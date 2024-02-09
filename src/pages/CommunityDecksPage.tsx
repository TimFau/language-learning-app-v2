import { Grid } from "@mui/material";
import DeckCard from "components/Deck/DeckCard";
import { useEffect, useState } from "react"
import deckService from "services/deckService"

const CommunityDecks = () => {
    const [decks, setDecks] = useState<any>(null);

    useEffect(() => {
        deckService.getCommunityDecks().then(
            result => {
                // console.log(result)
                setDecks(result)
            }
        )
    }, [])
    
    return (
        <div>
            <h1>Community Decks</h1>
            {!decks && "Loading..."}
            <Grid
                container
                direction="row"
                justifyContent="center"
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