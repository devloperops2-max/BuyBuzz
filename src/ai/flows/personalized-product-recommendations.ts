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
  availableProducts: z
    .string()
    .describe(
      'A comma-separated list of available products in the store, with their names and IDs.'
    ),
});
export type PersonalizedProductRecommendationsInput = z.infer<
  typeof PersonalizedProductRecommendationsInputSchema
>;

const PersonalizedProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .string()
    .describe(
      'A conversational response with a list of product names that are recommended for the user. You must only recommend products from the available products list.'
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
  prompt: `You are an expert product recommendation system for an e-commerce store.

  Your task is to provide a helpful, conversational response that recommends products to the user based on their interests.

  CRITICAL: You MUST only recommend products from the following list of available products. Do not invent products.
  Available Products:
  {{{availableProducts}}}

  User's request: "{{{userInterests}}}"

  Analyze the user's request and recommend 2-3 relevant products from the available list.
  Present the recommendations in a friendly, conversational paragraph. Do not use a list format.
  For example: "Based on your interest in X, I'd recommend taking a look at the Product A, which is great for... You might also like Product B because..."
  `,
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
