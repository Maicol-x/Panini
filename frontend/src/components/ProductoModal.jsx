import { useState } from 'react';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import {
  Dialog, DialogContent, Box, Typography, IconButton, Button,
  Chip, TextField, CircularProgress, Snackbar, Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { agregarItem } from '../store/carritoSlice';
import axiosClient from '../api/axiosClient';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5491100000000';
const SEP = '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500';
const E = {
  MANO:    '%F0%9F%91%87',
  CLIENTE: '%F0%9F%91%A4',
  CIUDAD:  '%F0%9F%93%8D',
  CASA:    '%F0%9F%8F%A0',
  BARRIO:  '%F0%9F%8F%A2',
  CAJA:    '%F0%9F%93%A6',
  DINERO:  '%F0%9F%92%B0',
  SOBRE:   '%E2%9C%89',
  ORO:     '%F0%9F%A5%87',
  DURA:    '%F0%9F%93%97',
  BLANDA:  '%F0%9F%93%95',
  BOLSA:   '%F0%9F%9B%8D',
};
function buildWAUrl(text) {
  let enc = encodeURIComponent(text);
  Object.entries(E).forEach(([key, bytes]) => {
    enc = enc.split('%5B%5B' + key + '%5D%5D').join(bytes);
  });
  return 'https://api.whatsapp.com/send?phone=' + WA_NUMBER + '&text=' + enc;
}
const prodEmoji = (nombre) => {
  if (/caja/i.test(nombre))   return '[[CAJA]]';
  if (/sobre/i.test(nombre))  return '[[SOBRE]]';
  if (/oro/i.test(nombre))    return '[[ORO]]';
  if (/dura/i.test(nombre))   return '[[DURA]]';
  if (/blanda/i.test(nombre)) return '[[BLANDA]]';
  return '[[BOLSA]]';
};
const shortName = (n) => n.replace('\u00C1lbum Panini Mundial 2026 \u2014 ', '');

// Rechaza HTML y patrones de inyección
const noXSS = (v) => !/<|>|javascript:|on\w+=/i.test(v ?? '');

const esquema = Yup.object({
  nombre: Yup.string().trim()
    .required('El nombre es requerido')
    .test('seguro', 'Caracteres no permitidos', noXSS),
  tel: Yup.string().trim()
    .required('El teléfono es requerido')
    .matches(/^[0-9+\s\-()]{7,15}$/, 'Solo números, mínimo 7 dígitos')
    .test('seguro', 'Caracteres no permitidos', noXSS),
  direccion: Yup.string().trim()
    .required('La dirección es requerida')
    .test('seguro', 'Caracteres no permitidos', noXSS),
  barrio: Yup.string().trim()
    .test('seguro', 'Caracteres no permitidos', noXSS),
});

export default function ProductoModal({ producto, onClose }) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState('');
  const [tel, setTel] = useState('');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState(false);
  const [errores, setErrores] = useState({});

  const p = producto;
  const sinStock = p?.stock === 0;
  const imagenSrc =
    p?.imagen_url ||
    `https://placehold.co/400x500/1565c0/ffffff?text=${encodeURIComponent(p?.nombre ?? '')}`;

  const handleClose = () => {
    setStep(1);
    setCantidad(1);
    setNombre('');
    setTel('');
    setDireccion('');
    setBarrio('');
    setErrores({});
    onClose();
  };

  const handleAgregar = () => {
    for (let i = 0; i < cantidad; i++) dispatch(agregarItem(p));
    setSnack(true);
    setTimeout(handleClose, 1200);
  };

  const handleWAConfirm = async () => {
    try {
      await esquema.validate({ nombre, tel, direccion, barrio }, { abortEarly: false });
    } catch (e) {
      const errs = {};
      e.inner.forEach((err) => { errs[err.path] = err.message; });
      setErrores(errs);
      return;
    }
    setErrores({});
    if (!nombre.trim() || !tel.trim() || !direccion.trim()) return;
    setLoading(true);
    try {
      await axiosClient.post('/pedidos', {
        nombre: nombre.trim(),
        telefono: tel.trim(),
        items: [{ ...p, cantidad }],
        total: Number(p.precio) * cantidad,
      });
    } catch (_) {}
    const total = Number(p.precio) * cantidad;
    const lineas = [
      '[[MANO]] \u00A1Hola! Tengo un nuevo pedido',
      '',
      '[[CLIENTE]] *Cliente:* ' + nombre.trim(),
      '[[CIUDAD]] *Ciudad:* Pasto',
      '[[CASA]] *Direcci\u00F3n:* ' + direccion.trim(),
    ];
    if (barrio.trim()) lineas.push('[[BARRIO]] *Barrio:* ' + barrio.trim());
    lineas.push(
      '',
      '[[CAJA]] *Detalle del pedido:*',
      SEP,
      '\u2022 ' + prodEmoji(p.nombre) + ' _' + shortName(p.nombre) + '_\n  *Cantidad:* x' + cantidad + '\n  *Precio unitario:* $' + Number(p.precio).toLocaleString('es-CO'),
      SEP,
      '',
      '[[DINERO]] *TOTAL A PAGAR: $' + total.toLocaleString('es-CO') + '*',
    );
    window.open(
      buildWAUrl(lineas.join('\n')),
      '_blank',
      'noopener,noreferrer',
    );
    setLoading(false);
    handleClose();
  };

  if (!producto) return null;

  return (
    <>
      <Dialog
        open={!!producto}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          backdrop: {
            sx: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)' },
          },
          paper: {
            sx: {
              borderRadius: { xs: '16px', sm: '32px' },
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
              mx: { xs: 1.5, sm: 3 },
            },
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, minHeight: { sm: 480 } }}>

            {/* — Imagen — */}
            <Box
              sx={{
                width: { xs: '100%', sm: '42%' },
                flexShrink: 0,
                bgcolor: '#f0f4f8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 2, sm: 3 },
                minHeight: { xs: 160, sm: 'auto' },
                maxHeight: { xs: 200, sm: 'none' },
              }}
            >
              <Box
                component="img"
                src={imagenSrc}
                alt={p.nombre}
                sx={{ maxWidth: '100%', maxHeight: { xs: 160, sm: 340 }, objectFit: 'contain' }}
              />
            </Box>

            {/* — Detalle — */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 2, sm: 4 },
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflowY: 'auto',
                maxHeight: { xs: '55vh', sm: 'none' },
              }}
            >
              {/* Cerrar */}
              <IconButton
                onClick={handleClose}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: 'rgba(0,0,0,0.06)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.12)' },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              {step === 1 ? (
                <>
                  {p.categoria && (
                    <Chip
                      label={p.categoria}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ alignSelf: 'flex-start', mb: 1.5, fontWeight: 600 }}
                    />
                  )}

                  <Typography fontWeight={900} gutterBottom
                    sx={{ fontSize: { xs: '1.15rem', sm: '1.6rem', md: '1.9rem' }, lineHeight: 1.2, pr: 3 }}>
                    {p.nombre}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.65 }}>
                    {p.descripcion}
                  </Typography>

                  {p.descripcion_larga && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.7, whiteSpace: 'pre-line' }}
                    >
                      {p.descripcion_larga}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box>
                      <Typography fontWeight={900} color="text.primary"
                        sx={{ fontSize: { xs: '1.6rem', sm: '2.2rem', md: '2.6rem' }, lineHeight: 1.1 }}>
                        ${(Number(p.precio) * cantidad).toLocaleString('es-CO')}
                      </Typography>
                      {cantidad > 1 && (
                        <Typography variant="caption" color="text.secondary">
                          ${Number(p.precio).toLocaleString('es-CO')} c/u
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={sinStock ? 'Agotado' : `${p.stock} disponibles`}
                      color={sinStock ? 'error' : 'success'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Typography variant="body2" fontWeight={700}>Cantidad:</Typography>
                    <TextField
                      type="number"
                      value={cantidad}
                      onChange={(e) => {
                        const v = Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 1));
                        setCantidad(v);
                      }}
                      slotProps={{ input: { min: 1, max: 10, inputMode: 'numeric' } }}
                      sx={{ width: 80 }}
                      size="small"
                      disabled={sinStock}
                    />
                    <Typography variant="caption" color="text.secondary">(máx. 10)</Typography>
                  </Box>

                  {/* CTA WhatsApp */}
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={sinStock}
                    startIcon={<WhatsAppIcon />}
                    onClick={() => setStep(2)}
                    sx={{
                      bgcolor: '#25D366',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: { xs: '0.85rem', sm: '1.05rem' },
                      py: { xs: 1.1, sm: 1.6 },
                      borderRadius: 3,
                      boxShadow: '0 6px 24px rgba(37,211,102,0.45)',
                      '&:hover': { bgcolor: '#1ebe5d', boxShadow: '0 8px 30px rgba(37,211,102,0.55)' },
                      mb: 1.5,
                      textTransform: 'none',
                    }}
                  >
                    Comprar por WhatsApp
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AddShoppingCartIcon />}
                    disabled={sinStock}
                    onClick={handleAgregar}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: { xs: '0.8rem', sm: '0.95rem' },
                      py: { xs: 0.9, sm: 1.3 },
                      textTransform: 'none',
                    }}
                  >
                    Agregar al carrito
                  </Button>
                </>
              ) : (
                /* — Paso 2: form WhatsApp — */
                <>
                  <Box sx={{ mb: 2 }}>
                    <IconButton size="small" onClick={() => setStep(1)} sx={{ mr: 1, mb: 0.5 }}>
                      <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="h5" fontWeight={800} component="span">
                      ¡Casi listo!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Te contactamos al WhatsApp que ingreses para confirmar el pedido de{' '}
                      <strong>{p.nombre}</strong>.
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <TextField
                      label="Tu nombre"
                      value={nombre}
                      onChange={(e) => { setNombre(e.target.value); setErrores((p) => ({ ...p, nombre: '' })); }}
                      fullWidth
                      autoFocus
                      disabled={loading}
                      error={!!errores.nombre}
                      helperText={errores.nombre || ''}
                    />
                    <TextField
                      label="Número de WhatsApp"
                      value={tel}
                      onChange={(e) => { setTel(e.target.value); setErrores((p) => ({ ...p, tel: '' })); }}
                      fullWidth
                      placeholder="Ej: 3001234567"
                      slotProps={{ input: { inputMode: 'tel' } }}
                      disabled={loading}
                      error={!!errores.tel}
                      helperText={errores.tel || ''}
                    />
                    <TextField
                      label="Dirección de entrega"
                      value={direccion}
                      onChange={(e) => { setDireccion(e.target.value); setErrores((p) => ({ ...p, direccion: '' })); }}
                      fullWidth
                      placeholder="Ej: Calle 18 #24-12"
                      disabled={loading}
                      error={!!errores.direccion}
                      helperText={errores.direccion || ''}
                    />
                    <TextField
                      label="Barrio (opcional)"
                      value={barrio}
                      onChange={(e) => { setBarrio(e.target.value); setErrores((p) => ({ ...p, barrio: '' })); }}
                      fullWidth
                      placeholder="Ej: Centro"
                      disabled={loading}
                      error={!!errores.barrio}
                      helperText={errores.barrio || ''}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <WhatsAppIcon />}
                    onClick={handleWAConfirm}
                    sx={{
                      bgcolor: '#25D366',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: { xs: '0.85rem', sm: '1.05rem' },
                      py: { xs: 1.1, sm: 1.6 },
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 6px 24px rgba(37,211,102,0.45)',
                      '&:hover': { bgcolor: '#1ebe5d' },
                    }}
                  >
                    Abrir WhatsApp
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snack}
        autoHideDuration={2000}
        onClose={() => setSnack(false)}
        message="¡Agregado al carrito!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
