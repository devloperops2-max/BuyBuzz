import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({apiKey: "AIzaSyAZkaiUn7WP49FEqzJxGKwaI8480NJCYk8"})],
  model: 'googleai/gemini-2.5-flash',
});

