import styles from './HandlerButton.module.css';

export default function HandlerButton({ children, value, handler, isDisable = false }) {
    return (
        <button className={styles.wrapper} onClick={handler} disabled={isDisable} >
            {children}
            <p>{ value }</p>
        </button>
    )
}