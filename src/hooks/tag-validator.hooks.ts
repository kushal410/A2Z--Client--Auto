import { BeforeAll } from '@cucumber/cucumber';
const fs = require('fs');
const glob = require('glob');
import { ALLOWED_TAGS, AllowedTag } from '../../configs/tags/allowed-tags';

const REQUIRED_SCOPE_TAGS: AllowedTag[] = ['@smoke', '@regression'];

BeforeAll(() => {
  const featureFiles: string[] = glob.sync('src/features/**/*.feature');

  const invalidTags = new Set<string>();
  const scenariosWithoutRequiredTags: string[] = [];

  featureFiles.forEach((file: string) => {
    const content: string = fs.readFileSync(file, 'utf-8');

    // Validate all tags
    const allTags: RegExpMatchArray | null = content.match(/@\w+/g);
    allTags?.forEach((tag: string) => {
      if (!(ALLOWED_TAGS as readonly string[]).includes(tag)) {
        invalidTags.add(tag);
      }
    });

    // Validate required tags per scenario
    const lines: string[] = content.split('\n');
    let currentTags: string[] = [];

    lines.forEach((line: string) => {
      const tagMatches: RegExpMatchArray | null = line.match(/@\w+/g);
      if (tagMatches) {
        currentTags = tagMatches;
      }

      if (line.trim().startsWith('Scenario')) {
        const hasRequiredScope = REQUIRED_SCOPE_TAGS.some(tag => currentTags.includes(tag as AllowedTag));
        if (!hasRequiredScope) {
          scenariosWithoutRequiredTags.push(file);
        }
        currentTags = []; // reset for next scenario
      }
    });
  });

  // Fail if invalid tags
  if (invalidTags.size > 0) {
    throw new Error(`
INVALID TAGS FOUND IN FEATURE FILES

Invalid tags:
${[...invalidTags].map(t => ` - ${t}`).join('\n')}

Allowed tags:
${ALLOWED_TAGS.join(', ')}

Fix the tags before running tests.
`);
  }

  // Fail if scenario without required tags
  if (scenariosWithoutRequiredTags.length > 0) {
    throw new Error(` SCENARIO WITHOUT REQUIRED TAG

Each scenario must include at least one of:
${REQUIRED_SCOPE_TAGS.join(', ')}

Affected files:
${[...new Set(scenariosWithoutRequiredTags)].map(f => ` - ${f}`).join('\n')}
`);
  }
});
