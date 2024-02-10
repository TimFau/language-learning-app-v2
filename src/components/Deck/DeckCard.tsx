import FavoriteIcon from '@mui/icons-material/Favorite';
import { Card, CardContent, Typography, CardActions, Button, CardActionArea, IconButton } from "@mui/material"
import { useNavigate } from "react-router";
import deckService from 'services/deckService';
import AuthContext from 'context/auth-context';
import { useContext } from "react";

type DeckCardProps = {
    item: any
}

const DeckCard = (props: DeckCardProps) => {
    const deck = props.item.deck_relation ? props.item.deck_relation : props.item
    const { deck_name: deckName, deck_id: deckId } = deck
    const authCtx = useContext(AuthContext);
    const userToken = authCtx.userToken || ''

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/deck?name=${deckName}&id=${deckId}`);
    }

    return (
        <Card className="deck-card">
            <CardActionArea onClick={() => handleClick()}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                    {deckName}
                    </Typography>
                    {/* <Typography gutterBottom variant="body1" component="h3">
                    English
                    </Typography> */}
                </CardContent>
            </CardActionArea>
            <CardActions>
                <IconButton aria-label="add to favorites" onClick={() => deckService.saveDeck(userToken, deck)}>
                    <FavoriteIcon />
                </IconButton>
                <Button size="small" onClick={() => handleClick()}>Start Deck</Button>
            </CardActions>
        </Card>
    )
}

export default DeckCard