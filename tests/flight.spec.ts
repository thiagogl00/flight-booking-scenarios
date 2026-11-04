import { expect, Page, test } from "@playwright/test";
import { FlightBookingPage } from "../pages/flightbookingSearch.page";
import { SelectPassengerPage } from "../pages/flightbookingSelect.page";
import { PassengerPage } from "../pages/flightbookingPassenger.page";
import { PaymentPage } from "../pages/flightbookingPayment.page";

async function verify(page:Page, hasTextPrimary: string, hasTextSuccess?: string) {
    hasTextSuccess?await expect(page.locator(".badge").filter({ hasText: hasTextSuccess }),)
    .toHaveClass(/bg-success/): null;
    await expect(page.locator(".badge").filter({ hasText: hasTextPrimary }),)
    .toHaveClass(/bg-primary/);
}

test.describe("Reserva de voos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/flight-booking-scenarios");
  });
//Emerson
  test("Fluxo completo de Reserva de Voo", async ({ page }) => {
    const flightBooking = new FlightBookingPage(page);
    const selectPassenger = new SelectPassengerPage(page);
    const passenger = new PassengerPage(page);
    const payment = new PaymentPage(page);

    await verify(page, "Search");

    await flightBooking.searchFlight({
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
  test("Fluxo de pesquisa voo só de ida", async ({ page }) => {
    const flightBooking = new FlightBookingPage(page);
    const selectPassenger = new SelectPassengerPage(page);
    const passenger = new PassengerPage(page);
    const payment = new PaymentPage(page);

    await verify(page, "Search");


    await flightBooking.searchFlight({
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

  // Matheus S
  test("Origem e destino iguais devem ser rejeitados", async ({ page }) => {
    // Seleciona Paris como cidade de origem.
    await page.selectOption('[data-testid="flight-from"]', "Paris");
    // Seleciona Paris também como cidade de destino.
    await page.selectOption('[data-testid="flight-to"]', "Paris");
    // Preenche a data de ida.
    await page.getByTestId("flight-departure-date").fill("2026-10-26");
    // Preenche a data de volta.
    await page.getByTestId("flight-return-date").fill("2026-11-01");
    // Informa que viajará um passageiro.
    await page.getByTestId("flight-passengers").fill("1");
    // Seleciona a classe executiva.
    await page.selectOption('[data-testid="flight-class"]', "Business");
    // Aciona a busca de voos.
    await page.getByTestId("flight-search").click();

    // 1. Verifica se a etapa de busca CONTINUA ATIVA (não avançou para sucesso)
    await verify(page, "Search");


    // 2. Valida se a mensagem de erro exata da tela apareceu
    await expect(
      page.getByText("Departure and destination cities cannot be the same.", {
        exact: true,
      }),
    ).toBeVisible();
  });
//Thiago
  test("Data de ida não pode ser maior ou igual a da volta", async ({
    page,
  }) => {
    const listDate = [
      { departureDate: "2026-10-22", returnDate: "2026-10-20" },
      { departureDate: "2026-11-11", returnDate: "2026-11-11" },
    ];

    for (const { departureDate, returnDate } of listDate) {
      await page.selectOption('[data-testid="flight-from"]', "Paris");
      await page.selectOption('[data-testid="flight-to"]', "London");
      await page.getByTestId("flight-departure-date").fill(departureDate);
      await page.getByTestId("flight-return-date").fill(returnDate);
      await page.getByTestId("flight-search").click();

      await expect(page.getByTestId("flight-return-date")).toHaveClass(
        /is-invalid/,
      );
      await expect(
        page.getByText("Return date must be after departure date.", {
          exact: true,
        }),
      ).toBeVisible();
    }
  });
//Franciele
  test("Exibir mensagens de erro com todos os campos vazios", async ({
    page,
  }) => {
    // Garantir que os campos estejam vazios
    await page.getByTestId("flight-from").selectOption("");
    await page.getByTestId("flight-to").selectOption("");
    await page.getByTestId("flight-departure-date").fill("");
    await page.getByTestId("flight-return-date").fill("");

    // Clicar no botão de busca
    await page.getByTestId("flight-search").click();

    // Validar mensagem de erro da origem
    await expect(
      page.getByText("Please select a departure city.", { exact: true }),
    ).toBeVisible();

    // Validar mensagem de erro do destino
    await expect(
      page.getByText("Please select a destination city.", { exact: true }),
    ).toBeVisible();

    // Validar mensagem de erro da data de ida
    await expect(
      page.getByText("Please select a departure date.", { exact: true }),
    ).toBeVisible();

    // Validar mensagem de erro da data de volta
    await expect(
      page.getByText("Please select a return date.", { exact: true }),
    ).toBeVisible();
  });
});
