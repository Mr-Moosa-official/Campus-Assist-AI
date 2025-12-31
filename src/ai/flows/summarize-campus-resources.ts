'use server';

/**
 * @fileOverview A flow that summarizes key information about campus resources for new students.
 *
 * - summarizeCampusResources - A function that summarizes campus resources.
 * - SummarizeCampusResourcesInput - The input type for the summarizeCampusResources function.
 * - SummarizeCampusResourcesOutput - The return type for the summarizeCampusResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCampusResourcesInputSchema = z.object({
  resourceType: z
    .string()
    .describe("The type of campus resource to summarize (e.g., 'library', 'tutoring services', 'health center')."),
  availableData: z.string().describe('The available data about the specified campus resource.'),
});
export type SummarizeCampusResourcesInput = z.infer<typeof SummarizeCampusResourcesInputSchema>;

const SummarizeCampusResourcesOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the specified campus resource.'),
});
export type SummarizeCampusResourcesOutput = z.infer<typeof SummarizeCampusResourcesOutputSchema>;

export async function summarizeCampusResources(
  input: SummarizeCampusResourcesInput
): Promise<SummarizeCampusResourcesOutput> {
  return summarizeCampusResourcesFlow(input);
}

const summarizeCampusResourcesPrompt = ai.definePrompt({
  name: 'summarizeCampusResourcesPrompt',
  input: {schema: SummarizeCampusResourcesInputSchema},
  output: {schema: SummarizeCampusResourcesOutputSchema},
  prompt: `You are a helpful AI assistant for new college students. Your task is to summarize key information about campus resources.

  Summarize the following information about the {{resourceType}}:

  {{availableData}}

  Provide a concise and easy-to-understand summary that helps new students quickly grasp the essentials. Be sure to include opening hours.
  `,
});

const summarizeCampusResourcesFlow = ai.defineFlow(
  {
    name: 'summarizeCampusResourcesFlow',
    inputSchema: SummarizeCampusResourcesInputSchema,
    outputSchema: SummarizeCampusResourcesOutputSchema,
  },
  async input => {
    const {output} = await summarizeCampusResourcesPrompt(input);
    return output!;
  }
);
