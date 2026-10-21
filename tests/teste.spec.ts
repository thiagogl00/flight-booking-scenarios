import { expect, test } from '@playwright/test';

 test('Busca', async ({ page }) => {
    await page.goto('/flight-booking-scenarios');

    await page.selectOption('[data-testid="flight-from"]', 'Paris');

    const inputIda = page.locator('[data-testid="flight-departure-date"]');
    await inputIda.fill('2026-10-21');

    const inputVolta = page.locator('[data-testid="flight-return-date"]');
    await inputVolta.fill('2026-10-21');

    page.locator('[data-testid="flight-passengers"]').fill('5')
    await page.selectOption('[data-testid="flight-class"]', 'Business');

    page.getByTestId('flight-search').click()

    expect(page).toHaveURL(/flight-booking-scenarios/)

  });
