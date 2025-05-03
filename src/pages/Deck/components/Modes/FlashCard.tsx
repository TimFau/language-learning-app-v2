import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface FlashCardProps {
    showAnswer: boolean,
    langFrom: Array<string>,
    langTo: Array<string>,
    randomNum: number,
    getCard: () => void,
    archiveCard: (event: React.UIEvent<HTMLElement>) => void,
    showAnswerFc: (event: React.UIEvent<HTMLElement>) => void,
    children: React.ReactNode    
}

const flashCard = (props: FlashCardProps) => {
    return(
        <Card className="flash-card-container" data-testid="flashcard">
            {props.showAnswer ? (
                <CardContent>
                    <Typography color="textSecondary">Answer</Typography>
                    <h1 className="lang-to" data-testid="card-answer">"{props.langTo[props.randomNum]}"</h1>
                    <div className="btn-container flipped">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={props.getCard}
                            data-testid="wrong-answer-button"
                        >I got it wrong</Button >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={props.archiveCard}
                            data-testid="correct-answer-button"
                        >I got it right</Button >
                    </div>
                </CardContent>
            ) : (
                <CardContent onClick={props.showAnswerFc}>
                    <Typography color="textSecondary">{props.children}</Typography>
                    <h1 className="lang-from" data-testid="card-question">"{props.langFrom[props.randomNum]}"</h1>
                    <div className="btn-container">
                        <Button
                            variant="contained"
                            color="primary"
                            data-testid="show-answer-button"
                        >See Answer</Button >
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

export default flashCard;
