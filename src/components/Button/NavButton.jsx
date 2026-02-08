import styles from './Button.module.css';
import { NavLink, useNavigate } from 'react-router-dom';

export default function NavButton({ children, teks, height, width, path }) {
    const navigation = useNavigate()
    return (
        <>
            <button className={styles.button} style={{ width: width, height: height }} onClick={() => navigation(path)}>
                <p>{ teks }</p>
                { children }
            </button>
        </>
    )
}