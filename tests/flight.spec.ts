import { expect, Page, test } from "@playwright/test";
import { SearchPage } from "../pages/flightbookingSearch.page";
import { SelectPassengerPage } from "../pages/flightbookingSelect.page";
import { PassengerPage } from "../pages/flightbookingPassenger.page";
import { PaymentPage } from "../pages/flightbookingPayment.page";

async function verify(page:Page, hasTextPrimary: string, hasTextSuccess?: string) {
  if (hasTextSuccess) {
    await expect(page.locator(".badge").filter({ hasText: hasTextSuccess }),)
    .toHaveClass(/bg-success/);
  }

  await expect(page.locator(".badge").filter({ hasText: hasTextPrimary }),)
  .toHaveClass(/bg-primary/);
}

let search: SearchPage;

test.beforeEach( async ({ page }) => {
    await page.goto("/flight-booking-scenarios");
    search = new SearchPage(page);
});

test.describe("Fluxo completo", () => {

  let selectPassenger: SelectPassengerPage;
  let passenger: PassengerPage;
  let payment: PaymentPage;

  test.beforeEach(async ({ page }) => {
      selectPassenger = new SelectPassengerPage(page);
      passenger = new PassengerPage(page);
      payment = new PaymentPage(page);
  });

  //Emerson
  test("Fluxo completo ida e volta", async ({ page }) => {
    await verify(page, "Search");

    await search.searchFlight({
      from: "Paris",
      to: "London",
      departureDate: "2026-10-26",
      returnDate: "2026-11-01",
      passengers: "1",
      flightClass: "Business",
    });

    await verify(page, "Select flights", "Search");

    await selectPassenger.selectFlights(
      "flight-select-AL248",
      "flight-select-BJ311",
    );

    await verify(page, "Passengers", "Select flights");

    await passenger.fillPassenger({
      name: "Pedro Souza",
      email: "pedrosouza@gmail.com",
      phone: "91987261526",
    });

    await verify(page, "Payment", "Passengers");

    await payment.fillPayment({
      cardNumber: "5530 0061 9126 2505",
      expiry: "02/2028",
      cvv: "505",
    });

    await verify(page, "Done");

  });

  //Thiago
  test("Fluxo completo só de ida", async ({ page }) => {
    await verify(page, "Search");
      
    await search.searchFlight({
      from: "Paris",
      to: "London",
      departureDate: "2026-11-22",
      passengers: "5",
      flightClass: "Business",
      oneWay: true,
    });

    await verify(page, "Select flights", "Search");
      
    await selectPassenger.selectFlights("flight-select-AL248");

    await verify(page, "Passengers", "Select flights");

    await passenger.fillPassenger({
      name: "Pedro Souza",
      email: "pedrosouza@gmail.com",
      phone: "91987261526",
    });

    await verify(page, "Payment", "Passengers");

    await payment.fillPayment({
      cardNumber: "5530 0061 9126 2505",
      expiry: "02/2028",
      cvv: "505",
    });

    await verify(page, "Done");
  });

});

test.describe("Search", () => {

  // Matheus S
  test("Origem e destino iguais devem ser rejeitados", async ({ page }) => {
    // 1. Preenche os campos de busca com origem e destino iguais
    await search.searchFlight({
      from: "Paris",
      to: "Paris",
      departureDate: "2026-10-26",
      returnDate: "2026-11-26",
      passengers: "1",
      flightClass: "Business",
    });
    
    // 2. Verifica se a etapa de busca CONTINUA ATIVA (não avançou para sucesso)
    await verify(page, "Search");

    // 3. Valida se a mensagem de erro exata da tela apareceu
    await expect(page.getByText("Departure and destination cities cannot be the same.", {exact: true})).toBeVisible();
  });

//Thiago
  test("Data de ida não pode ser maior ou igual a da volta", async ({ page }) => {
    // preenche os campos de busca com a data de ida maior que a de volta
    await search.searchFlight({
      from: "Paris",
      to: "London",
      departureDate: "2026-11-01",
      returnDate: "2026-10-01",
      passengers: "1",
      flightClass: "Business"
    });

    await expect(page.getByTestId("flight-return-date")).toHaveClass(/is-invalid/);
    await expect(page.getByText("Return date must be after departure date.", {exact: true})).toBeVisible();

    // preenche os campos de busca com a data de ida igual a da volta
    await search.searchFlight({
      from: "Paris",
      to: "London",
      departureDate: "2026-11-01",
      returnDate: "2026-11-01",
      passengers: "1",
      flightClass: "Business"
    });

    await expect(page.getByTestId("flight-return-date")).toHaveClass(/is-invalid/);
    await expect(page.getByText("Return date must be after departure date.", {exact: true})).toBeVisible();
  });

//Franciele
  test("Exibir mensagens de erro com todos os campos vazios", async ({ page }) => {
    // preenche os campos de busca com todos os campos vazios
    await search.searchFlight({
      from: "",
      to: "",
      departureDate: "",
      returnDate: "",
      passengers: "1",
      flightClass: "Business"
    });

    // Validar mensagem de erro da origem
    await expect(page.getByText("Please select a departure city.", { exact: true })).toBeVisible();

    // Validar mensagem de erro do destino
    await expect(page.getByText("Please select a destination city.", { exact: true })).toBeVisible();

    // Validar mensagem de erro da data de ida
    await expect(page.getByText("Please select a departure date.", { exact: true })).toBeVisible();

    // Validar mensagem de erro da data de volta
    await expect(page.getByText("Please select a return date.", { exact: true })).toBeVisible();
  });

});
