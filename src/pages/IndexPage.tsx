import { useContext } from 'react';
import AuthContext from 'context/auth-context';

import LoggedOut from '../components/LoggedOut'
import LoggedIn from '../components/LoggedIn';

const IndexPage = (props: any) => {
    const authCtx = useContext(AuthContext);

    return (
        <>
        {authCtx.userToken === '' ?
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