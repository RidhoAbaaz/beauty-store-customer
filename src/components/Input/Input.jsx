import styles from './Input.module.css';

export default function Input({ name,  label, value, handler, placeholder, type }) {
    return (
        <div className={styles.fieldWrapper}>
            <label htmlFor={ name } className={ styles.label } >{ label }</label>
            <input className={ styles.input } type={ type } id={ name } value={ value } name={ name } onChange={(e) => handler(e.target.name, e.target.value)} placeholder={ placeholder } required/>
        </div>
    )
}