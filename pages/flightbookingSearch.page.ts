import { Page } from "@playwright/test";

type FlightSearchOptions = {
	from: string;
	to: string;
	departureDate: string;
	returnDate?: string;
	passengers: string;
	flightClass: string;
	oneWay?: boolean;
};

export class SearchPage {
    readonly page: Page

	constructor(page: Page) {
		this.page = page;
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

	async reject(object: FlightSearchOptions) {
		await this.page.selectOption('[data-testid="flight-from"]', object.from);

		await this.page.selectOption('[data-testid="flight-to"]', object.to);

		await this.page.getByTestId("flight-departure-date").fill(object.departureDate);

		if(object.returnDate){
			await this.page.getByTestId("flight-return-date").fill(object.returnDate);
		}

		await this.page.getByTestId("flight-passengers").fill(object.passengers);

		await this.page.selectOption('[data-testid="flight-class"]', object.flightClass);

		await this.page.getByTestId("flight-search").click();
	}

}