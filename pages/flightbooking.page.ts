import { Page } from "@playwright/test";

export type FlightSearchOptions = {
	from: string;
	to: string;
	departureDate: string;
	returnDate?: string;
	passengers: string;
	flightClass: string;
	oneWay?: boolean;
};

export type PassengerData = {
	name: string;
	email: string;
	phone: string;
};

export type PaymentData = {
	cardNumber: string;
	expiry: string;
	cvv: string;
};

export class FlightBookingPage {
    private readonly page: Page
	constructor(page: Page) {
		this.page = page;
	}

	async goto() {
		await this.page.goto("/flight-booking-scenarios");
	}

	async searchFlight(options: FlightSearchOptions) {
		if (options.oneWay) {
			await this.page.getByTestId("flight-one-way").click();
		}

		await this.page.selectOption('[data-testid="flight-from"]', options.from);
		await this.page.selectOption('[data-testid="flight-to"]', options.to);
		await this.page
			.getByTestId("flight-departure-date")
			.fill(options.departureDate);

		if (!options.oneWay && options.returnDate) {
			await this.page
				.getByTestId("flight-return-date")
				.fill(options.returnDate);
		}

		await this.page.getByTestId("flight-passengers").fill(options.passengers);
		await this.page.selectOption(
			'[data-testid="flight-class"]',
			options.flightClass,
		);
		await this.page.getByTestId("flight-search").click();
	}

	async selectFlights(departureTestId: string, returnTestId?: string) {
		await this.page.getByTestId(departureTestId).click();

		if (returnTestId) {
			await this.page.getByTestId(returnTestId).click();
		}

		await this.page.getByTestId("flight-continue-to-passengers").click();
	}

	async fillPassenger(data: PassengerData) {
		await this.page.getByTestId("flight-passenger-name").fill(data.name);
		await this.page.getByTestId("flight-passenger-email").fill(data.email);
		await this.page.getByTestId("flight-passenger-phone").fill(data.phone);
		await this.page.getByTestId("flight-continue-to-payment").click();
	}

	async fillPayment(data: PaymentData) {
		await this.page.getByTestId("flight-card-number").fill(data.cardNumber);
		await this.page.getByTestId("flight-expiry").fill(data.expiry);
		await this.page.getByTestId("flight-cvv").fill(data.cvv);
		await this.page.getByTestId("flight-book").click();
	}
}
