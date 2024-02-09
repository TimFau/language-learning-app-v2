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
