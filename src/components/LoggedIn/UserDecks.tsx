import { useEffect, useState, useContext } from 'react';
import { Grid, Button, CircularProgress } from '@mui/material/';
import AddDeckModal from './AddDeckModal';
import AuthContext from '../../context/auth-context';
import deckService from 'services/deckService';
import DeckCard from 'components/Deck/DeckCard';

// Displays all the lists that a logged in user has added to their profile

interface itemsChild {
    date_created: string,
    id: string,
    deck_id: string,
    deck_name: string,
    status: string
}

interface UserListsProps {
    userId: string
}

export default function UserDecks(props: UserListsProps) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState<itemsChild[]>([]);
    const [addListDialogOpen, setAddListDialogOpen] = useState(false);
    const authCtx = useContext(AuthContext);
    const userId = props.userId

    function getUsersDecks (userToken: string, userId: string) {
        Promise.all([
            deckService.getUserDecks(userToken, userId),
            deckService.getSavedDecks(userToken, userId)
        ])
        .then(([userDecksResult, savedDecksResult]) => {
            setIsLoaded(true)
            const userDecks = userDecksResult.data.decks.map((deck: any) => {
                return {
                    type: "user",
                    ...deck
                }
            })
            const savedDecks = savedDecksResult.data.saved_decks.map((deck: any) => {
                return {
                    isSaved: true,
                    savedDeckId: deck.id,
                    ...deck
                }
            })
            setItems([
                ...userDecks,
                ...savedDecks
            ])
        })
        .catch(error => {
            setIsLoaded(true)
            setError(error)
            console.log(error)
        })
    }
  
    useEffect(() => {
        getUsersDecks(authCtx.userToken, userId)
    }, [authCtx.userToken, userId])
  
    if (error) {
      return <div>Error: {error}</div>;
    } else if (!isLoaded) {
      return <CircularProgress />;
    } else if (items) {
      return (
        <div id="userListsContainer">
            <Grid
                container
                direction="row"
                justifyContent="center"
                spacing={2}
            >
                {items.map(item => (
                    <DeckCard
                        item={item}
                        key={item.deck_name + item.id.toString()}
                    />
                ))}
            </Grid>
            <Button size="large" onClick={() => setAddListDialogOpen(true)}>Add New</Button>
            <AddDeckModal userId={userId} addListDialogOpen={addListDialogOpen} closeDialog={() => setAddListDialogOpen(false)} refreshLists={() => getUsersDecks(authCtx.userToken, userId)} />
        </div>
      )
    } else {
        return <div>Unkown Error</div>
    }
  }