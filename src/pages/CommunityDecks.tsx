import DeckCard from "components/Deck/DeckCard";
import { useContext, useEffect, useState } from "react"
import deckService from "services/deckService"
import AuthContext from 'context/auth-context';

const CommunityDecks = () => {
    const authCtx = useContext(AuthContext);
    const [decks, setDecks] = useState<any>(null);
    const [savedDecks, setSavedDecks] = useState<any>(null)

    useEffect(() => {
        if (authCtx.userToken && authCtx.userId) {
            setSavedDecks([])
            deckService.getSavedDecks(authCtx.userToken, authCtx.userId).then(result => {
                setSavedDecks(result.data.saved_decks)
            })
        }
    }, [authCtx.userToken, authCtx.userId])

    useEffect(() => {
        const getDecks = () => {
            deckService.getCommunityDecks().then(
                result => {
                    // console.log('savedDecks', savedDecks, 'result', result)
                    const modifiedResult = result.map((deck: any) => {
                        if (savedDecks) {
                            const savedDeck = savedDecks.find((savedDeckItem: any) => savedDeckItem.deck_relation?.id === deck.id)
                            if (savedDeck) {
                                console.log('savedDeck', savedDeck)
                                return {
                                    isSaved: true,
                                    savedDeckId: savedDeck.id,
                                    ...deck
                                }
                            }
                        }
                        return deck
                    })
                    setDecks(modifiedResult)
                }
            )
        }
        getDecks();
    }, [savedDecks]);

    
    return (
        <div className="page-container">
            <h1 className="sr-only">Community Decks</h1>
            {!decks && "Loading..."}
            <div className="decks-container">
            {decks && decks
                .filter((deck:any) => deck.user_created.username !== authCtx.userName)
                .map((deck: any) => (
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