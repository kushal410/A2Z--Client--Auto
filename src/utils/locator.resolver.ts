import { Page, Locator, FrameLocator } from '@playwright/test';
import { LocatorDefinition } from '../types/locator.types';

export function resolveLocator(
  page: Page | FrameLocator,
  def: LocatorDefinition
): Locator {
  switch (def.strategy) {
    case 'role':
      return page.getByRole(def.value as any, def.options);

    case 'testId':
      return page.getByTestId(def.value);

    case 'text':
      return page.getByText(def.value, def.options);

    case 'name':
      return page.locator(`[name="${def.value}"]`);

    case 'placeholder':
      return page.getByPlaceholder(def.value, def.options);

    case 'label':
      return page.getByLabel(def.value, def.options);

    case 'id':
      return page.locator(`#${def.value}`);

    case 'class':
      return page.locator(`.${def.value}`);

    case 'css':
      return page.locator(def.value);

    case 'htmlElement':
      return page.locator(def.value);

    case 'xpath':
      return page.locator(`xpath=${def.value}`);

    case 'title':
      return page.locator(def.value);

    default:
      throw new Error(`Unsupported locator strategy: ${def.strategy}`);
  }
}
