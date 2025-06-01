import React, { useState } from 'react';

interface RegexInputProps {
  field?: string
  value: string;
  onChange: (value: string) => void;
  regex?: RegExp;
  required?: boolean;
  errorMessage?: string;
  placeholder?: string;
}

const RegexInput: React.FC<RegexInputProps> = ({
  field = 'input',
  value,
  onChange,
  regex,
  required = false,
  errorMessage = 'Invalid input',
  placeholder = '',
}) => {
  const [touched, setTouched] = useState(false);

  const isValid = regex ? regex.test(value) : true;

  const handleChange = (e: any) => {
    onChange(e.target.value);
    setTouched(true);
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        data-testid="regex-input"
        required={required}
      />
      {!isValid && touched && (
        <span className='invalid-feedback' data-testid={'error-message-' + field}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default RegexInput;