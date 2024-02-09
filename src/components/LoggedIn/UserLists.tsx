import { useEffect, useState, useContext } from 'react';
import { Grid, Button, CircularProgress } from '@mui/material/';
import AddNewListComponent from './AddNewList';
import AuthContext from './../../context/auth-context';
import deckService from 'services/deckService';
import DeckCard from 'components/Deck/DeckCard';

// Displays all the lists that a logged in user has added to their profile

interface itemsChild {
    date_created: string,
    id: string,
    list_id: string,
    list_name: string,
    status: string
}

interface UserListsProps {
    userId: string
}

export default function UserLists(props: UserListsProps) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState<itemsChild[]>([]);
    const [addListDialogOpen, setAddListDialogOpen] = useState(false);
    const authCtx = useContext(AuthContext);
    const userId = props.userId

    function getUsersLists (userToken: string, userId: string) {
        deckService.getPrivateLists(userToken, userId)
        .then(
        (result) => {
            console.log(result.data)
            setIsLoaded(true);
            setItems(result.data.public_lists);
        },
        (error) => {
            setIsLoaded(true);
            setError(error);
            console.log(error);
        }
        )
    }
  
    useEffect(() => {
        getUsersLists(authCtx.userToken, userId)
    }, [authCtx, userId])
  
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
                        key={item.id.toString()}
                    />
                ))}
            </Grid>
            <Button size="large" onClick={() => setAddListDialogOpen(true)}>Add New</Button>
            <AddNewListComponent userId={userId} addListDialogOpen={addListDialogOpen} closeDialog={() => setAddListDialogOpen(false)} refreshLists={() => getUsersLists(authCtx.userToken, userId)} />
        </div>
      )
    } else {
        return <div>Unkown Error</div>
    }
  }