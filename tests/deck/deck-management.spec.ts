import { test, expect } from '@playwright/test';
import { login, createDeckViaUI, deleteDeckViaUI } from '../utils/test-utils';

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'playwrighttester@timfau.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'test123';
const TEST_SHEET_ID = '123uJsttzL6EmedjHzR2n8LSVFljlu1ZRVW84K5h74wI'; // Known valid public sheet

test.describe('Deck Management', () => {
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
    await login(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);
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
    await expect(page.locator('[data-testid="deck-name"]').first()).toContainText(uniqueDeckName);
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

    // Deletion is handled by the afterEach hook for this test
    // We just need to verify it exists before afterEach runs
    // No direct deletion call here, rely on afterEach
  });

  // Optional: Test for adding cards if it's part of deck management UI
  // test('should allow a user to add cards to a deck', async ({ page }) => {
  //   // TODO: Implement test steps
  // });
}); 