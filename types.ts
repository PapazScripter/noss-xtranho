
export enum CharacterId {
  VINICIUS = 'vinicius',
  KOUTH = 'kouth',
  CARLOS = 'carlos',
  FAB = 'fab',
  MATHEUS = 'matheus',
  RAFA = 'rafa',
  DELIVERY = 'delivery',
  CLERITON = 'cleriton',
  THIAGO = 'thiago',
  DAVID_DEX = 'david_dex',
  AGENT_X = 'agent_x'
}

export interface CharacterData {
  id: CharacterId;
  name: string;
  imageUrl: string;
  baseQuotes: string[]; // Specific quotes from the prompt
  description: string; // Internal description for the AI
  voiceStyle: string; // Clue for the AI on how to speak
  knowledgeBase?: string[]; // Specific Q&A mapping or behavior rules
}

export type InspectionTool = 'eyes' | 'teeth' | 'pockets';

export interface DailyRule {
  day: number;
  headline: string;
  clue: string; // The text the user reads in the newspaper
  mechanic: 'grammar' | 'aggression' | 'repetition' | 'nonsensical' | 'visual_distortion'; // How the AI/Game manifests the anomaly
  unlockedTool?: InspectionTool; // New tool available this day
  newsImage?: string; // Optional image to override the journalist for special reports
}

export interface Body {
  id: string;
  x: number; // Percentage
  y: number; // Percentage
  rotation: number; // Degrees
}

export interface GameState {
  screen: 'studio_intro' | 'start' | 'newspaper' | 'gameplay' | 'night_report' | 'gameover' | 'victory' | 'mushroom_dimension';
  day: number;
  playerAlive: boolean;
  visitorsHandled: number;
  visitorsToday: number;
  score: number;
  dailyRule: DailyRule | null;
  gameOverReason?: string; // Reason for death
  residents: CurrentVisitor[]; // People currently in the living room
  familyCount: number; // Number of innocent family members alive (Health)
  energy: number; // Current energy ("Double Cup")
  maxEnergy: number; // Max energy
  doubleCupStock: number; // Inventory of drinks in kitchen
  pendingOrder: boolean; // Is a delivery coming tomorrow?
  hasUsbDrive: boolean; // Item acquired from Clériton
  hasCdDrive: boolean; // Item acquired from Carlos Brandão
  hasMushroom: boolean; // Item acquired from Vinicius
  hasGuitar: boolean; // Item acquired from Kouth
  visitorsSeenThisDay: string[]; // Track character IDs seen in the current day to prevent repeats
  basementBodies: Body[]; // List of bodies stored in the basement
  agentWarnedAboutSmell: boolean; // True if Agent X has visited and smelled bodies once
}

export interface CurrentVisitor {
  id: string; // Unique instance ID
  character: CharacterData;
  isXtrange: boolean; // True if they are an impostor
  anomalyType: string | null; // Specific quirk if Xtrange
  status: 'waiting' | 'talking' | 'inspected' | 'judged';
  location: 'door' | 'living_room'; // Where the visitor is currently located
  chatHistory: { sender: 'player' | 'visitor' | 'system'; text: string }[];
  capturedImage?: string; // Image of a resident captured by this visitor (Agent X logic)
}