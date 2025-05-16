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
        <div className="flash-card-outer-container">
            <Card className="flash-card-container" data-testid="flashcard">
                {props.showAnswer ? (
                    <CardContent data-testid="card-back">
                        <Typography color="textSecondary">Answer</Typography>
                        <h1 className="lang-to" data-testid="card-answer">"{props.langTo[props.randomNum]}"</h1>
                    </CardContent>
                ) : (
                    <CardContent onClick={props.showAnswerFc} data-testid="card-front" className="card-front">
                        <Typography color="textSecondary">{props.children}</Typography>
                        <h1 className="lang-from" data-testid="card-question">"{props.langFrom[props.randomNum]}"</h1>
                    </CardContent>
                )}
            </Card>
            {props.showAnswer ? (
                <div className="btn-container flipped flash-card-button-row">
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
            ) : (
                <div className="btn-container flash-card-button-row">
                    <Button
                        variant="contained"
                        color="primary"
                        data-testid="show-answer-button"
                        onClick={props.showAnswerFc}
                    >See Answer</Button >
                </div>
            )}
        </div>
    )
}

export default flashCard;
