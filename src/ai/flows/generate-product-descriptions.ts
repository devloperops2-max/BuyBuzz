'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating compelling product descriptions.
 *
 * The flow takes in product details as input and generates a product description using the GenAI model.
 * @param {GenerateProductDescriptionsInput} input - The input for generating product descriptions.
 * @returns {Promise<GenerateProductDescriptionsOutput>} - The generated product description.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productFeatures: z.string().describe('The key features or keywords of the product.'),
  productCategory: z.string().describe('The category of the product.'),
});
export type GenerateProductDescriptionsInput = z.infer<
  typeof GenerateProductDescriptionsInputSchema
>;

const GenerateProductDescriptionsOutputSchema = z.object({
  productDescription: z.string().describe('The generated product description.'),
});
export type GenerateProductDescriptionsOutput = z.infer<
  typeof GenerateProductDescriptionsOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionsInput
): Promise<GenerateProductDescriptionsOutput> {
  return generateProductDescriptionsFlow(input);
}

const generateProductDescriptionsPrompt = ai.definePrompt({
  name: 'generateProductDescriptionsPrompt',
  input: {schema: GenerateProductDescriptionsInputSchema},
  output: {schema: GenerateProductDescriptionsOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling product descriptions.

  Based on the following product details, generate an engaging and informative product description.

  Product Name: {{{productName}}}
  Key Features/Keywords: {{{productFeatures}}}
  Category: {{{productCategory}}}
  `,
});

const generateProductDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionsFlow',
    inputSchema: GenerateProductDescriptionsInputSchema,
    outputSchema: GenerateProductDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await generateProductDescriptionsPrompt(input);
    return output!;
  }
);
