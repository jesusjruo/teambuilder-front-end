import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthedUserContext } from '../../App';

const NavBar = ({ handleSignout }) => {
  const user = useContext(AuthedUserContext);

  return (
    <nav>
      <ul>
        {user ? (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/teams">Teams</Link></li>
            <li><Link to="/" onClick={handleSignout}>Sign Out</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/signin">Sign In</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
