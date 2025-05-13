import { test, expect } from '@playwright/test';
import { login, logout } from '../utils/test-utils';

const TEST_USER_EMAIL = process.env.VITE_TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.VITE_TEST_USER_PASSWORD;

// // Ensure the test user credentials are set - Moved inside describe block
// if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
//   throw new Error('VITE_TEST_USER_EMAIL and VITE_TEST_USER_PASSWORD environment variables must be set');
// }

test.describe('Login Flow', () => {
  // Check for environment variables before running tests in this suite
  test.beforeAll(() => {
    if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
      throw new Error('Login Flow tests require VITE_TEST_USER_EMAIL and VITE_TEST_USER_PASSWORD environment variables');
    }
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await login(page, TEST_USER_EMAIL!, TEST_USER_PASSWORD!);

    // Verify successful login (e.g., check for a logged-in indicator or redirect)
    await expect(page.locator('[data-testid="create-deck-button"]')).toBeVisible();
    await expect(page).toHaveURL('/'); // Or the expected dashboard URL
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.click('[data-testid="login-link"]');
    // Fill in the login form with invalid credentials
    await page.fill('[data-testid="login-email-input"]', 'wrong@example.com');
    await page.fill('[data-testid="login-password-input"]', 'wrongpassword');
    
    // Click the login button and wait for the alert
    const alertPromise = page.waitForEvent('dialog');
    await page.click('[data-testid="login-submit-button"]');
    const alert = await alertPromise;
    
    // Verify alert message
    expect(alert.message()).toBe('Invalid user credentials.');
    await alert.accept();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('[data-testid="login-link"]');
    // Try to submit empty form
    await page.click('[data-testid="login-submit-button"]');
    
    // Verify validation messages
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    await expect(page.locator('text=Please enter your password')).toBeVisible();
  });

  test('should persist login state after page reload', async ({ page }) => {
    // First login using the helper with env vars
    await login(page, TEST_USER_EMAIL!, TEST_USER_PASSWORD!);
    
    // Verify initial login
    await expect(page.locator('[data-testid="create-deck-button"]')).toBeVisible();
    
    // Reload the page
    await page.reload();
    
    // Verify we're still logged in after reload
    await expect(page.locator('[data-testid="create-deck-button"]')).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('should logout successfully', async ({ page }) => {
    // First, log in
    await login(page, TEST_USER_EMAIL!, TEST_USER_PASSWORD!);
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();

    // Then, log out using the helper
    await logout(page);

    // Verify logged out state (e.g., login link is visible again)
    await expect(page.locator('[data-testid="login-link"]')).toBeVisible();
    await expect(page.locator('[data-testid="logout-button"]')).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });
}); 