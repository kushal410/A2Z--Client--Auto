import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { webchatbotLocators } from '../locators/webchatbot.locators';
import { resolveLocator } from '../utils/locator.resolver';

export class WebChatbotPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  private frame() {    
     return this.page.frameLocator(webchatbotLocators.chatbotIframe.value);
  }

  async openChatbot(): Promise<void> {
    await resolveLocator(this.page, webchatbotLocators.chatbotIcon).click();    
    //await this.page.locator('#frame textarea#search1').waitFor({ state: 'visible', timeout: 60000 });
  }

  async sendMessage(msg: string): Promise<void> {    
    const input = this.frame().locator(webchatbotLocators.messageInput.value);
    await input.waitFor({ state: 'visible', timeout: 60000 });    
    await input.fill(msg);
    const sendbtn = this.frame().locator(webchatbotLocators.sendButton.value);
    await sendbtn.click();
  }

  async getResponse(): Promise<string> {
    //const response = resolveLocator(this.page, webchatbotLocators.botResponse);
    const response1 = this.frame().locator(webchatbotLocators.botResponse.value).last();    
    const responsetxt = (await response1.innerText()).trim();    
    await response1.waitFor({ state: 'visible' });
    return responsetxt;
  }
}