import { expect, test } from "@playwright/test";

test.describe("Reserva de voos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/flight-booking-scenarios");
  });
//Emerson
  test("Fluxo completo de Reserva de Voo", async ({ page }) => {
    await expect(
      page.locator(".badge").filter({ hasText: "Search" }),
    ).toHaveClass(/bg-primary/);

    await page.selectOption('[data-testid="flight-from"]', "Paris");
    await page.selectOption('[data-testid="flight-to"]', "London");
    await page.getByTestId("flight-departure-date").fill("2026-10-26");
    await page.getByTestId("flight-return-date").fill("2026-11-01");
    await page.getByTestId("flight-passengers").fill("1");
    await page.selectOption('[data-testid="flight-class"]', "Business");
    await page.getByTestId("flight-search").click();

    await expect(
      page.locator(".badge").filter({ hasText: "Search" }),
    ).toHaveClass(/bg-success/);
    await expect(
      page.locator(".badge").filter({ hasText: "Select flights" }),
    ).toHaveClass(/bg-primary/);

    await page.getByTestId("flight-select-AL248").click();

    await page.getByTestId("flight-select-BJ311").click();

    await page.getByTestId("flight-continue-to-passengers").click();

    await expect(
      page.locator(".badge").filter({ hasText: "Select flights" }),
    ).toHaveClass(/bg-success/);
    await expect(
      page.locator(".badge").filter({ hasText: "Passengers" }),
    ).toHaveClass(/bg-primary/);

    await page.getByTestId("flight-passenger-name").fill("Pedro Souza");
    await page
      .getByTestId("flight-passenger-email")
      .fill("pedrosouza@gmail.com");
    await page.getByTestId("flight-passenger-phone").fill("91987261526");

    await page.getByTestId("flight-continue-to-payment").click();

    await expect(
      page.locator(".badge").filter({ hasText: "Passengers" }),
    ).toHaveClass(/bg-success/);
    await expect(
      page.locator(".badge").filter({ hasText: "Payment" }),
    ).toHaveClass(/bg-primary/);

    await page.getByTestId("flight-card-number").fill("5530 0061 9126 2505");
    await page.getByTestId("flight-expiry").fill("02/2028");
    await page.getByTestId("flight-cvv").fill("505");

    await page.getByTestId("flight-book").click();

    await expect(
      page.locator(".badge").filter({ hasText: "Done" }),
    ).toHaveClass(/bg-primary/);
  });
//Thiago
  test("Fluxo de pesquisa voo só de ida", async ({ page }) => {
    await expect(page.locator(".badge").filter({ hasText: "Search" }),).toHaveClass(/bg-primary/);
    await page.getByTestId("flight-one-way").click();

    await page.selectOption('[data-testid="flight-from"]', "Paris");
    await page.selectOption('[data-testid="flight-to"]', "London");
    await page.getByTestId("flight-departure-date").fill("2026-10-22");
    await page.getByTestId("flight-passengers").fill("5");
    await page.selectOption('[data-testid="flight-class"]', "Business");
    await page.getByTestId("flight-search").click();

    await expect(page.locator(".badge").filter({ hasText: "Search" }),).toHaveClass(/bg-success/);
    await expect(page.locator(".badge").filter({ hasText: "Select flights" }),).toHaveClass(/bg-primary/);

    await page.getByTestId("flight-select-AS174").click();

    await page.getByTestId("flight-continue-to-passengers").click();

    await expect(page.locator(".badge").filter({ hasText: "Select flights" }),).toHaveClass(/bg-success/);

    await expect(page.locator(".badge").filter({ hasText: "Passengers" }),).toHaveClass(/bg-primary/);

    await page.getByTestId("flight-passenger-name").fill("Pedro Souza");
    await page.getByTestId("flight-passenger-email").fill("pedrosouza@gmail.com");
    await page.getByTestId("flight-passenger-phone").fill("91987261526");

    await page.getByTestId("flight-continue-to-payment").click();

    await expect(page.locator(".badge").filter({ hasText: "Passengers" }),).toHaveClass(/bg-success/);
    await expect(page.locator(".badge").filter({ hasText: "Payment" }),).toHaveClass(/bg-primary/);

    await page.getByTestId("flight-card-number").fill("5530 0061 9126 2505");
    await page.getByTestId("flight-expiry").fill("02/2028");
    await page.getByTestId("flight-cvv").fill("505");

    await page.getByTestId("flight-book").click();

    await expect(page.locator(".badge").filter({ hasText: "Done" }),).toHaveClass(/bg-primary/);
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
    await expect(
      page.locator(".badge").filter({ hasText: "Search" }),
    ).toHaveClass(/bg-primary/);

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
