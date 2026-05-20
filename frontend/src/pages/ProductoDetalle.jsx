import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Grid, Typography, Box, Button, Chip,
  Divider, CircularProgress, Alert, Snackbar, IconButton, Badge,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getProducto, getProductos } from '../api/productos';
import { agregarItem } from '../store/carritoSlice';
import ProductoCard from '../components/ProductoCard';

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [snack, setSnack] = useState(false);
  const cantidad = useSelector((s) =>
    s.carrito.items.reduce((acc, i) => acc + i.cantidad, 0)
  );

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ['producto', id],
    queryFn: () => getProducto(id),
  });

  const { data: similares = [] } = useQuery({
    queryKey: ['similares', producto?.categoria_id],
    queryFn: () => getProductos(producto?.categoria_id),
    enabled: !!producto?.categoria_id,
    select: (data) => data.filter((p) => p.id !== Number(id)).slice(0, 4),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (isError || !producto) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Producto no encontrado</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  const sinStock = producto.stock === 0;
  const imagenSrc =
    producto.imagen_url && producto.imagen_url.trim()
      ? producto.imagen_url
      : `https://placehold.co/600x400/1565c0/ffffff?text=${encodeURIComponent(producto.nombre)}`;

  const handleAgregar = () => {
    dispatch(agregarItem(producto));
    setSnack(true);
  };

  return (
    <>
      {/* Botones flotantes */}
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'fixed', top: 16, left: 16, zIndex: 100,
          backdropFilter: 'blur(10px)',
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          '&:hover': { background: 'rgba(0,0,0,0.55)' },
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <IconButton
        onClick={() => navigate('/carrito')}
        sx={{
          position: 'fixed', top: 16, right: 16, zIndex: 100,
          backdropFilter: 'blur(10px)',
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          width: 52, height: 52,
          '&:hover': { background: 'rgba(0,0,0,0.55)' },
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <Badge badgeContent={cantidad} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 6 }, pt: { xs: 9, md: 8 } }}>
        <Grid container spacing={{ xs: 3, md: 6 }} alignItems="flex-start">
          {/* Detalles — izquierda en desktop, abajo en mobile */}
          <Grid item xs={12} md={7} sx={{ order: { xs: 2, md: 1 } }}>
            <Chip
              label={producto.categoria}
              color="primary"
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Typography
              variant="h4"
              fontWeight={900}
              lineHeight={1.2}
              gutterBottom
              sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}
            >
              {producto.nombre}
            </Typography>

            <Typography
              variant="h3"
              fontWeight={800}
              color="primary"
              gutterBottom
              sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              ${Number(producto.precio).toLocaleString('es-CO')}
              <Typography
                component="span"
                variant="body1"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                COP
              </Typography>
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 2.5, lineHeight: 1.7, fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              {producto.descripcion}
            </Typography>

            {sinStock ? (
              <Chip label="Sin stock" color="error" sx={{ mb: 3 }} />
            ) : (
              <Typography
                variant="body2"
                color="success.main"
                fontWeight={600}
                sx={{ mb: 3 }}
              >
                ✓ {producto.stock} unidades disponibles
              </Typography>
            )}

            {/* Botones de acción */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<AddShoppingCartIcon />}
                disabled={sinStock}
                onClick={handleAgregar}
                sx={{ py: 1.5, fontWeight: 700, borderRadius: 2, fontSize: '1rem' }}
              >
                Agregar al carrito
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={() => navigate('/carrito')}
                sx={{ borderRadius: 2 }}
              >
                Ver carrito
              </Button>
            </Box>
          </Grid>

          {/* Imagen — derecha en desktop, arriba en mobile */}
          <Grid item xs={12} md={5} sx={{ order: { xs: 1, md: 2 } }}>
            <Box
              component="img"
              src={imagenSrc}
              alt={producto.nombre}
              sx={{
                width: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                objectFit: 'contain',
                maxHeight: { xs: 260, md: 400 },
                bgcolor: '#f5f5f5',
              }}
            />
          </Grid>
        </Grid>

        {/* ── Descripción larga ── */}
        {producto.descripcion_larga && (
          <Box sx={{ mt: { xs: 5, md: 7 } }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Descripción del producto
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.9, whiteSpace: 'pre-line', maxWidth: 720 }}
            >
              {producto.descripcion_larga}
            </Typography>
          </Box>
        )}

        {/* ── Productos similares ── */}
        {similares.length > 0 && (
          <Box sx={{ mt: { xs: 5, md: 7 } }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Productos similares
            </Typography>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {similares.map((p) => (
                <Grid item xs={12} sm={6} lg={3} key={p.id} sx={{ display: 'flex' }}>
                  <ProductoCard producto={p} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snack}
        autoHideDuration={2500}
        onClose={() => setSnack(false)}
        message="¡Agregado al carrito!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
