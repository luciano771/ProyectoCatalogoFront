import { Link } from 'react-router-dom';

const PresentacionPage = () => {
  return (
    <div className="presentacion">
      <header className="presentacion-header">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between py-3">
            <Link to="/" className="presentacion-logo">
              Catálogo WhatsApp
            </Link>
            <nav className="presentacion-nav">
              <a href="#caracteristicas">Características</a>
              <a href="#como-funciona">Cómo funciona</a>
              <a href="#faq">Preguntas</a>
              <Link to="/registro" className="presentacion-nav-cta">
                Empezar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="presentacion-hero">
        <div className="container text-center py-5 py-md-6">
          <h1 className="presentacion-hero-title">
            Tu tienda online en minutos
          </h1>
          <p className="presentacion-hero-tagline">
            Catálogo de productos, carrito y pedidos. Pensado para que compartas el
            link de tu tienda y recibas pedidos sin errores.
          </p>
          <Link to="/registro" className="presentacion-btn presentacion-btn-primary">
            Ver cómo funciona →
          </Link>
        </div>
      </section>

      <section className="presentacion-section" id="caracteristicas">
        <div className="container py-5">
          <h2 className="presentacion-section-title">Todo lo que necesitás para vender</h2>
          <p className="presentacion-section-subtitle">
            Creá tu perfil de tienda, subí productos con fotos y compartí un único
            link. Tus clientes ven el catálogo, agregan al carrito y confirman el pedido.
          </p>
          <div className="presentacion-features">
            <div className="presentacion-card">
              <div className="presentacion-card-icon presentacion-card-icon-cat">📦</div>
              <h3 className="presentacion-card-title">Catálogo de productos</h3>
              <p className="presentacion-card-text">
                Categorías, precios, stock e imágenes. Cada producto con su foto,
                descripción y precio. Imagen por defecto para productos sin foto.
              </p>
            </div>
            <div className="presentacion-card">
              <div className="presentacion-card-icon presentacion-card-icon-order">🛒</div>
              <h3 className="presentacion-card-title">Carrito y pedidos</h3>
              <p className="presentacion-card-text">
                Los clientes agregan productos al carrito, ven el resumen y completan
                el checkout con nombre, teléfono y email. Pedido registrado al instante.
              </p>
            </div>
            <div className="presentacion-card">
              <div className="presentacion-card-icon presentacion-card-icon-panel">⚙️</div>
              <h3 className="presentacion-card-title">Panel del comercio</h3>
              <p className="presentacion-card-text">
                Perfil de tienda (slug, logo, portada), gestión de categorías y
                productos, lista de pedidos con estados (Pendiente, Pagado, Entregado,
                Cancelado).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="presentacion-section presentacion-section-alt">
        <div className="container py-5">
          <h2 className="presentacion-section-title">Tu tienda con tu identidad</h2>
          <p className="presentacion-section-subtitle">
            Cada comercio tiene su propia URL y su perfil: nombre, descripción, logo
            y banner. Las imágenes se guardan en el frontend para servir rápido.
          </p>
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <h3 className="presentacion-h3 mb-3">URL única y personalizada</h3>
              <p className="text-muted mb-3">
                Tu tienda vive en <strong>/tienda/tu-slug</strong>. Solo compartís el
                link y tus clientes ven tu catálogo, carrito y checkout.
              </p>
              <ul className="presentacion-list">
                <li>Slug en minúsculas (ej: mitienda, panaderia-lopez)</li>
                <li>Logo y foto de portada configurables</li>
                <li>Vista previa en vivo desde el panel (iframe)</li>
                <li>Imágenes por defecto si no hay logo o portada</li>
              </ul>
            </div>
            <div className="col-md-6">
              <div className="presentacion-mockup">
                <p className="presentacion-mockup-label">Ejemplo de URL de tienda</p>
                <div className="presentacion-mockup-window">
                  https://tudominio.com<span>/tienda/mitienda</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="presentacion-section" id="como-funciona">
        <div className="container py-5">
          <h2 className="presentacion-section-title">Cómo funciona</h2>
          <p className="presentacion-section-subtitle">
            Del registro a la primera venta en pocos pasos.
          </p>
          <div className="presentacion-steps">
            <div className="presentacion-step">
              <span className="presentacion-step-num">1</span>
              <strong>Registro</strong>
              <span>Creás tu cuenta como comercio (email y contraseña).</span>
            </div>
            <div className="presentacion-step">
              <span className="presentacion-step-num">2</span>
              <strong>Perfil</strong>
              <span>Completás nombre, slug, logo y portada de la tienda.</span>
            </div>
            <div className="presentacion-step">
              <span className="presentacion-step-num">3</span>
              <strong>Catálogo</strong>
              <span>Agregás categorías y productos con precios e imágenes.</span>
            </div>
            <div className="presentacion-step">
              <span className="presentacion-step-num">4</span>
              <strong>Compartir</strong>
              <span>Compartís el link /tienda/tu-slug por WhatsApp o redes.</span>
            </div>
            <div className="presentacion-step">
              <span className="presentacion-step-num">5</span>
              <strong>Pedidos</strong>
              <span>
                Los clientes compran; ves los pedidos en el panel y actualizás el
                estado.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="presentacion-section presentacion-section-alt">
        <div className="container py-5">
          <h2 className="presentacion-section-title">Panel del comercio</h2>
          <p className="presentacion-section-subtitle">
            Todo en un solo lugar: perfil, categorías, productos, carga masiva y
            pedidos.
          </p>
          <div className="presentacion-panel-grid">
            <div className="presentacion-panel-item">
              <span className="presentacion-panel-emoji">👤</span>
              Perfil: nombre, slug, logo, portada, vista previa iframe
            </div>
            <div className="presentacion-panel-item">
              <span className="presentacion-panel-emoji">📁</span>
              Categorías: crear, editar y ordenar
            </div>
            <div className="presentacion-panel-item">
              <span className="presentacion-panel-emoji">🖼️</span>
              Productos: imagen, precio, stock, categoría
            </div>
            <div className="presentacion-panel-item">
              <span className="presentacion-panel-emoji">📋</span>
              Pedidos: lista con estado, detalle y cambio de estado
            </div>
            <div className="presentacion-panel-item">
              <span className="presentacion-panel-emoji">📤</span>
              Carga masiva: importar productos desde Excel
            </div>
            <div className="presentacion-panel-item">
              <span className="presentacion-panel-emoji">🔐</span>
              Olvidé mi contraseña y registro seguro
            </div>
          </div>
          <p className="presentacion-section-subtitle mb-0">
            Los pedidos se muestran con cliente, teléfono, email, total y estado
            (Pendiente, Pagado, Entregado, Cancelado). En el detalle podés cambiar
            el estado con un clic.
          </p>
        </div>
      </section>

      <section className="presentacion-section" id="faq">
        <div className="container py-5">
          <h2 className="presentacion-section-title">Preguntas frecuentes</h2>
          <div className="presentacion-faq">
            <details className="presentacion-faq-item">
              <summary>¿Qué es el slug de la tienda?</summary>
              <p>
                Es la parte de la URL que identifica tu tienda. Por ejemplo, si tu
                slug es <strong>panaderia-lopez</strong>, tu tienda estará en{' '}
                <strong>/tienda/panaderia-lopez</strong>. Solo puede tener minúsculas,
                números y guiones.
              </p>
            </details>
            <details className="presentacion-faq-item">
              <summary>¿Dónde se guardan las imágenes?</summary>
              <p>
                Las imágenes (logo, portada y fotos de productos) se guardan en el
                frontend (<code>public/uploads</code>), organizadas por usuario e
                imagen. El backend solo escribe los archivos; el navegador los sirve
                de forma directa.
              </p>
            </details>
            <details className="presentacion-faq-item">
              <summary>¿Se puede integrar pago con Mercado Pago?</summary>
              <p>
                Sí. El flujo de checkout está preparado para integrar Mercado Pago
                (Checkout Pro). Por ahora el pedido se registra como &quot;realizado&quot; y el
                comercio puede coordinar el pago por otros medios hasta activar la
                pasarela.
              </p>
            </details>
            <details className="presentacion-faq-item">
              <summary>¿Hay notificaciones por WhatsApp al vendedor?</summary>
              <p>
                En el MVP no. Podés mostrar el teléfono/WhatsApp del comercio en el
                perfil para que el cliente contacte. En una siguiente etapa se puede
                integrar la API de WhatsApp para enviar al vendedor un mensaje cuando
                llegue un pedido nuevo.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="presentacion-cta">
        <div className="container py-5 text-center">
          <h2 className="presentacion-cta-title">Listo para armar tu tienda</h2>
          <p className="presentacion-cta-text">
            Registrate, configurá tu perfil y empezá a recibir pedidos.
          </p>
          <Link to="/registro" className="presentacion-btn presentacion-btn-white">
            Ir a la aplicación →
          </Link>
        </div>
      </section>

      <footer className="presentacion-footer">
        <div className="container py-4 text-center text-muted small">
          Proyecto Catálogo para WhatsApp – MVP. Frontend React + Vite, Backend
          Node + Express + Prisma.
        </div>
      </footer>
    </div>
  );
};

export default PresentacionPage;
