import FavoriteIcon from '@mui/icons-material/Favorite';
import { Card, CardContent, Typography, CardActions, Button, CardActionArea, IconButton } from "@mui/material"
import { useNavigate } from "react-router";
import deckService from 'services/deckService';

type DeckCardProps = {
    item: any
}

const DeckCard = (props: DeckCardProps) => {
    const deck = props.item.public_deck_id ?? props.item
    const { list_name: listName, list_id: listId } = deck

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/deck?name=${listName}&id=${listId}`);
    }

    return (
        <Card className="deck-card">
            <CardActionArea onClick={() => handleClick()}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                    {listName}
                    </Typography>
                    {/* <Typography gutterBottom variant="body1" component="h3">
                    English
                    </Typography> */}
                </CardContent>
            </CardActionArea>
            <CardActions>
                <IconButton aria-label="add to favorites" onClick={() => deckService.favoriteDeck(deck)}>
                    <FavoriteIcon />
                </IconButton>
                <Button size="small" onClick={() => handleClick()}>Start Deck</Button>
            </CardActions>
        </Card>
    )
}

export default DeckCard