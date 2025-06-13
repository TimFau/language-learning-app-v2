import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from 'context/auth-context';
import Login from 'components/Unauthenticated/Login';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const authCtx = useContext(AuthContext);
    const redirectTo = searchParams.get('redirectTo') || '/decks';
    const reason = searchParams.get('reason');

    useEffect(() => {
        // If user is already logged in, redirect them
        if (authCtx.userToken) {
            navigate(redirectTo, { replace: true });
        }
    }, [authCtx.userToken, redirectTo, navigate]);

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                {reason === 'session-expired' && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        Your session has expired. Please log in again to continue.
                    </Alert>
                )}
                <Login />
            </Box>
        </Container>
    );
} 