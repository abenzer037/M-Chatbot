
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating RCA suggestions based on an incident description.
 *
 * - rcaSuggestionGeneration - A function that takes an incident description and returns suggestions from previous RCA reports.
 * - RcaSuggestionGenerationInput - The input type for the rcaSuggestionGeneration function.
 * - RcaSuggestionGenerationOutput - The return type for the rcaSuggestionGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RcaSuggestionGenerationInputSchema = z.object({
  incidentDescription: z
    .string()
    .describe('The description of the incident for which RCA suggestions are needed.'),
});
export type RcaSuggestionGenerationInput = z.infer<typeof RcaSuggestionGenerationInputSchema>;

const RcaSuggestionGenerationOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions extracted from previous RCA reports.'),
});
export type RcaSuggestionGenerationOutput = z.infer<typeof RcaSuggestionGenerationOutputSchema>;

export async function rcaSuggestionGeneration(input: RcaSuggestionGenerationInput): Promise<RcaSuggestionGenerationOutput> {
  return rcaSuggestionGenerationFlow(input);
}

const getRelevantRcaSuggestions = ai.defineTool({
  name: 'getRelevantRcaSuggestions',
  description: 'Retrieves relevant RCA suggestions from previous RCA reports based on the incident description.',
  inputSchema: z.object({
    incidentDescription: z
      .string()
      .describe('The description of the incident for which RCA suggestions are needed.'),
  }),
  outputSchema: z.array(z.string()),
},
  async (input) => {
    // TODO: Implement the logic to fetch and filter relevant RCA suggestions from a data source.
    // This is a placeholder implementation.
    const suggestions = [
      'Check for recent network outages.',
      'Review server logs for error messages.',
      'Investigate database connection issues.',
    ];
    return suggestions;
  } // Removed trailing comma here
);

const rcaSuggestionGenerationPrompt = ai.definePrompt({
  name: 'rcaSuggestionGenerationPrompt',
  input: {schema: RcaSuggestionGenerationInputSchema},
  output: {schema: RcaSuggestionGenerationOutputSchema},
  tools: [getRelevantRcaSuggestions],
  prompt: `Based on the following incident description, suggest relevant information from previous RCA reports:

Incident Description: {{{incidentDescription}}}

Consider using the getRelevantRcaSuggestions tool to retrieve suggestions.`,
});

const rcaSuggestionGenerationFlow = ai.defineFlow(
  {
    name: 'rcaSuggestionGenerationFlow',
    inputSchema: RcaSuggestionGenerationInputSchema,
    outputSchema: RcaSuggestionGenerationOutputSchema,
  },
  async input => {
    const {output} = await rcaSuggestionGenerationPrompt(input);
    return output!;
  }
);
