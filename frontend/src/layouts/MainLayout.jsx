import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Outlet />
    </Box>
  );
}
