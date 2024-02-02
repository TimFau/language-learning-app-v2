import { useEffect, useState, useContext } from 'react';
import { Grid, Card, CardActions, CardContent, Button, Typography, CircularProgress } from '@mui/material/';
import AddNewListComponent from './AddNewList';
import AuthContext from './../../context/auth-context';

// Displays all the lists that a logged in user has added to their profile

interface itemsChild {
    date_created: string,
    id: string,
    list_id: string,
    list_name: string,
    status: string
}

interface UserListsProps {
    userId: string,
    deckOptions: (listName: string, listId: string) => void
}

export default function UserLists(props: UserListsProps) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState<itemsChild[]>([]);
    const [addListDialogOpen, setAddListDialogOpen] = useState(false);
    const authCtx = useContext(AuthContext);
    const userId = props.userId

    function getUsersLists (userToken: string, userId: string) {
        let listsUrl = `${process.env.REACT_APP_API_BASE}?access_token=` + userToken;
        fetch(listsUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query {
                        User_lists(filter: {
                            user_id: {
                                id: {
                                    _eq: "${userId}"
                                }
                            }
                        }) {
                            id
                            status
                            date_created
                            list_name
                            list_id
                            user_id {
                                id
                            }
                        }
                    }
                `
            })
        })
        .then(res => res.json())
        .then(
        (result) => {
            setIsLoaded(true);
            setItems(result.data.User_lists);
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
                    <Card onClick={() => props.deckOptions(item.list_name, item.list_id)} key={item.id.toString()} style={{margin: 10}}>
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="h2">
                            {item.list_name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Select List</Button>
                        </CardActions>
                    </Card>
                ))}
            </Grid>
            <Button size="large" onClick={() => setAddListDialogOpen(true)}>Add New</Button>
            <AddNewListComponent userId={userId} addListDialogOpen={addListDialogOpen} closeDialog={() => setAddListDialogOpen(false)} refreshLists={() => getUsersLists(authCtx.userToken, userId)} />
        </div>
      )
    } else {
        return <div>Error</div>
    }
  }