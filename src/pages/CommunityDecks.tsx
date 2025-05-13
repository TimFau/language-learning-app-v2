import DeckCard from "components/DeckCard";
import { useContext } from "react"
import AuthContext from 'context/auth-context';
import { gql, useQuery } from "@apollo/client";
import { COMMUNITY_DECKS, SAVED_DECKS } from 'queries';
import { Link } from "react-router-dom";

const CommunityDecks = () => {
    const authCtx = useContext(AuthContext);

    // Fetch data unconditionally at the top level
    const { loading: savedDecksLoading, error: savedDecksError, data: savedDecks } = useQuery(gql`${SAVED_DECKS}`, {
        variables: { userToken: authCtx.userToken, userId: authCtx.userId },
        context: { headers: { authorization: `Bearer ${authCtx.userToken}` } },
        skip: !authCtx.userToken // Skip query if not authenticated
    });

    const { loading, error, data: communityDecks } = useQuery(gql`${COMMUNITY_DECKS}`, {
        variables: { userToken: authCtx.userToken, userId: authCtx.userId },
        skip: !authCtx.userToken // Skip query if not authenticated
    });

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
    if (loading || savedDecksLoading) {
        return (
            <h1>Loading...</h1>
        )
    }
    if (error || savedDecksError) {
        return (
            <h1>Error: ${error?.message || savedDecksError?.message}</h1>
        )
    }

    // Process and display decks for authenticated users
    const decks = communityDecks.decks.map((deck: any) => {
        if (savedDecks) {
            const savedDeck = savedDecks.saved_decks.find((savedDeckItem: any) => savedDeckItem.deck_relation?.id === deck.id)
            if (savedDeck) {
                return {
                    isSaved: true,
                    savedDeckId: savedDeck.id,
                    ...deck
                }
            }
            return deck
        }
        return deck
    }).filter((deck:any) => deck.user_created?.username !== authCtx.userName)

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