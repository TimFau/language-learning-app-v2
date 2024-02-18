import { useEffect, useState, useContext } from 'react';
import { CircularProgress } from '@mui/material/';
import AuthContext from '../../context/auth-context';
import DeckCard from 'components/Deck/DeckCard';
import getUsersDecks from './getUsersDecks';

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
    const authCtx = useContext(AuthContext);
    const userId = props.userId
  
    useEffect(() => {
        getUsersDecks(authCtx.userToken, userId)
        .then((response: any) => {
            setIsLoaded(true)
            setItems(response)
        })
        .catch(error => {
            setIsLoaded(true)
            setError(error)
            console.log(error)
        })
    }, [authCtx.userToken, userId])
  
    if (error) {
      return <div>Error: {error}</div>;
    } else if (!isLoaded) {
      return <CircularProgress />;
    } else if (items) {
      return (
        <>
            <div id="userListsContainer">
                <h1 className="sr-only">My Decks</h1>
                <div className="decks-container">
                    {items.map(item => (
                        <DeckCard
                            item={item}
                            key={item.deck_name + item.id.toString()}
                        />
                    ))}
                </div>
            </div>
        </>
      )
    } else {
        return <div>Unkown Error</div>
    }
  }