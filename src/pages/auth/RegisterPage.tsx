import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre del negocio requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres')
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { register: registerMerchant } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    try {
      await registerMerchant(values.name, values.email, values.password);
      navigate('/panel', { replace: true });
    } catch {
      setError('No se pudo registrar el comercio. Revisá los datos.');
    }
  };

  return (
    <div className="container py-5 px-2 px-md-3" style={{ maxWidth: 420 }}>
      <h1 className="h5 mb-3">Registrar comercio</h1>
      {error && (
        <div className="mb-2">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nombre del negocio"
          {...register('name')}
          error={errors.name?.message}
        />
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
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>
      <p className="text-muted small mt-3">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="text-decoration-underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

