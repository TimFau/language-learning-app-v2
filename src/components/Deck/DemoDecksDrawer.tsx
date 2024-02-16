import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Drawer }  from '@mui/material';
import deckService from '../../services/deckService';
import DeckCard from './DeckCard';

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

export default function DemoDecks(props: DemoDeckDrawerProps) {
    const [error, setError] = useState('');
    const [items, setItems] = useState<listItem[]>([]);

    useEffect(() => {

        deckService.getDemoDecks().then(
            (result) => {
                setItems(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                setError(error);
                console.log(error);
            }
    )
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
            <Grid
                container
                direction="row"
                justifyContent="center"
            >
                {items.map(item => (
                    <DeckCard
                        item={item}
                        key={item.id.toString()}
                    />
                ))}
            </Grid>
        </Drawer>
      )
    }
  }