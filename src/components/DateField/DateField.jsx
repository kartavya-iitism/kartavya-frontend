import { TextField } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';

const DateField = ({
    name,
    value,
    onChange,
    label,
    required = false
}) => {
    const [dateValue, setDateValue] = useState(value);

    const handleChange = (e) => {
        const newDate = e.target.value;
        setDateValue(newDate);
        onChange({
            target: {
                name: name,
                value: newDate
            }
        });
    };

    return (
        <TextField
            type="date"
            label={label}
            required={required}
            value={dateValue}
            onChange={handleChange}
            className="custom-textfield custom-textfield-donation"
            fullWidth
            variant="outlined"
            InputLabelProps={{
                shrink: true
            }}
            inputProps={{
                max: new Date().toISOString().split('T')[0]
            }}
        />
    );
};

DateField.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool
};

export default DateField;