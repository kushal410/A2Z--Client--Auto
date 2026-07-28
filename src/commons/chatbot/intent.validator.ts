export interface IntentDefinition {
    keywords: string[];
}

export interface IntentMap {
    [intentName: string]: IntentDefinition;
}

export class IntentValidator {
    static validateByExpectedKeywords(
        response: string,
        expectedKeywords: string[],
        minimumMatch = 1
    ): void {
        const normalized = response.toLowerCase();

        const matches = expectedKeywords.filter(keyword =>
            normalized.includes(keyword.toLowerCase())
        );

        if (matches.length < minimumMatch) {
            throw new Error(`
Intent keyword validation failed.

Expected keywords: ${expectedKeywords.join(', ')}
Matched keywords: ${matches.join(', ') || 'None'}
Actual response: ${response}
      `);
        }
    }

    static validateIntent(
        response: string,
        intentName: string,
        intents: IntentMap,
        minimumMatch = 1
    ): void {
        const intent = intents[intentName];

        if (!intent) {
            throw new Error(`Intent "${intentName}" not found in configuration`);
        }

        this.validateByExpectedKeywords(
            response,
            intent.keywords,
            minimumMatch
        );
    }
}
