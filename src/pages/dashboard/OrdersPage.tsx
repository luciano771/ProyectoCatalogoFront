import { useQuery } from '@tanstack/react-query';
import { listMerchantOrders } from '../../api/order-api-dashboard';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { Link } from 'react-router-dom';

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

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const OrdersPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['merchant-orders'],
    queryFn: listMerchantOrders,
    refetchOnMount: 'always'
  });

  if (isLoading) {
    return (
      <div className="orders-page">
        <div className="orders-page-header">
          <h1 className="orders-page-title">Pedidos</h1>
        </div>
        <div className="d-flex justify-content-center py-5">
          <Spinner />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="orders-page">
        <div className="orders-page-header">
          <h1 className="orders-page-title">Pedidos</h1>
        </div>
        <Alert variant="danger">No se pudieron cargar los pedidos.</Alert>
      </div>
    );
  }

  if (!data.orders.length) {
    return (
      <div className="orders-page">
        <div className="orders-page-header">
          <h1 className="orders-page-title">Pedidos</h1>
        </div>
        <div className="orders-empty">
          <div className="orders-empty-icon">📋</div>
          <h2 className="orders-empty-title">Todavía no tenés pedidos</h2>
          <p className="orders-empty-text text-muted">
            Cuando alguien compre en tu tienda, los pedidos aparecerán aquí.
          </p>
          <Link to="/panel" className="btn btn-outline-primary btn-sm mt-2">
            Volver al panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-page-header">
        <h1 className="orders-page-title">Pedidos</h1>
        <span className="orders-page-count">{data.orders.length} pedido{data.orders.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="orders-list">
        {data.orders.map(o => (
          <Link
            key={o.id}
            to={`/panel/pedidos/${o.id}`}
            className="orders-card"
          >
            <div className="orders-card-main">
              <div className="orders-card-info">
                <span className="orders-card-client">{o.buyerName}</span>
                <span className="orders-card-meta">
                  {o.buyerPhone}
                  {o.buyerEmail ? ` · ${o.buyerEmail}` : ''}
                </span>
                <span className="orders-card-date">{formatDate(o.createdAt)}</span>
              </div>
              <div className="orders-card-right">
                <span className={`orders-status-badge ${STATUS_VARIANT[o.status] ?? 'orders-status-pending'}`}>
                  {STATUS_LABELS[o.status] ?? o.status}
                </span>
                <span className="orders-card-total">
                  ${Number(o.totalAmount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="orders-card-footer">
              <span className="orders-card-link">Ver pedido</span>
              <span className="orders-card-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
