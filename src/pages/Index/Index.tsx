import { useContext } from 'react';
import AuthContext from 'context/auth-context';

import LandingPage from './LandingPage'
import UserHome  from './UserHome';

const IndexPage = (props: any) => {
    const authCtx = useContext(AuthContext);

    if (authCtx.authLoading) {
        return null; // or a global spinner if you want
    }

    return (
        <>
        {authCtx.userToken === '' ?
            <LandingPage 
                open={props.demoDrawerOpen}
                onClose={props.setDemoDrawerClosed}
            />
        :
            <UserHome  />
        }
        </>
    )
};

export default IndexPage