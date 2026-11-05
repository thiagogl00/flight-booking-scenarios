import { Page } from "@playwright/test";

export class SelectPassengerPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    async selectFlights(departureTestId: string, returnTestId?: string) {
        await this.page.getByTestId(departureTestId).click();

        if (returnTestId) {
            await this.page.getByTestId(returnTestId).click();
        }

        await this.page.getByTestId("flight-continue-to-passengers").click();
    }
    
}