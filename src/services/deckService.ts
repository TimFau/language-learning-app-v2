const apiToken = process.env.REACT_APP_API_TOKEN;
const endpoint = process.env.REACT_APP_API_BASE;

const getCommunityDecks = () => {

    return fetch(endpoint + '?access_token=' + apiToken, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    public_lists {
                        id
                        list_name
                        list_id
                    }
                }
            `
        })
    })
    .then(res => res.json())
    .then(
        (result) => {
            return result.data.public_lists;
        }
    )
}

const getDemoDecks = () => {

    return fetch(endpoint + '?access_token=' + apiToken, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    public_lists(
                        filter: {
                            include_in_demo: {
                                _eq: true
                            }
                        }
                    ) {
                        id
                        list_name
                        list_id
                    }
                }
            `
        })
    })
    .then(res => res.json())
    .then(
        (result) => {
            return result.data.public_lists;
        }
    )
}

const addPrivateList = (deckName: string, deckId: string, userToken: string) => {
    let listsUrl = `${process.env.REACT_APP_API_BASE}?access_token=` + userToken;
    return fetch(listsUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
            mutation {
                create_public_lists_item (data: {
                    status: "published",
                    list_name: "${deckName}" ,
                    list_id: "${deckId}"
                }) {
                    status
                    list_name
                    list_id
                }
            }
            `
        })
    })
    .then(res => res.json())
    .then(
        (result) => {
            console.log('new list result', result)
            return result
        },
        (error) => {
            console.log(error);
        }
    )
}

const getPrivateLists = (userToken: string, userId: string) => {
    let listsUrl = `${process.env.REACT_APP_API_BASE}?access_token=` + userToken;
    return fetch(listsUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
                query {
                    public_lists(filter: {
                        user_created: {
                            id: {
                                _eq: "${userId}"
                            }
                        }
                    }) {
                        id
                        status
                        date_created
                        list_name
                        list_id
                        user_created {
                            id
                        }
                    }
                }
            `
        })
    })
    .then(res => res.json())
    .then((result) => result)
}

export default {
    getCommunityDecks,
    getDemoDecks,
    addPrivateList,
    getPrivateLists
};