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
  mutation SaveTerm($term: String!, $definition: String!, $language: String!) {
    create_saved_terms_item(
      data: {
        term: $term
        definition: $definition
        language: $language
        status: "published"
      }
    ) {
      id
      term
      definition
      language
    }
  }
`
