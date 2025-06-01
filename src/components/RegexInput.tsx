import React, { useState } from 'react';

interface RegexInputProps {
  value: string;
  onChange: (value: string) => void;
  regex?: RegExp;
  errorMessage?: string;
  placeholder?: string;
}

const RegexInput: React.FC<RegexInputProps> = ({
  value,
  onChange,
  regex,
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
    <div>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        data-testid="regex-input"
      />
      {!isValid && touched && (
        <span style={{ color: 'red' }} data-testid="error-message">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default RegexInput;