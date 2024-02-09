import { Card, CardContent, Typography, CardActions, Button } from "@mui/material"
import { useNavigate } from "react-router";

type DeckCardProps = {
    item: any
}

const DeckCard = (props: DeckCardProps) => {
    const navigate = useNavigate();

    const handleClick = (listName: string, listId: string) => {
        navigate(`/deck?name=${listName}&id=${listId}`);
    }
    return (
        <Card onClick={() => handleClick(props.item.list_name, props.item.list_id)} style={{margin: 10}}>
            <CardContent>
                <Typography gutterBottom variant="h6" component="h2">
                {props.item.list_name}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Select Deck</Button>
            </CardActions>
        </Card>
    )
}

export default DeckCard