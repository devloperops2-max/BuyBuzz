'use server';

/**
 * @fileOverview Summarizes product reviews to provide a quick overview of customer sentiment.
 *
 * - summarizeProductReviews - A function that takes product reviews and returns a summary.
 * - SummarizeProductReviewsInput - The input type for the summarizeProductReviews function.
 * - SummarizeProductReviewsOutput - The return type for the summarizeProductReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProductReviewsInputSchema = z.object({
  productReviews: z
    .string()
    .describe('A list of product reviews to summarize.'),
});
export type SummarizeProductReviewsInput = z.infer<typeof SummarizeProductReviewsInputSchema>;

const SummarizeProductReviewsOutputSchema = z.object({
  summary: z.string().describe('A summary of the product reviews.'),
});
export type SummarizeProductReviewsOutput = z.infer<typeof SummarizeProductReviewsOutputSchema>;

export async function summarizeProductReviews(
  input: SummarizeProductReviewsInput
): Promise<SummarizeProductReviewsOutput> {
  return summarizeProductReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProductReviewsPrompt',
  input: {schema: SummarizeProductReviewsInputSchema},
  output: {schema: SummarizeProductReviewsOutputSchema},
  prompt: `You are an expert at summarizing product reviews.

  Please provide a concise summary of the following product reviews:

  {{{productReviews}}}
  `,
});

const summarizeProductReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeProductReviewsFlow',
    inputSchema: SummarizeProductReviewsInputSchema,
    outputSchema: SummarizeProductReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
