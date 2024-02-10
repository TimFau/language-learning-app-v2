const PUBLIC_DECK_FIELDS = `
    fragment PublicListFields on public_lists {
        id
        list_name
        list_id  
    }
`

export const PUBLIC_DECKS = `
    ${PUBLIC_DECK_FIELDS}
    query GetPublicDecks {
        public_lists {
            ...PublicListFields
        }
    }
`

export const DEMO_DECKS = `
    ${PUBLIC_DECK_FIELDS}
    query getDemoDecks {
        public_lists(
            filter: {
                include_in_demo: {
                    _eq: true
                }
            }
        ) {
            ...PublicListFields
        }
    }
`

export const USER_DECKS = `
    query GetUserDecks($userId: String!){
        public_lists(filter: {
            user_created: {
                id: {
                    _eq: $userId
                }
            }
        }) {
            id
            list_name
            list_id
            status
            date_created
            user_created {
                id
            }
        }
    }
`

export const CREATE_PUBLIC_DECK = `
    mutation CreatePublicDeck ($deckName: String!, $deckId: String!) {
        create_public_lists_item (data: {
            status: "published",
            list_name: $deckName,
            list_id: $deckId
        }) {
            status
            list_name
            list_id
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
