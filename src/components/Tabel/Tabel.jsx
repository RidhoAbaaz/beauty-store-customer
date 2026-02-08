import Button from '../Button/Button';
import NavButton from '../Button/NavButton';
import styles from './Tabel.module.css';

export default function Tabel({ title, children, row, path }) {
    return (
        <div className={styles.card}>
            <h4>{ title }</h4>
            <table className={styles.productTable}>
                <thead>
                    <tr>
                        {children}
                    </tr>
                </thead>
                <tbody>
                    {row}
                </tbody>
            </table>
            <NavButton teks="See Detail" width="120px" height="30px" path={path} >
                <i className="bi bi-arrow-right"></i>
            </NavButton>
        </div>
    )
}