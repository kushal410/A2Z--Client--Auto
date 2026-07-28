export type LocatorStrategy =
  | 'role'
  | 'testId'
  | 'css'
  | 'id'
  | 'class'
  | 'text'
  | 'name'
  | 'label'
  | 'placeholder'
  | 'htmlElement'
  | 'xpath'
  | 'title'

export interface LocatorDefinition {
  strategy: LocatorStrategy;
  value: string;
  options?: Record<string, any>;
}
