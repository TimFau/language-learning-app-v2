import { Grid } from "@mui/material";
import DeckCard from "components/Deck/DeckCard";
import { useContext, useEffect, useState } from "react"
import deckService from "services/deckService"
import AuthContext from 'context/auth-context';

const CommunityDecks = () => {
    const authCtx = useContext(AuthContext);
    const [decks, setDecks] = useState<any>(null);
    const [savedDecks, setSavedDecks] = useState<any>(null)

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

    useEffect(() => {
        if (authCtx.userToken && authCtx.userId) {
            setSavedDecks([])
            deckService.getSavedDecks(authCtx.userToken, authCtx.userId).then(result => {
                setSavedDecks(result.data.saved_decks)
            })
        }
    }, [authCtx.userToken, authCtx.userId])

    useEffect(() => {
        getDecks();
    }, [savedDecks]);

    
    return (
        <div style={{ paddingTop: '65px' }}>
            <h1 className="sr-only">Community Decks</h1>
            {!decks && "Loading..."}
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                spacing={2}
            >
            {decks && decks.map((deck: any) => (
                <DeckCard
                    item={deck}
                    key={deck.id.toString()}
                />
            ))}
            </Grid>
        </div>
    )
}

export default CommunityDecks