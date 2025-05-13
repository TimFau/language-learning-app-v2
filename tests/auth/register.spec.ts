import { test, expect } from '@playwright/test';

const TEST_USER_EMAIL = process.env.VITE_TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.VITE_TEST_USER_PASSWORD;

// // Ensure the test user credentials are set - Moved inside describe block
// if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
//   throw new Error('VITE_TEST_USER_EMAIL and VITE_TEST_USER_PASSWORD environment variables must be set');
// }

test.describe('Registration Flow', () => {
  // Check for environment variables before running tests in this suite
  test.beforeAll(() => {
    if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
      throw new Error('Registration Flow tests require VITE_TEST_USER_EMAIL and VITE_TEST_USER_PASSWORD environment variables');
    }
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
  });

  test('should register successfully with valid information', async ({ page }) => {
    // Fill in the registration form
    await page.locator('[data-testid="register-first-name-input"] input').fill('Test');
    await page.locator('[data-testid="register-last-name-input"] input').fill('User');
    // Use a unique email for each test run to avoid conflicts
    const uniqueEmail = `testuser-${Date.now()}@example.com`;
    await page.locator('[data-testid="register-email-input"] input').fill(uniqueEmail);
    await page.locator('[data-testid="register-password-input"] input').fill(TEST_USER_PASSWORD!);
    
    // Click the register button
    await page.click('[data-testid="register-submit-button"]');
    
    // Verify successful registration by checking for redirect to home page
    await expect(page).toHaveURL('/');

    // Add an explicit wait for the button to become visible, especially for WebKit/Safari
    await expect(page.locator('[data-testid="create-deck-button"]')).toBeVisible({ timeout: 10000 }); // Increased timeout
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
    await page.locator('[data-testid="register-password-input"] input').fill(TEST_USER_PASSWORD!);
    
    // Click the register button
    await page.click('[data-testid="register-submit-button"]');
    
    // Verify validation message
    await expect(page.locator('text=Please enter a valid email address.')).toBeVisible();
  });

  test('should show error for duplicate email', async ({ page }) => {
    // Fill in the registration form with an email that already exists
    await page.locator('[data-testid="register-first-name-input"] input').fill('Another Test User');
    await page.locator('[data-testid="register-last-name-input"] input').fill('User');
    // Use the fixed test user email to check for duplicate registration
    await page.locator('[data-testid="register-email-input"] input').fill(TEST_USER_EMAIL!);
    await page.locator('[data-testid="register-password-input"] input').fill(TEST_USER_PASSWORD!);
    
    // Click the register button
    await page.click('[data-testid="register-submit-button"]');
    
    // Verify error message
    await expect(page.locator('[data-testid="register-alert"]')).toContainText('You are already registered with this email address.');
  });
}); 