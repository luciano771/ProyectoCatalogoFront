import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'sm' | 'md';
}

const Button = ({ children, size = 'md', className, ...rest }: Props) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : '';
  return (
    <button
      className={`btn btn-primary ${sizeClass} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;

