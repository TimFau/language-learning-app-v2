export type SyncPreference = 'manual' | 'auto_add' | 'auto_update' | 'auto_delete' | 'full_sync';

export interface SavedTermInput {
  term: string;
  definition: string;
  language: string;
  user: string;
  status?: 'published' | 'draft' | 'archived';
  source_deck_id?: string;
  source_term_key?: string;
  source_definition?: string;
  sync_preference?: SyncPreference;
  last_synced_at?: Date;
}

export interface SavedTermMetadata {
  source_deck_id: string;
  source_term_key: string;
  source_definition: string;
  sync_preference: SyncPreference;
  last_synced_at?: Date;
}

export const createSavedTermInput = (
  term: string,
  definition: string,
  language: string,
  user: string,
  metadata?: Partial<SavedTermMetadata>,
  status: SavedTermInput['status'] = 'published'
): SavedTermInput => ({
  term,
  definition,
  language,
  user,
  status,
  ...metadata
}); 