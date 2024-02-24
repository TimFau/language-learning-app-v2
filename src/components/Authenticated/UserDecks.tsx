import { useContext } from 'react';
import { CircularProgress } from '@mui/material/';
import AuthContext from '../../context/auth-context';
import DeckCard from 'components/DeckCard';
import { gql, useQuery } from '@apollo/client';
import { SAVED_DECKS, USER_DECKS } from 'queries';

interface UserListsProps {
    userId: string
    userName: string
}

export default function UserDecks(props: UserListsProps) {
    const authCtx = useContext(AuthContext);
    const userId = props.userId

    const { loading, error, data } = useQuery(USER_DECKS, {
        variables: { userId },
        context: { headers: { authorization: `Bearer ${authCtx.userToken}` } }
    });
    const {
        loading: communityLoading,
        error: communityError,
        data: communityData 
    } = useQuery(gql`${SAVED_DECKS}`, {
        variables: { userId },
        context: { headers: { authorization: `Bearer ${authCtx.userToken}` } }
    });
  

    if (error || communityError) {
      return <div>Error: {error?.message || communityError?.message}</div>;
    } else if (loading || communityLoading) {
      return <CircularProgress />;
    } else {
        const userDecks = data.decks.map((deck: any) => {
            return { type: "user", ...deck }
        })
        const savedDecks = communityData.saved_decks.map((deck: any) => {
            return { isSaved: true, savedDeckId: deck.id, ...deck }
        })
        const decks = [...userDecks, ...savedDecks];
        console.log('data', data);
        return (
        <>
            <div id="userListsContainer">
                <h1 className="sr-only">My Decks</h1>
                <div className="decks-container">
                    {decks.map((deck: any) => (
                        <DeckCard
                            item={deck}
                            key={deck.deck_name + deck.id.toString()}
                        />
                    ))}
                </div>
            </div>
        </>
        )
    }
  }