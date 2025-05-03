import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
  });

  test('should register successfully with valid information', async ({ page }) => {
    // Fill in the registration form
    await page.locator('[data-testid="register-first-name-input"] input').fill('Test');
    await page.locator('[data-testid="register-last-name-input"] input').fill('User');
    await page.locator('[data-testid="register-email-input"] input').fill(`test${Date.now()}@example.com`);
    await page.locator('[data-testid="register-password-input"] input').fill('Test123!');
    
    // Click the register button
    await page.click('[data-testid="register-submit-button"]');
    
    // Verify successful registration by checking for redirect to home page
    await expect(page).toHaveURL('/');
    // Verify we can see authenticated content
    await expect(page.locator('[data-testid="create-deck-button"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('[data-testid="register-submit-button"]');
    
    // Verify validation messages
    await expect(page.locator('text=Please enter your first name.')).toBeVisible();
    await expect(page.locator('text=Please enter your last name.')).toBeVisible();
    await expect(page.locator('text=Please enter your email address.')).toBeVisible();
    await expect(page.locator('text=Please enter a password.')).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    // Fill in the registration form with invalid email
    await page.locator('[data-testid="register-first-name-input"] input').fill('Test');
    await page.locator('[data-testid="register-last-name-input"] input').fill('User');
    await page.locator('[data-testid="register-email-input"] input').fill('invalid-email');
    await page.locator('[data-testid="register-password-input"] input').fill('Test123!');
    
    // Click the register button
    await page.click('[data-testid="register-submit-button"]');
    
    // Verify validation message
    await expect(page.locator('text=Please enter a valid email address.')).toBeVisible();
  });

  test('should show error for duplicate email', async ({ page }) => {
    // Fill in the registration form with an email that already exists
    await page.locator('[data-testid="register-first-name-input"] input').fill('Test');
    await page.locator('[data-testid="register-last-name-input"] input').fill('User');
    await page.locator('[data-testid="register-email-input"] input').fill('playwrighttester@timfau.com');
    await page.locator('[data-testid="register-password-input"] input').fill('Test123!');
    
    // Click the register button
    await page.click('[data-testid="register-submit-button"]');
    
    // Verify error message
    await expect(page.locator('[data-testid="register-alert"]')).toContainText('You are already registered with this email address.');
  });
}); 