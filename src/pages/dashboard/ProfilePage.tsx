import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile, uploadLogo, uploadBanner, type MerchantProfile } from '../../api/merchant-api';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { STORE_THEMES, DEFAULT_STORE_THEME_ID } from '../../config/storeThemes';
import ThemeSelector from '../../components/dashboard/ThemeSelector';

const profileSchema = z.object({
  businessName: z.string().min(2),
  slug: z.string().min(3),
  description: z.string().optional(),
  logoUrl: z.string().optional().nullable().or(z.literal('')),
  bannerUrl: z.string().optional().nullable().or(z.literal('')),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  paymentAlias: z.string().optional(),
  active: z.boolean(),
  backgroundColor: z.string().max(20).optional().or(z.literal('')),
  themeId: z.string().max(50).optional().nullable()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [logoFeedback, setLogoFeedback] = useState<string | null>(null);
  const [bannerFeedback, setBannerFeedback] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      updateMyProfile({
        ...values,
        logoUrl: values.logoUrl || undefined,
        bannerUrl: values.bannerUrl || undefined,
        instagramUrl: values.instagramUrl || undefined,
        backgroundColor: values.backgroundColor || undefined,
        themeId: values.themeId || undefined
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    }
  });

  const uploadLogoMutation = useMutation({
    mutationFn: uploadLogo,
    onSuccess: res => {
      queryClient.setQueryData(['my-profile'], (prev: { profile: MerchantProfile } | undefined) =>
        prev ? { profile: { ...prev.profile, logoUrl: res.url } } : prev
      );
      setIframeKey(k => k + 1);
      setLogoFeedback('Imagen subida correctamente');
      setTimeout(() => setLogoFeedback(null), 4000);
    },
    onError: (err: { response?: { data?: { message?: string } }; message?: string }) => {
      setLogoFeedback(err?.response?.data?.message ?? err?.message ?? 'Error al subir');
      setTimeout(() => setLogoFeedback(null), 5000);
    }
  });

  const uploadBannerMutation = useMutation({
    mutationFn: uploadBanner,
    onSuccess: res => {
      queryClient.setQueryData(['my-profile'], (prev: { profile: MerchantProfile } | undefined) =>
        prev ? { profile: { ...prev.profile, bannerUrl: res.url } } : prev
      );
      setIframeKey(k => k + 1);
      setBannerFeedback('Imagen subida correctamente');
      setTimeout(() => setBannerFeedback(null), 4000);
    },
    onError: (err: { response?: { data?: { message?: string } }; message?: string }) => {
      setBannerFeedback(err?.response?.data?.message ?? err?.message ?? 'Error al subir');
      setTimeout(() => setBannerFeedback(null), 5000);
    }
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: data?.profile
      ? {
          ...data.profile,
          description: data.profile.description ?? '',
          logoUrl: data.profile.logoUrl ?? '',
          bannerUrl: data.profile.bannerUrl ?? '',
          instagramUrl: data.profile.instagramUrl ?? '',
          backgroundColor: data.profile.backgroundColor ?? '',
          themeId: (data.profile.themeId && STORE_THEMES.some(t => t.id === data.profile.themeId))
          ? data.profile.themeId
          : DEFAULT_STORE_THEME_ID
        }
      : undefined
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    return <Alert variant="danger">No se pudo cargar el perfil del comercio.</Alert>;
  }

  const onSubmit = (values: ProfileFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="container-fluid px-2 px-md-3" style={{ maxWidth: 720 }}>
      <h1 className="h5 mb-3">Perfil del comercio</h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          label="Nombre del negocio"
          {...form.register('businessName')}
          error={form.formState.errors.businessName?.message}
        />
        <Input
          label="Slug"
          {...form.register('slug')}
          error={form.formState.errors.slug?.message}
        />
        <div className="mb-4">
          <label className="form-label small fw-semibold">Template de la tienda</label>
          <p className="text-muted small mb-2">
            Elegí el diseño según la temática o gusto de tu tienda. Se aplica a colores, botones y acentos. Podés filtrar por estilo.
          </p>
          <ThemeSelector
            value={form.watch('themeId') || DEFAULT_STORE_THEME_ID}
            onChange={id => form.setValue('themeId', id)}
            disabled={mutation.isPending}
          />
        </div>
        <Input
          label="Descripción"
          {...form.register('description')}
          error={form.formState.errors.description?.message}
        />
        <div className="mb-3">
          <label className="form-label small">Imagen de portada</label>
          <p className="text-muted small mb-1">
            Subí una imagen. JPG, PNG, GIF o WebP, máx. 5 MB.
          </p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="form-control form-control-sm"
            style={{ maxWidth: 280 }}
            disabled={uploadBannerMutation.isPending}
            onChange={e => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (!file) return;
              uploadBannerMutation.mutate(file);
            }}
          />
          {bannerFeedback && (
            <p className={`small mt-1 mb-0 ${bannerFeedback.startsWith('Imagen subida') ? 'text-success' : 'text-danger'}`}>
              {uploadBannerMutation.isPending ? 'Subiendo...' : bannerFeedback}
            </p>
          )}
          {form.formState.errors.bannerUrl?.message && (
            <p className="text-danger small mt-1">{form.formState.errors.bannerUrl.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label small">Imagen de perfil</label>
          <p className="text-muted small mb-1">
            Logo o foto de la tienda (círculo sobre la portada). JPG, PNG, GIF o WebP, máx. 5 MB.
          </p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="form-control form-control-sm"
            style={{ maxWidth: 280 }}
            disabled={uploadLogoMutation.isPending}
            onChange={e => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (!file) return;
              uploadLogoMutation.mutate(file);
            }}
          />
          {logoFeedback && (
            <p className={`small mt-1 mb-0 ${logoFeedback.startsWith('Imagen subida') ? 'text-success' : 'text-danger'}`}>
              {uploadLogoMutation.isPending ? 'Subiendo...' : logoFeedback}
            </p>
          )}
          {form.formState.errors.logoUrl?.message && (
            <p className="text-danger small mt-1">{form.formState.errors.logoUrl.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label small">Vista previa de la tienda</label>
          <p className="text-muted small mb-1">
            Cómo se ve tu tienda para los clientes.
          </p>
          <div className="border rounded-3 overflow-hidden bg-light">
            <iframe
              key={iframeKey}
              title="Vista previa de la tienda"
              src={`/tienda/${data.profile.slug}?v=${iframeKey}`}
              className="w-100 border-0"
              style={{ height: 420 }}
            />
          </div>
        </div>
        <Input
          label="Instagram (URL)"
          {...form.register('instagramUrl')}
          error={form.formState.errors.instagramUrl?.message}
        />
        <Input
          label="Alias de pago (opcional)"
          {...form.register('paymentAlias')}
          error={form.formState.errors.paymentAlias?.message}
        />
        <div className="form-check form-switch mb-3">
          <input
            id="active"
            type="checkbox"
            className="form-check-input"
            {...form.register('active')}
          />
          <label htmlFor="active" className="form-check-label small">
            Tienda activa
          </label>
        </div>
        <Button type="submit" className="btn-sm" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
        </Button>
        {mutation.isSuccess && (
          <Alert variant="success" className="mt-2 mb-0">
            Se ha guardado con éxito.
          </Alert>
        )}
        {mutation.isError && (
          <Alert variant="danger" className="mt-2 mb-0">
            {(() => {
              const err = mutation.error as { response?: { data?: { message?: string } }; message?: string };
              return err?.response?.data?.message ?? err?.message ?? 'No se pudieron guardar los cambios.';
            })()}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
