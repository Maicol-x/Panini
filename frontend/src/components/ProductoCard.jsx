import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Button, Chip, Box,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { agregarItem } from '../store/carritoSlice';

export default function ProductoCard({ producto }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sinStock = producto.stock === 0;

  const imagenSrc = producto.imagen_url && producto.imagen_url.trim()
    ? producto.imagen_url
    : `https://placehold.co/600x300/1565c0/ffffff?text=${encodeURIComponent(producto.nombre)}`;

  return (
    <Card
      onClick={() => navigate(`/producto/${producto.id}`)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.16)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="160"
        image={imagenSrc}
        alt={producto.nombre}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pb: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={producto.categoria || 'General'}
            size="small"
            color="primary"
            variant="outlined"
          />
          {sinStock ? (
            <Chip label="Agotado" size="small" color="error" />
          ) : (
            <Chip label="Disponible" size="small" color="success" />
          )}
        </Box>

        <Typography
          variant="h6"
          fontWeight={700}
          lineHeight={1.2}
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {producto.nombre}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {producto.descripcion}
        </Typography>

        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          <Typography variant="h5" fontWeight={800} color="primary">
            ${Number(producto.precio).toLocaleString('es-CO')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            COP · por unidad
          </Typography>
        </Box>
      </CardContent>

      {/* stopPropagation para que el botón no dispare el click de la card */}
      <CardActions sx={{ p: 2, pt: 0 }} onClick={(e) => e.stopPropagation()}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddShoppingCartIcon />}
          disabled={sinStock}
          onClick={() => dispatch(agregarItem(producto))}
          sx={{ borderRadius: 2, py: 1, fontWeight: 700 }}
        >
          {sinStock ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </CardActions>
    </Card>
  );
}
