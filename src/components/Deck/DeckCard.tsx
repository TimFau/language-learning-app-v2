import FavoriteIcon from '@mui/icons-material/Favorite';
import { Card, CardContent, Typography, CardActions, CardActionArea, IconButton, Chip } from "@mui/material"
import { useNavigate } from "react-router";
import deckService from 'services/deckService';
import AuthContext from 'context/auth-context';
import { useContext } from "react";
import { FavoriteBorder, Language } from '@mui/icons-material';

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
        <Card className={["deck-card", props.item.type === 'user' ? 'isUser' : 'notUser'].join(' ')}>
            <CardActionArea onClick={() => handleClick()}>
                <CardContent>
                    <div className="cart-content-top">
                        <div className="deck-info">
                            <Language />
                            <Typography variant="h6"><span>{props.item.Language2}</span></Typography>
                            {/* <Avatar sx={{ width: 18, height: 18 }}>{props.item.user_created.username[0]}</Avatar>
                            <Typography><span>{props.item.user_created.username}</span></Typography> */}
                        </div>
                        <span className="deck-categories">
                            {props.item.categories.map((category: string) => <Chip label={category} />)}
                        </span>
                    </div>
                    <Typography gutterBottom variant="h4" component="h2" className="deck-name">
                        {deckName}
                    </Typography>
                    {/* <Button size="small">Start Deck</Button> */}
                </CardContent>
            </CardActionArea>
            {/* This duplicates code below - it's done thinking forward that we may add more actions and, thus, conditionals */}
            {props.item.type !== 'user' &&
            <CardActions>
                {props.item.type !== 'user' &&
                <IconButton aria-label={props.item.isSaved ? "Remove from favorites" : "Add to favorites"} onClick={() => props.item.isSaved ? deckService.unsaveDeck(userToken, props.item.savedDeckId) : deckService.saveDeck(userToken, deck)}>
                    {props.item.isSaved ? <FavoriteIcon /> : <FavoriteBorder />}
                    
                </IconButton>
                }
            </CardActions>
            }
        </Card>
    )
}

export default DeckCard