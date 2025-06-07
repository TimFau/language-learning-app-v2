import DeckCard from "components/DeckCard";
import { useContext, useEffect, useState } from "react"
import AuthContext from 'context/auth-context';
import { gql, useQuery } from "@apollo/client";
import { COMMUNITY_DECKS, SAVED_DECKS } from 'queries';
import { Link, useNavigate } from "react-router-dom";
import DeckCardSkeleton from 'components/DeckCardSkeleton';
import ColdStartMessage from 'components/ColdStartMessage';
import FetchErrorMessage from '../components/Unauthenticated/FetchErrorMessage';
import { COLD_START_TIMEOUT } from '../utils/constants';

const CommunityDecks = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [isColdStart, setIsColdStart] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch data unconditionally at the top level
    const { loading: savedDecksLoading, error: savedDecksError, data: savedDecks } = useQuery(gql`${SAVED_DECKS}`, {
        variables: { userToken: authCtx.userToken, userId: authCtx.userId },
        context: { headers: { authorization: `Bearer ${authCtx.userToken}` } },
        skip: !authCtx.userToken // Skip query if not authenticated
    });

    const { loading, error: communityDecksError, data: communityDecks } = useQuery(gql`${COMMUNITY_DECKS}`, {
        variables: { userToken: authCtx.userToken, userId: authCtx.userId },
        skip: !authCtx.userToken // Skip query if not authenticated
    });

    // Cold start UX logic
    useEffect(() => {
        if (loading || savedDecksLoading) {
            setError(null);
            const timer = setTimeout(() => setIsColdStart(true), COLD_START_TIMEOUT);
            return () => clearTimeout(timer);
        } else {
            setIsColdStart(false);
            return undefined;
        }
    }, [loading, savedDecksLoading]);

    useEffect(() => {
        const allErrors = [communityDecksError, savedDecksError].filter(Boolean);

        if (allErrors.length === 0) {
            setError(null);
            return;
        }

        const hasAuthError = allErrors.some(error => {
            const isInvalidToken = error?.graphQLErrors?.some((err: any) => err.extensions?.code === 'INVALID_TOKEN');
            const networkError = error?.networkError as any;
            const isUnauthorized = networkError && [401, 403].includes(networkError.statusCode);
            return isInvalidToken || isUnauthorized;
        });

        if (hasAuthError) {
            authCtx.onLogout();
            authCtx.onLoginOpen(true, false);
            navigate('/');
            return;
        }

        setError(allErrors[0]?.message || 'An unexpected error occurred.');
    }, [communityDecksError, savedDecksError, authCtx, navigate]);

    // Scroll to top on mount (fixes mobile reload issue)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Show login prompt if not authenticated
    if (!authCtx.userToken) {
        return (
            <div className="page-container text-center not-authenticated">
                <h1>Community Decks</h1>
                <p>Please <Link to="/">log in</Link> or <Link to="/">sign up</Link> to view community decks.</p>
            </div>
        );
    }

    // Handle loading and error states for authenticated users
    if (error) {
        return (
            <div className="decks-container">
                <FetchErrorMessage error={error} onRetry={() => window.location.reload()} title="Error loading decks" />
            </div>
        );
    } else if (loading || savedDecksLoading) {
        return isColdStart ? (
            <ColdStartMessage maxSeconds={30} />
        ) : (
            <div className="page-container">
                <h1 className="sr-only">Community Decks</h1>
                <div className="decks-container">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <DeckCardSkeleton key={idx} />
                    ))}
                </div>
            </div>
        );
    }

    if (!communityDecks?.decks) {
        return null;
    }

    // Process and display decks for authenticated users
    const decks = communityDecks.decks.map((deck: any) => {
        const deckWithMeta = { ...deck };
        if (savedDecks) {
            const savedDeck = savedDecks.saved_decks.find((savedDeckItem: any) => savedDeckItem.deck_relation?.id === deck.id)
            if (savedDeck) {
                deckWithMeta.isSaved = true;
                deckWithMeta.savedDeckId = savedDeck.id;
            }
        }
        if (deck.user_created?.username === authCtx.userName) {
            deckWithMeta.isOwnDeck = true;
        }
        return deckWithMeta;
    });

    return (
        <div className="page-container">
            <h1 className="sr-only">Community Decks</h1>
            {!decks && "Loading..."}
            <div className="decks-container">
            {decks.map((deck: any) => (
                    <DeckCard
                        item={deck}
                        key={deck.id.toString()}
                        from="/decks"
                    />
                )
            )}
            </div>
        </div>
    )
}

export default CommunityDecks