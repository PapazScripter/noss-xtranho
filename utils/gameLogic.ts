
import { CharacterData, DailyRule, CharacterId } from "../types";
import { POCKET_ITEMS, ASSETS } from "../constants";

// Helper to normalize text for comparison (remove accents, punctuation, lowercase)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[?.!]/g, "") // Remove punctuation
    .trim();
};

// Helper to find the pre-written answer in the character's knowledge base
const findCanonicalResponse = (character: CharacterData, question: string): string | null => {
  if (!character.knowledgeBase) return null;
  
  const normQuestion = normalizeText(question);
  
  // Find entry where normalized key matches normalized question
  const entry = character.knowledgeBase.find(line => {
    // Expected format: "q: [question] -> A: [answer]"
    const parts = line.split("->");
    if (parts.length < 2) return false;
    
    const key = parts[0].replace(/^q:\s*/i, ""); // Remove "q: " prefix
    return normalizeText(key) === normQuestion;
  });

  if (entry) {
    const parts = entry.split("-> A: ");
    if (parts.length > 1) {
      let ans = parts[1].trim();
      if ((ans.startsWith("'") && ans.endsWith("'")) || (ans.startsWith('"') && ans.endsWith('"'))) {
        ans = ans.slice(1, -1);
      }
      return ans;
    }
  }
  return null;
};

// Logic to corrupt text via code for Xtranges
const simulateXtrangeCorruption = (text: string, mechanic: string): string => {
  switch (mechanic) {
    case 'repetition':
      const words = text.split(' ');
      if (words.length > 0) {
        // Repeat a random word 3 times
        const target = Math.floor(Math.random() * words.length);
        words[target] = `${words[target]} ${words[target]} ${words[target]}`;
      }
      return words.join(' ');
    case 'grammar':
      return text.replace(/o /g, "a ").replace(/a /g, "o ").replace(/os /g, "is ").replace(/as /g, "us ");
    case 'aggression':
      return text + " ...SEU VERME INÚTIL.";
    case 'nonsensical':
      return text + " As paredes têm gosto de roxo.";
    case 'visual_distortion':
      return text + " (m-minha c-cara d-dói)";
    default:
      return text;
  }
};

interface ChatParams {
  character: CharacterData;
  isXtrange: boolean;
  dailyRule: DailyRule;
  userMessage: string;
}

export const getCharacterResponse = ({
  character,
  isXtrange,
  dailyRule,
  userMessage
}: ChatParams): string => {
  // 1. Find canonical response from constants
  const canonicalAnswer = findCanonicalResponse(character, userMessage);
  let response = canonicalAnswer;

  // Fallback if no specific answer found
  if (!response) {
      const fallbacks = [
          "Não sei do que você está falando.",
          "...",
          "Pode repetir?",
          "Só me deixa entrar.",
          "Eu já disse tudo o que tinha pra dizer."
      ];
      response = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // 2. If Xtrange, apply mechanical corruption
  if (isXtrange) {
    response = simulateXtrangeCorruption(response, dailyRule.mechanic);
  }

  return response;
};

export const getInspectionResult = (
    character: CharacterData,
    tool: 'eyes' | 'teeth' | 'pockets',
    isXtrange: boolean
): { text: string; image?: string } => {
    // Pockets Logic
    if (tool === 'pockets') {
        if (character.id === CharacterId.FAB) {
            return { text: "SISTEMA: Você encontrou um papel timbrado com selo médico: 'LAUDO PSICOLÓGICO: O paciente Fab Godamn sofre de delírios psicóticos. Acredita que objetos inanimados (machado) são familiares. Não representa perigo se a ilusão for respeitada.'" };
        }
        
        if (character.id === CharacterId.CLERITON) {
             return { text: "SISTEMA: Você encontrou um PENDRIVE PRATEADO com a palavra 'TEMPO' escrita à mão. (Item adicionado ao inventário)" };
        }

        if (character.id === CharacterId.CARLOS) {
             return { text: "SISTEMA: Você encontrou um CD-ROM pirata escrito 'HITS DO JAPÃO'. (Item adicionado ao inventário)" };
        }

        if (character.id === CharacterId.VINICIUS) {
             return { text: "SISTEMA: Você encontrou um COGUMELO ESTRANHO que brilha com uma cor roxa pulsante. Parece... comestível?" };
        }

        if (character.id === CharacterId.KOUTH) {
             return { text: "SISTEMA: Você encontrou uma MINI GUITARRA ELÉTRICA. (Item adicionado). OBS: Conecte a guitarra no NOTEBOOK do quarto para usar." };
        }

        // Weed Logic (Matheus always has it, others have a chance)
        const hasWeed = character.id === CharacterId.MATHEUS || Math.random() > 0.85;

        if (hasWeed) {
             if (isXtrange) {
                 return { text: "SISTEMA: INCRIMINADOR: Você encontrou um tijolo de MACONHA PRENSADA (fedida, cheia de galhos e sementes). Típico de um impostor." };
             } else {
                 return { text: "SISTEMA: ALÍVIO: Você encontrou um ziplock com MACONHA NATURAL (SKANK/FLOR). O cheiro é doce e cítrico. É coisa boa (Humano)." };
             }
        }
        
        const item = POCKET_ITEMS[Math.floor(Math.random() * POCKET_ITEMS.length)];
        return { text: `SISTEMA: Você revistou os bolsos e encontrou: ${item}` };
    }

    // Eyes Logic
    if (tool === 'eyes') {
        if (isXtrange) {
            // Randomly choose one of the two Xtrange variations
            const xtrangeEye = Math.random() > 0.5 ? ASSETS.EYE_XTRANGE : ASSETS.EYE_XTRANGE_2;
            return {
                text: "SISTEMA: CAPTURANDO IMAGEM BIOMÉTRICA OCULAR... (Analise a imagem abaixo)",
                image: xtrangeEye
            };
        } else {
            return {
                text: "SISTEMA: CAPTURANDO IMAGEM BIOMÉTRICA OCULAR... (Analise a imagem abaixo)",
                image: ASSETS.EYE_NORMAL
            };
        }
    }

    // Teeth Logic
    if (tool === 'teeth') {
        if (isXtrange) {
            return {
                text: "SISTEMA: CAPTURANDO IMAGEM DENTÁRIA... (Analise a imagem abaixo)",
                image: ASSETS.TEETH_XTRANGE
            };
        } else {
             return {
                text: "SISTEMA: CAPTURANDO IMAGEM DENTÁRIA... (Analise a imagem abaixo)",
                image: ASSETS.TEETH_NORMAL
            };
        }
    }

    return { text: "SISTEMA: Inspeção inconclusiva." };
}
