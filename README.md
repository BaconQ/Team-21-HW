# DigiPal - Voice-Enabled Virtual Pet

DigiPal is a virtual pet app with speech recognition and text-to-speech capabilities, allowing for a more immersive interaction experience.

## Features

- Interactive pixel pet with customizable appearance
- AI conversation capabilities
- Track and log pet stats:
  - Food intake
  - Water consumption 
  - Activity levels
  - Mood tracking
- Pet stats decay over time
- Pet responds to care and neglect

## Color Palette

- Primary: #328E6E (Green)
- Secondary: #E1EEBC (Light yellow/green)
- White for clean UI elements

## Voice Features

### Text-to-Speech (TTS)

DigiPal uses Eleven Labs for high-quality text-to-speech synthesis. Your virtual pet can speak to you using a natural-sounding voice.

- **Toggle TTS**: Use the audio icon in the top right corner to turn TTS on or off
- **Auto-Play**: When enabled, your pet will automatically speak all its messages

### Speech-to-Text (STT)

Talk to your DigiPal using your voice instead of typing.

- **Start Voice Recognition**: Tap the microphone icon in the chat input
- **End Recording**: Tap the microphone icon again when you're done speaking
- **Send Message**: Your spoken text will appear in the input field - tap send to communicate with your pet

## API Keys

This app uses Eleven Labs for TTS. The API key in the code is a placeholder and should be replaced with your own key for production use:

1. Sign up at [Eleven Labs](https://elevenlabs.io/)
2. Get your API key from the dashboard
3. Replace the API key in `src/services/elevenLabsService.ts`

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/digipal.git
cd digipal
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Scan the QR code with Expo Go (Android) or the Camera app (iOS)

## Usage

- Tap the icons at the top to feed, water, exercise, or play with your pet
- Use the chat input at the bottom to talk with your pet
- Pet's mood changes based on its stats
- Stats decay over time, so make sure to interact with your pet regularly

## Future Enhancements

- Multiple pet types (dog, bunny, etc.)
- Customizable hats and accessories
- Animated sprite sequences
- More advanced AI conversation integration
- Mini-games for pet exercise
- Achievements and rewards system

## License

This project is licensed under the MIT License 

## Technologies Used

- Expo/React Native
- TypeScript
- Eleven Labs API for TTS
- React Native Voice for STT
- Expo Audio for sound playback

## Troubleshooting

### Speech Recognition Issues

- Ensure microphone permissions are granted
- Check that your device has a working microphone
- Try restarting the app if recognition is inconsistent

### Text-to-Speech Issues

- Verify your API key is correct and has sufficient credits
- Check your internet connection (TTS requires API calls)
- Ensure device volume is turned up 