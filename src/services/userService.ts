import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { USERS_ME, CREATE_ACCOUNT, LOGIN } from "../queries"

const endpoint = `${process.env.REACT_APP_API_BASE}/system`

const client = new ApolloClient({
    uri: endpoint,
    cache: new InMemoryCache(),
    headers: {
    authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
    },
});

const getAccountDetails = async (userToken: string) => {
    const { data } = await client.query({ query: gql(USERS_ME), context: { headers: { authorization: `Bearer ${userToken}` } } });
    return data;
}

const createAccount = async (firstName: string, lastName: string, userEmail: string, userPassword: string) => {
    const { data } = await client.mutate({ mutation: gql(CREATE_ACCOUNT), variables: { firstName, lastName, userEmail, userPassword } });
    return data;
}

const login = async (email: string, password: string) => {
    const { data } = await client.mutate({ mutation: gql(LOGIN), variables: { email, password } });
    console.log('loginService', data)
    return data;
}

const userService = {
    getAccountDetails,
    createAccount,
    login
}

export default userService