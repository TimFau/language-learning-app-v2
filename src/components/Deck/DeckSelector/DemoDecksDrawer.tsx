import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Drawer, CardActions, CardContent, Button, Typography }  from '@mui/material';
import { useNavigate } from 'react-router-dom';
import deckService from '../../../services/deckService';

//
// This drawer contains decks that are available for guest users to try out the app
//

interface listItem {
    id: string,
    list_id: string,
    list_name: string
}

interface DemoDeckDrawerProps {
    open: boolean,
    onClose: (event: React.UIEvent<HTMLElement>) => void,
}

export default function DemoDecks(props: DemoDeckDrawerProps) {
    const [error, setError] = useState('');
    const [items, setItems] = useState<listItem[]>([]);

    useEffect(() => {

        deckService.getPublicLists().then(
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

    const navigate = useNavigate();

    const handleClick = (listName: string, listId: string) => {
        navigate(`/deck?name=${listName}&id=${listId}`);
    }
  
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
                    <Card onClick={() => handleClick(item.list_name, item.list_id)} key={item.id.toString()}>
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="h2">
                            {item.list_name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Select Deck</Button>
                        </CardActions>
                    </Card>
                ))}
            </Grid>
        </Drawer>
      )
    }
  }