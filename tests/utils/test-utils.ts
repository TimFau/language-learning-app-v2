import { Page, expect } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  await page.click('[data-testid="login-link"]');
  await page.fill('[data-testid="login-email-input"]', email);
  await page.fill('[data-testid="login-password-input"]', password);
  await page.click('[data-testid="login-submit-button"]');
  // Wait for login to complete and redirect
  await expect(page).toHaveURL('/');
  // Verify we can see authenticated content (like in login.spec.ts)
  await expect(page.locator('[data-testid="create-deck-button"]')).toBeVisible();
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

// --- Deck Management Helpers ---

/**
 * Creates a deck via the UI.
 * @param page Playwright Page object
 * @param deckName Name for the new deck
 * @param deckSheetId Google Sheet ID for the deck content
 * @returns The generated data-testid for the created deck card.
 */
export async function createDeckViaUI(page: Page, deckName: string, deckSheetId: string = '1DBxo_07qQZGB24fE20nPpiXGkOqNyrQoHffGPA_RjBY') {
  await page.click('[data-testid="create-deck-button"]');
  await page.waitForSelector('[data-testid="deck-name-input"]', { state: 'visible' });
  await page.fill('[data-testid="deck-name-input"]', deckName);
  await page.fill('[data-testid="deck-id-input"]', deckSheetId); // Use provided or default sheet ID
  // Add language selection if needed
  await page.click('[data-testid="submit-deck-button"]');
  
  // Construct the expected data-testid selector prefix
  const deckCardSelectorPrefix = `[data-testid^="deck-card-${deckName.replace(/\s+/g, '-')}"]`;
  
  // Wait for the card to appear and verify it
  await expect(page.locator(deckCardSelectorPrefix)).toBeVisible({ timeout: 10000 });
  await expect(page.locator(deckCardSelectorPrefix)).toContainText(deckName);

  // Return the selector prefix for future use (e.g., deletion)
  return deckCardSelectorPrefix;
}

/**
 * Deletes a deck via the UI using its data-testid selector prefix.
 * @param page Playwright Page object
 * @param deckCardSelectorPrefix The data-testid selector prefix (e.g., `[data-testid^="deck-card-My-Deck-Name"]`)
 */
export async function deleteDeckViaUI(page: Page, deckCardSelectorPrefix: string) {
  const deckCard = page.locator(deckCardSelectorPrefix);
  // Find the delete button within the specific deck card
  const deleteButton = deckCard.locator('button[aria-label^="Delete"]'); 
  
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();

  // Add confirmation dialog handling if necessary
  // page.on('dialog', dialog => dialog.accept()); // Example: Accept any confirmation

  // Verify the deck card is removed
  await expect(deckCard).not.toBeVisible({ timeout: 10000 });
}

// --- End Deck Management Helpers --- 