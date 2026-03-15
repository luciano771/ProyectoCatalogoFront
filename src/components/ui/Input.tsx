import { forwardRef, type InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, ...rest }, ref) => {
    return (
      <div className="mb-3">
        <label className="form-label small">{label}</label>
        <input
          ref={ref}
          className={`form-control form-control-sm ${className ?? ''} ${
            error ? 'is-invalid' : ''
          }`}
          {...rest}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

