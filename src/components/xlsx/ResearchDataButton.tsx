"use client";

import { useState } from "react";
import { Button, Tooltip, CircularProgress } from "@mui/material";
import { TableView } from "@mui/icons-material";
import { AnimalService } from "../../services/api";
import ExcelJS from "exceljs";

// --- 1. DEFINIÇÃO DAS TIPAGENS ---
interface ResearchTooth {
  id: number;
  toothCode: string;
  toothType: string;
  isPresent: boolean;
  crownReductionLevel: number;
  lingualWear: number;
  pulpChamberExposure: number;
  fractureLevel: number;
  dentalCalculus: number;
  pulpitis: number;
  groove: number; // NOVO: Ranhura
  vitrifiedBorder: number;
  caries: number;
  abnormalColor: number;
  periodontalLesions: number;
  gingivitis: number; // NOVO: Gengivite
  necrotizingGingivitis: number; // NOVO: Gengivite Necrosante
  necrotizingPeriodontitis: number; // NOVO: Periodontite Necrosante
  gingivitisEdema: number;
  pericoronitis: number; // NOVO: Pericoronarite
  // Campos antigos mantidos por compatibilidade
  gingivalRecessionLevel: number;
  gingivitisColor: number;
}

interface ResearchEvaluation {
  id: number;
  evaluatorUserId: number;
  evaluationDate: string;
  generalObservations: string;
  generalGingivitisScore: number;
  teeth: ResearchTooth[];
}

interface ResearchAnimal {
  id: number;
  tagCode: string;
  chip: string | null;
  sisbovNumber: string | null;
  birthDate: string | null;
  currentWeight: number | null;
  breed: string | null;
  farm: string | null;
  lot: string | null;
  client: string | null;
  location: string | null;
  age: number | null;
  collectionDate: string | null;
  bodyScore: number | null;
  coatColor: string | null;
  category: string | null;
  status: string | null;
  createdAt: string;
  dentalEvaluations: ResearchEvaluation[];
}

// --- 2. PALETA DE CORES POR GRUPO DE COLUNAS ---
const COLORS = {
  groupIdentification: "1A5276",
  groupOrigin: "1B4F72",
  groupBiometrics: "4A235A",
  groupEvaluation: "1E8449",
  groupTooth: "784212",
  groupDentalIssues: "7B241C",
  groupGingivalIssues: "6C3483",

  headerIdentification: "2E86C1",
  headerOrigin: "2980B9",
  headerBiometrics: "7D3C98",
  headerEvaluation: "27AE60",
  headerTooth: "CA6F1E",
  headerDentalIssues: "E74C3C",
  headerGingivalIssues: "8E44AD",

  rowEven: "EAF2FF",
  rowOdd: "FFFFFF",

  summaryHeader: "1C2833",
  summaryRow: "D5DBDB",
};

// --- 3. GRUPOS DE COLUNAS (atualizados para 43 colunas) ---
// IDENTIFICAÇÃO:   1–8   (8 cols)
// ORIGEM:          9–12  (4 cols)
// BIOMÉTRICOS:    13–17  (5 cols)
// AVALIAÇÃO:      18–22  (5 cols)
// DENTE:          23–25  (3 cols)
// ALT. DENTÁRIAS: 26–36  (11 cols) ← +1 (groove)
// ALT. GENGIVAIS: 37–43  (7 cols)  ← +4 (gingivitis, necrotizingGingivitis, necrotizingPeriodontitis, pericoronitis)
const COLUMN_GROUPS = [
  {
    start: 1,
    end: 8,
    color: COLORS.headerIdentification,
    groupColor: COLORS.groupIdentification,
    label: "IDENTIFICAÇÃO DO ANIMAL",
  },
  {
    start: 9,
    end: 12,
    color: COLORS.headerOrigin,
    groupColor: COLORS.groupOrigin,
    label: "ORIGEM",
  },
  {
    start: 13,
    end: 17,
    color: COLORS.headerBiometrics,
    groupColor: COLORS.groupBiometrics,
    label: "DADOS BIOMÉTRICOS",
  },
  {
    start: 18,
    end: 22,
    color: COLORS.headerEvaluation,
    groupColor: COLORS.groupEvaluation,
    label: "AVALIAÇÃO GERAL",
  },
  {
    start: 23,
    end: 25,
    color: COLORS.headerTooth,
    groupColor: COLORS.groupTooth,
    label: "DENTE AVALIADO",
  },
  {
    start: 26,
    end: 36,
    color: COLORS.headerDentalIssues,
    groupColor: COLORS.groupDentalIssues,
    label: "ALTERAÇÕES DENTÁRIAS",
  },
  {
    start: 37,
    end: 43,
    color: COLORS.headerGingivalIssues,
    groupColor: COLORS.groupGingivalIssues,
    label: "ALTERAÇÕES GENGIVAIS",
  },
];

const HEADERS = [
  // IDENTIFICAÇÃO (1–8)
  "ID Animal",
  "Brinco",
  "Chip",
  "Sisbov",
  "Categoria",
  "Status",
  "Raça",
  "Pelagem",
  // ORIGEM (9–12)
  "Fazenda",
  "Cliente",
  "Lote",
  "Localização",
  // BIOMÉTRICOS (13–17)
  "Data Nascimento",
  "Idade (meses)",
  "Data Coleta",
  "Peso (kg)",
  "Escore Corporal",
  // AVALIAÇÃO (18–22)
  "ID Avaliação",
  "Data Avaliação",
  "ID Veterinário",
  "Escore Gengivite Geral",
  "Observações",
  // DENTE (23–25)
  "Código Dente",
  "Tipo Dente",
  "Presente",
  // ALTERAÇÕES DENTÁRIAS (26–36)
  "Fratura",
  "Pulpite",
  "Cáries",
  "Redução da Coroa",
  "Desgaste Lingual",
  "Recessão Gengival",
  "Lesão Periodontal",
  "Borda Vitrificada",
  "Exposição da Polpa",
  "Cor Anormal",
  "Ranhura", // NOVO: groove (col 36)
  // ALTERAÇÕES GENGIVAIS (37–43)
  "Edema Gengival",
  "Cor Gengival",
  "Cálculo Dental",
  "Gengivite", // NOVO: gingivitis (col 40)
  "Gengivite Necrosante", // NOVO: necrotizingGingivitis (col 41)
  "Periodontite Necrosante", // NOVO: necrotizingPeriodontitis (col 42)
  "Pericoronarite", // NOVO: pericoronitis (col 43)
];

export default function ResearchDataButton() {
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return "-";
    }
  };

  const translateToothType = (type: string): string => {
    const types: Record<string, string> = {
      PERMANENT: "Permanente",
      DECIDUOUS: "Decíduo",
    };
    return types[type] || type;
  };

  const styleHeaderCell = (
    cell: ExcelJS.Cell,
    bgColor: string,
    bold = true,
    fontSize = 10,
  ) => {
    cell.font = {
      name: "Arial",
      bold,
      size: fontSize,
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${bgColor}` },
    };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FFB0BEC5" } },
      left: { style: "thin", color: { argb: "FFB0BEC5" } },
      bottom: { style: "medium", color: { argb: "FF90A4AE" } },
      right: { style: "thin", color: { argb: "FFB0BEC5" } },
    };
  };

  const styleDataCell = (
    cell: ExcelJS.Cell,
    isEven: boolean,
    isNumeric = false,
    isAlert = false,
  ) => {
    const bg = isEven ? COLORS.rowEven : COLORS.rowOdd;
    cell.font = {
      name: "Arial",
      size: 9,
      color: { argb: isAlert ? "FFCC0000" : "FF1C2833" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${bg}` },
    };
    cell.alignment = {
      horizontal: isNumeric ? "center" : "left",
      vertical: "middle",
    };
    cell.border = {
      top: { style: "hair", color: { argb: "FFD5D8DC" } },
      left: { style: "hair", color: { argb: "FFD5D8DC" } },
      bottom: { style: "hair", color: { argb: "FFD5D8DC" } },
      right: { style: "hair", color: { argb: "FFD5D8DC" } },
    };
  };

  const handleExport = async () => {
    try {
      setLoading(true);

      const response = await AnimalService.getResearchData();
      const animals: ResearchAnimal[] = response.data;

      if (!animals || animals.length === 0) {
        alert("Nenhum dado disponível para exportação.");
        return;
      }

      const wb = new ExcelJS.Workbook();
      wb.creator = "AnimalTools";
      wb.created = new Date();

      // ── ABA 1: DADOS COMPLETOS ──────────────────────────────────────────────
      const ws = wb.addWorksheet("Dados da Pesquisa", {
        views: [{ state: "frozen", xSplit: 0, ySplit: 3 }],
        pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1 },
      });

      // ── LINHA 1: Título principal ──
      ws.mergeCells(1, 1, 1, HEADERS.length);
      const titleCell = ws.getCell(1, 1);
      titleCell.value = "RELATÓRIO DE PESQUISA DENTÁRIA BOVINA";
      titleCell.font = {
        name: "Arial",
        bold: true,
        size: 14,
        color: { argb: "FFFFFFFF" },
      };
      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${COLORS.groupIdentification}` },
      };
      titleCell.alignment = { horizontal: "center", vertical: "middle" };
      ws.getRow(1).height = 30;

      // ── LINHA 2: Labels dos grupos de colunas ──
      COLUMN_GROUPS.forEach(({ start, end, groupColor, label }) => {
        ws.mergeCells(2, start, 2, end);
        const cell = ws.getCell(2, start);
        cell.value = label;
        styleHeaderCell(cell, groupColor, true, 9);
      });
      ws.getRow(2).height = 22;

      // ── LINHA 3: Headers individuais ──
      HEADERS.forEach((header, i) => {
        const colIdx = i + 1;
        const group = COLUMN_GROUPS.find(
          (g) => colIdx >= g.start && colIdx <= g.end,
        );
        const cell = ws.getCell(3, colIdx);
        cell.value = header;
        styleHeaderCell(
          cell,
          group?.color ?? COLORS.headerIdentification,
          true,
          9,
        );
      });
      ws.getRow(3).height = 40;

      // ── LINHAS DE DADOS ──
      let dataRowIdx = 4;

      animals.forEach((animal) => {
        if (!animal.dentalEvaluations?.length) return;

        animal.dentalEvaluations.forEach((evaluation) => {
          const teethList = evaluation.teeth?.length
            ? evaluation.teeth
            : [null];

          teethList.forEach((tooth) => {
            const isEven = dataRowIdx % 2 === 0;

            const rowData = [
              // IDENTIFICAÇÃO (1–8)
              animal.id,
              animal.tagCode || "-",
              animal.chip || "-",
              animal.sisbovNumber || "-",
              animal.category || "-",
              animal.status || "-",
              animal.breed || "-",
              animal.coatColor || "-",
              // ORIGEM (9–12)
              animal.farm || "-",
              animal.client || "-",
              animal.lot || "-",
              animal.location || "-",
              // BIOMÉTRICOS (13–17)
              formatDate(animal.birthDate),
              animal.age ?? "-",
              formatDate(animal.collectionDate),
              animal.currentWeight || "-",
              animal.bodyScore || "-",
              // AVALIAÇÃO (18–22)
              evaluation.id,
              formatDate(evaluation.evaluationDate),
              evaluation.evaluatorUserId || "-",
              evaluation.generalGingivitisScore ?? "-",
              evaluation.generalObservations || "-",
              // DENTE (23–25)
              tooth?.toothCode ?? "-",
              tooth ? translateToothType(tooth.toothType) : "-",
              tooth ? (tooth.isPresent ? "Sim" : "Não") : "-",
              // ALTERAÇÕES DENTÁRIAS (26–36)
              tooth?.fractureLevel ?? "-",
              tooth?.pulpitis ?? "-",
              tooth?.caries ?? "-",
              tooth?.crownReductionLevel ?? "-",
              tooth?.lingualWear ?? "-",
              tooth?.gingivalRecessionLevel ?? "-",
              tooth?.periodontalLesions ?? "-",
              tooth?.vitrifiedBorder ?? "-",
              tooth?.pulpChamberExposure ?? "-",
              tooth?.abnormalColor ?? "-",
              tooth?.groove ?? "-", // NOVO: Ranhura (col 36)
              // ALTERAÇÕES GENGIVAIS (37–43)
              tooth?.gingivitisEdema ?? "-",
              tooth?.gingivitisColor ?? "-",
              tooth?.dentalCalculus ?? "-",
              tooth?.gingivitis ?? "-", // NOVO: Gengivite (col 40)
              tooth?.necrotizingGingivitis ?? "-", // NOVO: Gengivite Necrosante (col 41)
              tooth?.necrotizingPeriodontitis ?? "-", // NOVO: Periodontite Necrosante (col 42)
              tooth?.pericoronitis ?? "-", // NOVO: Pericoronarite (col 43)
            ];

            const row = ws.getRow(dataRowIdx);
            rowData.forEach((value, colI) => {
              const cell = row.getCell(colI + 1);
              cell.value = value as ExcelJS.CellValue;

              // Colunas de pontuação começam na col 26 (índice 25)
              const isNumericCol = colI >= 25;
              const isAlert =
                typeof value === "number" && value > 0 && isNumericCol;
              styleDataCell(cell, isEven, isNumericCol, isAlert);

              if (colI === 0) cell.font = { ...cell.font, bold: true };
            });

            row.height = 18;
            dataRowIdx++;
          });
        });
      });

      // ── LARGURAS DAS COLUNAS (43 colunas) ──
      const colWidths = [
        // IDENTIFICAÇÃO (8)
        8, 12, 18, 18, 22, 10, 14, 12,
        // ORIGEM (4)
        22, 18, 16, 14,
        // BIOMÉTRICOS (5)
        14, 13, 14, 10, 13,
        // AVALIAÇÃO (5)
        11, 14, 13, 16, 30,
        // DENTE (3)
        12, 12, 9,
        // ALTERAÇÕES DENTÁRIAS (11) — +1 groove
        9, 9, 9, 14, 15, 15, 15, 14, 14, 12, 11,
        // ALTERAÇÕES GENGIVAIS (7) — +4 novos
        13, 12, 13, 12, 20, 22, 16,
      ];
      colWidths.forEach((w, i) => {
        ws.getColumn(i + 1).width = w;
      });

      // ── ABA 2: RESUMO ──────────────────────────────────────────────────────
      const wsSummary = wb.addWorksheet("Resumo", {
        views: [{ state: "normal" }],
      });

      const totalAnimals = animals.length;
      const totalEvals = animals.reduce(
        (a, b) => a + (b.dentalEvaluations?.length || 0),
        0,
      );
      const totalTeeth = animals.reduce(
        (a, b) =>
          a +
          (b.dentalEvaluations?.reduce(
            (c, e) => c + (e.teeth?.length || 0),
            0,
          ) || 0),
        0,
      );
      const totalAffected = animals.reduce(
        (a, b) =>
          a +
          (b.dentalEvaluations?.reduce(
            (c, e) =>
              c +
              (e.teeth?.filter(
                (t) =>
                  t.fractureLevel > 0 ||
                  t.caries > 0 ||
                  t.pulpitis > 0 ||
                  t.periodontalLesions > 0 ||
                  t.gingivalRecessionLevel > 0 ||
                  t.dentalCalculus > 0 ||
                  t.crownReductionLevel > 0 ||
                  t.groove > 0 || // NOVO
                  t.gingivitis > 0 || // NOVO
                  t.necrotizingGingivitis > 0 || // NOVO
                  t.necrotizingPeriodontitis > 0 || // NOVO
                  t.pericoronitis > 0, // NOVO
              ).length || 0),
            0,
          ) || 0),
        0,
      );

      // Título da aba resumo
      wsSummary.mergeCells("A1:D1");
      const sumTitle = wsSummary.getCell("A1");
      sumTitle.value = "RESUMO DA PESQUISA DENTÁRIA";
      sumTitle.font = {
        name: "Arial",
        bold: true,
        size: 14,
        color: { argb: "FFFFFFFF" },
      };
      sumTitle.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${COLORS.summaryHeader}` },
      };
      sumTitle.alignment = { horizontal: "center", vertical: "middle" };
      wsSummary.getRow(1).height = 32;

      wsSummary.mergeCells("A2:D2");
      const subTitle = wsSummary.getCell("A2");
      subTitle.value = `Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`;
      subTitle.font = {
        name: "Arial",
        size: 10,
        italic: true,
        color: { argb: "FF555555" },
      };
      subTitle.alignment = { horizontal: "center" };
      wsSummary.getRow(2).height = 20;

      const summaryRows = [
        ["📋 Total de Animais", totalAnimals, "animais avaliados"],
        ["🦷 Total de Avaliações", totalEvals, "avaliações realizadas"],
        ["🔬 Total de Dentes Avaliados", totalTeeth, "registros de dentes"],
        [
          "⚠️ Dentes com Alterações",
          totalAffected,
          `${((totalAffected / totalTeeth) * 100).toFixed(1)}% do total`,
        ],
      ];

      summaryRows.forEach(([label, value, note], i) => {
        const rowIdx = i + 4;
        const row = wsSummary.getRow(rowIdx);
        const isEven = i % 2 === 0;
        const bg = isEven ? "EAF2FF" : "FFFFFF";

        const cellLabel = row.getCell(1);
        cellLabel.value = label as string;
        cellLabel.font = {
          name: "Arial",
          bold: true,
          size: 11,
          color: { argb: "FF1C2833" },
        };
        cellLabel.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: `FF${bg}` },
        };
        cellLabel.alignment = { vertical: "middle" };

        const cellValue = row.getCell(2);
        cellValue.value = value as number;
        cellValue.font = {
          name: "Arial",
          bold: true,
          size: 14,
          color: { argb: `FF${COLORS.groupEvaluation}` },
        };
        cellValue.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: `FF${bg}` },
        };
        cellValue.alignment = { horizontal: "center", vertical: "middle" };

        const cellNote = row.getCell(3);
        cellNote.value = note as string;
        cellNote.font = {
          name: "Arial",
          size: 10,
          italic: true,
          color: { argb: "FF7F8C8D" },
        };
        cellNote.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: `FF${bg}` },
        };
        cellNote.alignment = { vertical: "middle" };

        row.height = 28;

        [cellLabel, cellValue, cellNote].forEach((c) => {
          c.border = {
            top: { style: "thin", color: { argb: "FFD5D8DC" } },
            bottom: { style: "thin", color: { argb: "FFD5D8DC" } },
            left: { style: "thin", color: { argb: "FFD5D8DC" } },
            right: { style: "thin", color: { argb: "FFD5D8DC" } },
          };
        });
      });

      // Legenda de cores
      const legendStartRow = summaryRows.length + 6;
      wsSummary.mergeCells(legendStartRow, 1, legendStartRow, 4);
      const legendTitle = wsSummary.getCell(legendStartRow, 1);
      legendTitle.value = "LEGENDA DE CORES — GRUPOS DE COLUNAS";
      legendTitle.font = {
        name: "Arial",
        bold: true,
        size: 11,
        color: { argb: "FFFFFFFF" },
      };
      legendTitle.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${COLORS.summaryHeader}` },
      };
      legendTitle.alignment = { horizontal: "center" };
      wsSummary.getRow(legendStartRow).height = 22;

      COLUMN_GROUPS.forEach(({ label, color }, i) => {
        const r = legendStartRow + i + 1;
        const cell = wsSummary.getCell(r, 1);
        cell.value = `  ${label}`;
        cell.font = { name: "Arial", size: 10, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: `FF${color}` },
        };
        cell.alignment = { vertical: "middle" };
        wsSummary.getRow(r).height = 20;
        wsSummary.mergeCells(r, 1, r, 4);
      });

      [
        ["A", 38],
        ["B", 14],
        ["C", 28],
        ["D", 10],
      ].forEach(([col, w]) => {
        wsSummary.getColumn(col as string).width = w as number;
      });

      // ── DOWNLOAD ──────────────────────────────────────────────────────────
      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `pesquisa_dentaria_${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert("Erro ao gerar planilha. Verifique o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title="Exportar relatório completo da pesquisa dentária (.xlsx)">
      <Button
        variant="contained"
        sx={{
          textTransform: "none",
          boxShadow: 2,
          bgcolor: "#10b981",
          "&:hover": { bgcolor: "#059669" },
          "&:disabled": { bgcolor: "#94a3b8" },
        }}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <TableView />
          )
        }
        onClick={handleExport}
        disabled={loading}
      >
        {loading ? "Gerando Relatório..." : "Relatório Pesquisa"}
      </Button>
    </Tooltip>
  );
}
