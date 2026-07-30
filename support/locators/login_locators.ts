import { Locator, Page } from '@playwright/test'

export class LoginLocators {
  public page: Page

  constructor(page: Page) {
    this.page = page
  }

  emailInput(): Locator {
    return this.page.getByRole('textbox', { name: 'E-mail' })
  }

  //demais seletores
}