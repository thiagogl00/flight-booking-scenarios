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

	async searchFlight(obj: FlightSearchOptions) {
		if (obj.oneWay) {
			await this.page.getByTestId("flight-one-way").click();
		}

		await this.page.selectOption('[data-testid="flight-from"]', obj.from);
		await this.page.selectOption('[data-testid="flight-to"]', obj.to);
		await this.page.getByTestId("flight-departure-date").fill(obj.departureDate);

		if (!obj.oneWay && obj.returnDate) {
			await this.page.getByTestId("flight-return-date").fill(obj.returnDate);
		}

		await this.page.getByTestId("flight-passengers").fill(obj.passengers);
		await this.page.selectOption('[data-testid="flight-class"]',obj.flightClass);
		await this.page.getByTestId("flight-search").click();
	}

}