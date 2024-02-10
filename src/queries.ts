const DECK_FIELDS = `
    fragment DeckFields on decks {
        id
        deck_name
        deck_id
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

export const USER_DECKS = `
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

export const SAVED_DECKS = `
    ${DECK_FIELDS}
    query getSavedDecks($userId: String!){
        saved_decks(filter: {
            user_created: {
                id: {
                    _eq: $userId
                }
            }
        }) {
            id
            status
            date_created
            user_created {
                id
            }
            deck_relation {
                ...DeckFields
            }
        }
    }
`

export const CREATE_DECK = `
    mutation CreateDeck ($deckName: String!, $deckId: String!, $deckStatus: String!) {
        create_decks_item (data: {
            status: $deckStatus,
            deck_name: $deckName,
            deck_id: $deckId
        }) {
            status
            deck_name
            deck_id
        }
    }
`

export const SAVE_DECK = `
    mutation SaveDeck ($communityDeckId: create_decks_input!) {
        create_saved_decks_item (data: {
            status: "published",
            deck_relation: $communityDeckId
        }) {
            status
            deck_relation {
                deck_name
                deck_id
            }
        }
    }
`

export const USERS_ME = `
    query UsersMe {
        users_me {
            first_name
            email
            id
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
        }
    }
`
