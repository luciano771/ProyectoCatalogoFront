import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      await login(values.email, values.password);
      const state = location.state as { from?: string } | undefined;
      navigate(state?.from ?? '/panel', { replace: true });
    } catch {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="container py-5 px-2 px-md-3" style={{ maxWidth: 420 }}>
      <h1 className="h5 mb-3">Iniciar sesión</h1>
      {error && (
        <div className="mb-2">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Contraseña"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Button type="submit" className="w-100 btn-sm" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>
      <p className="text-muted small mt-3">
        ¿No tenés cuenta?{' '}
        <Link to="/registro" className="text-decoration-underline">
          Registrate
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

