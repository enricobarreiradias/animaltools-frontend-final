"use client";

import { Box, Paper, Typography, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ToothCode, SeverityScale } from "../types/dental";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const getToothSeverity = (data: any) => {
  if (!data || !data.isPresent) return SeverityScale.NONE;

  // --- ALTERAÇÃO AQUI: Adicionamos os novos campos na lista de severidade ---
  const severityValues = [
    data.crownReductionLevel,
    data.lingualWear,
    data.pulpChamberExposure,
    data.fractureLevel,
    data.dentalCalculus,
    data.pulpitis,
    data.groove, // Novo
    data.vitrifiedBorder,
    data.caries,
    data.periodontalLesions,
    data.gingivitis, // Novo
    data.necrotizingGingivitis, // Novo
    data.necrotizingPeriodontitis, // Novo
    data.gingivitisEdema,
    data.pericoronitis, // Novo
  ];

  return Math.max(...severityValues.map((v) => Number(v) || 0));
};

// Cores baseadas na severidade
const getSeverityColor = (level: number) => {
  if (level >= SeverityScale.SEVERE) return "#ef4444";
  if (level === SeverityScale.MODERATE) return "#facc15";
  return "#e2e8f0";
};

const ToothButton = styled(Paper)<{ selected?: boolean; severity: number }>(
  ({ theme, selected, severity }) => ({
    width: 60,
    height: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: selected
      ? `3px solid ${theme.palette.primary.main}`
      : "2px solid transparent",
    backgroundColor: getSeverityColor(severity),
    transition: "all 0.2s ease",
    borderRadius: "0 0 16px 16px",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.shadows[4],
    },
  }),
);

interface DentalArchProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  teethData: Record<string, any>;
  selectedTooth: string | null;
  onSelectTooth: (code: string) => void;
}

export default function DentalArch({
  teethData,
  selectedTooth,
  onSelectTooth,
}: DentalArchProps) {
  // Lado Esquerdo da TELA (Corresponde ao lado DIREITO do animal na foto frontal)
  const screenLeftTeeth = [
    ToothCode.I4_RIGHT,
    ToothCode.I3_RIGHT,
    ToothCode.I2_RIGHT,
    ToothCode.I1_RIGHT,
  ];

  // Lado Direito da TELA (Corresponde ao lado ESQUERDO do animal na foto frontal)
  const screenRightTeeth = [
    ToothCode.I1_LEFT,
    ToothCode.I2_LEFT,
    ToothCode.I3_LEFT,
    ToothCode.I4_LEFT,
  ];

  const renderTooth = (code: string, label: string) => {
    const data = teethData[code] || { isPresent: true };

    const maxSeverity = getToothSeverity(data);

    // O displayCode pega apenas o prefixo (Ex: "I1_L" vira "I1")
    const displayCode = code.split("_")[0].replace(/\D/g, ""); // "1", "2"...

    return (
      <Tooltip title={`${label} - ${code}`} key={code} placement="top">
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight="bold"
          >
            {displayCode}
          </Typography>

          <ToothButton
            elevation={1}
            selected={selectedTooth === code}
            severity={maxSeverity}
            onClick={() => onSelectTooth(code)}
            sx={{ opacity: data.isPresent ? 1 : 0.4 }}
          >
            {/* Exibe o número apenas se tiver algum problema (> 0) */}
            {maxSeverity > 0 && (
              <Typography variant="h6" fontWeight="900" sx={{ opacity: 0.7 }}>
                {maxSeverity}
              </Typography>
            )}
            {!data.isPresent && (
              <Typography variant="caption" sx={{ fontSize: 10 }}>
                AUSENTE
              </Typography>
            )}
          </ToothButton>
        </Box>
      </Tooltip>
    );
  };

  return (
    <Box
      p={3}
      bgcolor="#f8fafc"
      borderRadius={4}
      border="1px dashed #cbd5e1"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="overline" color="text.secondary" gutterBottom>
        Arcada Inferior (Visão Frontal Espelhada)
      </Typography>

      <Box display="flex" gap={4} mt={2}>
        {/* Lado Esquerdo da TELA renderiza os dentes DIREITOS */}
        <Box display="flex" gap={1}>
          {screenLeftTeeth.map((code) =>
            renderTooth(code, "Lado Direito do Animal"),
          )}
        </Box>

        {/* Divisor Central (Linha média) */}
        <Box
          width={2}
          height={60}
          bgcolor="#cbd5e1"
          borderRadius={1}
          alignSelf="center"
        />

        {/* Lado Direito da TELA renderiza os dentes ESQUERDOS */}
        <Box display="flex" gap={1}>
          {screenRightTeeth.map((code) =>
            renderTooth(code, "Lado Esquerdo do Animal"),
          )}
        </Box>
      </Box>

      {/* Legenda para Regra 0-1-2 */}
      <Box mt={3} display="flex" gap={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            width={12}
            height={12}
            bgcolor="#e2e8f0"
            borderRadius="50%"
            border="1px solid #cbd5e1"
          />
          <Typography variant="caption">Normal (0)</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box width={12} height={12} bgcolor="#facc15" borderRadius="50%" />
          <Typography variant="caption">Moderado (1)</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box width={12} height={12} bgcolor="#ef4444" borderRadius="50%" />
          <Typography variant="caption" fontWeight="bold">
            Crítico (2)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
