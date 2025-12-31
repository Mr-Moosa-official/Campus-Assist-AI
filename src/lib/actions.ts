'use server';

import { z } from 'zod';
import { answerFaq } from '@/ai/flows/faq-answer-from-knowledge-base';
import { multilingualQueryUnderstanding } from '@/ai/flows/multilingual-query-understanding';
import { KNOWLEDGE_BASE } from '@/lib/college-data';

const chatSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty.'),
  language: z.string(),
});

type AiResponse =
  | {
      success: true;
      response: string;
      error?: never;
    }
  | {
      success: false;
      error: string;
      response?: never;
    };

export async function getAiResponse(
  prevState: AiResponse,
  formData: FormData
): Promise<AiResponse> {
  const validatedFields = chatSchema.safeParse({
    query: formData.get('query'),
    language: formData.get('language'),
  });

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid input.' };
  }

  const { query, language } = validatedFields.data;

  try {
    if (language === 'en') {
      const result = await answerFaq({
        query,
        knowledgeBase: KNOWLEDGE_BASE,
      });
      return { success: true, response: result.answer };
    } else {
      const augmentedQuery = `Based *only* on the following knowledge base, please answer the user's question. If the answer is not in the knowledge base, say that you don't have that information.
      
      Knowledge Base:
      ---
      ${KNOWLEDGE_BASE}
      ---
      
      User's Question: "${query}"`;

      const result = await multilingualQueryUnderstanding({
        query: augmentedQuery,
        targetLanguage: language,
      });

      return { success: true, response: result.response };
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: 'Something went wrong on our end. Please try again.',
    };
  }
}
