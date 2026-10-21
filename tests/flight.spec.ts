import { expect, test } from '@playwright/test';

test.describe('Reserva de voos', () => {
  test('Fluxo completo de Reserva de Voo', async ({ page }) => {
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
});


