import LoggedOut from '../components/LoggedOut'
import LoggedIn from '../components/LoggedIn';

const IndexPage = (props: any) => {
    return (
        <>
        {props.authCtx.userToken === '' ?
            <LoggedOut 
                open={props.demoDrawerOpen}
                onClose={props.setDemoDrawerClosed}
            />
        :
            <LoggedIn />
        }
        </>
    )
};

export default IndexPage