import { useSelector } from 'react-redux';
import { userSelectors } from 'ducks';

function WhenAuthenticated({ children = null }) {
    const isAuthenticated = useSelector(userSelectors.isAuthenticated);
    return isAuthenticated ? children : null;
}
export default WhenAuthenticated;
