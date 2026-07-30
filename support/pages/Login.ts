import { Page } from '@playwright/test'
import { LoginLocators } from '../locators/login_locators'

export class LoginPage {
    private page: Page
    private loginLocators: LoginLocators

    constructor(page: Page) {
        this.page = page
        this.loginLocators = new LoginLocators(page)
    }

    async visitBaseUrlLogin(): Promise<void> {
        await this.page.goto('') // url configurada no baseUrl do playwright.config.ts
    }

    async fillEmail(email: string): Promise<void> {
        await this.loginLocators.emailInput().fill(email)
    }
    // demais métodos da página de login podem ser adicionados aqui.
}