import styles from './Checkbox.module.css';

export default function Checkbox({ value, name, setter, isChecked}) {
    return (
        <div className={styles.row}>
            <input type="radio" name={ name } value={ name } id={ name } checked={ isChecked === name } className={ styles.checkbox }  onChange={(e) => setter(e.target.value)}/>
            <p className={styles.value}>{ value }</p>
        </div>
    )
}