'use server';
/**
 * @fileOverview A flow that answers FAQs from a knowledge base.
 *
 * - answerFaq - A function that answers a FAQ.
 * - AnswerFaqInput - The input type for the answerFaq function.
 * - AnswerFaqOutput - The return type for the answerFaq function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFaqInputSchema = z.object({
  query: z.string().describe('The user query.'),
  knowledgeBase: z.string().describe('The knowledge base to use.'),
});
export type AnswerFaqInput = z.infer<typeof AnswerFaqInputSchema>;

const AnswerFaqOutputSchema = z.object({
  answer: z.string().describe('The answer to the query.'),
});
export type AnswerFaqOutput = z.infer<typeof AnswerFaqOutputSchema>;

export async function answerFaq(input: AnswerFaqInput): Promise<AnswerFaqOutput> {
  return answerFaqFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFaqPrompt',
  input: {schema: AnswerFaqInputSchema},
  output: {schema: AnswerFaqOutputSchema},
  prompt: `You are a college helpdesk chatbot. You will answer questions from students based on the provided knowledge base.

Knowledge Base:
{{knowledgeBase}}

Question: {{query}}

Answer:`,
});

const answerFaqFlow = ai.defineFlow(
  {
    name: 'answerFaqFlow',
    inputSchema: AnswerFaqInputSchema,
    outputSchema: AnswerFaqOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
