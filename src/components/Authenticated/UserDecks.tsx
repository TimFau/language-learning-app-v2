import { useContext, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import AuthContext from '../../context/auth-context';
import DeckCard from 'components/DeckCard';
import { gql, useQuery } from '@apollo/client';
import { SAVED_DECKS, USER_DECKS } from 'queries';
import DeckCardSkeleton from '../DeckCardSkeleton';
import ColdStartMessage from 'components/ColdStartMessage';

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
  
    // Cold start UX hooks (must be at top level)
    const [isColdStart, setIsColdStart] = useState(false);
    useEffect(() => {
        if (loading || communityLoading) {
            const timer = setTimeout(() => setIsColdStart(true), 4000);
            return () => clearTimeout(timer);
        } else {
            setIsColdStart(false);
        }
    }, [loading, communityLoading]);

    if (error || communityError) {
      return <div>Error: {error?.message || communityError?.message}</div>;
    } else if (loading || communityLoading) {
      return (
        <div id="userListsContainer">
          <h1 className="sr-only">My Decks</h1>
          <div className="decks-container">
            {Array.from({ length: 3 }).map((_, idx) => (
              <DeckCardSkeleton key={idx} />
            ))}
            {isColdStart && (
              <ColdStartMessage />
            )}
          </div>
        </div>
      );
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
                    {decks.length === 0 ? (
                        <div className="empty-decks-message">
                            <Typography variant="h6" component="p" gutterBottom>
                                Your deck collection is empty.
                            </Typography>
                            <Typography variant="body1">
                                Click the "+" or "Add Deck" button to create your own, or explore the "Community Decks" section to find and save decks shared by others!
                            </Typography>
                        </div>
                    ) : (
                        decks.map((deck: any) => (
                            <DeckCard
                                item={deck}
                                key={deck.deck_name + deck.id.toString()}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
        )
    }
  }