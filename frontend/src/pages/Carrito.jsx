import { useState } from 'react';
import * as Yup from 'yup';
import {
  Container, Typography, Box, IconButton, Button, Divider,
  TextField, CircularProgress, Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { quitarItem, cambiarCantidad, vaciarCarrito } from '../store/carritoSlice';
import { useWhatsApp } from '../hooks/useWhatsApp';
import axiosClient from '../api/axiosClient';

const noXSS = (v) => !/<|>|javascript:|on\w+=/i.test(v ?? '');

const esquema = Yup.object({
  nombre: Yup.string().trim()
    .required('El nombre es requerido')
    .test('seguro', 'Caracteres no permitidos', noXSS),
  telefono: Yup.string().trim()
    .required('El teléfono es requerido')
    .test('seguro', 'Caracteres no permitidos', noXSS),
  direccion: Yup.string().trim()
    .required('La dirección es requerida')
    .test('seguro', 'Caracteres no permitidos', noXSS),
  barrio: Yup.string().trim()
    .test('seguro', 'Caracteres no permitidos', noXSS),
});

export default function Carrito() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s) => s.carrito.items);
  const { generarMensaje } = useWhatsApp();

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  const handleConfirmar = async () => {
    try {
      await esquema.validate({ nombre, telefono, direccion, barrio }, { abortEarly: false });
    } catch (e) {
      const errs = {};
      e.inner.forEach((err) => { errs[err.path] = err.message; });
      setErrores(errs);
      return;
    }
    setErrores({});
    setLoading(true);
    try {
      await axiosClient.post('/pedidos', {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        items,
        total,
      });
    } catch (_) {}
    setLoading(false);
    const url = generarMensaje(nombre.trim(), direccion.trim(), barrio.trim());
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    dispatch(vaciarCarrito());
    navigate('/');
    setNombre('');
    setTelefono('');
    setDireccion('');
    setBarrio('');
  };

  /* ── Carrito vacío ── */
  if (items.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f7f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{ position: 'fixed', top: 16, left: 16, bgcolor: 'rgba(0,0,0,0.07)', '&:hover': { bgcolor: 'rgba(0,0,0,0.13)' } }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ textAlign: 'center', px: 3 }}>
          <ShoppingCartIcon sx={{ fontSize: 72, color: '#cfd8e3', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} color="text.secondary" gutterBottom>
            Tu carrito está vacío
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
            Agrega productos desde el catálogo para hacer tu pedido.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/')} sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}>
            Ver catálogo
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f9fc' }}>
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(16px)',
          bgcolor: 'rgba(255,255,255,0.85)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          px: { xs: 2, md: 4 },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <IconButton onClick={() => navigate('/')} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={800} sx={{ flex: 1 }}>
          Mi carrito
        </Typography>
        <Button
          variant="text"
          color="error"
          size="small"
          onClick={() => dispatch(vaciarCarrito())}
          sx={{ fontWeight: 600, textTransform: 'none' }}
        >
          Vaciar
        </Button>
      </Box>

      <Container maxWidth="sm" sx={{ py: 3, pb: { xs: 2, md: 4 } }}>

        {/* Lista de productos */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                bgcolor: '#fff',
                borderRadius: 3,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              {/* Imagen */}
              <Avatar
                variant="rounded"
                src={item.imagen_url || ''}
                alt={item.nombre}
                sx={{ width: 64, height: 64, bgcolor: '#f0f4f8', '& img': { objectFit: 'contain' } }}
              />

              {/* Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  fontWeight={700}
                  fontSize="0.9rem"
                  sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                >
                  {item.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                  ${Number(item.precio).toLocaleString('es-CO')} c/u
                </Typography>
                <Typography fontWeight={800} color="primary.main" fontSize="0.95rem">
                  ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                </Typography>
              </Box>

              {/* Controles cantidad */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => {
                    if (item.cantidad <= 1) dispatch(quitarItem(item.id));
                    else dispatch(cambiarCantidad({ id: item.id, cantidad: item.cantidad - 1 }));
                  }}
                  sx={{ bgcolor: '#f0f4f8', width: 28, height: 28, '&:hover': { bgcolor: '#e0e7ef' } }}
                >
                  {item.cantidad <= 1 ? <DeleteIcon fontSize="inherit" sx={{ color: '#e53935' }} /> : <RemoveIcon fontSize="inherit" />}
                </IconButton>

                <Typography fontWeight={800} fontSize="1rem" sx={{ minWidth: 24, textAlign: 'center' }}>
                  {item.cantidad}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => dispatch(cambiarCantidad({ id: item.id, cantidad: item.cantidad + 1 }))}
                  sx={{ bgcolor: '#f0f4f8', width: 28, height: 28, '&:hover': { bgcolor: '#e0e7ef' } }}
                >
                  <AddIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Resumen total */}
        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            p: 2.5,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography color="text.secondary">{items.reduce((a, i) => a + i.cantidad, 0)} producto(s)</Typography>
            <Typography fontWeight={600}>${total.toLocaleString('es-CO')}</Typography>
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={800}>Total</Typography>
            <Typography variant="h5" fontWeight={900} color="primary.main">
              ${total.toLocaleString('es-CO')}
            </Typography>
          </Box>
        </Box>

        {/* Formulario contacto */}
        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            p: 2.5,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <Typography fontWeight={800} fontSize="1rem" gutterBottom>
            ¿A quién le enviamos el pedido?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Completa estos datos para confirmar tu pedido por WhatsApp.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="Tu nombre"
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); setErrores((p) => ({ ...p, nombre: '' })); }}
              fullWidth
              disabled={loading}
              size="small"
              error={!!errores.nombre}
              helperText={errores.nombre || ''}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Número de WhatsApp"
              value={telefono}
              onChange={(e) => { setTelefono(e.target.value); setErrores((p) => ({ ...p, telefono: '' })); }}
              fullWidth
              placeholder="Ej: 3001234567"
              slotProps={{ input: { inputMode: 'tel' } }}
              disabled={loading}
              size="small"
              error={!!errores.telefono}
              helperText={errores.telefono || ''}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Dirección de entrega"
              value={direccion}
              onChange={(e) => { setDireccion(e.target.value); setErrores((p) => ({ ...p, direccion: '' })); }}
              fullWidth
              placeholder="Ej: Calle 18 #24-12"
              disabled={loading}
              size="small"
              error={!!errores.direccion}
              helperText={errores.direccion || ''}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Barrio (opcional)"
              value={barrio}
              onChange={(e) => { setBarrio(e.target.value); setErrores((p) => ({ ...p, barrio: '' })); }}
              fullWidth
              placeholder="Ej: Centro"
              disabled={loading}
              size="small"
              error={!!errores.barrio}
              helperText={errores.barrio || ''}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <WhatsAppIcon />}
              onClick={handleConfirmar}
              disabled={!nombre.trim() || !telefono.trim() || !direccion.trim() || loading}
              sx={{
                mt: 0.5,
                bgcolor: '#25D366',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1rem',
                py: 1.6,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 6px 24px rgba(37,211,102,0.4)',
                '&:hover': { bgcolor: '#1ebe5d' },
                '&:disabled': { bgcolor: '#a5d6a7', color: '#fff' },
              }}
            >
              {loading ? 'Enviando…' : 'Confirmar pedido por WhatsApp'}
            </Button>
          </Box>
        </Box>

      </Container>
    </Box>
  );
}

