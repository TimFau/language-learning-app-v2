import React, { useEffect, useState } from 'react';
import { Drawer, Typography, IconButton, Skeleton, Card, CardContent, CardActions }  from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import deckService from '../../../services/deckService';
import DeckCard from '../../../components/DeckCard';

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
                setError(error);
                setLoading(false);
                console.log(error);
            }
        );
        if (ENABLE_ARTIFICIAL_DELAY) {
            setTimeout(fetchData, ARTIFICIAL_DELAY_MS);
        } else {
            fetchData();
        }
    }, [])
  
    if (error) {
      return (
        <Drawer anchor="bottom" open={props.open} onClose={props.onClose} className="demo-drawer">
            <div>Error Loading Demo Deck List - Please Contact Site Admin to resume service - lla@timfau.com</div>
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
                        Array.from({ length: 3 }).map((_, idx) => (
                            <Card className="deck-card deck-card-skeleton" key={idx}>
                                <CardContent>
                                    <div className="card-content-top">
                                        <div className="deck-info">
                                            <Skeleton variant="circular" width={24} height={24} className="deck-skeleton-icon" />
                                            <Skeleton variant="text" width={60} height={20} className="deck-skeleton-lang" />
                                        </div>
                                        {/* Add back if categories become required attribute */}
                                        {/* <div className="deck-categories">
                                            <Skeleton variant="rounded" width={50} height={28} className="deck-skeleton-chip" />
                                        </div> */}
                                    </div>
                                    <Skeleton variant="text" width="70%" height={32} className="deck-name deck-skeleton-name" />
                                </CardContent>
                                <CardActions style={{ justifyContent: 'flex-end' }}>
                                    <div>
                                        <Skeleton variant="text" width={80} height={30} className="deck-skeleton-cta" />
                                    </div>
                                </CardActions>
                            </Card>
                        ))
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