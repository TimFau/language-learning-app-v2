import DeckCard from "components/Deck/DeckCard";
import { useContext } from "react"
import AuthContext from 'context/auth-context';
import { gql, useQuery } from "@apollo/client";
import { COMMUNITY_DECKS, SAVED_DECKS } from "queries";

const CommunityDecks = () => {
    const authCtx = useContext(AuthContext);

    const { loading: savedDecksLoading, error: savedDecksError, data: savedDecks } = useQuery(gql`${SAVED_DECKS}`, {
        variables: { userToken: authCtx.userToken, userId: authCtx.userId },
        context: { headers: { authorization: `Bearer ${authCtx.userToken}` } }
    });

    const { loading, error, data: communityDecks } = useQuery(gql`${COMMUNITY_DECKS}`, {
        variables: { userToken: authCtx.userToken, userId: authCtx.userId },
    })

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
                    />
                )
            )}
            </div>
        </div>
    )
}

export default CommunityDecks