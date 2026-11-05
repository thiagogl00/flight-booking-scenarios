import { Page } from "@playwright/test";

type PassengerData = {
	name: string;
	email: string;
	phone: string;
};

export class PassengerPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page;
    }

    async fillPassenger(data: PassengerData) {
        await this.page.getByTestId("flight-passenger-name").fill(data.name);
        await this.page.getByTestId("flight-passenger-email").fill(data.email);
        await this.page.getByTestId("flight-passenger-phone").fill(data.phone);
        await this.page.getByTestId("flight-continue-to-payment").click();
    }

}