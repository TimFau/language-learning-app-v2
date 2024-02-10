import { USERS_ME, CREATE_ACCOUNT, LOGIN } from "../queries"

const apiToken = process.env.REACT_APP_API_TOKEN;
const endpoint = `${process.env.REACT_APP_API_BASE}/system`

const fetchGraphQL = (query: string, variables?: any, userToken?: string) => {
    return fetch(`${endpoint}?access_token=${userToken || apiToken}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables })
    });
}

const getAccountDetails = (userToken: string) => {
    return fetchGraphQL(USERS_ME, null, userToken)
}

const createAccount = (
        firstName: string,
        lastName: string,
        userEmail: string,
        userPassword: string
    ) => {
    return fetchGraphQL(CREATE_ACCOUNT, { firstName, lastName, userEmail, userPassword })
}

const login = (email: string, password: string) => {
    return fetchGraphQL(LOGIN, { email, password })
}

const userService = {
    getAccountDetails,
    createAccount,
    login
}

export default userService