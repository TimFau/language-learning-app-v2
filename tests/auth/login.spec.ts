import { test, expect } from '@playwright/test';
import { login } from '../utils/test-utils';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.click('[data-testid="login-link"]');
    // Fill in the login form
    await page.fill('[data-testid="login-email-input"]', 'playwrighttester@timfau.com');
    await page.fill('[data-testid="login-password-input"]', 'test123');
    
    // Click the login button
    await page.click('[data-testid="login-submit-button"]');
    
    // Verify successful login by checking for redirect to home page
    await expect(page).toHaveURL('/');
    // Verify we can see authenticated content
    await expect(page.locator('[data-testid="create-deck-button"]')).toBeVisible();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.click('[data-testid="login-link"]');
    // Fill in the login form with invalid credentials
    await page.fill('[data-testid="login-email-input"]', 'wrong@example.com');
    await page.fill('[data-testid="login-password-input"]', 'wrongpassword');
    
    // Click the login button
    await page.click('[data-testid="login-submit-button"]');
    
    // Verify error message is displayed
    await expect(page.locator('text=Invalid username or password')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('[data-testid="login-link"]');
    // Try to submit empty form
    await page.click('[data-testid="login-submit-button"]');
    
    // Verify validation messages
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
    await expect(page.locator('text=Please enter your password')).toBeVisible();
  });
}); 