import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField, Button, Typography, Box, Alert,
  InputAdornment, IconButton, Divider, LinearProgress, Paper,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { register } from '../api/auth';
import { setCredenciales } from '../store/authSlice';

const schema = yup.object({
  nombre: yup
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .required('El nombre es requerido'),
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .matches(/[A-Z]/, 'Debe tener al menos una mayúscula')
    .matches(/[0-9]/, 'Debe tener al menos un número')
    .required('La contraseña es requerida'),
  confirmar: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmá tu contraseña'),
});

function calcularFuerza(password = '') {
  let f = 0;
  if (password.length >= 6)  f += 25;
  if (password.length >= 10) f += 25;
  if (/[A-Z]/.test(password)) f += 25;
  if (/[0-9]/.test(password)) f += 25;
  return f;
}
const colores = ['error', 'warning', 'warning', 'success', 'success'];
const labels  = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mostrarPass, setMostrarPass] = useState(false);

  const {
    register: field,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), mode: 'onChange' });

  const passwordActual = watch('password', '');
  const fuerza = calcularFuerza(passwordActual);
  const nivel  = Math.round(fuerza / 25);

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      dispatch(setCredenciales(data));
      navigate('/');
    },
  });

  const onSubmit = ({ confirmar, ...datos }) => mutation.mutate(datos);

  return (
    <Box>
      {/* ── Encabezado fuera de la card ── */}
      <Box textAlign="center" mb={2}>
        <Typography
          variant="overline"
          sx={{ color: '#ffd700', fontWeight: 700, letterSpacing: 3, fontSize: 13 }}
        >
          ¡Prepárate para la emoción!
        </Typography>
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            color: '#fff',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            textShadow: '0 2px 12px rgba(0,0,0,0.7)',
          }}
        >
          Panini Mundial 2026
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: '#e53935',
            color: '#fff',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            mt: 0.5,
          }}
        >
          <EmojiEventsIcon fontSize="small" />
          <Typography variant="caption" fontWeight={700} letterSpacing={2}>
            VENTA EXCLUSIVA · PASTO
          </Typography>
        </Box>

        <Typography
          variant="subtitle1"
          sx={{ color: '#ffffffcc', mt: 1.5, fontWeight: 500 }}
        >
          COMPRA YA Y LLENA TU ÁLBUM
        </Typography>
        <Typography variant="body2" sx={{ color: '#ffffff99' }}>
          Asegurá tus cajas antes de que se agoten.
        </Typography>
      </Box>

      {/* ── Card del formulario ── */}
      <Paper
        elevation={12}
        sx={{
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
          bgcolor: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {mutation.error?.response?.data?.error || 'Error al registrarse'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Nombre completo"
            fullWidth
            autoComplete="name"
            autoFocus
            size="small"
            sx={{ mb: 1.5 }}
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
            {...field('nombre')}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            autoComplete="email"
            size="small"
            sx={{ mb: 1.5 }}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...field('email')}
          />

          <TextField
            label="Contraseña"
            type={mostrarPass ? 'text' : 'password'}
            fullWidth
            autoComplete="new-password"
            size="small"
            sx={{ mb: 0.5 }}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setMostrarPass((v) => !v)} edge="end" size="small">
                    {mostrarPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...field('password')}
          />

          {passwordActual && (
            <Box sx={{ mb: 1.5 }}>
              <LinearProgress
                variant="determinate"
                value={fuerza}
                color={colores[nivel]}
                sx={{ borderRadius: 2, height: 5 }}
              />
              <Typography variant="caption" color={`${colores[nivel]}.main`}>
                Contraseña {labels[nivel]}
              </Typography>
            </Box>
          )}

          <TextField
            label="Confirmar contraseña"
            type={mostrarPass ? 'text' : 'password'}
            fullWidth
            autoComplete="new-password"
            size="small"
            sx={{ mb: 2.5 }}
            error={!!errors.confirmar}
            helperText={errors.confirmar?.message}
            {...field('confirmar')}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={mutation.isPending}
            startIcon={<WhatsAppIcon />}
            sx={{
              bgcolor: '#25D366',
              '&:hover': { bgcolor: '#1ebe5d' },
              fontWeight: 700,
              fontSize: 16,
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
            }}
          >
            {mutation.isPending ? 'Registrando...' : '¡COMPRAR AHORA POR WHATSAPP!'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography textAlign="center" variant="body2" color="text.secondary">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: '#1565c0', fontWeight: 600 }}>
            Ingresá para ver tus pedidos
          </Link>
        </Typography>

        <Typography
          textAlign="center"
          variant="caption"
          color="text.disabled"
          display="block"
          mt={1}
        >
          Precios especiales por volumen · Entregas inmediatas en Pasto
        </Typography>
      </Paper>
    </Box>
  );
}
