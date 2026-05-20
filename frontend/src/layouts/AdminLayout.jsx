import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../store/authSlice';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      <AppBar position="sticky" sx={{ bgcolor: '#1a237e' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Panini Admin · Mundial 2026
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => {
              dispatch(cerrarSesion());
              navigate('/login');
            }}
          >
            Salir
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
