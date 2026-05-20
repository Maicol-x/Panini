import {
  Container, Typography, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Box, IconButton, Tooltip, CircularProgress, Alert, Stack,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQuery } from '@tanstack/react-query';
import { getPedidos, getStats } from '../api/pedidos';

function StatCard({ title, value, icon, color }) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        borderLeft: `5px solid ${color}`,
        height: '100%',
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            bgcolor: `${color}18`,
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            color,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={800}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const {
    data: pedidos,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({ queryKey: ['pedidos'], queryFn: getPedidos });

  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: getStats });

  const formatFecha = (iso) =>
    new Date(iso).toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatPrecio = (n) =>
    `$${Number(n).toLocaleString('es-CO')}`;

  const abrirWA = (telefono) => {
    const num = telefono.replace(/\D/g, '');
    const waNum = num.startsWith('57') ? num : `57${num}`;
    window.open(`https://wa.me/${waNum}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      {/* Encabezado */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Resumen de ventas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Todos los pedidos recibidos por WhatsApp
          </Typography>
        </Box>
        <Tooltip title="Actualizar datos">
          <IconButton
            onClick={() => refetch()}
            disabled={isFetching}
            sx={{ bgcolor: 'white', boxShadow: 1 }}
          >
            {isFetching ? (
              <CircularProgress size={20} />
            ) : (
              <RefreshIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total pedidos"
            value={stats?.total_pedidos ?? '—'}
            icon={<ShoppingBagIcon />}
            color="#1565c0"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Ingresos totales"
            value={stats ? formatPrecio(stats.ingresos_totales) : '—'}
            icon={<AttachMoneyIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Clientes únicos"
            value={stats?.total_clientes ?? '—'}
            icon={<PeopleIcon />}
            color="#e53935"
          />
        </Grid>
      </Grid>

      {/* Tabla de pedidos */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Pedidos recientes
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          No se pudieron cargar los pedidos. Verifica que el backend esté corriendo.
        </Alert>
      )}

      {!isLoading && !isError && (
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#1a237e' }}>
                  {['#', 'Cliente', 'Teléfono', 'Productos', 'Total', 'Fecha'].map((h) => (
                    <TableCell
                      key={h}
                      sx={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidos?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      Aún no hay pedidos. ¡Comparte el catálogo!
                    </TableCell>
                  </TableRow>
                )}
                {pedidos?.map((p, idx) => (
                  <TableRow
                    key={p.id}
                    hover
                    sx={{ bgcolor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}
                  >
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        #{p.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={600}>{p.nombre}</Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2">{p.telefono}</Typography>
                        <Tooltip title={`Abrir WhatsApp con ${p.nombre}`}>
                          <IconButton
                            size="small"
                            sx={{ color: '#25D366' }}
                            onClick={() => abrirWA(p.telefono)}
                          >
                            <WhatsAppIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {Array.isArray(p.items) &&
                          p.items.map((item, i) => (
                            <Chip
                              key={i}
                              label={`${item.nombre} ×${item.cantidad}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: 11 }}
                            />
                          ))}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={700} color="success.dark">
                        {formatPrecio(p.total)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary" whiteSpace="nowrap">
                        {formatFecha(p.created_at)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}
    </Container>
  );
}
