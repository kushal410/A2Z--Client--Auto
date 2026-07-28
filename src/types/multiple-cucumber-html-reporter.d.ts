declare module "multiple-cucumber-html-reporter" {
  interface GenerateOptions {
    jsonDir: string;
    reportPath: string;
    metadata?: Record<string, any>;
    customData?: {
      title: string;
      data: { label: string; value: string }[];
    };
  }

  export function generate(options: GenerateOptions): void;
}
