import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMerchantOrderDetail,
  updateOrderStatus
} from '../../api/order-api-dashboard';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado'
};

const STATUS_VARIANT: Record<string, string> = {
  PENDING: 'orders-status-pending',
  PAID: 'orders-status-paid',
  DELIVERED: 'orders-status-delivered',
  CANCELLED: 'orders-status-cancelled'
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['merchant-order', id],
    queryFn: () => getMerchantOrderDetail(id ?? ''),
    enabled: !!id
  });

  const mutation = useMutation({
    mutationFn: (status: string) => updateOrderStatus(id ?? '', status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-order', id] });
      queryClient.invalidateQueries({ queryKey: ['merchant-orders'] });
    }
  });

  if (isLoading) {
    return (
      <div className="orders-detail-page">
        <div className="d-flex justify-content-center py-5">
          <Spinner />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="orders-detail-page">
        <Alert variant="danger">Pedido no encontrado.</Alert>
        <Link to="/panel/pedidos" className="btn btn-outline-primary btn-sm mt-3">
          Volver a pedidos
        </Link>
      </div>
    );
  }

  const { order } = data;
  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—';

  return (
    <div className="orders-detail-page">
      <div className="orders-detail-header">
        <Link to="/panel/pedidos" className="orders-detail-back">
          ← Pedidos
        </Link>
        <h1 className="orders-detail-title">Pedido #{order.id.slice(-8)}</h1>
        <span className={`orders-status-badge ${STATUS_VARIANT[order.status] ?? 'orders-status-pending'}`}>
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <div className="orders-detail-grid">
        <section className="orders-detail-card orders-detail-card-client">
          <h2 className="orders-detail-card-title">Cliente</h2>
          <dl className="orders-detail-dl">
            <div>
              <dt>Nombre</dt>
              <dd>{order.buyerName}</dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd>
                <a href={`tel:${order.buyerPhone}`} className="orders-detail-link">
                  {order.buyerPhone}
                </a>
              </dd>
            </div>
            {order.buyerEmail && (
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${order.buyerEmail}`} className="orders-detail-link">
                    {order.buyerEmail}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt>Fecha</dt>
              <dd>{createdAt}</dd>
            </div>
          </dl>
        </section>

        <section className="orders-detail-card orders-detail-card-items">
          <h2 className="orders-detail-card-title">Ítems</h2>
          <ul className="orders-detail-items">
            {(order.items ?? []).map((item: { id: string; productName: string; quantity: number; unitPrice: string; subtotal: string }) => (
              <li key={item.id} className="orders-detail-item">
                <div className="orders-detail-item-info">
                  <span className="orders-detail-item-name">{item.productName}</span>
                  <span className="orders-detail-item-meta">
                    ${Number(item.unitPrice).toFixed(2)} × {item.quantity}
                  </span>
                </div>
                <span className="orders-detail-item-subtotal">
                  ${Number(item.subtotal).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </li>
            ))}
          </ul>
          <div className="orders-detail-total">
            <span>Total</span>
            <span className="orders-detail-total-amount">
              ${Number(order.totalAmount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </section>

        <section className="orders-detail-card orders-detail-card-actions">
          <h2 className="orders-detail-card-title">Cambiar estado</h2>
          <p className="orders-detail-actions-desc small text-muted mb-3">
            Actualizá el estado del pedido según avance.
          </p>
          <div className="orders-detail-actions-btns">
            {(['PENDING', 'PAID', 'DELIVERED', 'CANCELLED'] as const).map(status => (
              <button
                key={status}
                type="button"
                className={`btn btn-sm ${order.status === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => mutation.mutate(status)}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? '...' : STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderDetailPage;
