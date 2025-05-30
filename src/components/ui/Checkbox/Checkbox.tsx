import "./Checkbox.css";

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
}

const Checkbox = ({ checked, onChange }: CheckboxProps) => {
    return (
        <label className="checkbox-container">
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="custom-checkbox"></span>
        </label>
    )
}

export default Checkbox;