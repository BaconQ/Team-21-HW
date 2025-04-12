// Define types inline to avoid import issues
interface StatChange {
  attribute: string; // "food", "water", "activity", "happiness", etc.
  value: number; // Positive for increase, negative for decrease
}

interface LLMResponse {
  messages: string[]; // Array of message texts
  changes: StatChange[]; // Array of stat changes
}

interface BackendResponse {
  name: string;
  status: {
    food: number;
    water: number;
    energy: number;
    happiness: number;
  };
  last_interaction: string;
}

// Correct endpoint for the backend
const API_ENDPOINT = 'https://ag48os0csoco44000c8g00ow.calendar-genie.com/interact';

// Maximum number of retries
const MAX_RETRIES = 2;
// Delay between retries (in milliseconds)
const RETRY_DELAY = 1000;

/**
 * Delay execution for a specified time
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch with timeout
 */
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 5000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

/**
 * Map backend attributes to frontend attributes
 * @param attribute Backend attribute name
 * @returns Mapped frontend attribute name
 */
function mapAttribute(attribute: string): string {
  switch (attribute.toLowerCase()) {
    case 'food':
      return 'hunger';
    case 'water':
      return 'hydration';
    case 'energy':
      return 'activity';
    case 'happiness':
      return 'mood';
    default:
      return attribute;
  }
}

/**
 * Parse the JSON response from the backend
 * This handles potential formatting issues in the JSON response
 */
function parseBackendResponse(text: string): LLMResponse | BackendResponse {
  try {
    // First try to parse directly
    return JSON.parse(text);
  } catch (e) {
    // If that fails, try to clean up and parse
    console.log("Initial JSON parse failed, attempting cleanup:", e);
    
    try {
      // Sometimes multiple JSON objects might be concatenated
      // Try to extract the first valid JSON object
      const jsonRegex = /{[^{}]*({[^{}]*})*[^{}]*}/g;
      const matches = text.match(jsonRegex);
      
      if (matches && matches.length > 0) {
        return JSON.parse(matches[0]);
      }
      
      throw new Error("Could not extract valid JSON");
    } catch (e2) {
      console.error("JSON cleanup failed:", e2);
      
      // If all else fails, return a mock response
      return {
        messages: ["Sorry, I'm having trouble understanding the response."],
        changes: []
      } as LLMResponse;
    }
  }
}

/**
 * Determine if the response is in BackendResponse format
 */
function isBackendResponse(data: any): data is BackendResponse {
  return data && 
         typeof data === 'object' && 
         'status' in data && 
         'name' in data && 
         'last_interaction' in data;
}

/**
 * Convert BackendResponse to LLMResponse format
 */
function convertResponseFormat(data: BackendResponse, message: string): LLMResponse {
  // Generate response messages based on the user's message and pet status
  const messages = generateResponses(message, data);
  
  // Calculate stat changes
  const changes = calculateChanges(data);
  
  return {
    messages,
    changes
  };
}

/**
 * Send a user message to the LLM backend and get a response
 * @param message The user's message to send to the AI
 * @returns Promise with LLM response containing messages and stat changes
 */
export async function sendMessageToLLM(message: string): Promise<LLMResponse> {
  let retries = 0;
  
  while (retries <= MAX_RETRIES) {
    try {
      // Add a small delay on retries
      if (retries > 0) {
        await delay(RETRY_DELAY * retries);
        console.log(`Retrying LLM API call (attempt ${retries})`);
      }
      
      console.log("Calling API with message:", message);
      
      // Use POST to the /interact endpoint
      const response = await fetchWithTimeout(
        API_ENDPOINT, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            prompt: message
          })
        },
        10000 // 10 second timeout
      );
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        console.error(`API error (${response.status}): ${errorText}`);
        
        // If we hit a 5xx error (server error), we'll retry
        if (response.status >= 500 && retries < MAX_RETRIES) {
          retries++;
          continue;
        }
        
        // If we hit a client error or have retried too many times, use mock data
        throw new Error(`HTTP error ${response.status}`);
      }
      
      // Success - parse and return the data
      try {
        // Get the response text first
        const responseText = await response.text();
        console.log('Raw API response:', responseText);
        
        // Parse the backend response
        const data = JSON.parse(responseText);
        console.log('Parsed API response:', data);
        
        // Return the right format (backend should now return messages)
        return {
          messages: data.messages || [],
          changes: data.changes || []
        };
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response format');
      }
      
    } catch (error) {
      console.error(`Error calling API (attempt ${retries}):`, error);
      
      // Retry on network errors
      if (retries < MAX_RETRIES) {
        retries++;
        continue;
      }
      
      // If we've exhausted retries, use mock data
      return getMockResponse(message);
    }
  }
  
  // If we somehow exit the loop without returning, use mock data
  return getMockResponse(message);
}

/**
 * Calculate stat changes based on current status and previous status
 */
function calculateChanges(data: BackendResponse): StatChange[] {
  // For now, we'll just create a dummy positive change for a random stat
  // In a real implementation, you'd compare with previous status values
  const changes: StatChange[] = [];
  
  // Get all stats from the backend
  const statKeys = Object.keys(data.status);
  
  // Choose a random stat to change
  if (statKeys.length > 0) {
    const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)];
    
    changes.push({
      attribute: mapAttribute(randomStat),
      value: Math.floor(Math.random() * 3) + 1 // Random value between 1-3
    });
  }
  
  return changes;
}

/**
 * Generate responses based on user message content
 */
function generateResponses(message: string, data: BackendResponse): string[] {
  // Clean and lowercase the message for easier processing
  const cleanMessage = message.toLowerCase().trim();
  
  // Check for greetings
  if (/^(hi|hello|hey|greetings|howdy|hiya)/i.test(cleanMessage)) {
    return [
      `Hello! Nice to see you!`,
      `How can I help you today?`
    ];
  }
  
  // Check for questions about the pet
  if (/how are you|feeling|doing/i.test(cleanMessage)) {
    // Check pet stats to determine response
    const avgStatValue = Object.values(data.status).reduce((sum, val) => sum + val, 0) / 
                       Object.values(data.status).length;
    
    if (avgStatValue > 80) {
      return [
        "I'm feeling fantastic! All my stats are looking great.",
        "Thanks for asking! Is there anything you'd like to talk about?"
      ];
    } else if (avgStatValue > 50) {
      return [
        "I'm doing okay, but could be better.",
        "Maybe we could do something fun together?"
      ];
    } else {
      return [
        "To be honest, I'm not feeling my best right now.",
        "I could use some attention."
      ];
    }
  }
  
  // Check for food-related messages
  if (/food|eat|hungry|feed/i.test(cleanMessage)) {
    const foodLevel = data.status.food;
    if (foodLevel < 50) {
      return [
        "Yes, I am feeling quite hungry!",
        "Some food would be wonderful right now."
      ];
    } else {
      return [
        "I'm actually pretty full at the moment, but thank you!",
        "Maybe we could do something else together?"
      ];
    }
  }
  
  // Check for water-related messages
  if (/water|drink|thirsty/i.test(cleanMessage)) {
    const waterLevel = data.status.water;
    if (waterLevel < 50) {
      return [
        "I am feeling a bit thirsty. Some water would be nice!",
        "Thank you for noticing."
      ];
    } else {
      return [
        "I'm well hydrated right now, but I appreciate you checking!",
        "What would you like to do next?"
      ];
    }
  }
  
  // Check for play/activity related messages
  if (/play|game|activity|exercise|active/i.test(cleanMessage)) {
    const energyLevel = data.status.energy;
    if (energyLevel > 50) {
      return [
        "Yes! I'd love to play a game right now!",
        "What kind of game did you have in mind?"
      ];
    } else {
      return [
        "I'm feeling a bit low on energy right now.",
        "Maybe after I rest a bit more."
      ];
    }
  }
  
  // Check for mood/happiness related messages
  if (/happy|sad|mood|feel|emotion/i.test(cleanMessage)) {
    const happinessLevel = data.status.happiness;
    if (happinessLevel > 70) {
      return [
        "I'm feeling very happy right now!",
        "It's always nice when we spend time together."
      ];
    } else if (happinessLevel > 40) {
      return [
        "My mood is okay, but it could be better.",
        "Maybe we could do something fun together?"
      ];
    } else {
      return [
        "I'm feeling a bit down today.",
        "Some attention would really cheer me up."
      ];
    }
  }
  
  // For other messages, provide a generic contextual response
  const responseTemplates = [
    [`I see you're interested in "${cleanMessage.split(' ').slice(0, 3).join(' ')}..."`, 
     "That's something I'd like to learn more about too!"],
    
    ["That's an interesting topic!",
     "I'd love to hear more about your thoughts on that."],
     
    ["Thanks for sharing that with me.",
     "It's always nice chatting with you about these things."],
     
    ["I'm not sure I fully understand, but I'm eager to learn.",
     "Could you tell me more about that?"]
  ];
  
  // Return a randomly selected template
  return responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
}

/**
 * Generate a mock response when the API is unavailable
 */
function getMockResponse(message: string): LLMResponse {
  console.log('Using mock LLM response');
  
  // List of possible mock responses based on user examples
  const mockResponses: LLMResponse[] = [
    {
      messages: [
        `I get it, ${message.split(' ').slice(0, 3).join(' ')} is interesting. Let me share some thoughts.`,
        "Sometimes the most interesting things are right in front of us.",
        "What do you think about that perspective?"
      ],
      changes: [{ attribute: "happiness", value: 2 }]
    },
    {
      messages: [
        "Sure, I'd love to talk about that! It's a fascinating topic.",
        `"${message.split(' ').slice(0, 5).join(' ')}..." - that's something worth exploring further.`
      ],
      changes: []
    },
    {
      messages: [
        "That's an interesting point. I wonder how that connects to other aspects of life.",
        "Sometimes the best insights come from unexpected places."
      ],
      changes: [{ attribute: "activity", value: 1 }]
    }
  ];
  
  // Return a random mock response
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
} 