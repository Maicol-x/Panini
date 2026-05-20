import { AppBar, Toolbar, Typography, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const cantidad = useSelector((s) =>
    s.carrito.items.reduce((acc, i) => acc + i.cantidad, 0)
  );

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1565c0' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontWeight: 700 }}
        >
          Panini Mundial 2026
        </Typography>
        <IconButton color="inherit" onClick={() => navigate('/carrito')}>
          <Badge badgeContent={cantidad} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
