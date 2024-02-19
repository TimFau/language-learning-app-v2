import FavoriteIcon from '@mui/icons-material/Favorite';
import { Card, CardContent, Typography, CardActions, CardActionArea, IconButton, Chip } from "@mui/material"
import { useNavigate } from "react-router";
import deckService from 'services/deckService';
import AuthContext from 'context/auth-context';
import ModalContext from 'context/modal-context';
import { useContext } from "react";
import { FavoriteBorder, Language, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

type DeckCardProps = {
    item: any
}

const DeckCard = (props: DeckCardProps) => {
    const deck = props.item.deck_relation ? props.item.deck_relation : props.item
    const { deck_name: deckName, deck_id: deckId } = deck
    const authCtx = useContext(AuthContext);
    const modalCtx =useContext(ModalContext);
    const userToken = authCtx.userToken || ''

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/deck?name=${deckName}&id=${deckId}`);
    }

    const handleEditDeck = () => {
        console.log('handleEditDeck', deck)
        modalCtx.setDeck({
            isPublic: deck.status === 'published',
            ...deck
        })
        modalCtx.setModeEdit()
        modalCtx.openModal()
    }

    return (
        <Card className={["deck-card", props.item.type === 'user' ? 'isUser' : 'notUser'].join(' ')}>
            <CardActionArea onClick={() => handleClick()}>
                <CardContent>
                    <div className="card-content-top">
                        <div className="deck-info">
                            <Language />
                            <Typography variant="h6"><span>{deck.Language2}</span></Typography>
                        </div>
                        <span className="deck-categories">
                            {props.item.categories?.map((category: string) => <Chip label={category} key={category} />)}
                        </span>
                    </div>
                    <Typography gutterBottom variant="h4" component="h2" className="deck-name">
                        {deckName}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                {props.item.type !== 'user' ?
                <IconButton
                    aria-label={props.item.isSaved ? "Remove from favorites" : "Add to favorites"}
                    onClick={() => props.item.isSaved ? deckService.unsaveDeck(userToken, props.item.savedDeckId, authCtx.userId) : deckService.saveDeck(userToken, deck, authCtx.userId)}
                    size="large">
                    {props.item.isSaved ? <FavoriteIcon /> : <FavoriteBorder />}
                    
                </IconButton>
                :
                <>
                    <IconButton
                        aria-label={`Delete "${deckName}"`}
                        onClick={() => deckService.deleteDeck(userToken, deck.id, authCtx.userId)}
                        size="large">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton
                        aria-label={`Edit "${deckName}"`}
                        onClick={() => handleEditDeck()}
                        size="large">
                        <EditIcon />
                    </IconButton>
                </>
                }
            </CardActions>
        </Card>
    );
}

export default DeckCard