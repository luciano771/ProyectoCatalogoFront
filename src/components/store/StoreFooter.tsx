import type { PublicMerchantProfile } from '../../api/store-api';

interface Props {
  profile: PublicMerchantProfile;
}

const StoreFooter = ({ profile }: Props) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-5 pt-4 border-top">
      <div className="row small text-muted">
        <div className="col-12 col-md-6 mb-3">
          <h3 className="h6 text-dark mb-2">{profile.businessName}</h3>
          {profile.description && (
            <p className="mb-2">{profile.description}</p>
          )}
          <p className="mb-0">Tu tienda en línea</p>
        </div>
        <div className="col-12 col-md-6">
          <p className="fw-semibold mb-2">Contacto</p>
          {profile.paymentAlias && (
            <a
              href={`https://wa.me/${profile.paymentAlias.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="d-block text-decoration-none text-muted mb-1"
            >
              WhatsApp
            </a>
          )}
          {profile.instagramUrl && (
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="d-block text-decoration-none text-muted mb-1"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
      <p className="small text-muted text-center mt-3 mb-0">
        © {currentYear} {profile.businessName}. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default StoreFooter;
