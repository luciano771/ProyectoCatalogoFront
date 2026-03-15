import type { ReactNode } from 'react';

interface Props {
  variant?: 'info' | 'success' | 'danger';
  children: ReactNode;
}

const Alert = ({ variant = 'info', children }: Props) => {
  const cls =
    variant === 'success'
      ? 'alert alert-success'
      : variant === 'danger'
      ? 'alert alert-danger'
      : 'alert alert-primary';
  return <div className={cls}>{children}</div>;
};

export default Alert;

