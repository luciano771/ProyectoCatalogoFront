import { useLocation, useSearchParams } from 'react-router-dom';

const PaymentResultPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const state = location.state as
    | { orderId?: string; status?: string; total?: string }
    | undefined;

  const externalStatus = searchParams.get('status');
  const status = state?.status ?? externalStatus ?? 'PENDING';

  const isSuccess = status === 'PAID' || status === 'approved';

  return (
    <div className="container py-5 px-2 px-md-3 text-center">
      <h1 className="h5 mb-3">
        {isSuccess ? '¡Pedido realizado con éxito!' : 'Pedido registrado correctamente'}
      </h1>
      <p className="text-muted small mb-1">
        Pedido: {state?.orderId ?? 'N/D'}
      </p>
      {state?.total && (
        <p className="text-muted small mb-3">Total: ${state.total}</p>
      )}
      <p className="text-muted small">
        En una siguiente etapa se integrará el flujo de pago con Mercado Pago.
      </p>
    </div>
  );
};

export default PaymentResultPage;

