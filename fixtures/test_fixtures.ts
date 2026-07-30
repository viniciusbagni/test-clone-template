import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../support/index'
import { LoginLocators } from '../support/locators/login_locators'

type TestFixtures = {
  loginPage: LoginPage
  loginLocators: LoginLocators
}

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  loginLocators: async ({ page }, use) => {
    await use(new LoginLocators(page))
  },
})

export { expect }