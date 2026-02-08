import styles from './LoadingCard.module.css';

export default function LoadingCard() {
    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <div className={styles.loadingCircle}></div>
                <p>Please Wait</p>
            </div>
        </div>
    )
}