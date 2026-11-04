import { Page } from "@playwright/test";


export type PaymentData = {
    cardNumber: string;
    expiry: string;
    cvv: string;
};

export class PaymentPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    
	async fillPayment(data: PaymentData) {
		await this.page.getByTestId("flight-card-number").fill(data.cardNumber);
		await this.page.getByTestId("flight-expiry").fill(data.expiry);
		await this.page.getByTestId("flight-cvv").fill(data.cvv);
		await this.page.getByTestId("flight-book").click();
	}
}