"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
  Paper,
  Snackbar,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
import { AuthService } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const theme = useTheme();

  // Estados do Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Novos estados para a notificação flutuante (Snackbar)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // --- LÓGICA DE AUTO-LOGIN E RECUPERAÇÃO DE ROTA DA AWS ---
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const hash = window.location.hash;

      if (hash && hash.startsWith("#!")) {
        const intendedPath = hash.replace("#!", "");
        router.push(intendedPath);
      } else {
        router.push("/dashboard");
      }
    }
  }, [router]);

  // Função do Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await AuthService.login({ email, password });

      const { accessToken, user } = response.data;

      if (accessToken) {
        localStorage.setItem("token", accessToken);

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        router.push("/dashboard");
      } else {
        setError("Token não recebido. Tente novamente.");
      }
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Email ou senha incorretos.");
      } else {
        setError("Erro ao conectar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com botões ainda não implementados
  const handleNotImplemented = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Função para fechar o Snackbar
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return; // Evita fechar se o usuário clicar fora da notificação
    }
    setSnackbarOpen(false);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Box display="flex" justifyContent="center" mb={4}>
          <Image
            src="/logoFull.png"
            alt="VirtualVet Logo"
            width={240}
            height={110}
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>

        <Paper
          elevation={4}
          sx={{
            borderRadius: 4,
            padding: { xs: 4, sm: 5 },
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h5"
              fontWeight={700}
              color="text.primary"
              gutterBottom
            >
              Bem-vindo(a)!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Por favor, insira suas credenciais para acessar a plataforma.
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2, fontSize: "0.875rem" }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              required
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />

            <TextField
              fullWidth
              required
              label="Senha"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                "&:hover": {
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.6)}`,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Acessar o Sistema"
              )}
            </Button>
          </Box>

          {/* Links de ajuda com a nova função */}
          <Box
            mt={4}
            display="flex"
            justifyContent="center"
            gap={1}
            flexWrap="wrap"
          >
            <Button
              variant="text"
              size="small"
              onClick={() =>
                handleNotImplemented(
                  "Para redefinir sua senha, contate o administrador do sistema.",
                )
              }
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              Esqueci minha senha
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              •
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() =>
                handleNotImplemented(
                  "Suporte Técnico: suporte@virtualvet.com.br",
                )
              }
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              Preciso de ajuda
            </Button>
          </Box>
        </Paper>

        <Box mt={4}>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="center"
          >
            © {new Date().getFullYear()} VirtualVet. Todos os direitos
            reservados.
          </Typography>
        </Box>
      </Container>

      {/* Componente Snackbar Flutuante */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} // Fica na tela por 4 segundos
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
