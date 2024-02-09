import { useContext } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from 'context/auth-context';
import { AppBar, Button } from '@mui/material/';
import makeStyles from '@mui/styles/makeStyles';
import ToolBar from '@mui/material/Toolbar';

const useStyles = makeStyles({
    appBar: {
        "& .MuiToolbar-root": {
            display: "flex",
        },
        "& button": {
            color: "#fff"
        },
        "& .login": {
            justifySelf: "flex-end",
            marginLeft: "auto"
        }
    }
})

export default function Nav(props: any) {
    const dispatch = useAppDispatch();
    const deckStarted = useAppSelector((state) => state.deckStarted);
    const authCtx = useContext(AuthContext);
    const classes = useStyles(props);
    let pathName = useLocation().pathname;
    const navigate = useNavigate();

    function goToDeckSelector() {
        dispatch({type: 'deck/setDeckStarted', value: false});
        dispatch({type: 'deck/setDialog', value: false});
        navigate('/')
    }

    const isLoggedIn = () => authCtx.userToken !== ''

    return (
        <AppBar position="static" color="primary" className={classes.appBar}>
            <ToolBar>
                {!deckStarted ?
                <Button>
                    <Link to="/">{isLoggedIn() ? 'My Decks' : 'Home'}</Link>
                </Button>
                :
                <Button onClick={() => goToDeckSelector()}
                >Exit Deck</Button>
                }
                <Button>
                    <Link to="/decks">Community Decks</Link>
                </Button>
                {!isLoggedIn() &&
                <Button
                    onClick={() => authCtx.onLoginOpen(true, false)}
                    className="login"
                >Login</Button>
                }
                {isLoggedIn() && pathName !== "/deck" &&
                <Button
                    onClick={authCtx.onLogout}
                    color="secondary"
                    className="login"
                >Logout</Button>
                }
            </ToolBar>
        </AppBar>
    )
}