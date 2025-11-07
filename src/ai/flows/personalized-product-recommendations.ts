'use server';

/**
 * @fileOverview Personalized product recommendations flow.
 *
 * This file defines a Genkit flow that provides personalized product recommendations to users
 * based on their interests, browsing history, and purchase behavior.
 *
 * @interface PersonalizedProductRecommendationsInput - Defines the input schema for the flow.
 * @interface PersonalizedProductRecommendationsOutput - Defines the output schema for the flow.
 * @function getPersonalizedProductRecommendations - The main function to trigger the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedProductRecommendationsInputSchema = z.object({
  userInterests: z
    .string()
    .describe('A comma-separated list of the user\u2019s interests.'),
  browsingHistory: z
    .string()
    .describe(
      'A comma-separated list of product IDs the user has recently viewed.'
    ),
  purchaseHistory: z
    .string()
    .describe(
      'A comma-separated list of product IDs the user has previously purchased.'
    ),
});
export type PersonalizedProductRecommendationsInput = z.infer<
  typeof PersonalizedProductRecommendationsInputSchema
>;

const PersonalizedProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .string()
    .describe(
      'A comma-separated list of product IDs that are recommended for the user.'
    ),
});
export type PersonalizedProductRecommendationsOutput = z.infer<
  typeof PersonalizedProductRecommendationsOutputSchema
>;

export async function getPersonalizedProductRecommendations(
  input: PersonalizedProductRecommendationsInput
): Promise<PersonalizedProductRecommendationsOutput> {
  return personalizedProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedProductRecommendationsPrompt',
  input: {schema: PersonalizedProductRecommendationsInputSchema},
  output: {schema: PersonalizedProductRecommendationsOutputSchema},
  prompt: `You are an expert product recommendation system.

  Based on the user's interests, browsing history, and purchase history,
  recommend a list of products that the user would be most interested in.

  User Interests: {{{userInterests}}}
  Browsing History: {{{browsingHistory}}}
  Purchase History: {{{purchaseHistory}}}

  Recommended Products:`,
});

const personalizedProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedProductRecommendationsFlow',
    inputSchema: PersonalizedProductRecommendationsInputSchema,
    outputSchema: PersonalizedProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
