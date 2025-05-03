import { Page, expect } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  await page.click('[data-testid="login-link"]');
  await page.fill('[data-testid="login-email-input"]', email);
  await page.fill('[data-testid="login-password-input"]', password);
  await page.click('[data-testid="login-submit-button"]');
  // Wait for login to complete and redirect
  await expect(page).toHaveURL('/');
}

export async function logout(page: Page) {
  await page.click('[data-testid="logout-button"]');
  await expect(page).toHaveURL('/');
}

export async function createTestDeck(page: Page, deckName: string) {
  await page.click('[data-testid="create-deck-button"]');
  await page.fill('[data-testid="deck-name-input"]', deckName);
  await page.fill('[data-testid="deck-id-input"]', 'test-sheet-id');
  await page.click('[data-testid="submit-deck-button"]');
  await expect(page.locator(`text=${deckName}`)).toBeVisible();
}

export async function interactWithFlashCard(page: Page) {
  // Wait for the flashcard to be visible
  await expect(page.locator('[data-testid="flashcard"]')).toBeVisible();
  
  // Get the question text
  const question = await page.locator('[data-testid="card-question"]').textContent();
  
  // Click to show answer
  await page.click('[data-testid="show-answer-button"]');
  
  // Get the answer text
  const answer = await page.locator('[data-testid="card-answer"]').textContent();
  
  // Mark as correct
  await page.click('[data-testid="correct-answer-button"]');
  
  return { question, answer };
}

export async function markCardAsIncorrect(page: Page) {
  await page.click('[data-testid="show-answer-button"]');
  await page.click('[data-testid="wrong-answer-button"]');
} 