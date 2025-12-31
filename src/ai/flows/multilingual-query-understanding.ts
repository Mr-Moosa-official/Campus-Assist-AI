'use server';

/**
 * @fileOverview A multilingual query understanding AI agent.
 *
 * - multilingualQueryUnderstanding - A function that handles the query understanding process.
 * - MultilingualQueryUnderstandingInput - The input type for the multilingualQueryUnderstanding function.
 * - MultilingualQueryUnderstandingOutput - The return type for the multilingualQueryUnderstanding function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualQueryUnderstandingInputSchema = z.object({
  query: z.string().describe('The user query in any language.'),
  targetLanguage: z.string().describe('The target language for the response.'),
});
export type MultilingualQueryUnderstandingInput = z.infer<typeof MultilingualQueryUnderstandingInputSchema>;

const MultilingualQueryUnderstandingOutputSchema = z.object({
  translatedQuery: z.string().describe('The translated query in English.'),
  response: z.string().describe('The response to the query in the target language.'),
});
export type MultilingualQueryUnderstandingOutput = z.infer<typeof MultilingualQueryUnderstandingOutputSchema>;

export async function multilingualQueryUnderstanding(input: MultilingualQueryUnderstandingInput): Promise<MultilingualQueryUnderstandingOutput> {
  return multilingualQueryUnderstandingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'multilingualQueryUnderstandingPrompt',
  input: {schema: MultilingualQueryUnderstandingInputSchema},
  output: {schema: MultilingualQueryUnderstandingOutputSchema},
  prompt: `You are a multilingual AI chatbot for a college helpdesk.  The user will provide a query in their native language, and a target language for the response.

Translate the user's query to English, and respond to the user's query in the target language.

User Query: {{{query}}}
Target Language: {{{targetLanguage}}}

Ensure that the response is accurate and helpful, and that the translation is accurate as well.

Translated Query:
Response in {{targetLanguage}}:
`,
});

const multilingualQueryUnderstandingFlow = ai.defineFlow(
  {
    name: 'multilingualQueryUnderstandingFlow',
    inputSchema: MultilingualQueryUnderstandingInputSchema,
    outputSchema: MultilingualQueryUnderstandingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
