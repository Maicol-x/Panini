import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Typography, CircularProgress, Alert, Box, IconButton, Badge,
} from '@mui/material';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector } from 'react-redux';
import { getProductos } from '../api/productos';
import ProductoModal from '../components/ProductoModal';
import heroBg from '../assets/panini_register.webp';

export default function Catalogo() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cantidad = useSelector((s) =>
    s.carrito.items.reduce((acc, i) => acc + i.cantidad, 0)
  );

  const { data: productos = [], isLoading, isError } = useQuery({
    queryKey: ['productos'],
    queryFn: () => getProductos(null),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        position: 'relative',
        
      }}
    >
      {/* Botón carrito flotante */}
      <IconButton
        onClick={() => navigate('/carrito')}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 100,
          backdropFilter: 'blur(12px)',
          background: 'rgba(255, 255, 255, 0)',
          border: '1.5px solid rgba(255, 255, 255, 0)',
          color: '#fff',
          width: { xs: 44, sm: 52 },
          height: { xs: 44, sm: 52 },
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          '&:hover': { background: 'rgba(255,255,255,0.28)' },
        }}
      >
        <Badge badgeContent={cantidad} color="error" max={99}>
          <ShoppingCartIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' } }} />
        </Badge>
      </IconButton>

      {/* Título — esquina superior izquierda */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 12, md: 24 },
          left: { xs: 12, md: 32 },
          zIndex: 2,
          backdropFilter: 'blur(4px)',
          background: 'rgba(0,0,0,0.32)',
          borderRadius: 2,
          px: { xs: 1.2, sm: 2 },
          py: { xs: 0.6, sm: 1 },
          maxWidth: { xs: '65vw', sm: 'none' },
        }}
      >
        <Typography
          sx={{
            color: '#ffd700',
            fontWeight: 700,
            letterSpacing: { xs: 1.5, sm: 3 },
            fontSize: { xs: '0.6rem', sm: '0.75rem' },
            textTransform: 'uppercase',
            display: 'block',
          }}
        >
          Colección oficial
        </Typography>
        <Typography
          fontWeight={900}
          sx={{
            color: '#fff',
            lineHeight: 1.1,
            fontSize: { xs: '1rem', sm: '1.8rem', md: '2.4rem' },
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          Panini FIFA World Cup 2026™
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.75)',
            mt: 0.5,
            fontSize: { xs: '0.65rem', sm: '0.875rem' },
          }}
        >
          Sobres, cajas y álbumes · Entregas en Pasto
        </Typography>
      </Box>

      {/* Productos — anclados sobre el campo (centro-bajo de la imagen) */}
      {isLoading && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
          <CircularProgress sx={{ color: '#fff' }} />
        </Box>
      )}

      {isError && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>No se pudieron cargar los productos. Recarga la página.</Alert>
        </Box>
      )}

      {/* ── MOBILE: cuadrícula 2×3 centrada ── */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '96%',
          zIndex: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1.5,
        }}
      >
        {productos.map((p) => (
          <Box
            key={p.id}
            onClick={() => setSelectedProduct(p)}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '28%',
              transition: 'transform 0.2s',
              '&:active': { transform: 'scale(0.95)' },
              filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.6))',
            }}
          >
            <Box
              component="img"
              src={p.imagen_url || `https://placehold.co/200x260/1565c0/ffffff?text=${encodeURIComponent(p.nombre)}`}
              alt={p.nombre}
              sx={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
            <Box
              sx={{
                mt: 0.5,
                px: 0.8,
                py: 0.4,
                backdropFilter: 'blur(8px)',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: 1.5,
                textAlign: 'center',
                width: '100%',
              }}
            >
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.58rem', lineHeight: 1.2, display: 'block' }}>
                {p.nombre.replace('Álbum Panini Mundial 2026 — ', '').replace('Sobre x', 'x').replace(' láminas', ' lám.')}
              </Typography>
              <Typography sx={{ color: '#ffd700', fontWeight: 900, fontSize: '0.72rem' }}>
                ${Number(p.precio).toLocaleString('es-CO')}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ── DESKTOP: fila 3D sobre el campo ── */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'block' },
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transformStyle: 'preserve-3d',
          perspective: '700px',
          width: { sm: '90%', md: '80%' },
          zIndex: 2,
        }}
      >
        {/* Fila inclinada para simular el plano del campo */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: { sm: 3, md: 5 },
            transform: 'rotateX(10deg)',
            transformOrigin: 'center bottom',
            transformStyle: 'preserve-3d',
          }}
        >
          {productos.map((p, i) => {
            const configs = [
              { imgW: { sm: 105, md: 135 }, ry: '10deg'  },
              { imgW: { sm: 135, md: 175 }, ry: '5deg'   },
              { imgW: { sm: 155, md: 205 }, ry: '0deg'   },
              { imgW: { sm: 135, md: 175 }, ry: '-5deg'  },
              { imgW: { sm: 105, md: 135 }, ry: '-10deg' },
            ];
            const cfg = configs[i] ?? configs[0];

            return (
              <Box
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transform: `rotateX(-10deg) rotateY(${cfg.ry})`,
                  transformOrigin: 'center bottom',
                  transition: 'transform 0.28s ease, filter 0.28s ease',
                  filter: 'drop-shadow(0 20px 12px rgba(0,0,0,0.6))',
                  position: 'relative',
                  zIndex: 1,
                  '&:hover': {
                    transform: `rotateX(-10deg) rotateY(${cfg.ry}) translateY(-20px) scale(1.06)`,
                    filter: 'drop-shadow(0 32px 20px rgba(0,0,0,0.7))',
                    zIndex: 10,
                  },
                }}
              >
                <Box
                  component="img"
                  src={p.imagen_url || `https://placehold.co/260x340/1565c0/ffffff?text=${encodeURIComponent(p.nombre)}`}
                  alt={p.nombre}
                  sx={{ width: cfg.imgW, height: 'auto', objectFit: 'contain', display: 'block', pointerEvents: 'none' }}
                />

                {/* Sombra suelo */}
                <Box
                  sx={{
                    width: '90%',
                    height: 14,
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)',
                    filter: 'blur(3px)',
                    mt: '-6px',
                    mb: 0.75,
                    pointerEvents: 'none',
                  }}
                />

                {/* Nombre y precio */}
                <Box
                  sx={{
                    px: 1.2,
                    py: 0.6,
                    backdropFilter: 'blur(8px)',
                    background: 'rgba(0,0,0,0.55)',
                    borderRadius: 2,
                    textAlign: 'center',
                    width: cfg.imgW,
                    pointerEvents: 'none',
                  }}
                >
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: { sm: '0.72rem', md: '0.8rem' }, display: 'block', lineHeight: 1.2 }}>
                    {p.nombre}
                  </Typography>
                  <Typography sx={{ color: '#ffd700', fontWeight: 900, fontSize: { sm: '0.95rem', md: '1.05rem' }, mt: 0.2 }}>
                    ${Number(p.precio).toLocaleString('es-CO')}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Modal producto */}
      <ProductoModal
        producto={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </Box>
  );
}
