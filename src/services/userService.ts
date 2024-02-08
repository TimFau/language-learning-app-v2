const getAccountDetails = (userToken: string) => {
    return fetch(`${process.env.REACT_APP_API_BASE}/system?access_token=${userToken}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
            query {
                users_me {
                    first_name
                    email
                    id
                }
            }
            `
        })
    })
}

const createAccount = (
    // TODO: Remove undefined
    apiToken: string | undefined,
    firstName: string,
    lastName: string,
    userEmail: string,
    userPassword: string) => {
    const endpoint = `${process.env.REACT_APP_API_BASE}/system`;
    return fetch(endpoint + '?access_token=' + apiToken, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
                mutation {
                    create_users_item(
                        data: {
                            first_name: "${firstName}",
                            last_name: "${lastName}",
                            email: "${userEmail}",
                            password: "${userPassword}",
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
        })
    })
}

const login = (email: string, password: string) => {
    const endpoint = `${process.env.REACT_APP_API_BASE}/system`;
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
            mutation {
                auth_login(
                    email: "${email}",
                    password: "${password}",
                    mode: cookie
                ) {
                    access_token
                    refresh_token
                }
            }
            `
        })
    })
}

export default {
    getAccountDetails,
    createAccount,
    login
}