'use server';

import { rcaSuggestionGeneration, type RcaSuggestionGenerationInput } from '@/ai/flows/rca-suggestion-generation';
import type { RcaSuggestionGenerationOutput } from '@/ai/flows/rca-suggestion-generation';

export async function getAIResponse(incidentDescription: string): Promise<RcaSuggestionGenerationOutput> {
  try {
    const input: RcaSuggestionGenerationInput = { incidentDescription };
    const result = await rcaSuggestionGeneration(input);
    return result;
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
}
