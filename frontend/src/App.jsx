import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from './store/store';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductoDetalle from './pages/ProductoDetalle';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
});

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    secondary: { main: '#e53935' },
  },
  typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
});

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              {/* Login admin */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Dashboard admin — protegido */}
              <Route element={<ProtectedRoute soloAdmin />}>
                <Route element={<AdminLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
              </Route>

              {/* Catálogo público */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Catalogo />} />
                <Route path="/producto/:id" element={<ProductoDetalle />} />
                <Route path="/carrito" element={<Carrito />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
