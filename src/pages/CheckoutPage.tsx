import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useCart } from '../hooks/useCart';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useState, useEffect } from 'react';
import { createPublicOrder } from '../api/order-api';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Nombre requerido'),
  phone: z.string().min(6, 'Teléfono requerido'),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('').transform(() => undefined))
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const queryClient = useQueryClient();
  const { items, clear, setStoreSlug } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const slugFromUrl = searchParams.get('store') ?? '';
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { slug?: string } | undefined;
  const slug = state?.slug ?? slugFromUrl;

  useEffect(() => {
    if (slug) setStoreSlug(slug);
  }, [slug, setStoreSlug]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema)
  });

  const total = items.reduce(
    (acc, i) => acc + Number(i.price) * i.quantity,
    0
  );

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!slug) {
      setError('No se pudo identificar la tienda.');
      return;
    }
    if (!items.length) {
      setError('Tu carrito está vacío.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const payload = {
        buyer: {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email
        },
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity
        }))
      };
      const { order } = await createPublicOrder(slug, payload);
      await clear(slug);
      await queryClient.invalidateQueries({ queryKey: ['merchant-orders'] });
      navigate('/resultado-pago', {
        state: { orderId: order.id, status: order.status, total: order.totalAmount }
      });
    } catch {
      setError('No se pudo crear el pedido. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 px-2 px-md-3" style={{ maxWidth: 480 }}>
      <h1 className="h5 mb-3">Checkout</h1>
      {error && (
        <div className="mb-2">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nombre y apellido"
          {...register('fullName')}
          error={errors.fullName?.message}
        />
        <Input
          label="Teléfono"
          {...register('phone')}
          error={errors.phone?.message}
        />
        <Input
          label="Email (opcional)"
          {...register('email')}
          error={errors.email?.message}
        />
        <div className="d-flex justify-content-between align-items-center mb-3 small">
          <span>Total estimado</span>
          <span className="fw-semibold">${total.toFixed(2)}</span>
        </div>
        <Button type="submit" className="w-100 btn-sm" disabled={loading}>
          {loading ? 'Procesando...' : 'Confirmar pedido'}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutPage;

