import "./Checkbox.css";

const Checkbox = ({ checked, onChange }) => {
    return (
        <label className="checkbox-container">
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="custom-checkbox"></span>
        </label>
    )
}

export default Checkbox