import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import stadiumBg from '../assets/panini_register.jpg';

export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundImage: `url(${stadiumBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,50,0.6) 0%, rgba(0,0,30,0.75) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 520 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
