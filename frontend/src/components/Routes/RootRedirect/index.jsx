import { Navigate } from 'react-router';
import { useAuthContext } from '../../../hooks/useAuthContext';

const RootRedirect = () => {
    const { user } = useAuthContext();

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    const home = user.role === 'IT' ? '/users' : '/artwork';

    return (
        <Navigate
            to={home}
            replace
        />
    );
};

export default RootRedirect;
