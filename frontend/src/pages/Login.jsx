import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField, Button, Typography, Box, Alert,
  InputAdornment, IconButton, Divider, Paper,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { login } from '../api/auth';
import { setCredenciales } from '../store/authSlice';

const schema = yup.object({
  email: yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es requerida'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mostrarPass, setMostrarPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), mode: 'onChange' });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      dispatch(setCredenciales(data));
      navigate(data.usuario?.rol === 'admin' ? '/dashboard' : '/');
    },
  });

  const onSubmit = (datos) => mutation.mutate(datos);

  return (
    <Box>
      {/* ── Encabezado ── */}
      <Box textAlign="center" mb={2}>
        <Typography
          variant="overline"
          sx={{ color: '#ffd700', fontWeight: 700, letterSpacing: 3, fontSize: 13 }}
        >
          ¡Bienvenido de nuevo!
        </Typography>
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{ color: '#fff', textTransform: 'uppercase', lineHeight: 1.1,
                textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}
        >
          Panini Mundial 2026
        </Typography>
        <Box
          sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.5,
            bgcolor: '#e53935', color: '#fff', px: 2, py: 0.5, borderRadius: 2, mt: 0.5,
          }}
        >
          <EmojiEventsIcon fontSize="small" />
          <Typography variant="caption" fontWeight={700} letterSpacing={2}>
            VENTA EXCLUSIVA · PASTO
          </Typography>
        </Box>
      </Box>

      {/* ── Card ── */}
      <Paper
        elevation={12}
        sx={{
          borderRadius: 4, p: { xs: 3, sm: 4 },
          bgcolor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)',
        }}
      >
        <Typography variant="h6" fontWeight={600} textAlign="center" gutterBottom>
          Iniciá sesión
        </Typography>

        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {mutation.error?.response?.data?.error || 'Error al iniciar sesión'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            autoComplete="email"
            autoFocus
            size="small"
            sx={{ mb: 1.5 }}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />

          <TextField
            label="Contraseña"
            type={mostrarPass ? 'text' : 'password'}
            fullWidth
            autoComplete="current-password"
            size="small"
            sx={{ mb: 2.5 }}
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
            {...register('password')}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            startIcon={<LoginIcon />}
            disabled={mutation.isPending}
            sx={{ fontWeight: 700, py: 1.5, borderRadius: 3 }}
          >
            {mutation.isPending ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography textAlign="center" variant="body2" color="text.secondary">
          ¿No tenés cuenta?{' '}
          <Link to="/register" style={{ color: '#1565c0', fontWeight: 600 }}>
            Registrate y comprá ahora
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
