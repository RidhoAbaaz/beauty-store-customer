import styles from './ErrorCard.module.css';

export default function ErrorCard({ message }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <i className={`bi bi-exclamation-diamond ${styles.icon}`}></i>
                <h3 className={styles.title}>Error</h3>
                <p className={styles.message}>{ message }</p>
            </div>
        </div>
    )
}