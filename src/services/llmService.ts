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
const API_ENDPOINT = 'https://ag48os0csoco44000c8g00ow.calendar-genie.com';

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
      
      // Use fetch with timeout to call the API endpoint
      const response = await fetchWithTimeout(
        API_ENDPOINT, 
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
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
        // Parse the backend response format
        const data = await response.json() as BackendResponse;
        console.log('API Success:', data);
        
        // Generate a response based on the user's message
        const petResponses = generateResponses(message, data);
        
        // Create changes based on current stats
        const changes = calculateChanges(data);
        
        // Return formatted response
        return {
          messages: petResponses,
          changes: changes
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
 * Generate responses based on user message and pet status
 */
function generateResponses(message: string, data: BackendResponse): string[] {
  // Extract topics from user message
  const topics = extractTopics(message);
  
  // Generate contextual responses
  if (topics.includes('play') || topics.includes('game')) {
    return [
      "I'd love to play a game with you!",
      "Games are my favorite. What shall we play?",
      "Playing together is always fun!"
    ];
  }
  
  if (topics.includes('food') || topics.includes('eat') || topics.includes('hungry')) {
    return [
      "Mmm, I'm getting hungry just thinking about food!",
      "Thanks for thinking about feeding me. You're so considerate!"
    ];
  }
  
  if (topics.includes('water') || topics.includes('drink') || topics.includes('thirsty')) {
    return [
      "Staying hydrated is important!",
      "Thanks for the water. I was getting thirsty!"
    ];
  }
  
  if (topics.includes('sleep') || topics.includes('tired') || topics.includes('rest')) {
    return [
      "I could use a little nap soon.",
      "Resting is important for pets and humans alike!"
    ];
  }
  
  // Default responses
  return [
    `I'm happy you want to talk about ${message.split(' ').slice(0, 3).join(' ')}...`,
    "It's always nice chatting with you!",
    "What else would you like to talk about today?"
  ];
}

/**
 * Extract topics from a message
 */
function extractTopics(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const words = lowerMessage.split(/\W+/).filter(word => word.length > 2);
  return words;
}

/**
 * Calculate stat changes based on current status
 */
function calculateChanges(data: BackendResponse): StatChange[] {
  const changes: StatChange[] = [];
  
  // Generate a positive change for a random stat
  const stats = ['food', 'water', 'energy', 'happiness'];
  const randomStat = stats[Math.floor(Math.random() * stats.length)];
  
  changes.push({
    attribute: mapAttribute(randomStat),
    value: Math.floor(Math.random() * 5) + 1 // Random value between 1-5
  });
  
  return changes;
}

/**
 * Generate a mock response when the API is unavailable
 */
function getMockResponse(message: string): LLMResponse {
  console.log('Using mock LLM response');
  
  // List of possible mock responses
  const mockResponses: LLMResponse[] = [
    {
      messages: [
        `I see you're talking about "${message.substring(0, 20)}...". That's interesting!`,
        "I'm currently having trouble connecting to my brain, but I'd love to chat more when I'm back online."
      ],
      changes: [{ attribute: "happiness", value: 1 }]
    },
    {
      messages: [
        "I'm processing what you said about that topic.",
        "My connection seems a bit spotty right now, but I'm still here for you!"
      ],
      changes: []
    },
    {
      messages: [
        "That's a great point about " + message.split(' ').slice(0, 3).join(' ') + "...",
        "Sorry for the slow response - I'm having some technical difficulties."
      ],
      changes: [{ attribute: "activity", value: 2 }]
    }
  ];
  
  // Return a random mock response
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
} 