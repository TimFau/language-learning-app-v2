import { ApolloClient, InMemoryCache, ApolloLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createHttpLink } from '@apollo/client/link/http';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// Create the http link
const httpLink = createHttpLink({
    uri: import.meta.env.VITE_API_BASE,
});

// Auth link to add token to requests
const authLink = new ApolloLink((operation, forward) => {
    const token = cookies.get('token');
    
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : '',
        }
    });

    return forward(operation);
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            // Handle 401 Unauthorized errors
            if (err.extensions?.code === 'UNAUTHENTICATED' || 
                err.message?.includes('Invalid token') || 
                err.message?.includes('Token expired')) {
                
                // Get the current auth context from window
                const authContext = (window as any).__AUTH_CONTEXT__;
                if (authContext) {
                    authContext.onLogout({ 
                        reason: 'session-expired',
                        redirectPath: window.location.pathname + window.location.search
                    });
                }

                // Stop processing other operations
                return;
            }
        }
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

// Create the Apollo Client
const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});

export default client; 