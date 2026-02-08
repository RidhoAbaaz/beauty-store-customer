import styles from './Empty.module.css';

export default function Empty() {
    return (
        <div className={styles.container}>
            <i className={`bi bi-exclamation-diamond ${styles.icon}`}></i>
            <p className={styles.text}>Something Went Wrong</p>
        </div>
    )
}