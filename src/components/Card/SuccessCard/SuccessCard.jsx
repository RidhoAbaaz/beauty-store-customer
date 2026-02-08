import styles from './SuccessCard.module.css';

export default function SuccessCard({ message }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <i className={`bi bi-check-circle ${styles.icon}`}></i>
                <h3 className={styles.title}>Success</h3>
                <p className={styles.message}>{ message }</p>
            </div>
        </div>
    )
}