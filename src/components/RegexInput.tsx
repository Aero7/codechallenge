import React, { useState, useRef } from "react";

interface RegexInputProps {
  field?: string;
  value: string;
  onChange: (value: string) => void;
  regex?: RegExp;
  required?: boolean;
  errorMessage?: string;
  placeholder?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  usePopover?: boolean;
  dataTestId?: string;
}

const RegexInput: React.FC<RegexInputProps> = ({
  field = "input",
  value,
  onChange,
  regex,
  required = false,
  errorMessage = "Invalid input",
  placeholder = "",
  onBlur,
  onKeyDown,
  usePopover = false,
  dataTestId = "regex-input",
}) => {
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValid = regex ? regex.test(value) : true;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setTouched(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    if (onBlur) onBlur(e);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        className={`form-control${
          !isValid && touched && !usePopover ? " is-invalid" : ""
        }`}
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        data-testid={dataTestId}
        required={required}
        autoFocus
        style={
          usePopover && !isValid && touched
            ? { borderColor: "#dc3545" }
            : undefined
        }
        aria-invalid={!isValid && touched}
        aria-describedby={
          usePopover && !isValid && touched ? `popover-${field}` : undefined
        }
      />
      {!isValid && touched && !usePopover && (
        <span
          className="invalid-feedback"
          data-testid={"error-message-" + field}
        >
          {errorMessage}
        </span>
      )}
      {!isValid && touched && usePopover && inputRef.current && (
        <div
          className="popover bs-popover-bottom show"
          role="tooltip"
          id={`popover-${field}`}
          style={{
            position: "absolute",
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #dc3545",
            color: "#dc3545",
            padding: "0.5rem 1rem",
            borderRadius: "0.3rem",
            boxShadow: "0 0.5rem 1rem rgba(0,0,0,.15)",
            marginTop: "0.25rem",
            left:
              inputRef.current.getBoundingClientRect &&
              inputRef.current.getBoundingClientRect().left
                ? inputRef.current.getBoundingClientRect().left
                : 0,
          }}
          data-testid={"popover-error-" + field}
        >
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default RegexInput;
