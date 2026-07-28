export const ALLOWED_TAGS = [
  '@smoke',
  '@regression',
  '@fallback',
  '@critical',
  '@sanity',
  '@keepme',
  '@KeepmeCRM',
  '@KeepmeAPI',
  '@PerfectgymCRM',
  '@PerfectgymAPI',
  '@controlcentre'
] as const;

export type AllowedTag = typeof ALLOWED_TAGS[number];
