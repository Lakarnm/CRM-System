import styles from './Checkbox.module.scss';

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
}

const Checkbox = ({ checked, onChange }: CheckboxProps) => {
    return (
        <label className={styles['checkbox-container']}>
            <input type="checkbox" checked={checked} onChange={onChange}/>
            <span className={styles['custom-checkbox']}></span>
        </label>
    )
}

export default Checkbox;