import { gql } from "@apollo/client"

const DECK_FIELDS = `
    fragment DeckFields on decks {
        id
        status
        deck_name
        deck_id
        categories
        Language1
        Language2
        user_created {
            username
        }
    }
`

export const COMMUNITY_DECKS = `
    ${DECK_FIELDS}
    query GetCommunityDecks {
        decks {
            ...DeckFields
        }
    }
`

export const DEMO_DECKS = `
    ${DECK_FIELDS}
    query GetDemoDecks {
        decks(
            filter: {
                include_in_demo: {
                    _eq: true
                }
            }
        ) {
            ...DeckFields
        }
    }
`

export const USER_DECKS = gql`
    ${DECK_FIELDS}
    query GetUserDecks($userId: String!) {
        decks(filter: {
            user_created: {
                id: {
                    _eq: $userId
                }
            }
        }) {
            ...DeckFields
        }
    }
`

export const CREATE_DECK = `
    ${DECK_FIELDS}
    mutation CreateDeck ($deckName: String!, $deckId: String!, $nativeLanguage: String!, $learningLanguage: String!, $deckStatus: String!) {
        create_decks_item (data: {
            status: $deckStatus,
            deck_name: $deckName,
            deck_id: $deckId,
            Language1: $nativeLanguage,
            Language2: $learningLanguage
        }) {
            ...DeckFields
        }
    }
`

export const UPDATE_DECK = `
    ${DECK_FIELDS}
    mutation UpdateDeck ($deckName: String!, $deckId: String!, $nativeLanguage: String!, $learningLanguage: String!, $deckStatus: String!, $id: ID!) {
        update_decks_item (id: $id, data: {
            status: $deckStatus,
            deck_name: $deckName,
            deck_id: $deckId,
            Language1: $nativeLanguage,
            Language2: $learningLanguage
        }) {
            ...DeckFields
        }
    }
`

export const DELETE_DECK = `
    mutation DeleteDeck ($deckId: ID!) {
        delete_decks_item (id: $deckId) {
            id
        }
    }
`

const SAVED_DECK_FIELDS = `
    ${DECK_FIELDS}
    fragment SavedDeckFields on saved_decks {
        id
        status
        date_created
        last_access
        user_created {
            id
        }
        deck_relation {
            ...DeckFields
        }
    }
`

export const SAVED_DECKS = `
    ${SAVED_DECK_FIELDS}
    query getSavedDecks($userId: String!){
        saved_decks(filter: {
            user_created: {
                id: {
                    _eq: $userId
                }
            }
        }) {
            ...SavedDeckFields
        }
    }
`

export const SAVE_DECK = `
    ${SAVED_DECK_FIELDS}
    mutation SaveDeck ($communityDeckId: create_decks_input!) {
        create_saved_decks_item (data: {
            status: "published",
            deck_relation: $communityDeckId
        }) {
            ...SavedDeckFields
        }
    }
`

// UNSAVE DECK
export const UNSAVE_DECK = `
    mutation UnsaveDeck ($savedDeckId: ID!) {
        delete_saved_decks_item (id: $savedDeckId) {
            id
        }
    }
`

export const UPDATE_SAVED_DECK = `
    mutation UpdateSavedDeck($id: ID!, $lastAccess: Date, $lastComplete: Date) {
        update_saved_decks_item(id: $id, data: {
            id: $id,
            last_access: $lastAccess,
            last_complete: $lastComplete
        }) {
            id
            last_access
            last_complete
        }
    }
`

export const USERS_ME = `
    query UsersMe {
        users_me {
            first_name
            email
            id
            username
        }
    }
`

export const CREATE_ACCOUNT = `
    mutation CreateAccount (
            $firstName: String!,
            $lastName: String!,
            $userEmail: String!,
            $userPassword: Hash!
        ) {
        create_users_item(
            data: {
                first_name: $firstName,
                last_name: $lastName,
                email: $userEmail,
                password: $userPassword,
                status: "active",
                provider: "default",
                role:{
                    id: "c8737b56-b42b-4796-adb0-d0fc6c1ede40"
                    name: "User"
                    app_access: true
                    enforce_tfa: false
                    admin_access: false
                    icon: "supervised_user_circle"
                }
            }
        ) {
            email
            status
        }
    }
`

export const LOGIN = `
    mutation Login ($email: String!, $password: String!) {
        auth_login(
            email: $email,
            password: $password,
            mode: cookie
        ) {
            access_token
            refresh_token
            expires
        }
    }
`

export const SAVE_TERM = gql`
  mutation SaveTerm(
    $term: String!, 
    $definition: String!, 
    $language: String!, 
    $source_deck: create_decks_input!,
    $source_term_key: String,
    $source_definition: String,
    $sync_preference: String,
    $last_synced_at: Date
  ) {
    create_saved_terms_item(
      data: {
        term: $term
        definition: $definition
        language: $language
        status: "published"
        source_deck: $source_deck
        source_term_key: $source_term_key
        source_definition: $source_definition
        sync_preference: $sync_preference
        last_synced_at: $last_synced_at
      }
    ) {
      id
      term
      definition
      language
      source_term_key
      source_definition
      sync_preference
      last_synced_at
      source_deck {
        id
        deck_name
        Language2
        status
      }
      user_created {
        id
      }
    }
  }
`

export const CHECK_TERM_SAVED = gql`
  query CheckTermSaved($term: String!, $language: String!) {
    saved_terms(
      filter: {
        _and: [
          { term: { _eq: $term } }
          { language: { _eq: $language } }
        ]
      }
      limit: 1
    ) {
      id
      source_deck {
        id
        deck_name
        Language2
        status
      }
    }
  }
`

export const BATCH_UPDATE_TERMS = gql`
  mutation BatchUpdateTerms($items: [BatchUpdateTermInput!]!) {
    batch_update_saved_terms_items(data: $items) {
      id
      term
      definition
      language
    }
  }
`

export const UPDATE_MULTIPLE_TERMS = gql`
  mutation UpdateMultipleTerms($keys: [ID!]!, $data: update_saved_terms_input!) {
    update_saved_terms_items(ids: $keys, data: $data) {
      id
      term
      definition
      language
    }
  }
`

export const CHECK_SYNCED_DECK = gql`
  query CheckSyncedDeck($deckId: String!) {
    synced_decks(filter: {
      deck_id: { _eq: $deckId }
    }) {
      id
      sync_preference
    }
  }
`

export const CREATE_SYNCED_DECK = gql`
  mutation CreateSyncedDeck($deckId: String!, $language: String!, $termCount: Int!) {
    create_synced_decks_item(data: {
      deck_id: $deckId
      language: $language
      sync_preference: "manual"
      term_count_at_save: $termCount
    }) {
      id
      deck_id
      sync_preference
    }
  }
`

export const SAVE_MULTIPLE_TERMS = gql`
  mutation SaveMultipleTerms($items: [create_saved_terms_input!]!) {
    create_saved_terms_items(data: $items) {
      id
      term
      definition
      language
      source_term_key
      source_definition
      source_deck {
        id
        deck_name
        Language2
        status
      }
    }
  }
`

export const GET_SAVED_TERM_KEYS = gql`
  query GetSavedTermKeys($deckId: String!) {
    saved_terms(
      filter: {
        source_deck: {
          deck_id: { _eq: $deckId }
        }
      }
    ) {
      id
      source_term_key
      term
      language
    }
  }
`