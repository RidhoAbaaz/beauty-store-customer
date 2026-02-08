import styles from './Button.module.css';

export default function Button({ children, teks, handler, height, width }) {
    return (
        <button className={styles.button} onClick={handler} style={{ width: width, height: height }}>
            <p>{ teks }</p>
            { children }
        </button>
    )
}