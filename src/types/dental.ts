export enum SeverityScale {
  NONE = 0, // Saudável / Normal
  MODERATE = 1, // Moderado / Atenção
  SEVERE = 2, // Crítico / Severo
}

export enum ColorScale {
  NORMAL = 0,
  ALTERED = 1,
}

export enum ToothType {
  DECIDUOUS = "DECIDUOUS", // Dente de Leite
  PERMANENT = "PERMANENT", // Dente Permanente
}

export enum ToothCode {
  I1_LEFT = "I1_L", // Pinça Esq
  I1_RIGHT = "I1_R", // Pinça Dir
  I2_LEFT = "I2_L", // Primeiro Médio Esq
  I2_RIGHT = "I2_R", // Primeiro Médio Dir
  I3_LEFT = "I3_L", // Segundo Médio Esq
  I3_RIGHT = "I3_R", // Segundo Médio Dir
  I4_LEFT = "I4_L", // Canto Esq
  I4_RIGHT = "I4_R", // Canto Dir
}

export interface ToothEvaluationData {
  toothCode: ToothCode;
  isPresent: boolean;
  toothType: ToothType;

  // Parâmetros (Nova Ordem do Cliente)
  crownReductionLevel: SeverityScale;
  lingualWear: SeverityScale;
  pulpChamberExposure: SeverityScale;
  fractureLevel: SeverityScale;
  dentalCalculus: SeverityScale;
  pulpitis: SeverityScale;
  groove: SeverityScale; // Novo: Ranhura
  vitrifiedBorder: SeverityScale;
  caries: SeverityScale;
  abnormalColor: ColorScale;
  periodontalLesions: SeverityScale;
  gingivitis: SeverityScale; // Novo: Gengivite
  necrotizingGingivitis: SeverityScale; // Novo: Gengivite Necrosante
  necrotizingPeriodontitis: SeverityScale; // Novo: Periodontite Necrosante
  gingivitisEdema: SeverityScale;
  pericoronitis: SeverityScale; // Novo: Pericoronarite

  // Campos Antigos Ocultos (Mantidos para não quebrar compatibilidade)
  gingivalRecessionLevel: SeverityScale;
  gingivitisColor: ColorScale;
}

export interface EvaluationPayload {
  animalId: string | number;
  evaluatorId: string | number;
  notes: string;
  teeth: ToothEvaluationData[];
}

export enum MoultingStage {
  DL = "DL",
  D2 = "D2",
  D4 = "D4",
  D6 = "D6",
  BC = "BC",
}

// Define a estrutura das fotos processadas pelo teu backend (S3)
export interface AnimalMedia {
  s3UrlPath: string;
  originalDriveUrl: string;
  latitude?: number;
  longitude?: number;
}

export interface Animal {
  id: string;
  code: string;
  tagCode: string; // Mapeia o "n_do_Animal"
  chip: string | null; // Mapeia o "chip"
  sisbovNumber: string | null; // Mapeia o "n_do_SISBOV"

  currentWeight: number | null; // Mapeia o "peso_atual"
  birthDate: string | Date | null; // Mapeia a "data_de_nascimento"
  age: number | null; // Calculado no backend com base no nascimento
  coatColor: string | null; // Mapeia o "nome_pelagem_id"
  breed: string | null; // Mapeia o "nome_raca_id"
  category: string | null; // Mapeia o "nome_categoria_id"

  bodyScore: number | null; // Mapeia o "score_in"
  bodyScoreOut: number | null; // Mapeia o "score_out"

  farm: string | null; // Mapeia o "nome_centro_de_custo_id"
  location: string | null; // Mapeia o "nome_local_de_estoque_id"
  lot: string | null; // Mapeia o "nome_lote_id"

  status: string | null; // Mapeia o "status"
  entryDate: string | Date | null; // Data e hora de "criado"
  collectionDate: string | Date | null;
  externalModificationDate: string | Date | null; // Data e hora de "modificado"
  client?: string;

  media: AnimalMedia[]; // Lista de fotos (já transferidas para o S3 pelo backend)
}
