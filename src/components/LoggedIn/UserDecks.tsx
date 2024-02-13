import { useEffect, useState, useContext } from 'react';
import { Grid, Button, CircularProgress, Avatar } from '@mui/material/';
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
    userName: string
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
        <>
            <div className="top-container">
                <div className="top-container-inner">
                    <div className="start">
                        <div className="greeting">
                            <Avatar>AD</Avatar><h1>Welcome back, {props.userName}</h1>
                        </div>
                        <h2>Here you can view, manage, and add to your personal and saved decks. <span>Explore, learn, and grow your knowledge base!</span></h2>
                    </div>
                    <div className="end">
                        <Button size="large" variant="contained" onClick={() => setAddListDialogOpen(true)}>Add Deck</Button>
                    </div>
                </div>
            </div>
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
            </div>
            <AddDeckModal userId={userId} addListDialogOpen={addListDialogOpen} closeDialog={() => setAddListDialogOpen(false)} refreshLists={() => getUsersDecks(authCtx.userToken, userId)} />
        </>
      )
    } else {
        return <div>Unkown Error</div>
    }
  }