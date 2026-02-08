import styles from './NavBar.module.css';
import { NavLink } from 'react-router-dom';


export default function NavBar() {
    return (
        <nav className={styles.navbar}>
            <NavLink 
                to="/home"
                end
                className={({ isActive }) => `${styles.menuItem} ${isActive && styles.active}`}>
                <i className="bi bi-house"></i>
                <p>Home</p>
            </NavLink>
            <NavLink 
                to="/Shop"
                className={({ isActive }) => `${styles.menuItem} ${isActive && styles.active}`}>
                <i className="bi bi-archive"></i>Shop
            </NavLink>
            <NavLink 
                to="/Order"
                className={({ isActive }) => `${styles.menuItem} ${isActive && styles.active}`}>
                <i className="bi bi-file-text-fill"></i>
                <p>Order</p>
            </NavLink>
            <NavLink 
                to="/History"
                className={({ isActive }) => `${styles.menuItem} ${isActive && styles.active}`}>
                <i className="bi bi-book"></i>
                <p>History</p>
            </NavLink>
        </nav>
    )
}