import React, { useEffect, useState } from 'react';
import { Drawer, Typography, IconButton }  from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import deckService from '../../../services/deckService';
import DeckCard from '../../../components/DeckCard';
import DeckCardSkeleton from '../../../components/DeckCardSkeleton';
import ColdStartMessage from '../../../components/ColdStartMessage';
import FetchErrorMessage from '../../../components/Unauthenticated/FetchErrorMessage';
import { COLD_START_TIMEOUT } from '../../../utils/constants';

//
// This drawer contains decks that are available for guest users to try out the app
//

interface listItem {
    id: string,
    deck_id: string,
    deck_name: string
}

interface DemoDeckDrawerProps {
    open: boolean,
    onClose: (event: React.UIEvent<HTMLElement>) => void,
}

// Artificial delay for skeleton testing
const ENABLE_ARTIFICIAL_DELAY = false;
const ARTIFICIAL_DELAY_MS = 2000;

export default function DemoDecks(props: DemoDeckDrawerProps) {
    const [error, setError] = useState('');
    const [items, setItems] = useState<listItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isColdStart, setIsColdStart] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = () => deckService.getDemoDecks().then(
            (result) => {
                setItems(result);
                setLoading(false);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                setError(error?.message || String(error));
                setLoading(false);
                console.log(error);
            }
        );
        let coldStartTimer: ReturnType<typeof setTimeout> | null = null;
        if (loading) {
            coldStartTimer = setTimeout(
                () => setIsColdStart(true),
                COLD_START_TIMEOUT
            );
        }
        if (ENABLE_ARTIFICIAL_DELAY) {
            setTimeout(fetchData, ARTIFICIAL_DELAY_MS);
        } else {
            fetchData();
        }
        return () => {
            if (coldStartTimer) clearTimeout(coldStartTimer);
            setIsColdStart(false);
        };
    }, [])
  
    if (error) {
      return (
        <Drawer anchor="bottom" open={props.open} onClose={props.onClose} className="demo-drawer">
            <div className="decks-container">
                <FetchErrorMessage error={error} onRetry={() => window.location.reload()} title="Error loading demo decks" />
            </div>
        </Drawer>
      )
    } else {
      return (
        <Drawer anchor="bottom" open={props.open} onClose={props.onClose} className="demo-drawer">
            <div className="drawer-header">
                <IconButton 
                    aria-label="close"
                    onClick={props.onClose} 
                    sx={{ 
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    data-testid="close-demo-drawer-button"
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" component="h2" className="title">
                    Explore <span>a Demo Deck</span>
                </Typography>
                <Typography variant="body1" className="subtitle">
                    Choose a sample deck to try LangPulse instantly.
                </Typography>
            </div>
            <div className="drawer-content">
                <div className="decks-container">
                    {loading ? (
                        isColdStart ? (
                            <ColdStartMessage maxSeconds={30} />
                        ) : (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <DeckCardSkeleton key={idx} />
                            ))
                        )
                    ) : (
                        items.map(item => (
                            <DeckCard
                                item={item}
                                key={item.id.toString()}
                            />
                        ))
                    )}
                </div>
            </div>
        </Drawer>
      )
    }
  }