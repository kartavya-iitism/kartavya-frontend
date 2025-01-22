import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
};

export const UserRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

AdminRoute.propTypes = {
    children: PropTypes.node.isRequired
};

UserRoute.propTypes = {
    children: PropTypes.node.isRequired
};

AdminRoute.displayName = 'AdminRoute';
UserRoute.displayName = 'UserRoute';