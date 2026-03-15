import type { PublicMerchantProfile } from '../../api/store-api';
import { getImageUrlOrDefault } from '../../utils/imageUrl';

interface Props {
  profile: PublicMerchantProfile;
}

const StoreHeader = ({ profile }: Props) => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: profile.businessName,
          url: shareUrl
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert('Enlace de la tienda copiado');
      }
    } catch {
      // silencioso
    }
  };

  return (
    <section className="store-header-card rounded-3 shadow-sm mb-4 overflow-hidden">
      {/* Imagen de portada */}
      <div className="store-header-banner position-relative">
        <img
          src={getImageUrlOrDefault(profile.bannerUrl)}
          alt=""
          className="w-100"
        />
        {/* Imagen de perfil superpuesta */}
        <div className="store-header-logo-wrap position-absolute start-50 translate-middle-x">
          <img
            src={getImageUrlOrDefault(profile.logoUrl)}
            alt={profile.businessName}
            className="store-header-logo rounded-circle border border-3 border-white shadow-sm"
          />
        </div>
      </div>

      <div className="store-header-body text-center pt-4 pb-3 px-3">
        <h1 className="h5 mb-1 fw-bold">{profile.businessName}</h1>
        {profile.description && (
          <p className="text-muted small mb-3">{profile.description}</p>
        )}
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <a
            href="#productos"
            className="btn btn-dark btn-sm rounded-pill px-3"
          >
            Inicio
          </a>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill px-3"
            onClick={handleShare}
          >
            Compartir
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoreHeader;
