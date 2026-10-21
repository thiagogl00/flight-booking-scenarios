import { expect, test } from '@playwright/test';

test.describe('Buscar voos', () => {
  test('Realiza uma busca válida com retorno', async ({ page }) => {
    await page.goto('/flight-booking-scenarios');

    await expect(page.locator('.badge').filter({ hasText: 'Search' })).toHaveClass(/bg-primary/);
    await page.selectOption('[data-testid="flight-from"]', 'Paris');
    await page.selectOption('[data-testid="flight-to"]', 'London');
    await page.getByTestId('flight-departure-date').fill('2026-10-22');
    await page.getByTestId('flight-return-date').fill('2026-10-29');
    await page.getByTestId('flight-passengers').fill('5');
    await page.selectOption('[data-testid="flight-class"]', 'Business');
    await page.getByTestId('flight-search').click();

    await expect(page.locator('.badge').filter({ hasText: 'Search' })).toHaveClass(/bg-success/);
  });

   test('Realiza uma busca válida sem retorno', async ({ page }) => {
    await page.goto('/flight-booking-scenarios');

    await expect(page.locator('.badge').filter({ hasText: 'Search' })).toHaveClass(/bg-primary/);
    await page.getByTestId('flight-one-way').click();
    
    await page.selectOption('[data-testid="flight-from"]', 'Paris');
    await page.selectOption('[data-testid="flight-to"]', 'London');
    await page.getByTestId('flight-departure-date').fill('2026-10-22');
    await page.getByTestId('flight-passengers').fill('5');
    await page.selectOption('[data-testid="flight-class"]', 'Business');
    await page.getByTestId('flight-search').click();

    await expect(page.locator('.badge').filter({ hasText: 'Search' })).toHaveClass(/bg-success/);
  });

  test('Campos obrigatórios não preenchidos em search', async ({ page }) => {
    await page.goto('/flight-booking-scenarios');

    await page.getByTestId('flight-search').click();
    
    await expect(page.getByTestId('flight-from')).toHaveClass(/is-invalid/);
    await expect(page.getByTestId('flight-to')).toHaveClass(/is-invalid/);
    await expect(page.getByTestId('flight-departure-date')).toHaveClass(/is-invalid/);
    await expect(page.getByTestId('flight-return-date')).toHaveClass(/is-invalid/);

    await expect(page.getByText('Please select a departure city.', { exact: true })).toBeVisible();
    await expect(page.getByText('Please select a destination city.', { exact: false })).toBeVisible();
    await expect(page.getByText('Please select a departure date.', { exact: true })).toBeVisible();
    await expect(page.getByText('Please select a return date.', { exact: true })).toBeVisible();


  });

  test('Origem e destino iguais não são permitidos', async ({ page }) => {
    await page.goto('/flight-booking-scenarios');

    await page.selectOption('[data-testid="flight-from"]', 'Paris');
    await page.selectOption('[data-testid="flight-to"]', 'Paris');
    await page.getByTestId('flight-departure-date').fill('2026-10-22');
    await page.getByTestId('flight-return-date').fill('2026-10-29');
    await page.getByTestId('flight-search').click();

    await expect(page.getByTestId('flight-to')).toHaveClass(/is-invalid/);
    await expect(page.getByText('Departure and destination cities cannot be the same.', { exact: true })).toBeVisible();

  });

  test('Data de ida é maior ou igual a da volta', async ({ page }) => {
    await page.goto('/flight-booking-scenarios');

    await page.selectOption('[data-testid="flight-from"]', 'Paris');
    await page.selectOption('[data-testid="flight-to"]', 'London');
    await page.getByTestId('flight-departure-date').fill('2026-10-29');
    await page.getByTestId('flight-return-date').fill('2026-10-22');
    await page.getByTestId('flight-search').click();

    await expect(page.getByTestId('flight-return-date')).toHaveClass(/is-invalid/);
    await expect(page.getByText('Return date must be after departure date.', { exact: true })).toBeVisible();

  });
});


