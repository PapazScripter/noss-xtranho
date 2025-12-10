
import React, { useState, useEffect, useRef } from 'react';
import { CharacterId, CharacterData, GameState, CurrentVisitor, InspectionTool, Body } from './types';
import { CHARACTERS, ASSETS, DAILY_RULES, TOTAL_DAYS, VISITORS_PER_DAY, PLAYER_QUESTIONS, ENERGY_COSTS, SOCIAL_FEED, PHONE_NUMBER, XTERMINADORES_PHONE } from './constants';
import { getCharacterResponse, getInspectionResult } from './utils/gameLogic';
import { playAmbience, stopAmbience, playSFX, playMusic, stopMusic, playGuitarString } from './utils/audio';
import { DialogueBox } from './components/DialogueBox';
import { CharacterView } from './components/CharacterView';

// Helper to get random character
const getRandomCharacter = (excludeIds: string[] = []): CharacterData => {
  const available = Object.values(CHARACTERS).filter(c => !excludeIds.includes(c.id));
  if (available.length === 0) return Object.values(CHARACTERS)[0];
  return available[Math.floor(Math.random() * available.length)];
};

// Helper to get random questions
const getRandomQuestions = (count: number): string[] => {
  const shuffled = [...PLAYER_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const App: React.FC = () => {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>({
    screen: 'studio_intro',
    day: 1,
    playerAlive: true,
    visitorsHandled: 0,
    visitorsToday: 0,
    score: 0,
    dailyRule: DAILY_RULES[0],
    residents: [],
    familyCount: 5,
    energy: 100,
    maxEnergy: 100,
    doubleCupStock: 0,
    pendingOrder: false,
    hasUsbDrive: false,
    hasCdDrive: false,
    hasMushroom: false,
    hasGuitar: false,
    visitorsSeenThisDay: [],
    basementBodies: [],
    agentWarnedAboutSmell: false
  });

  const [currentVisitor, setCurrentVisitor] = useState<CurrentVisitor | null>(null);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [view, setView] = useState<'door' | 'living_room' | 'bedroom' | 'kitchen' | 'basement' | 'cemetery'>('door');
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);
  const [roomMessage, setRoomMessage] = useState<string | null>(null);
  const [inspectionImage, setInspectionImage] = useState<string | null>(null);
  const [energyFlash, setEnergyFlash] = useState(false);
  const [isTraveling, setIsTraveling] = useState(false);
  
  // Bedroom/Laptop State
  const [showLaptop, setShowLaptop] = useState(false);
  const [laptopMode, setLaptopMode] = useState<'desktop' | 'feed' | 'usb' | 'cd' | 'guitar'>('desktop');
  const [showPhone, setShowPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  
  // Laptop Apps State
  const [isXrarOpen, setIsXrarOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Mechanic States
  const [isMatheusTrapActive, setIsMatheusTrapActive] = useState(false);
  const [isShooting, setIsShooting] = useState(false);
  const [buryingAnim, setBuryingAnim] = useState(false);
  
  // Cemetery New Mechanics
  const [cemeteryPhase, setCemeteryPhase] = useState<'arrived' | 'digging'>('arrived');
  const [cemeteryTimer, setCemeteryTimer] = useState(30); // 30 Seconds Difficulty
  const [burialProgress, setBurialProgress] = useState(0);
  const [isJumpscareActive, setIsJumpscareActive] = useState(false);

  // --- EFFECTS ---
  
  // Audio Ambience Management
  useEffect(() => {
    if (gameState.screen === 'gameplay' && !isTraveling) {
       playAmbience(view);
    } else {
       stopAmbience();
       stopMusic();
    }
  }, [view, gameState.screen, isTraveling]);

  // Studio Intro Timer
  useEffect(() => {
    if (gameState.screen === 'studio_intro') {
        playSFX('intro_boom');
        const timer = setTimeout(() => {
            setGameState(prev => ({ ...prev, screen: 'start' }));
        }, 5000);
        return () => clearTimeout(timer);
    }
  }, [gameState.screen]);

  // Cemetery Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (view === 'cemetery' && gameState.screen === 'gameplay' && !isTraveling) {
        // Reset timer when entering is handled in travel function, this is countdown
        interval = setInterval(() => {
            setCemeteryTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleCemeteryDeath();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, gameState.screen, isTraveling]);

  // --- HELPERS ---
  const consumeEnergy = (amount: number): boolean => {
    if (gameState.energy >= amount) {
      setGameState(prev => ({ ...prev, energy: prev.energy - amount }));
      return true;
    } else {
      setEnergyFlash(true);
      playSFX('error');
      setTimeout(() => setEnergyFlash(false), 500);
      return false;
    }
  };

  const handleDrinkDoubleCup = () => {
     if (gameState.doubleCupStock <= 0) {
         setRoomMessage("SEM ESTOQUE DE DOUBLE CUP!");
         playSFX('error');
         return;
     }
     
     if (gameState.energy >= gameState.maxEnergy) {
         setRoomMessage("ENERGIA JÁ ESTÁ CHEIA!");
         return;
     }

     playSFX('drink');
     setGameState(prev => ({
         ...prev,
         energy: Math.min(prev.maxEnergy, prev.energy + 50),
         doubleCupStock: prev.doubleCupStock - 1
     }));
     setRoomMessage("GLUG GLUG... ENERGIA RESTAURADA.");
     setTimeout(() => setRoomMessage(null), 2000);
  };

  const handleEatMushroom = () => {
      setRoomMessage("VOCÊ COMEU O COGUMELO...");
      playSFX('drink');
      setTimeout(() => {
          setGameState(prev => ({ ...prev, screen: 'mushroom_dimension' }));
      }, 3000);
  };

  const handleGoToCemetery = () => {
      setIsTraveling(true);
      playSFX('click');
      setTimeout(() => {
          setView('cemetery');
          setCemeteryPhase('arrived'); // Reset to arrival phase
          setCemeteryTimer(30); // Harder time limit
          setBurialProgress(0); // Reset progress
          setIsTraveling(false);
      }, 4000);
  };

  const handleReturnHome = () => {
      setIsTraveling(true);
      playSFX('click');
      setTimeout(() => {
          setView('basement');
          setIsTraveling(false);
      }, 4000);
  };

  const handleCemeteryDeath = () => {
      playSFX('jumpscare_loud');
      setIsJumpscareActive(true);
      setTimeout(() => {
          setIsJumpscareActive(false);
          setGameState(prev => ({
              ...prev,
              screen: 'gameover',
              gameOverReason: "VOCÊ FICOU MUITO TEMPO NA ESCURIDÃO. ELES TE PEGARAM."
          }));
      }, 2000); // Display jumpscare for 2s then game over
  };

  const handleBuryInteraction = () => {
      if (gameState.basementBodies.length === 0) {
          setRoomMessage("NENHUM CORPO PARA ENTERRAR.");
          playSFX('error');
          return;
      }
      
      // Changed Logic: Per Click cost is lower, but need many clicks
      if (!consumeEnergy(ENERGY_COSTS.DIG)) {
          setRoomMessage("SEM ENERGIA PARA CAVAR!");
          return;
      }

      setBuryingAnim(true);
      playSFX('shovel');
      
      // HARDER: Less progress per click (Requires 25 clicks)
      const progressIncrement = 4; 
      const newProgress = burialProgress + progressIncrement;

      if (newProgress >= 100) {
           // Body Buried
           setGameState(prev => ({
              ...prev,
              basementBodies: prev.basementBodies.slice(0, -1)
           }));
           setBurialProgress(0);
           setRoomMessage("CORPO ENTERRADO!");
           playSFX('success');
      } else {
           setBurialProgress(newProgress);
      }

      setTimeout(() => {
          setBuryingAnim(false);
          if (newProgress < 100) setRoomMessage(null);
      }, 150); // Faster reset for spam clicking
  };

  // --- GAME LOOP LOGIC ---

  const startGame = () => {
    playSFX('click');
    setGameState({
      screen: 'newspaper',
      day: 1,
      playerAlive: true,
      visitorsHandled: 0,
      visitorsToday: 0,
      score: 0,
      dailyRule: DAILY_RULES[0],
      residents: [],
      familyCount: 5,
      energy: 100,
      maxEnergy: 100,
      doubleCupStock: 0,
      pendingOrder: false,
      hasUsbDrive: false,
      hasCdDrive: false,
      hasMushroom: false,
      hasGuitar: false,
      visitorsSeenThisDay: [],
      basementBodies: [],
      agentWarnedAboutSmell: false
    });
  };

  const startNextDay = () => {
    if (gameState.day >= TOTAL_DAYS) {
      setGameState(prev => ({ ...prev, screen: 'victory' }));
      return;
    }
    const nextDay = gameState.day + 1;
    setGameState(prev => ({
      ...prev,
      screen: 'newspaper',
      day: nextDay,
      visitorsToday: 0,
      dailyRule: DAILY_RULES.find(r => r.day === nextDay) || DAILY_RULES[0],
      energy: 100, // Refill Energy
      visitorsSeenThisDay: [] // Reset daily tracking
    }));
    
    // Clear door for next day
    setCurrentVisitor(null);
    setView('door');
    setRoomMessage(null);
  };

  const spawnVisitor = () => {
    playSFX('knock');
    
    // Delivery Logic: If order pending, spawn Delivery Guy first
    if (gameState.pendingOrder) {
        setGameState(prev => ({ ...prev, pendingOrder: false }));
        const deliveryChar = CHARACTERS[CharacterId.DELIVERY];
        
        setCurrentVisitor({
            id: Date.now().toString(),
            character: deliveryChar,
            isXtrange: false, // Delivery guy is always human
            anomalyType: null,
            status: 'waiting',
            location: 'door',
            chatHistory: [{ sender: 'visitor', text: "Entrega do Sprite Plug. Assina aqui." }]
        });
        setCurrentOptions(getRandomQuestions(3));
        return;
    }

    // Filter out characters already in the house
    const residentIds = gameState.residents.map(r => r.character.id);
    // Filter out characters seen today
    const seenIds = gameState.visitorsSeenThisDay;
    
    const excludedIds = [...residentIds, ...seenIds];
    
    // Logic for Character Selection Constraints
    let char = getRandomCharacter(excludedIds);
    
    // Force Matheus logic: From Day 3 onwards, high chance if not seen yet
    if (gameState.day >= 3 && !excludedIds.includes(CharacterId.MATHEUS)) {
        if (Math.random() < 0.4) char = CHARACTERS[CharacterId.MATHEUS];
    }

    // Force Kouth logic: Increase chance if no guitar
    if (!gameState.hasGuitar && !excludedIds.includes(CharacterId.KOUTH)) {
        if (Math.random() < 0.35) char = CHARACTERS[CharacterId.KOUTH];
    }
    
    // Force Agent X logic: Increase chance if Day >= 2
    if (gameState.day >= 2 && !excludedIds.includes(CharacterId.AGENT_X)) {
         if (Math.random() < 0.4) char = CHARACTERS[CharacterId.AGENT_X];
    }

    // Agent X constraint: Only appears Day 2+ (Was 3+)
    while (char.id === CharacterId.AGENT_X && gameState.day < 2) {
        char = getRandomCharacter(excludedIds);
    }
    
    // Thiago constraint: Only appears Day 2+
    while (char.id === CharacterId.THIAGO && gameState.day < 2) {
        char = getRandomCharacter(excludedIds);
    }

    // Determine Xtrange Status
    const alwaysXtrangeList = [CharacterId.MATHEUS, CharacterId.VINICIUS, CharacterId.KOUTH, CharacterId.THIAGO];
    const alwaysHumanList = [CharacterId.FAB, CharacterId.DELIVERY, CharacterId.CLERITON, CharacterId.DAVID_DEX, CharacterId.CARLOS, CharacterId.AGENT_X];
    
    let isXtrange = false;
    if (alwaysXtrangeList.includes(char.id)) {
      isXtrange = true;
    } else if (alwaysHumanList.includes(char.id)) {
      isXtrange = false;
    } else {
      isXtrange = Math.random() > 0.5;
    }

    // --- DIALOGUE SETUP & SPECIAL MECHANICS ---
    let initialQuote = char.baseQuotes[Math.floor(Math.random() * char.baseQuotes.length)];
    let initialOptions = getRandomQuestions(3);
    let trapActive = false;

    // MATHEUS TRAP LOGIC
    if (char.id === CharacterId.MATHEUS && isXtrange && gameState.residents.length === 0) {
        trapActive = true;
        initialQuote = "Voce ta sozinho em casa?";
        initialOptions = ["Sim, estou sozinho.", "Não, tem gente comigo."];
    }

    // AGENT X SMELL LOGIC
    if (char.id === CharacterId.AGENT_X && gameState.basementBodies.length > 0) {
        initialQuote = "Sniff... Sniff... Que cheiro é esse vindo lá de baixo? Cheiro de... podridão.";
        initialOptions = [
            "Tem corpos aqui dentro, eu matei.", // Confession -> Instant Arrest
            "Estão fazendo um ritual aqui dentro.", // Lie
            "O esgoto estourou, já chamei o encanador." // Lie
        ];
    }

    setCurrentVisitor({
      id: Date.now().toString(),
      character: char,
      isXtrange: isXtrange,
      anomalyType: isXtrange ? gameState.dailyRule?.mechanic || 'unknown' : null,
      status: 'waiting',
      location: 'door',
      chatHistory: [{ sender: 'visitor', text: initialQuote }]
    });

    setIsMatheusTrapActive(trapActive);
    setCurrentOptions(initialOptions);
    
    // Track seen visitor
    setGameState(prev => ({
        ...prev,
        visitorsSeenThisDay: [...prev.visitorsSeenThisDay, char.id]
    }));
  };

  const triggerMatheusJumpscare = () => {
     playSFX('shoot'); // Loud noise
     setGameState(prev => ({
         ...prev,
         screen: 'gameover',
         gameOverReason: "VOCÊ CAIU NA ARMADILHA. MATHEUS ATACOU VOCÊ NA CASA VAZIA."
     }));
  };

  const triggerAgentArrest = () => {
      playSFX('jumpscare_loud');
      setGameState(prev => ({
          ...prev,
          screen: 'gameover',
          gameOverReason: "VOCÊ FOI PRESO PELA FORÇA TÁTICA XTERMINADORES. CORPOS ENCONTRADOS NO PORÃO."
      }));
  };

  const handleNextVisitor = () => {
    if (gameState.visitorsToday + 1 >= VISITORS_PER_DAY) {
       setGameState(prev => ({ ...prev, visitorsToday: prev.visitorsToday + 1 }));
       setCurrentVisitor(null);
    } else {
      setGameState(prev => ({ ...prev, visitorsToday: prev.visitorsToday + 1 }));
      spawnVisitor();
    }
  };

  const handleDoorDecision = (allowed: boolean) => {
    if (!currentVisitor) return;
    playSFX(allowed ? 'success' : 'click');

    // Delivery Guy Special Case
    if (currentVisitor.character.id === CharacterId.DELIVERY && allowed) {
        setGameState(prev => ({
            ...prev,
            doubleCupStock: prev.doubleCupStock + 3,
            score: prev.score + 50
        }));
        setRoomMessage("ENTREGA RECEBIDA: +3 DOUBLE CUPS");
        setTimeout(() => setRoomMessage(null), 3000);
        setCurrentVisitor(null);
        handleNextVisitor();
        return;
    }

    // Agent X Special Cases
    if (currentVisitor.character.id === CharacterId.AGENT_X && allowed) {
        // CASE: ARRESTED FOR BODIES
        if (gameState.basementBodies.length > 0) {
            triggerAgentArrest();
            return;
        }

        // CASE: TAKING RESIDENT
        if (gameState.residents.length > 0) {
            // Take the last resident
            const victim = gameState.residents[gameState.residents.length - 1];
            
            // Update Agent X visual to show captured victim
            setCurrentVisitor(prev => prev ? ({
                ...prev,
                capturedImage: victim.character.imageUrl,
                chatHistory: [...prev.chatHistory, { sender: 'visitor', text: `O indivíduo ${victim.character.name} foi detido para análise. Agradecemos a cooperação.` }]
            }) : null);

            // Remove resident from house
            setGameState(prev => ({
                ...prev,
                residents: prev.residents.slice(0, -1)
            }));
            
            // Delay leaving to show the visual
            setTimeout(() => {
                setCurrentVisitor(null);
                handleNextVisitor();
            }, 4000);
            return;
        } else {
             // No one to take
             setCurrentVisitor(prev => prev ? ({
                ...prev,
                chatHistory: [...prev.chatHistory, { sender: 'visitor', text: `Residência vazia. Prosseguindo para o próximo setor.` }]
            }) : null);
             setTimeout(() => {
                setCurrentVisitor(null);
                handleNextVisitor();
            }, 2000);
            return;
        }
    }

    if (allowed) {
      const resident = { 
        ...currentVisitor, 
        location: 'living_room' as const,
        chatHistory: [...currentVisitor.chatHistory, { sender: 'visitor' as const, text: "Obrigado... é bom estar dentro." }] 
      };

      setGameState(prev => ({
        ...prev,
        residents: [...prev.residents, resident]
      }));

      setCurrentVisitor(null);
      handleNextVisitor();
      
    } else {
      if (currentVisitor.isXtrange) {
        setGameState(prev => ({ ...prev, score: prev.score + 100 }));
      } else {
        setGameState(prev => ({ ...prev, score: prev.score + 50 })); 
      }
      setCurrentVisitor(null);
      handleNextVisitor();
    }
  };

  const handleKillResident = (residentId: string) => {
    if (!gameState.residents.find(r => r.id === residentId)) return;
    
    if (!consumeEnergy(ENERGY_COSTS.SHOOT)) {
        setRoomMessage("SEM ENERGIA PARA ATIRAR!");
        return;
    }

    setIsShooting(true);
    playSFX('shoot');

    setTimeout(() => {
        setIsShooting(false);
        
        const resident = gameState.residents.find(r => r.id === residentId);
        if (resident) {
            const isXtrange = resident.isXtrange;
            const msg = isXtrange 
                ? `ALVO ELIMINADO: ${resident.character.name} ERA UM XTRANHOS (+150 PTS)`
                : `VOCÊ MATOU UM INOCENTE: ${resident.character.name} ERA HUMANO (-200 PTS)`;

            setRoomMessage(msg);
            
            // Generate Random Position for body in basement
            const newBody: Body = {
                id: Date.now().toString(),
                x: Math.random() * 60 + 20, // 20% to 80% width
                y: Math.random() * 15 + 65, // 65% to 80% height (floor area)
                rotation: Math.random() * 40 - 20 // -20 to 20 deg
            };

            setGameState(prev => ({
                ...prev,
                residents: prev.residents.filter(r => r.id !== residentId),
                score: isXtrange ? prev.score + 150 : prev.score - 200,
                basementBodies: [...prev.basementBodies, newBody]
            }));
            
            setSelectedResidentId(null);
        }
    }, 500); // Wait for anim
  };

  const handleInspection = (tool: InspectionTool) => {
      if (view === 'living_room') {
           if (!selectedResidentId || isTyping) return;
           
           if (!consumeEnergy(ENERGY_COSTS.INSPECT)) {
             setRoomMessage("PRECISA DE MAIS DOUBLE CUP!");
             return;
           }

           const resident = gameState.residents.find(r => r.id === selectedResidentId);
           if (!resident) return;

           setIsTyping(true);
           setRoomMessage("ANALISANDO SUJEITO...");
           setInspectionImage(null);
           playSFX('scan');

           // Logic delay
           setTimeout(() => {
               const result = getInspectionResult(resident.character, tool, resident.isXtrange);
               
               // Unlock Items Logic
               if (resident.character.id === CharacterId.CLERITON && tool === 'pockets') {
                   setGameState(prev => ({ ...prev, hasUsbDrive: true }));
               }
               if (resident.character.id === CharacterId.CARLOS && tool === 'pockets') {
                   setGameState(prev => ({ ...prev, hasCdDrive: true }));
               }
               if (resident.character.id === CharacterId.VINICIUS && tool === 'pockets') {
                   setGameState(prev => ({ ...prev, hasMushroom: true }));
               }
               if (resident.character.id === CharacterId.KOUTH && tool === 'pockets') {
                   setGameState(prev => ({ ...prev, hasGuitar: true }));
               }

               setRoomMessage(result.text);
               if (result.image) {
                   setInspectionImage(result.image);
               }
               setIsTyping(false);
           }, 1500);
      }
  }
  
  const handleScan = () => {
    if (!selectedResidentId) return;
    if (!consumeEnergy(ENERGY_COSTS.SCAN)) {
        setRoomMessage("PRECISA DE MAIS DOUBLE CUP!");
        setScanMode(false);
        return;
    }
    playSFX('scan');
    setScanMode(true);
  }

  const handleOptionClick = (optionText: string) => {
    // If Matheus Trap is active, any click triggers death
    if (isMatheusTrapActive) {
        triggerMatheusJumpscare();
        return;
    }

    if (!currentVisitor || isTyping) return;

    if (!consumeEnergy(ENERGY_COSTS.CHAT)) return;
    playSFX('click');
    
    const updatedHistory = [...currentVisitor.chatHistory, { sender: 'player' as const, text: optionText }];
    
    setCurrentVisitor(prev => prev ? ({ ...prev, chatHistory: updatedHistory }) : null);
    setIsTyping(true);
    setCurrentOptions([]); 
    playSFX('typing');

    // --- SPECIAL INTERACTION: AGENT X SMELL ---
    if (currentVisitor.character.id === CharacterId.AGENT_X && gameState.basementBodies.length > 0) {
        setTimeout(() => {
            let reply = "";
            let triggerDeath = false;
            let triggerLeave = false;

            if (optionText === "Tem corpos aqui dentro, eu matei.") {
                reply = "Mãos na cabeça agora! Você está preso por homicídio doloso!";
                triggerDeath = true;
            } else {
                // Lying (Ritual or Plumbing)
                if (gameState.agentWarnedAboutSmell) {
                    // Second time -> Arrest
                    reply = "Eu te avisei na última vez. O cheiro continua. Saia da frente, eu vou entrar agora!";
                    triggerDeath = true;
                } else {
                    // First time -> Warning
                    reply = "Tudo bem, volto depois para pegar alguma pessoa na sua casa, agora o cheiro ta muito forte. Acho melhor voce resolver isso logo, quando eu voltar, irei entrar de qualquer forma, e irei ver realmente oque estar acontecendo ai!";
                    triggerLeave = true;
                }
            }

            setCurrentVisitor(prev => prev ? ({
                ...prev,
                chatHistory: [...prev.chatHistory, { sender: 'visitor', text: reply }]
            }) : null);
            setIsTyping(false);

            if (triggerDeath) {
                setTimeout(triggerAgentArrest, 5000);
            } else if (triggerLeave) {
                setTimeout(() => {
                    setGameState(prev => ({ ...prev, agentWarnedAboutSmell: true }));
                    setCurrentVisitor(null);
                    handleNextVisitor();
                }, 12000);
            }

        }, 1500);
        return;
    }

    // Standard Interaction
    setTimeout(() => {
      const aiResponse = getCharacterResponse({
        character: currentVisitor.character,
        isXtrange: currentVisitor.isXtrange,
        dailyRule: gameState.dailyRule!,
        userMessage: optionText
      });

      setIsTyping(false);

      setCurrentVisitor(prev => {
        if (!prev) return null;
        return {
          ...prev,
          chatHistory: [...prev.chatHistory, { sender: 'visitor' as const, text: aiResponse }]
        };
      });
      
      setCurrentOptions(getRandomQuestions(3));
    }, 1500);
  };

  const handlePhoneCall = () => {
      if (phoneInput === PHONE_NUMBER) {
          setGameState(prev => ({ ...prev, pendingOrder: true }));
          setPhoneMessage("PEDIDO CONFIRMADO. ENTREGA AMANHÃ.");
          playSFX('success');
      } else if (phoneInput === XTERMINADORES_PHONE) {
          setPhoneMessage("XTERMINADORES: FIQUE SEGURO. ESTAMOS A CAMINHO.");
          playSFX('scan');
      } else {
          setPhoneMessage("NÚMERO INVÁLIDO.");
          playSFX('error');
      }
      setTimeout(() => setPhoneMessage(""), 3000);
  };

  // --- RENDERERS ---

  const renderLaptop = () => {
    const isWindowOpen = laptopMode !== 'desktop';
    let windowTitle = '';
    let windowContent = null;

    // Content Switching
    if (laptopMode === 'feed') {
        windowTitle = 'Internet Explorer - Rede Oculta';
        windowContent = (
            <div className="space-y-6 text-green-500 font-mono">
                <div className="bg-gray-200 p-1 border-b border-gray-400 flex items-center gap-2 mb-2 text-black font-sans text-xs">
                    <span>Address:</span>
                    <div className="bg-white border border-gray-400 px-2 py-0.5 w-full overflow-hidden whitespace-nowrap">www.deepweb.gov/restricted</div>
                    <button className="bg-green-600 text-white px-2 rounded">GO</button>
                </div>
                
                <div className="bg-black p-4 min-h-[300px]">
                    <div className="text-center text-red-600 border-b border-red-900 pb-2 mb-4 animate-pulse">
                        <h2 className="text-xl font-bold tracking-widest">REDE OCULTA GOVERNAMENTAL</h2>
                        <p className="text-xs">ACESSO NÃO AUTORIZADO DETECTADO...</p>
                    </div>
                    {SOCIAL_FEED.map(post => (
                        <div key={post.id} className="bg-gray-900/30 border-l-2 border-green-800 p-4 mb-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-2 font-bold">
                                <span className="text-green-600">USR: {post.user}</span>
                                <span>{post.date}</span>
                            </div>
                            <p className="mb-3 text-sm text-green-400 leading-relaxed">{post.text}</p>
                            <div className="border border-green-900/50 p-1 bg-black/50">
                                <img src={post.image} alt="Feed content" className="w-full h-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } else if (laptopMode === 'usb') {
        windowTitle = 'Pendrive (F:)';
        windowContent = (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-black font-sans bg-white">
                {!isXrarOpen ? (
                    <div onClick={() => setIsXrarOpen(true)} className="cursor-pointer text-center group p-4 hover:bg-blue-100 border border-transparent hover:border-blue-300 rounded">
                        <div className="w-16 h-16 bg-[url('https://img.icons8.com/color/96/winrar.png')] bg-contain bg-no-repeat bg-center mb-1 mx-auto"></div>
                        <span>TEMPO.ZIP</span>
                    </div>
                ) : !isVideoOpen ? (
                    <div className="border border-gray-400 shadow-lg w-full max-w-sm bg-[#ECE9D8]">
                        <div className="bg-gradient-to-r from-[#0058EE] to-[#3593FF] text-white px-2 py-1 text-xs flex justify-between">
                            <span>XRAR Archiver</span>
                            <button onClick={() => setIsXrarOpen(false)} className="bg-[#D7402B] px-1 text-[10px] font-bold">X</button>
                        </div>
                        <div className="bg-white p-2 h-32 border m-1 border-gray-400">
                            <div onClick={() => setIsVideoOpen(true)} className="cursor-pointer hover:bg-blue-600 hover:text-white flex items-center gap-2 p-1 text-sm">
                                <span className="text-yellow-500">📄</span> 2020.mp4
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center bg-black p-2">
                        <img src="https://i.ibb.co/rRnhJWhh/f67470be-d255-11f0-8aad-0e646caa791e-0.gif" className="max-h-[300px] border border-gray-600" alt="Video" />
                        <button onClick={() => setIsVideoOpen(false)} className="mt-2 text-white hover:text-red-400 text-sm">[FECHAR VÍDEO]</button>
                    </div>
                )}
            </div>
        );
    } else if (laptopMode === 'cd') {
        windowTitle = 'Windows Media Player';
        windowContent = (
            <div className="flex flex-col items-center justify-center h-full bg-black text-white p-4">
                <div className={`w-24 h-24 rounded-full border-4 border-gray-600 flex items-center justify-center mb-4 ${isPlayingMusic ? 'animate-spin' : ''}`}>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-800 to-black flex items-center justify-center">
                        <span className="text-xs text-gray-500">CD</span>
                    </div>
                </div>
                <div className="text-center mb-6">
                    <p className="text-lg font-bold text-green-400">HITS DO JAPÃO</p>
                    <p className="text-sm text-gray-400">Track 01: Previa.mp3</p>
                </div>
                <div className="flex gap-4">
                    <button 
                    onClick={() => {
                        if (isPlayingMusic) {
                            stopMusic();
                            setIsPlayingMusic(false);
                        } else {
                            playMusic('http://som.brasilplaygames.com.br/som/japones previa.mp3');
                            setIsPlayingMusic(true);
                        }
                    }}
                    className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center border-2 border-gray-400"
                    >
                        {isPlayingMusic ? '❚❚' : '▶'}
                    </button>
                </div>
            </div>
        );
    } else if (laptopMode === 'guitar') {
        windowTitle = 'Marshall Amp Sim v2.0';
        windowContent = (
            <div className="flex flex-col items-center justify-center h-full bg-[#111]">
                <div className="w-full max-w-sm bg-[#222] border-4 border-[#111] p-4 relative shadow-inner">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_5px_red]"></div>
                    <h2 className="text-center font-bold text-2xl text-[#ddd] font-serif mb-6 tracking-widest italic">Marshall</h2>
                    
                    {/* Strings */}
                    <div className="flex justify-between px-6 h-40 items-center relative bg-[#050505] border-2 border-gray-700 shadow-inner">
                        {[82.4, 110, 146.8, 196, 246.9, 329.6].map((freq, i) => (
                            <div 
                            key={i}
                            onMouseDown={() => {
                                playGuitarString(freq);
                                const el = document.getElementById(`string-${i}`);
                                if(el) {
                                    el.style.transform = "translateX(1px)";
                                    setTimeout(() => el.style.transform = "translateX(0)", 100);
                                }
                            }}
                            className="h-full w-6 flex justify-center cursor-pointer hover:bg-white/5 transition-colors relative group"
                            >
                                <div id={`string-${i}`} className={`h-full bg-gray-400 transition-all shadow-[0_0_2px_rgba(255,255,255,0.3)] ${i < 3 ? 'w-[2px]' : 'w-[1px]'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden">
          {/* XP DESKTOP BACKGROUND */}
          <div className="w-full h-full bg-gradient-to-b from-[#3b87d9] to-[#68a736] relative overflow-hidden">
              
              {/* Desktop Icons - z-0 to stay behind window */}
              <div className="absolute top-4 left-4 grid grid-cols-1 gap-6 z-0">
                  {/* Internet Explorer */}
                  <div 
                    onClick={() => setLaptopMode('feed')}
                    className="flex flex-col items-center gap-1 cursor-pointer w-20 group text-white text-shadow-md"
                  >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-600 shadow-md group-hover:bg-blue-200">
                          <span className="text-blue-600 font-serif font-bold text-xl">e</span>
                      </div>
                      <span className="text-xs text-center drop-shadow-md bg-transparent group-hover:bg-blue-700/50 px-1 rounded">Internet</span>
                  </div>

                  {/* My Computer - USB */}
                  {gameState.hasUsbDrive && (
                      <div 
                        onClick={() => setLaptopMode('usb')}
                        className="flex flex-col items-center gap-1 cursor-pointer w-20 group text-white text-shadow-md"
                      >
                          <div className="w-10 h-10 bg-[url('https://img.icons8.com/color/96/usb-memory-stick.png')] bg-contain bg-no-repeat bg-center drop-shadow-md"></div>
                          <span className="text-xs text-center drop-shadow-md bg-transparent group-hover:bg-blue-700/50 px-1 rounded">Pendrive (F:)</span>
                      </div>
                  )}

                  {/* My Computer - CD */}
                  {gameState.hasCdDrive && (
                      <div 
                        onClick={() => setLaptopMode('cd')}
                        className="flex flex-col items-center gap-1 cursor-pointer w-20 group text-white text-shadow-md"
                      >
                          <div className="w-10 h-10 bg-[url('https://img.icons8.com/color/96/cd--v1.png')] bg-contain bg-no-repeat bg-center drop-shadow-md"></div>
                          <span className="text-xs text-center drop-shadow-md bg-transparent group-hover:bg-blue-700/50 px-1 rounded">CD Drive (D:)</span>
                      </div>
                  )}

                  {/* Amp Sim */}
                  {gameState.hasGuitar && (
                      <div 
                        onClick={() => setLaptopMode('guitar')}
                        className="flex flex-col items-center gap-1 cursor-pointer w-20 group text-white"
                      >
                          <div className="w-10 h-10 bg-gray-800 border-2 border-gray-400 flex items-center justify-center text-[8px] font-mono text-white shadow-md">AMP</div>
                          <span className="text-xs text-center drop-shadow-md group-hover:bg-blue-700/50 px-1 rounded">Marshall.exe</span>
                      </div>
                  )}
              </div>

              {/* WINDOW - z-20 to be on top of icons */}
              {isWindowOpen && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[640px] h-[80%] md:h-[480px] bg-[#ECE9D8] rounded-t-lg shadow-2xl flex flex-col font-sans border-[3px] border-[#0055EA] z-20">
                      {/* Title Bar */}
                      <div className="h-8 bg-gradient-to-r from-[#0058EE] via-[#3593FF] to-[#0058EE] flex justify-between items-center px-2 rounded-t-sm select-none">
                        <span className="text-white font-bold drop-shadow-md text-sm italic flex items-center gap-2 truncate">
                             {windowTitle}
                        </span>
                        <button 
                          onClick={() => setLaptopMode('desktop')} 
                          className="w-5 h-5 bg-[#D7402B] border border-white rounded-[3px] text-white flex items-center justify-center text-xs font-bold hover:bg-[#ff5555] shadow-inner flex-shrink-0"
                        >
                          X
                        </button>
                      </div>
                      
                      {/* Menu Bar (Fake) */}
                      <div className="bg-[#ECE9D8] border-b border-gray-400 p-1 text-xs flex gap-2 text-black select-none hidden md:flex">
                          <span className="hover:bg-blue-600 hover:text-white px-1 cursor-default">File</span>
                          <span className="hover:bg-blue-600 hover:text-white px-1 cursor-default">Edit</span>
                          <span className="hover:bg-blue-600 hover:text-white px-1 cursor-default">View</span>
                          <span className="hover:bg-blue-600 hover:text-white px-1 cursor-default">Help</span>
                      </div>

                      {/* Content Area */}
                      <div className="flex-grow bg-white p-0 overflow-auto text-black border-2 border-gray-300 m-1 inset-shadow">
                         {windowContent}
                      </div>
                  </div>
              )}

              {/* Taskbar */}
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-[#245DDA] to-[#1941A5] border-t-2 border-[#386FEA] flex items-center px-0 z-50">
                  <button 
                    onClick={() => setShowLaptop(false)}
                    className="h-full px-4 bg-gradient-to-b from-[#3C8033] to-[#25561B] rounded-r-xl border-r-2 border-[#549E48] flex items-center gap-1 hover:brightness-110 active:brightness-90 transition-all"
                  >
                      <span className="font-bold text-white italic text-shadow-md pr-2">start</span>
                  </button>
                  <div className="flex-grow"></div>
                  <div className="h-full bg-[#1291D2] border-l border-[#0F75AA] px-4 flex items-center text-white text-xs font-sans">
                      11:42 PM
                  </div>
              </div>
          </div>
      </div>
    );
  };

  const renderPhone = () => (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full border-4 border-gray-300">
              <div className="text-center mb-4">
                  <div className="w-16 h-1 bg-gray-300 mx-auto rounded mb-4"></div>
                  <input 
                    type="text" 
                    value={phoneInput} 
                    readOnly 
                    className="w-full bg-gray-100 text-3xl text-center py-2 font-mono tracking-widest border rounded"
                    placeholder="___-___"
                  />
                  <p className="text-xs text-red-500 mt-2 font-bold h-4">{phoneMessage}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                      <button 
                        key={n}
                        onClick={() => { playSFX('click'); setPhoneInput(prev => prev.length < 9 ? prev + n : prev); }}
                        className="w-16 h-16 bg-gray-200 rounded-full text-2xl font-bold text-gray-700 hover:bg-gray-300 active:bg-gray-400 mx-auto"
                      >
                          {n}
                      </button>
                  ))}
                  <button 
                    onClick={() => { playSFX('click'); setPhoneInput(prev => prev.length < 9 ? prev + '0' : prev); }}
                    className="w-16 h-16 bg-gray-200 rounded-full text-2xl font-bold text-gray-700 hover:bg-gray-300 active:bg-gray-400 col-start-2 mx-auto"
                  >
                      0
                  </button>
              </div>
              <div className="flex gap-4">
                  <button 
                    onClick={() => { setPhoneInput(""); setPhoneMessage(""); setShowPhone(false); }}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600"
                  >
                      CANCEL
                  </button>
                  <button 
                    onClick={handlePhoneCall}
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600"
                  >
                      CALL
                  </button>
              </div>
          </div>
      </div>
  );

  const renderBedroomView = () => {
    const isShiftOver = gameState.visitorsToday >= VISITORS_PER_DAY;

    return (
        <div className="flex h-screen w-screen bg-black relative overflow-hidden">
            <div className="crt absolute inset-0 z-50 pointer-events-none"></div>
            {renderHUD()}
            {renderNavControls()}
            
            {showLaptop && renderLaptop()}
            {showPhone && renderPhone()}

            <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${ASSETS.BEDROOM})` }}
            >
                {/* Dark overlay for atmosphere */}
                <div className="absolute inset-0 bg-black/40"></div>
                
                {/* Laptop Hotspot - Bottom Left on Chair/Bed */}
                <div 
                    onClick={() => { playSFX('click'); setShowLaptop(true); }}
                    className="absolute bottom-[5%] left-[35%] w-[25%] h-[20%] cursor-pointer hover:bg-white/5 border border-transparent hover:border-white/20 transition-all rounded-lg z-10"
                    title="Open Laptop"
                ></div>

                {/* Visible Phone Asset */}
                <img 
                    src={ASSETS.PHONE} 
                    alt="Phone" 
                    onClick={() => { playSFX('click'); setShowPhone(true); }}
                    className="absolute top-[45%] right-[25%] w-12 h-20 cursor-pointer hover:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] z-10"
                    title="Use Phone"
                />
            </div>

            <div className="z-10 absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 {isShiftOver ? (
                     <div className="text-center space-y-4 bg-black/70 p-8 border border-gray-600 backdrop-blur-sm pointer-events-auto">
                         <h2 className="text-3xl text-green-500 font-mono tracking-widest">TURNO FINALIZADO</h2>
                         <p className="text-gray-300 font-mono">Você sobreviveu a mais um dia.</p>
                         <p className="text-gray-400 text-sm font-mono">Pode dormir agora. (Provavelmente)</p>
                         <button 
                            onClick={() => {
                                // Night Phase Logic
                                let damage = 0;
                                let report = [];
                                gameState.residents.forEach(r => {
                                  if (r.isXtrange) {
                                    damage++;
                                    report.push(`${r.character.name} era um Xtrange.`);
                                  }
                                });
                                const newFamily = gameState.familyCount - damage;
                                if (newFamily <= 0) {
                                   setGameState(prev => ({ ...prev, screen: 'gameover', gameOverReason: "TODOS OS SEUS FAMILIARES MORRERAM." }));
                                } else {
                                   setGameState(prev => ({ 
                                       ...prev, 
                                       screen: 'night_report', 
                                       familyCount: newFamily,
                                       gameOverReason: damage > 0 ? `Você perdeu ${damage} familiar(es) esta noite.` : "Noite segura. Sem baixas."
                                   }));
                                }
                            }}
                            className="mt-4 px-8 py-3 bg-blue-900 border-2 border-blue-500 text-blue-200 hover:bg-blue-800 hover:text-white transition-all text-xl font-mono uppercase cursor-pointer animate-pulse"
                         >
                            [ DORMIR ]
                         </button>
                     </div>
                 ) : null}
            </div>
        </div>
    );
  };
  
  const renderHUD = () => (
    <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-black/80 border border-purple-500 p-2 rounded-lg">
      <div className={`w-10 h-10 ${energyFlash ? 'animate-bounce' : ''}`}>
        <img src={ASSETS.ENERGY_ICON} className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col">
          <span className="text-purple-400 font-bold font-mono text-xs leading-none mb-1">DOUBLE CUP</span>
          <div className="w-24 h-3 bg-gray-900 border border-gray-700 relative">
             <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${(gameState.energy / gameState.maxEnergy) * 100}%` }}></div>
          </div>
          <span className="text-xs text-white font-mono leading-none mt-1">{gameState.energy}%</span>
      </div>
    </div>
  );

  const renderNavControls = () => (
    <div className="absolute top-4 right-4 z-50 flex gap-2 flex-wrap justify-end">
        <button onClick={() => setView('door')} disabled={view === 'door'} className={`px-3 py-1 font-bold font-mono border-2 cursor-pointer ${view === 'door' ? 'bg-red-600 text-black border-red-800 pointer-events-none' : 'bg-gray-800 text-gray-400 border-gray-600 hover:text-white'}`}>CAM 01: PORTA</button>
        <button onClick={() => setView('living_room')} disabled={view === 'living_room'} className={`px-3 py-1 font-bold font-mono border-2 cursor-pointer ${view === 'living_room' ? 'bg-red-600 text-black border-red-800 pointer-events-none' : 'bg-gray-800 text-gray-400 border-gray-600 hover:text-white'}`}>CAM 02: SALA</button>
        <button onClick={() => setView('bedroom')} disabled={view === 'bedroom'} className={`px-3 py-1 font-bold font-mono border-2 cursor-pointer ${view === 'bedroom' ? 'bg-red-600 text-black border-red-800 pointer-events-none' : 'bg-gray-800 text-gray-400 border-gray-600 hover:text-white'}`}>CAM 03: CAMA</button>
        <button onClick={() => setView('kitchen')} disabled={view === 'kitchen'} className={`px-3 py-1 font-bold font-mono border-2 cursor-pointer ${view === 'kitchen' ? 'bg-red-600 text-black border-red-800 pointer-events-none' : 'bg-gray-800 text-gray-400 border-gray-600 hover:text-white'}`}>CAM 04: COZINHA</button>
        <button onClick={() => setView('basement')} disabled={view === 'basement'} className={`px-3 py-1 font-bold font-mono border-2 cursor-pointer ${view === 'basement' ? 'bg-red-600 text-black border-red-800 pointer-events-none' : 'bg-gray-800 text-gray-400 border-gray-600 hover:text-white'}`}>CAM 05: PORÃO</button>
    </div>
  );

  // Other render functions (Kitchen, Living Room, Door, Intro, News, etc.)
  const renderKitchenView = () => (
    <div className="flex h-screen w-screen bg-black relative overflow-hidden">
        <div className="crt absolute inset-0 z-50 pointer-events-none"></div>
        {renderHUD()}
        {renderNavControls()}
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${ASSETS.KITCHEN})` }}>
             <div className="absolute inset-0 bg-black/30"></div>
        </div>
        {roomMessage && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-purple-900/90 border border-purple-500 p-6 rounded-xl animate-bounce">
                <p className="text-white font-mono text-xl font-bold">{roomMessage}</p>
            </div>
        )}
        <div className="z-10 absolute inset-0 flex items-center justify-center">
             <button onClick={handleDrinkDoubleCup} className="group relative">
                 <div className="bg-purple-600/20 hover:bg-purple-600/40 border-4 border-purple-500 p-10 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:scale-110 cursor-pointer">
                     <div className="flex flex-col items-center">
                         <img src={ASSETS.ENERGY_ICON} className="w-20 h-20 mb-2" />
                         <span className="text-purple-300 font-bold font-mono text-xl bg-black/50 px-4 py-1 rounded">BEBER DOUBLE CUP</span>
                         <span className="text-purple-400 text-xs font-mono mt-1">(ESTOQUE: {gameState.doubleCupStock})</span>
                     </div>
                 </div>
             </button>
        </div>
    </div>
  );

  const renderBasementView = () => {
    const tooManyBodies = gameState.basementBodies.length > 3;
    
    return (
    <div className="flex h-screen w-screen bg-black relative overflow-hidden">
        <div className="crt absolute inset-0 z-50 pointer-events-none"></div>
        {renderHUD()}
        {renderNavControls()}
        
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${ASSETS.BASEMENT})` }}>
             <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Bodies */}
        <div className="absolute inset-0 z-10 pointer-events-none">
            {gameState.basementBodies.map(body => (
                <img 
                    key={body.id}
                    src={ASSETS.BODY_BAG}
                    alt="Body Bag"
                    className="absolute w-64 h-auto drop-shadow-2xl grayscale brightness-75 contrast-125"
                    style={{
                        left: `${body.x}%`,
                        top: `${body.y}%`,
                        transform: `translate(-50%, -50%) rotate(${body.rotation}deg)`
                    }}
                />
            ))}
        </div>

        {/* Interaction Layer */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
             {tooManyBodies && (
                 <div className="bg-red-900/80 p-4 border border-red-500 mb-4 animate-pulse pointer-events-auto">
                     <p className="text-red-300 font-bold font-mono text-xl text-center">O CHEIRO ESTÁ INSUPORTÁVEL!</p>
                     <p className="text-red-200 text-xs text-center">Livre-se dos corpos antes que a doença se espalhe.</p>
                 </div>
             )}
             
             {gameState.basementBodies.length > 0 && (
                 <button 
                    onClick={handleGoToCemetery}
                    className="pointer-events-auto bg-gray-900 border-2 border-gray-400 hover:bg-gray-200 hover:text-black hover:border-white text-white px-8 py-3 font-mono font-bold transition-all flex items-center gap-2 group"
                 >
                     <span>LEVAR CORPOS PARA O CEMITÉRIO</span>
                     <span className="text-xs opacity-70 group-hover:opacity-100">→</span>
                 </button>
             )}
        </div>

        {/* Overlay Text */}
        <div className="absolute bottom-10 left-10 z-20">
             <p className="text-red-600 font-mono text-xs font-bold tracking-widest bg-black/80 px-2">DEPÓSITO DE RESÍDUOS BIOLÓGICOS</p>
             <p className="text-gray-400 font-mono text-xs">TOTAL: {gameState.basementBodies.length}</p>
        </div>
    </div>
    );
  };

  const renderCemeteryView = () => (
      <div className="flex h-screen w-screen bg-black relative overflow-hidden">
        <div className="crt absolute inset-0 z-50 pointer-events-none"></div>
        {renderHUD()}
        
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${ASSETS.CEMETERY})` }}>
             <div className="absolute inset-0 bg-black/40"></div>
             {/* Fog Effect */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50"></div>
        </div>
        
        {/* Timer UI */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
             <div className="text-red-600 font-mono font-bold text-4xl animate-pulse drop-shadow-lg tracking-widest bg-black/50 px-4 rounded border border-red-800">
                 00:{(cemeteryTimer < 10 ? '0' : '') + cemeteryTimer}
             </div>
             <div className="text-gray-400 text-xs font-mono uppercase tracking-widest mt-1">Tempo Seguro</div>
        </div>

        {roomMessage && (
            <div className="absolute top-28 left-1/2 -translate-x-1/2 z-50 bg-black/90 border border-gray-500 p-4 rounded-xl animate-bounce">
                <p className="text-white font-mono text-xl font-bold">{roomMessage}</p>
            </div>
        )}

        {/* Phase 1: Arrival */}
        {cemeteryPhase === 'arrived' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center p-8 border-2 border-white bg-black max-w-lg">
                    <p className="text-white font-mono text-2xl mb-6 typewriter-text leading-relaxed">
                        "PRONTO, CHEGUEI. TENHO QUE CAVAR!"
                    </p>
                    <button 
                        onClick={() => { playSFX('click'); setCemeteryPhase('digging'); }}
                        className="bg-gray-800 border-2 border-white hover:bg-white hover:text-black text-white px-8 py-3 font-mono font-bold text-xl uppercase transition-all"
                    >
                        COMEÇAR A CAVAR
                    </button>
                    <p className="text-red-500 text-xs mt-4 animate-pulse font-mono">
                        (CUIDADO: O TEMPO ESTÁ PASSANDO...)
                    </p>
                </div>
            </div>
        )}

        {/* Phase 2: Interactive Grave - HUGE & SHAKING */}
        {cemeteryPhase === 'digging' && (
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-center pointer-events-none">
                <div 
                    className={`
                        relative cursor-pointer pointer-events-auto
                        transition-transform duration-75 
                        active:scale-95 
                        ${buryingAnim ? 'shake scale-105' : 'hover:scale-105'}
                    `}
                    onClick={handleBuryInteraction}
                >
                    {/* Make image huge and bottom-aligned */}
                    <img 
                        src={ASSETS.GRAVE} 
                        alt="Grave" 
                        className="w-[150%] max-w-5xl object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]" 
                    />
                    
                    {/* Visual Feedback for burying */}
                    {buryingAnim && (
                        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 text-yellow-500 font-mono text-4xl font-bold tracking-widest animate-ping">
                            CAVANDO!!
                        </div>
                    )}
                    
                    {/* Progress Bar */}
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-2/3 h-6 bg-gray-900 border-4 border-white rounded-full overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <div 
                            className="h-full bg-yellow-600 transition-all duration-100" 
                            style={{ width: `${burialProgress}%` }}
                        ></div>
                    </div>
                    
                    <div className="absolute bottom-5 w-full text-center">
                        <p className="text-gray-300 font-mono text-lg bg-black/70 px-4 py-1 inline-block border border-gray-500">CLIQUE RÁPIDO PARA ENTERRAR</p>
                    </div>
                </div>
            </div>
        )}

        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
             <button 
                onClick={handleReturnHome}
                className="bg-red-900 border-2 border-red-500 hover:bg-red-700 text-white px-4 py-2 font-mono font-bold uppercase text-xs"
             >
                 FUGIR PARA CASA
             </button>
             <p className="text-gray-400 font-mono text-xs bg-black/50 px-2">CORPOS RESTANTES: {gameState.basementBodies.length}</p>
        </div>
        
        {/* JUMPSCARE OVERLAY */}
        {isJumpscareActive && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black">
                <img src={ASSETS.CEMETERY_JUMPSCARE} className="w-full h-full object-cover animate-pulse" />
            </div>
        )}
      </div>
  );

  const renderTravelOverlay = () => {
      if (!isTraveling) return null;
      return (
          <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
              <img src={ASSETS.DRIVING} className="w-full h-full object-cover opacity-80" />
              <div className="absolute bottom-10 right-10 text-white font-mono text-2xl animate-pulse">
                  VIAJANDO...
              </div>
          </div>
      );
  };

  const renderDoorView = () => {
    const lastMsg = currentVisitor?.chatHistory[currentVisitor.chatHistory.length - 1];
    const isShiftOver = gameState.visitorsToday >= VISITORS_PER_DAY && !currentVisitor;

    return (
      <div className="flex h-screen w-screen bg-black relative overflow-hidden">
        <div className="crt absolute inset-0 z-50 pointer-events-none"></div>
        {renderHUD()}
        {renderNavControls()}

        {!currentVisitor ? (
             <div className="z-10 w-full h-full flex items-center justify-center flex-col bg-cover bg-center" style={{ backgroundImage: `url(${ASSETS.BACKGROUND})` }}>
                 {isShiftOver ? (
                     <div className="text-2xl font-mono text-green-500 bg-black/80 p-6 border-2 border-green-800 text-center">TURNO FINALIZADO<br/><span className="text-sm text-gray-400">VÁ PARA CAM 03 (CAMA) PARA DORMIR</span></div>
                 ) : (
                     <div className="text-2xl font-mono text-white bg-black/50 p-4 animate-pulse">AGUARDANDO VISITANTE...</div>
                 )}
             </div>
        ) : (
        <div className="z-10 w-full h-full flex flex-col md:flex-row relative">
          <div className="w-full md:w-1/2 h-1/2 md:h-full relative border-r border-gray-800 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${ASSETS.BACKGROUND})` }}>
            <CharacterView character={currentVisitor.character} isScanning={false} anomalyType={currentVisitor.anomalyType} mode="door" capturedImage={currentVisitor.capturedImage} />
          </div>
          <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-gray-900/90 border-l border-gray-700">
            <div className="flex-grow p-4 overflow-hidden relative">
               {lastMsg && <DialogueBox text={lastMsg.text} sender={lastMsg.sender === 'player' ? 'VOCÊ' : lastMsg.sender === 'system' ? 'SISTEMA' : currentVisitor.character.name.toUpperCase()} isTyping={isTyping} />}
            </div>
            <div className="p-4 bg-black border-t border-gray-800 flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-2 h-32 overflow-y-auto no-scrollbar">
                 {isTyping ? <div className="text-center text-green-500 animate-pulse font-mono py-4">[ PROCESSANDO... ]</div> : 
                   currentOptions.map((opt, idx) => (
                     <button key={idx} onClick={() => handleOptionClick(opt)} disabled={gameState.energy < ENERGY_COSTS.CHAT && !isMatheusTrapActive} className={`text-left bg-gray-800 border border-gray-600 text-green-400 p-2 hover:bg-gray-700 hover:border-green-500 transition-colors font-mono text-sm cursor-pointer ${gameState.energy < ENERGY_COSTS.CHAT && !isMatheusTrapActive ? 'opacity-50' : ''}`}>
                        &gt; {opt} <span className="text-xs text-purple-400">{isMatheusTrapActive ? '' : `(-${ENERGY_COSTS.CHAT} EP)`}</span>
                     </button>
                   ))
                 }
              </div>
              {!isMatheusTrapActive && (
                  <div className="grid grid-cols-2 gap-4 h-16 mt-2">
                    <button onClick={() => handleDoorDecision(true)} className="bg-green-900/50 border border-green-600 text-green-500 hover:bg-green-700 hover:text-white transition-all font-bold text-lg uppercase flex items-center justify-center gap-2 group cursor-pointer">ABRIR</button>
                    <button onClick={() => handleDoorDecision(false)} className="bg-red-900/50 border border-red-600 text-red-500 hover:bg-red-700 hover:text-white transition-all font-bold text-lg uppercase flex items-center justify-center gap-2 group cursor-pointer">NEGAR</button>
                  </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    );
  };

  const renderLivingRoomView = () => (
      <div className="flex h-screen w-screen bg-black relative overflow-hidden">
        <div className="crt absolute inset-0 z-50 pointer-events-none"></div>
        {renderHUD()}
        {renderNavControls()}
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${ASSETS.LIVING_ROOM})` }}></div>
        
        {/* GUN OVERLAY - FPS Style */}
        <img src={ASSETS.GUN} className={`absolute bottom-0 right-0 md:right-10 w-48 md:w-72 pointer-events-none z-[40] transition-transform origin-bottom-center ${isShooting ? 'gun-recoil' : ''}`} alt="Gun" />
        {isShooting && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-500 mix-blend-screen muzzle-flash z-[45]"></div>}
        {isShooting && <div className="absolute inset-0 blood-splatter z-[46] bg-red-600 mix-blend-multiply"></div>}

        {roomMessage && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[65] bg-black/90 border border-green-500 p-4 max-w-lg w-full shadow-2xl flex flex-col items-center">
                <h3 className="text-green-500 font-bold font-mono text-sm mb-1">RELATÓRIO:</h3>
                <p className="text-white font-mono text-lg text-center">{roomMessage}</p>
                {inspectionImage && <img src={inspectionImage} className="mt-2 w-32 h-32 object-contain border border-gray-600" />}
                {gameState.hasMushroom && roomMessage.includes("COGUMELO") && (
                    <button onClick={handleEatMushroom} className="mt-2 bg-purple-600 text-white px-4 py-1 hover:bg-purple-500">COMER</button>
                )}
                <button onClick={() => { setRoomMessage(null); setInspectionImage(null); }} className="mt-2 text-xs text-gray-400 hover:text-white underline">[FECHAR]</button>
            </div>
        )}

        <div className="z-10 absolute inset-0 flex items-end justify-center pb-32 px-10 gap-4 overflow-x-auto no-scrollbar">
             {gameState.residents.map((resident) => (
                    <div key={resident.id} onClick={() => setSelectedResidentId(resident.id)} className={`relative cursor-pointer transition-all duration-300 group ${selectedResidentId === resident.id ? 'z-30 scale-110 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'z-10 grayscale hover:grayscale-0'}`} style={{ width: '200px', flexShrink: 0 }}>
                         {selectedResidentId === resident.id && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-900 text-white text-xs px-2 py-1 font-mono whitespace-nowrap border border-red-500 animate-bounce">ALVO SELECIONADO</div>}
                         <CharacterView character={resident.character} isScanning={scanMode && selectedResidentId === resident.id} anomalyType={resident.anomalyType} mode="room" />
                    </div>
             ))}
        </div>
        
        <div className="z-[60] absolute inset-x-0 bottom-0 bg-black/90 p-4 border-t-2 border-yellow-600">
             <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-yellow-500 font-mono text-xs md:text-sm max-w-xs">
                    <p className="font-bold">OCUPANTES: {gameState.residents.length}</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                     <button onMouseDown={handleScan} onMouseUp={() => setScanMode(false)} disabled={!selectedResidentId} className="bg-blue-900/80 border border-blue-500 text-blue-200 px-4 py-2 font-mono text-xs hover:bg-blue-800 disabled:opacity-30 cursor-pointer">SCAN BIO (-{ENERGY_COSTS.SCAN})</button>
                     {gameState.day >= 2 && <button onClick={() => handleInspection('eyes')} disabled={!selectedResidentId || isTyping} className="bg-gray-800 border border-yellow-500 text-yellow-200 px-4 py-2 font-mono text-xs hover:bg-gray-700 disabled:opacity-30 cursor-pointer">OLHOS (-{ENERGY_COSTS.INSPECT})</button>}
                     {gameState.day >= 3 && <button onClick={() => handleInspection('teeth')} disabled={!selectedResidentId || isTyping} className="bg-gray-800 border border-yellow-500 text-yellow-200 px-4 py-2 font-mono text-xs hover:bg-gray-700 disabled:opacity-30 cursor-pointer">DENTES (-{ENERGY_COSTS.INSPECT})</button>}
                     {gameState.day >= 4 && <button onClick={() => handleInspection('pockets')} disabled={!selectedResidentId || isTyping} className="bg-gray-800 border border-purple-500 text-purple-200 px-4 py-2 font-mono text-xs hover:bg-gray-700 disabled:opacity-30 cursor-pointer">BOLSOS (-{ENERGY_COSTS.INSPECT})</button>}
                </div>
                {selectedResidentId && <button onClick={() => handleKillResident(selectedResidentId)} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-6 border-2 border-red-500 cursor-pointer animate-pulse text-sm">MATAR ALVO</button>}
             </div>
        </div>
      </div>
  );

  return (
    <>
      {renderTravelOverlay()}
      {gameState.screen === 'studio_intro' && (
        <div className="flex items-center justify-center h-screen bg-black">
            <img src={ASSETS.STUDIO_INTRO} className="w-full h-full object-contain" />
        </div>
      )}
      {gameState.screen === 'start' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white relative overflow-hidden">
          <div className="crt absolute inset-0 z-10 pointer-events-none"></div>
          <div className="z-20 text-center space-y-8 p-4">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-red-600 glitch-anim font-vt323">NO, I'M NOT<br/>A XTRANGE</h1>
            <button onClick={startGame} className="px-8 py-4 bg-gray-900 border-2 border-red-800 text-red-500 hover:bg-red-900 hover:text-black transition-all text-2xl font-bold cursor-pointer">INICIAR TURNO</button>
          </div>
        </div>
      )}
      {gameState.screen === 'newspaper' && (
         <div className="flex flex-col items-center justify-center h-screen bg-[#111] text-white relative overflow-hidden">
            <div className="relative aspect-video w-full max-w-4xl bg-gray-900 rounded-lg shadow-2xl border-[16px] border-gray-800 p-2 overflow-hidden flex">
                <div className="w-1/3 h-full bg-blue-900 relative border-r-4 border-black">
                    <img src={gameState.dailyRule?.newsImage || ASSETS.JOURNALIST} className="w-full h-full object-cover object-top" />
                    <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold">AO VIVO</div>
                </div>
                <div className="w-2/3 h-full bg-[#0000aa] flex flex-col p-6 crt relative">
                    <div className="bg-red-600 text-white font-bold text-2xl px-4 py-1 mb-4 w-fit animate-pulse">PLANTÃO URGENTE</div>
                    <h3 className="text-3xl font-mono text-yellow-400 font-bold mb-4 uppercase leading-tight border-b-2 border-white pb-2">{gameState.dailyRule?.headline}</h3>
                    <div className="bg-blue-900/50 p-4 border border-blue-500 flex-grow">
                        <p className="text-xl font-mono leading-relaxed typewriter-text">{gameState.dailyRule?.clue}</p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 text-black font-bold font-mono py-1 overflow-hidden z-20">
                     <div className="whitespace-nowrap animate-[marquee_10s_linear_infinite]">ATENÇÃO: TOQUE DE RECOLHER. DENUNCIE COMPORTAMENTOS ESTRANHOS. 085333111 PARA XTERMINADORES.</div>
                </div>
            </div>
            <button onClick={() => { setGameState(prev => ({...prev, screen: 'gameplay'})); setView('door'); spawnVisitor(); }} className="mt-8 px-8 py-3 bg-gray-800 border-2 border-white text-white font-mono hover:bg-white hover:text-black transition-all cursor-pointer text-xl">DESLIGAR TV E COMEÇAR</button>
         </div>
      )}
      {gameState.screen === 'gameplay' && (
          view === 'door' ? renderDoorView() : 
          view === 'living_room' ? renderLivingRoomView() : 
          view === 'bedroom' ? renderBedroomView() :
          view === 'basement' ? renderBasementView() :
          view === 'cemetery' ? renderCemeteryView() :
          renderKitchenView()
      )}
      {gameState.screen === 'night_report' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white relative">
           <div className="crt absolute inset-0 z-10 pointer-events-none"></div>
           <div className="z-20 text-center max-w-2xl px-6 border-2 border-red-900 bg-gray-900 p-10">
               <h2 className="text-4xl font-mono text-red-500 mb-6">RELATÓRIO DA NOITE</h2>
               <p className="text-xl font-mono mb-4">{gameState.gameOverReason}</p>
               <div className="my-6"><p className="text-gray-400 mb-2">FAMÍLIA RESTANTE:</p><div className="text-4xl text-red-600 flex justify-center gap-2">{Array.from({length: gameState.familyCount}).map((_, i) => <span key={i}>♥</span>)}</div></div>
               <button onClick={startNextDay} className="bg-gray-800 border border-white px-6 py-2 hover:bg-white hover:text-black font-mono transition-colors">PRÓXIMO DIA</button>
           </div>
        </div>
      )}
      {gameState.screen === 'gameover' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-red-900/20 animate-pulse"></div>
            <div className="z-20 text-center max-w-2xl px-4">
                <h1 className="text-8xl font-bold text-red-600 mb-4 font-vt323">GAME OVER</h1>
                <p className="text-2xl text-red-400 font-mono mb-8">{gameState.gameOverReason}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-900 cursor-pointer">TENTAR NOVAMENTE</button>
            </div>
        </div>
      )}
      {gameState.screen === 'victory' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white relative">
            <div className="z-20 text-center">
                <h1 className="text-6xl text-green-500 font-bold mb-4">SOBREVIVEU</h1>
                <p className="text-xl text-gray-300 font-mono mb-8">Você sobreviveu aos 10 dias de invasão.</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 border border-green-500 text-green-500 hover:bg-green-900 cursor-pointer">JOGAR NOVAMENTE</button>
            </div>
        </div>
      )}
      {gameState.screen === 'mushroom_dimension' && (
          <div className="flex flex-col items-center justify-center h-screen w-screen bg-cover bg-center relative hallucination" style={{ backgroundImage: `url(${ASSETS.MUSHROOM_DIMENSION})` }}>
              <div className="bg-black/80 p-8 rounded-xl max-w-2xl text-center border-4 border-purple-500">
                  <h2 className="text-4xl text-purple-400 font-bold mb-4">DIMENSÃO DOS FUNGOS</h2>
                  <p className="text-white text-xl mb-4">"Então é aqui a casa dele?"</p>
                  <p className="text-gray-400">Você sente sua mente expandindo... e depois voltando ao normal.</p>
                  <button onClick={() => setGameState(prev => ({ ...prev, screen: 'gameplay' }))} className="mt-6 bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-600">ACORDAR</button>
              </div>
          </div>
      )}
    </>
  );
};

export default App;
    