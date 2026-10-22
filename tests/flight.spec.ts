import { expect, test } from '@playwright/test';

test.describe('Reserva de voos', () => {
  test.beforeEach( async ({ page })=>{
    await page.goto('/flight-booking-scenarios');
  })

  test('Fluxo completo de Reserva de Voo', async ({ page }) => {

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

  test('Fluxo de pesquisa voo só de ida', async ({ page }) => {
    
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

  test('Data de ida é maior ou igual a da volta', async ({ page }) => {
    const listDate = [
      { departureDate: '2026-10-22', returnDate: '2026-10-20' },
      { departureDate: '2026-11-11', returnDate: '2026-11-11' },
    ];

    for (const { departureDate, returnDate } of listDate) {
      await page.selectOption('[data-testid="flight-from"]', 'Paris');
      await page.selectOption('[data-testid="flight-to"]', 'London');
      await page.getByTestId('flight-departure-date').fill(departureDate);
      await page.getByTestId('flight-return-date').fill(returnDate);
      await page.getByTestId('flight-search').click();

      await expect(page.getByTestId('flight-return-date')).toHaveClass(/is-invalid/);
      await expect(page.getByText('Return date must be after departure date.', { exact: true })).toBeVisible();
    }
  });

});


