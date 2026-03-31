import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import styles from './Header.module.css';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { isAuthenticated, user } = useSelector(state => state.auth);
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles['header-container']}>
        <Link to="/" className={styles['header-logo']}>
          <span className={styles['logo-icon']}>💘</span>
          <span className={styles['logo-text']}>Affinity</span>
        </Link>

        <nav className={styles['header-nav']}>
          {isAuthenticated ? (
            <>
              <Link to="/discovery" className={styles['nav-link']}>Discover</Link>
              <Link to="/matches" className={styles['nav-link']}>Matches</Link>
              <Link to="/questionnaires" className={styles['nav-link']}>Questionnaires</Link>
              <Link to="/profile" className={styles['nav-link']}>Profile</Link>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles['nav-link']}>Log In</Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
