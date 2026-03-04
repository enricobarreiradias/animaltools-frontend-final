"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Chip,
  Divider,
  LinearProgress,
  Alert,
  Button,
  CardActionArea,
  Paper,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Assessment,
  Warning,
  TrendingUp,
  CalendarToday,
  CheckCircle,
  Sync,
  ListAlt,
  History,
  InsertChartOutlined,
} from "@mui/icons-material";
import { GiCow } from "react-icons/gi";
import { api, AnimalService, AuthService } from "@/services/api";

// --- INTERFACES ---
interface DashboardStats {
  totalAnimals: number;
  evaluated: number;
  critical: number;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle: string;
  onClick?: () => void;
}

export default function DashboardPage() {
  const router = useRouter();
  const theme = useTheme();

  const [stats, setStats] = useState<DashboardStats>({
    totalAnimals: 0,
    evaluated: 0,
    critical: 0,
  });

  const [userRole, setUserRole] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSync = async () => {
    setSyncing(true);
    setSuccessMsg("");
    setError("");
    try {
      await AnimalService.sync();
      setSuccessMsg(
        "Sincronização realizada com sucesso! Recarregando dados...",
      );
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error(err);
      setError("Falha ao sincronizar com o ERP externo.");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        try {
          const userResponse = await AuthService.me();
          const role = userResponse.data?.role || userResponse.data?.user?.role;
          if (role) {
            setUserRole(String(role).toUpperCase());
          }
        } catch (roleErr) {
          console.warn(
            "Aviso: Não foi possível obter as permissões do usuário.",
            roleErr,
          );
        }

        const response = await api.get("/evaluations/dashboard");
        const data = response.data;
        setStats({
          totalAnimals: data.totalAnimals,
          evaluated: data.totalEvaluations,
          critical: data.criticalCases,
        });
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Falha ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
    onClick,
  }: StatCardProps) => (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
        "&:hover": onClick
          ? {
              transform: "translateY(-4px)",
              boxShadow: 4,
              cursor: "pointer",
            }
          : {},
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          position: "absolute",
          top: -15,
          right: -15,
          opacity: 0.08,
          transform: "rotate(15deg) scale(1.2)",
          color: color,
          transition: "transform 0.3s",
        }}
        className="bg-icon"
      >
        {icon}
      </Box>
      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              p={1}
              bgcolor={alpha(color, 0.15)}
              borderRadius={2}
              color={color}
              display="flex"
            >
              {icon}
            </Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight={700}
            >
              {title}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h3"
              fontWeight={800}
              color="text.primary"
              sx={{ letterSpacing: "-1px" }}
            >
              {value}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
            >
              {subtitle}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const QuickActionBtn = ({
    title,
    icon,
    onClick,
    color,
  }: {
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
    color: string;
  }) => (
    <CardActionArea onClick={onClick} sx={{ borderRadius: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          bgcolor: alpha(color, 0.1),
          border: `1px solid ${alpha(color, 0.3)}`,
          color: color,
          transition: "all 0.2s",
          "&:hover": { bgcolor: alpha(color, 0.2), borderColor: color },
        }}
      >
        {icon}
        <Typography variant="body2" fontWeight={600} textAlign="center">
          {title}
        </Typography>
      </Paper>
    </CardActionArea>
  );

  const quickActionGridSize = userRole === "ADMIN" ? 3 : 4;

  return (
    <Box className="fade-in" sx={{ pt: 4, pb: 4 }}>
      {error && (
        <Box mb={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Box
        mb={5}
        display="flex"
        justifyContent="space-between"
        alignItems="end"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Painel de Controle
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bem-vindo! Aqui está o resumo operacional da saúde do seu rebanho.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          {userRole === "ADMIN" && (
            <Button
              variant="contained"
              color="primary"
              startIcon={
                syncing ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Sync />
                )
              }
              onClick={handleSync}
              disabled={syncing}
              sx={{
                height: 40,
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
              }}
            >
              {syncing ? "Sincronizando..." : "Sincronizar"}
            </Button>
          )}

          <Chip
            icon={<CalendarToday sx={{ fontSize: 16 }} />}
            label={new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            variant="outlined"
            sx={{
              bgcolor: "white",
              fontWeight: 500,
              height: 40,
              borderRadius: 2,
            }}
          />
        </Stack>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      <Box mb={4}>
        <Typography variant="h6" fontWeight={700} mb={2} color="text.secondary">
          Ações Rápidas
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: quickActionGridSize }}>
            <QuickActionBtn
              title="Animais Pendentes"
              icon={<ListAlt fontSize="large" />}
              color={theme.palette.primary.main}
              onClick={() => router.push("/pending")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: quickActionGridSize }}>
            <QuickActionBtn
              title="Histórico de Laudos"
              icon={<History fontSize="large" />}
              color={theme.palette.info.main}
              onClick={() => router.push("/history")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: quickActionGridSize }}>
            <QuickActionBtn
              title="Gerar Relatórios"
              icon={<InsertChartOutlined fontSize="large" />}
              color={theme.palette.secondary.main}
              onClick={() => router.push("/reports")}
            />
          </Grid>

          {userRole === "ADMIN" && (
            <Grid size={{ xs: 12, sm: quickActionGridSize }}>
              <QuickActionBtn
                title="Auditoria"
                icon={<CheckCircle fontSize="large" />}
                color={theme.palette.warning.main}
                onClick={() => router.push("/audit")}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          {/* 2. Aplicamos o novo ícone aqui com a tag style para controlar o tamanho */}
          <StatCard
            title="TOTAL DE ANIMAIS"
            value={stats.totalAnimals}
            icon={<GiCow style={{ fontSize: 80 }} />}
            color={theme.palette.primary.main}
            subtitle="Clique para ver os pendentes"
            onClick={() => router.push("/pending")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="LAUDOS EMITIDOS"
            value={stats.evaluated}
            icon={<Assessment sx={{ fontSize: 80 }} />}
            color={theme.palette.info.main}
            subtitle="Clique para ver o histórico"
            onClick={() => router.push("/history")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="CASOS CRÍTICOS"
            value={stats.critical}
            icon={<Warning sx={{ fontSize: 80 }} />}
            color={theme.palette.error.main}
            subtitle="Atenção imediata recomendada"
            onClick={() => router.push("/reports")}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
              >
                <Stack direction="row" alignItems="center" gap={2}>
                  <Box
                    p={1}
                    bgcolor="primary.50"
                    borderRadius={2}
                    display="flex"
                  >
                    <TrendingUp color="primary" />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    Progresso das Avaliações
                  </Typography>
                </Stack>
              </Stack>
              <Divider sx={{ mb: 4 }} />

              <Box py={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1" fontWeight={600}>
                    Conclusão Geral
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color="primary.main"
                  >
                    {stats.totalAnimals > 0
                      ? Math.round((stats.evaluated / stats.totalAnimals) * 100)
                      : 0}
                    %
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    stats.totalAnimals > 0
                      ? (stats.evaluated / stats.totalAnimals) * 100
                      : 0
                  }
                  sx={{
                    height: 16,
                    borderRadius: 8,
                    bgcolor: "#f1f5f9",
                    "& .MuiLinearProgress-bar": { borderRadius: 8 },
                  }}
                />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={500}
                    fontSize="0.875rem"
                  >
                    <strong>{stats.evaluated}</strong> animais avaliados
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={500}
                    fontSize="0.875rem"
                  >
                    <strong>{stats.totalAnimals - stats.evaluated}</strong>{" "}
                    pendentes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
