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
    private readonly page: Page

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

	async rejectDestinationSameAsOrigin() {
		// Seleciona Paris como cidade de origem.
		await this.page.selectOption('[data-testid="flight-from"]', "Paris");
		// Seleciona Paris também como cidade de destino.
		await this.page.selectOption('[data-testid="flight-to"]', "Paris");
		// Preenche a data de ida.
		await this.page.getByTestId("flight-departure-date").fill("2026-10-26");
		// Preenche a data de volta.
		await this.page.getByTestId("flight-return-date").fill("2026-11-01");
		// Informa que viajará um passageiro.
		await this.page.getByTestId("flight-passengers").fill("1");
		// Seleciona a classe executiva.
		await this.page.selectOption('[data-testid="flight-class"]', "Business");
		// Aciona a busca de voos.
		await this.page.getByTestId("flight-search").click();
	}

	async rejectReturnDateBeforeDepartureDate() {
		// Seleciona Paris como cidade de origem.
		await this.page.selectOption('[data-testid="flight-from"]', "Paris");
		// Seleciona Londres como cidade de destino.
		await this.page.selectOption('[data-testid="flight-to"]', "London");
		// Preenche a data de ida.
		await this.page.getByTestId("flight-departure-date").fill("2026-11-01");
		// Preenche a data de volta com uma data anterior à de ida.
		await this.page.getByTestId("flight-return-date").fill("2026-10-26");
		// Informa que viajará um passageiro.
		await this.page.getByTestId("flight-passengers").fill("1");
		// Seleciona a classe executiva.
		await this.page.selectOption('[data-testid="flight-class"]', "Business");
		// Aciona a busca de voos.
		await this.page.getByTestId("flight-search").click();
	}

	async rejectReturnDateEqualToDepartureDate() {
		// Seleciona Paris como cidade de origem.
		await this.page.selectOption('[data-testid="flight-from"]', "Paris");
		// Seleciona Londres como cidade de destino.
		await this.page.selectOption('[data-testid="flight-to"]', "London");
		// Preenche a data de ida.
		await this.page.getByTestId("flight-departure-date").fill("2026-11-01");
		// Preenche a data de volta com a mesma data da ida.
		await this.page.getByTestId("flight-return-date").fill("2026-11-01");
		// Informa que viajará um passageiro.
		await this.page.getByTestId("flight-passengers").fill("1");
		// Seleciona a classe executiva.
		await this.page.selectOption('[data-testid="flight-class"]', "Business");
		// Aciona a busca de voos.
		await this.page.getByTestId("flight-search").click();
	}

	async rejectEmptyFields() {
		// Garantir que os campos estejam vazios
		await this.page.getByTestId("flight-from").selectOption("");
		await this.page.getByTestId("flight-to").selectOption("");
		await this.page.getByTestId("flight-departure-date").fill("");
		await this.page.getByTestId("flight-return-date").fill("");
	
		// Clicar no botão de busca
		await this.page.getByTestId("flight-search").click();
	}
}