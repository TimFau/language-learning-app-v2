import { useContext, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import AuthContext from '../../context/auth-context';
import DeckCard from 'components/DeckCard';
import { gql, useQuery } from '@apollo/client';
import { SAVED_DECKS, USER_DECKS } from 'queries';
import DeckCardSkeleton from '../DeckCardSkeleton';
import ColdStartMessage from 'components/ColdStartMessage';
import '../../css/partials/components/segmented-toggle.scss';
import { COLD_START_TIMEOUT } from '../../utils/constants';

interface UserListsProps {
    userId: string
    userName: string
}

export default function UserDecks(props: UserListsProps) {
    const authCtx = useContext(AuthContext);
    const userId = props.userId
    const [activeView, setActiveView] = useState<'created' | 'saved'>(() => {
        const savedView = localStorage.getItem('userDecksView');
        return (savedView === 'created' || savedView === 'saved') ? savedView : 'created';
    });

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
            const timer = setTimeout(() => setIsColdStart(true), COLD_START_TIMEOUT);
            return () => clearTimeout(timer);
        } else {
            setIsColdStart(false);
            return undefined;
        }
    }, [loading, communityLoading]);

    useEffect(() => {
        localStorage.setItem('userDecksView', activeView);
    }, [activeView]);

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
        const savedDecksData = communityData.saved_decks.map((deck: any) => {
            return { isSaved: true, savedDeckId: deck.id, ...deck }
        })
        
        const decksToDisplay = activeView === 'created' ? userDecks : savedDecksData;

        const EmptyStateMessage = () => (
            <div className="empty-decks-message">
                <Typography variant="h6" component="p" gutterBottom>
                    {activeView === 'created' ? "You haven't created any decks yet." : "You haven't saved any decks yet."}
                </Typography>
                <Typography variant="body1">
                    {activeView === 'created' 
                        ? 'Click the "+" or "Add Deck" button to create your own!'
                        : 'Explore the "Community Decks" section to find and save decks shared by others!'}
                </Typography>
            </div>
        );

        return (
        <>
            <div id="userListsContainer">
                <h1 className="sr-only">My Decks</h1>
                <div className="segmented-toggle">
                    <button 
                        className={activeView === 'created' ? 'active' : ''}
                        onClick={() => setActiveView('created')}
                    >
                        Created
                    </button>
                    <button 
                        className={activeView === 'saved' ? 'active' : ''}
                        onClick={() => setActiveView('saved')}
                    >
                        Saved
                    </button>
                </div>
                <div className="decks-container">
                    {decksToDisplay.length === 0 ? (
                        <EmptyStateMessage />
                    ) : (
                        decksToDisplay.map((deck: any) => (
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