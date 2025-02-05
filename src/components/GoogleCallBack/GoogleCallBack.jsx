import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Alert } from '@mui/material';
import { useAuth } from '../../helper/AuthContext';
import { jwtDecode } from 'jwt-decode';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        let mounted = true;

        const handleCallback = async () => {
            if (isProcessing) return;
            setIsProcessing(true);

            try {
                const params = new URLSearchParams(location.search);
                const token = params.get('token');
                const user = JSON.parse(params.get('user'));

                if (!token) {
                    throw new Error('Token is missing');
                }
                console.log(token)
                console.log(JSON.stringify(user))
                const decodedToken = jwtDecode(token);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('role', user.role);
                await login(token, user);

                if (mounted) {
                    navigate(decodedToken.role === 'admin' ? '/admin/dash' : '/user/profile', { replace: true });
                }
            } catch (err) {
                console.log(err)
                console.error('Authentication Error:', err.message);
                if (mounted) {
                    setError(err.message);
                    navigate('/login', { replace: true });
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                    setIsProcessing(false);
                }
            }
        };

        handleCallback();

        return () => {
            mounted = false;
        };
    }, []); // Empty dependency array as we only want this to run once

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Alert severity="error">
                    Authentication failed. Redirecting...
                </Alert>
            </Box>
        );
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    );
};

export default GoogleCallback;