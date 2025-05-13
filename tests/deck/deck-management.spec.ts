import { test, expect } from '@playwright/test';
import { login, createDeckViaUI, deleteDeckViaUI } from '../utils/test-utils';

const TEST_USER_EMAIL = process.env.VITE_TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.VITE_TEST_USER_PASSWORD;

// // Ensure the test user credentials are set - Moved inside describe block
// if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
//   throw new Error('VITE_TEST_USER_EMAIL and VITE_TEST_USER_PASSWORD environment variables must be set');
// }

const TEST_SHEET_ID = '123uJsttzL6EmedjHzR2n8LSVFljlu1ZRVW84K5h74wI'; // Known valid public sheet

test.describe('Deck Management', () => {
  // Check for environment variables before running tests in this suite
  test.beforeAll(() => {
    if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
      throw new Error('Deck Management tests require VITE_TEST_USER_EMAIL and VITE_TEST_USER_PASSWORD environment variables');
    }
  });

  let deckCardSelectorPrefix: string; // To store the selector for the created deck
  let uniqueDeckName: string;

  // Remove beforeAll as login needs to happen per test context
  // test.beforeAll(async ({ browser }) => {
  //   const page = await browser.newPage();
  //   await login(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);
  //   await page.close(); 
  // });

  // Login and create a unique deck before each test
  test.beforeEach(async ({ page }) => {
    uniqueDeckName = `Test Deck ${Date.now()}`;
    // Log in for each test
    await login(page, TEST_USER_EMAIL!, TEST_USER_PASSWORD!);
    // Go to the decks page (login should redirect here, but explicit navigation is safer)
    await page.goto('/'); 
    await page.waitForSelector('.decks-container', { state: 'visible' });
    // Create the deck for the test
    deckCardSelectorPrefix = await createDeckViaUI(page, uniqueDeckName, TEST_SHEET_ID);
  });

  // Delete the unique deck after each test
  test.afterEach(async ({ page }) => {
    await page.goto('/'); // Ensure we are on the deck list page
    await page.waitForSelector('.decks-container', { state: 'visible' });
    // Add error handling in case the test failed before creating the deck
    if (deckCardSelectorPrefix) {
      await deleteDeckViaUI(page, deckCardSelectorPrefix);
    }
    deckCardSelectorPrefix = '';
  });

  test('should allow a user to create a new deck', async ({ page }) => {
    // Verification is implicitly done by beforeEach and afterEach successful execution
    // We just need to ensure the test passes if the deck is created and found.
    await expect(page.locator(deckCardSelectorPrefix)).toBeVisible();
  });

  test('should allow a user to view a deck', async ({ page }) => {
    // Deck is created in beforeEach
    await expect(page.locator(deckCardSelectorPrefix)).toBeVisible();
    
    // Click the deck card to navigate
    // Note: DeckCard.tsx uses CardActionArea for navigation
    await page.locator(deckCardSelectorPrefix).locator('.MuiCardActionArea-root').click();

    // Verify navigation to the deck page (adjust URL/content check as needed)
    // Escape the '?' for RegExp as it's a special character
    const expectedUrlPattern = new RegExp(`.*/deck\\?name=${encodeURIComponent(uniqueDeckName)}&id=${TEST_SHEET_ID}$`); 
    const actualUrl = page.url();
    console.log('Expected URL Pattern:', expectedUrlPattern);
    console.log('Actual URL:', actualUrl);
    await expect(page).toHaveURL(expectedUrlPattern);
    // Add more checks for deck view content if necessary (e.g., card count)
    await expect(page.locator('[data-testid="deck-name"]').first()).toContainText(uniqueDeckName, { timeout: 10000 });
  });

  test('should allow a user to edit an existing deck', async ({ page }) => {
    const updatedDeckName = `${uniqueDeckName} - Edited`;

    // Deck is created in beforeEach
    await expect(page.locator(deckCardSelectorPrefix)).toBeVisible();

    // 1. Click the edit button within the specific deck card
    const editButton = page.locator(deckCardSelectorPrefix).locator('button[aria-label^="Edit"]');
    await expect(editButton).toBeVisible();
    await editButton.click();

    // 2. Modal opens - wait for it and modify the name
    await page.waitForSelector('[data-testid="deck-name-input"]', { state: 'visible' });
    await page.fill('[data-testid="deck-name-input"]', updatedDeckName);
    // Modify other fields if needed

    // 3. Submit the changes
    await page.click('[data-testid="submit-deck-button"]');

    // 4. Verify the deck name is updated in the list
    const updatedDeckCardSelectorPrefix = `[data-testid^="deck-card-${updatedDeckName.replace(/\s+/g, '-')}"]`;
    await expect(page.locator(updatedDeckCardSelectorPrefix)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(updatedDeckCardSelectorPrefix)).toContainText(updatedDeckName);

    // Update the selector prefix so afterEach deletes the *edited* deck
    deckCardSelectorPrefix = updatedDeckCardSelectorPrefix; 
  });

  test('should allow a user to delete an existing deck', async ({ page }) => {
    // Deck is created in beforeEach
    await expect(page.locator(deckCardSelectorPrefix)).toBeVisible();

    // 1. Find the specific deck card
    const deckCard = page.locator(deckCardSelectorPrefix);

    // 2. Find and click the delete button within the card
    const deleteButton = deckCard.locator('button[aria-label^="Delete"]');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // 3. Handle the confirmation dialog
    await expect(page.locator('[data-testid="delete-confirm-dialog"]')).toBeVisible();
    await page.click('[data-testid="confirm-delete-button"]');

    // 4. Verify the deck card is removed from the list
    await expect(deckCard).not.toBeVisible({ timeout: 10000 });

    // Set deckCardSelectorPrefix to null so afterEach doesn't try to delete it again
    deckCardSelectorPrefix = '';
  });

  // --- Start: Deck Interaction Tests ---

  test('should allow navigation through cards in a deck', async ({ page }) => {
    // Deck is created in beforeEach, view it
    await page.locator(deckCardSelectorPrefix).locator('.MuiCardActionArea-root').click();
    await expect(page.locator('[data-testid="deck-name"]').first()).toContainText(uniqueDeckName, { timeout: 10000 });

    // 1. Click the 'Start Deck' button
    await page.click('[data-testid="start-deck-button"]');

    // Wait for the first card front to be visible 
    await expect(page.locator('[data-testid="card-front"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="card-question"]')).toBeVisible();

    // 1. Check initial card state (showing front)
    const initialCardFront = page.locator('[data-testid="card-front"]');
    const initialQuestionElement = initialCardFront.locator('[data-testid="card-question"]');
    const initialQuestionText = await initialQuestionElement.textContent();
    expect(initialQuestionText).not.toBeNull();
    await expect(page.locator('[data-testid="card-back"]')).not.toBeVisible(); // Ensure back is hidden

    // 2. Click 'Show Answer' button (using existing data-testid)
    await page.click('[data-testid="show-answer-button"]'); 
    await expect(page.locator('[data-testid="card-back"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-answer"]')).toBeVisible();
    const initialCardBack = page.locator('[data-testid="card-back"]');
    const initialAnswerElement = initialCardBack.locator('[data-testid="card-answer"]');
    const initialAnswerText = await initialAnswerElement.textContent();
    expect(initialAnswerText).not.toBeNull();
    await expect(page.locator('[data-testid="card-front"]')).not.toBeVisible(); // Ensure front is hidden

    // 3. Click 'I got it wrong' button to simulate going to the next card
    await page.click('[data-testid="wrong-answer-button"]'); 

    // 4. Verify the next card is displayed (front side shown)
    await expect(page.locator('[data-testid="card-front"]')).toBeVisible(); // Back to front view
    await expect(page.locator('[data-testid="card-question"]')).toBeVisible();
    const nextQuestionElement = page.locator('[data-testid="card-question"]');
    const nextQuestionText = await nextQuestionElement.textContent();
    expect(nextQuestionText).not.toBeNull();
    expect(nextQuestionText).not.toEqual(initialQuestionText); // Ensure it's a different card question
    await expect(page.locator('[data-testid="card-back"]')).not.toBeVisible(); // Back is hidden again
    
    // Previous button does not exist in this component, removed that check.
  });

  test('should allow marking a card as learned (archive)', async ({ page }) => {
    // View the deck
    await page.locator(deckCardSelectorPrefix).locator('.MuiCardActionArea-root').click();
    await expect(page.locator('[data-testid="deck-name"]').first()).toContainText(uniqueDeckName, { timeout: 10000 });
    await page.click('[data-testid="start-deck-button"]');
    await expect(page.locator('[data-testid="card-front"]')).toBeVisible({ timeout: 10000 });
    const initialQuestionElement = page.locator('[data-testid="card-question"]');
    const initialQuestionText = await initialQuestionElement.textContent();
    expect(initialQuestionText).not.toBeNull();

    // 1. Click the 'Start Deck' button
    await page.click('[data-testid="start-deck-button"]');

    // 1. Click 'Show Answer'
    await page.click('[data-testid="show-answer-button"]'); 
    await expect(page.locator('[data-testid="card-back"]')).toBeVisible();

    // 2. Find the 'I got it right' button (used for marking learned/archiving)
    const markLearnedButton = page.locator('[data-testid="correct-answer-button"]'); 
    await expect(markLearnedButton).toBeVisible();

    // 3. Click the button
    await markLearnedButton.click();

    // 4. Verify the card changes (moves to the next card)
    //    Wait for the front of the *next* card to appear
    await expect(page.locator('[data-testid="card-front"]')).toBeVisible({ timeout: 5000 }); 
    const nextQuestionElement = page.locator('[data-testid="card-question"]');
    await expect(nextQuestionElement).toBeVisible();
    const nextQuestionText = await nextQuestionElement.textContent();
    expect(nextQuestionText).not.toBeNull();
    // Ensure the question text is different, indicating the card advanced
    expect(nextQuestionText).not.toEqual(initialQuestionText); 
  });

  // --- End: Deck Interaction Tests ---

  // Optional: Test for adding cards if it's part of deck management UI
  // test('should allow a user to add cards to a deck', async ({ page }) => {
  //   // TODO: Implement test steps
  // });
}); 