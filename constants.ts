

import { CharacterData, CharacterId, DailyRule } from './types';

export const ASSETS = {
  BACKGROUND: 'https://i.ibb.co/vbBTH8S/kisss2.png',
  LIVING_ROOM: 'https://i.ibb.co/XksTZJWZ/sala-matue.png',
  BEDROOM: 'https://i.ibb.co/Y4hmRz8w/quarto-matue.png',
  KITCHEN: 'https://i.ibb.co/fGVtvcLZ/geladeira-matue.png',
  LOGO: 'https://i.ibb.co/HDtZhZFg/fundo.png',
  ENERGY_ICON: 'https://i.ibb.co/v45vtLVJ/266-2662604-baby-bottle-border-clip-art-for-kids-lean-trap-png-removebg-preview.png',
  GUN: 'https://i.ibb.co/JRXjrhTG/b7c3340d-bae5-4cf5-bfdb-ff3cd0ac8fd1.png',
  JOURNALIST: 'https://i.ibb.co/Kcqw2bYj/reporter-fortal.png',
  MUSHROOM_DIMENSION: 'https://i.ibb.co/5hrWYqH3/lost.png',
  XTERMINADORES: 'https://i.ibb.co/zpP97x5/xterminadores-grupo-2.png',
  MATHEUS_JUMPSCARE: 'https://i.ibb.co/WppHHtnS/save-matue.png', 
  STUDIO_INTRO: 'https://i.ibb.co/RGDQjrML/53a43e70-d3f2-11f0-b99e-4ec188426ffb-0.gif',
  PHONE: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 100'%3E%3Crect x='10' y='5' width='40' height='90' rx='5' fill='%23111' stroke='%23444' stroke-width='3'/%3E%3Crect x='15' y='12' width='30' height='35' fill='%232c3e50'/%3E%3Ccircle cx='30' cy='85' r='3' fill='%23444'/%3E%3Crect x='15' y='55' width='8' height='6' fill='%23777' rx='1'/%3E%3Crect x='26' y='55' width='8' height='6' fill='%23777' rx='1'/%3E%3Crect x='37' y='55' width='8' height='6' fill='%23777' rx='1'/%3E%3Crect x='15' y='65' width='8' height='6' fill='%23777' rx='1'/%3E%3Crect x='26' y='65' width='8' height='6' fill='%23777' rx='1'/%3E%3Crect x='37' y='65' width='8' height='6' fill='%23777' rx='1'/%3E%3C/svg%3E",
  
  // Basement Assets
  BASEMENT: 'https://i.ibb.co/tPzp2F66/port-o-X.png',
  BODY_BAG: 'https://i.ibb.co/1Y5XZ7q8/cadaver-X.png',
  
  // Cemetery Assets
  CEMETERY: 'https://i.ibb.co/qYT5Sbnh/Cemiterio-Xtrange.png',
  GRAVE: 'https://i.ibb.co/0ppCzxJ7/cova-X.png',
  DRIVING: 'https://i.ibb.co/SXQzTKSh/2-BRAL.gif',
  CEMETERY_JUMPSCARE: 'https://i.ibb.co/4Zn13wVy/jumpscara-X.png',

  // Inspection Assets
  EYE_NORMAL: "https://i.ibb.co/HTjvYPpH/olho-xtranho-H.png",
  EYE_XTRANGE: "https://i.ibb.co/83HCtJM/olho-xtranho.png",
  EYE_XTRANGE_2: "https://i.ibb.co/Hp1rjfj2/eyes-xtrange.png",
  TEETH_NORMAL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'%3E%3Crect width='100' height='50' fill='%23222'/%3E%3Cpath d='M10,10 Q50,5 90,10 L90,40 Q50,45 10,40 Z' fill='%23cc6666'/%3E%3Cg fill='%23eee' stroke='%23ccc'%3E%3Crect x='20' y='12' width='10' height='15' rx='1'/%3E%3Crect x='32' y='12' width='12' height='18' rx='1'/%3E%3Crect x='46' y='12' width='12' height='18' rx='1'/%3E%3Crect x='60' y='12' width='10' height='15' rx='1'/%3E%3C/g%3E%3C/svg%3E",
  TEETH_XTRANGE: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'%3E%3Crect width='100' height='50' fill='black'/%3E%3Cpath d='M10,10 Q50,5 90,10 L90,40 Q50,45 10,40 Z' fill='%23660000'/%3E%3Cg fill='%23ffffcc' stroke='%23550000'%3E%3Cpath d='M20,15 L25,35 L30,15 Z'/%3E%3Cpath d='M35,15 L42,40 L49,15 Z'/%3E%3Cpath d='M55,15 L62,40 L69,15 Z'/%3E%3Cpath d='M75,15 L80,35 L85,15 Z'/%3E%3C/g%3E%3C/svg%3E"
};

export const PHONE_NUMBER = "085333420";
export const XTERMINADORES_PHONE = "085333111";

export const ENERGY_COSTS = {
  CHAT: 10,
  SCAN: 5,
  INSPECT: 25,
  SHOOT: 20,
  BURY: 15, // Total cost approx
  DIG: 1 // Cost per click
};

export const PLAYER_QUESTIONS = [
  "Quem é você?",
  "O que você quer aqui?",
  "Você está sozinho?",
  "De onde você veio?",
  "Por que devo deixar você entrar?",
  "Você parece nervoso...",
  "O que tem aí fora?",
  "Você é humano?",
  "Seus olhos parecem estranhos.",
  "Conte-me mais sobre você.",
  "Não vou abrir a porta.",
  "Qual é o seu nome mesmo?",
  "Você ouviu aquele barulho?",
  "Sua voz está diferente.",
  "Prove que não é um Xtrange.",
  "Preciso mesmo fazer isso?",
  "O que são os Xtranhos?"
];

export const POCKET_ITEMS = [
  "Um papel de bala amassado.",
  "Chaves de casa com chaveiro de pato.",
  "Carteira vazia.",
  "Fotos de família (os rostos estão riscados).",
  "Um dedo humano decepado (seco).",
  "Bilhete de loteria não premiado.",
  "Uma pedra brilhante.",
  "Restos de carne crua.",
  "Um isqueiro Bic azul.",
  "Documentos manchados de sangue preto."
];

export const SOCIAL_FEED = [
  {
    id: 0,
    user: "Sprite_Plug_Oficial",
    date: "AGORA MESMO",
    text: "fala ai rapaziada do mal, tou vendendo alguns double cup sprite, quem quiser comprar eu faço entrega ate a sua casa, peça logo, porque eu quase fui morto por um estranho hj, ligue 085333420",
    image: "https://i.ibb.co/Zn5P0Wj/venda-de-double-sprite.png"
  },
  {
    id: 1,
    user: "survivor_007",
    date: "HÁ 2 MINUTOS",
    text: "SOCORRO ELES ESTÃO ENTRANDO PELAS PAREDES OLHA O QUE FIZERAM NA MINHA SALA",
    image: "https://i.ibb.co/mrLXRcxg/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f.gif"
  },
  {
    id: 2,
    user: "hidden_eye",
    date: "HÁ 5 MINUTOS",
    text: "NÃO ABRAM A PORTA PARA O CARA DO CHAPÉU ISSO NÃO É HUMANO!!!",
    image: "https://i.ibb.co/gM4C0782/8df899e4e3bfacba93f04eaa0f66cda2bdc42a94-hq.gif"
  },
  {
    id: 3,
    user: "lost_girl",
    date: "HÁ 10 MINUTOS",
    text: "Alguém pode me ouvir? Estou escondida no porão...",
    image: "https://i.ibb.co/c9vCWMH/snot-scary.gif"
  },
  {
    id: 4,
    user: "bunker_boy",
    date: "HÁ 1 HORA",
    text: "Meu abrigo está seguro por enquanto. Tenho suprimentos.",
    image: "https://i.ibb.co/99Xy10Q0/tumblr-2b7592729f3fe974d0a221dfcdfcce91-e650aff1-400.gif"
  }
];

export const TOTAL_DAYS = 10;
export const VISITORS_PER_DAY = 3;

export const DAILY_RULES: DailyRule[] = [
  {
    day: 1,
    headline: "ESTRANHOS AMEAÇAM A VIZINHANÇA",
    clue: "RELATOS INDICAM QUE ESTRANHOS TÊM DIFICULDADE COM A GRAMÁTICA. ERROS DE CONCORDÂNCIA E GÊNERO SÃO COMUNS.",
    mechanic: "grammar",
    unlockedTool: undefined 
  },
  {
    day: 2,
    headline: "XTERMINADORES ATIVADOS",
    clue: "O GOVERNO ACABA DE ANUNCIAR UM GRUPO DE AGENTES EXTERMINADORES, PARA CONTER E INVESTIGAR CADA VEZ MAIS OS XTRANHOS. ESSE GRUPO SERÁ CHAMADO DE XTERMINADORES! ELES VÃO SER NOSSA SALVAÇÃO NESSE MOMENTO TÃO DIFÍCIL. (Dica de sobrevivência: Cuidado com os olhos das pessoas.)",
    mechanic: "visual_distortion",
    unlockedTool: "eyes",
    newsImage: ASSETS.XTERMINADORES
  },
  {
    day: 3,
    headline: "SORRISO DA MORTE",
    clue: "A DENTIÇÃO DOS IMPOSTORES É IRREGULAR. DENTES SERRILHADOS OU FILEIRAS DUPLAS FORAM OBSERVADOS.",
    mechanic: "aggression",
    unlockedTool: "teeth"
  },
  {
    day: 4,
    headline: "OBJETOS SUSPEITOS",
    clue: "REVISTE OS BOLSOS. ELES COSTUMAM CARREGAR RESTOS ORGÂNICOS OU ITENS DAS VÍTIMAS.",
    mechanic: "repetition",
    unlockedTool: "pockets"
  },
  {
    day: 5,
    headline: "INVASÃO TOTAL",
    clue: "ELES ESTÃO DESESPERADOS E AGRESSIVOS. NÃO CONFIE EM NINGUÉM. COMPORTAMENTO NONSENSE É ESPERADO.",
    mechanic: "nonsensical"
  },
  {
    day: 6,
    headline: "SILÊNCIO MORTAL",
    clue: "ESTRANHOS ESTÃO MAIS QUIETOS. CUIDADO COM O QUE NÃO É DITO. ELES EVITAM CONTATO VISUAL.",
    mechanic: "visual_distortion"
  },
  {
    day: 7,
    headline: "IMITADORES PERFEITOS",
    clue: "A MIMETIZAÇÃO ESTÁ EVOLUINDO. ERROS DE FALA SÃO SUTIS. FIQUE ATENTO AOS DETALHES.",
    mechanic: "grammar"
  },
  {
    day: 8,
    headline: "OLHAR VAZIO",
    clue: "COMPORTAMENTO AGRESSIVO AUMENTANDO. ELES NÃO TÊM PACIÊNCIA.",
    mechanic: "aggression"
  },
  {
    day: 9,
    headline: "CAOS TOTAL",
    clue: "DISTORÇÃO DA REALIDADE. ELES REPETEM PADRÕES. NÃO CONFIE EM SEUS OLHOS.",
    mechanic: "repetition"
  },
  {
    day: 10,
    headline: "O FIM",
    clue: "A INVASÃO FINAL COMEÇOU. ELES FALAM COISAS SEM SENTIDO. PROTEJA A FAMÍLIA A QUALQUER CUSTO.",
    mechanic: "nonsensical"
  }
];

export const CHARACTERS: Record<CharacterId, CharacterData> = {
  [CharacterId.VINICIUS]: {
    id: CharacterId.VINICIUS,
    name: "Vinicius",
    imageUrl: "https://i.ibb.co/97sHdnt/Chat-GPT-Image-3-de-dez-de-2025-19-45-28-removebg-preview.png",
    baseQuotes: ["Não tava aguentando morar mais em um cogumelo, tinha que vir aqui.", "Tem muitos estranhos a solta.", "Eae mano, tranquilo?"],
    description: "Um jovem casual, parece relaxado, mas paranoico.",
    voiceStyle: "calm",
    knowledgeBase: [
      "q: Quem é você? -> A: Sou o Vinicius, mano. Só um cara normal tentando não virar adubo.",
      "q: O que você quer aqui? -> A: Paz, mano. Só um teto que não seja úmido e escuro.",
      "q: Você está sozinho? -> A: Fisicamente? Sim. Mentalmente... as vezes as sombras sussurram.",
      "q: De onde você veio? -> A: Do cogumelo, mano. Era apertado, fedia a mofo. Não aguentei.",
      "q: Por que devo deixar você entrar? -> A: Porque eu não sou um deles! E eu tenho... conhecimentos sobre fungos.",
      "q: Você parece nervoso... -> A: Você também estaria se visse o que eu vi rastejando no esgoto.",
      "q: O que tem aí fora? -> A: Xtranges, mano. E esporos. Muitos esporos.",
      "q: Você é humano? -> A: 100% orgânico, sem conservantes. Pode confiar.",
      "q: Seus olhos parecem estranhos. -> A: É a falta de sono, mano. As pálpebras pesam.",
      "q: Conte-me mais sobre você. -> A: Gosto de natureza, mas a natureza tá tentando me matar ultimamente.",
      "q: Não vou abrir a porta. -> A: Qual é, mano! Vai me deixar pros fungos pegarem?",
      "q: Qual é o seu nome mesmo? -> A: Vinicius! Não esquece, mano.",
      "q: Você ouviu aquele barulho? -> A: Ouvi... parecia algo estalando. Abre logo!",
      "q: Sua voz está diferente. -> A: Deve ser o ar tóxico lá de fora. Secou minha garganta.",
      "q: Prove que não é um Xtrange. -> A: Eu sangro vermelho, mano! Quer que eu me corte aqui?",
      "q: Preciso mesmo fazer isso? -> A: Precisa, mano! Se não abrir, eu viro comida de fungo.",
      "q: O que são os Xtranhos? -> A: São monstros, mano. Eles copiam a gente, mas são vazios por dentro."
    ]
  },
  [CharacterId.KOUTH]: {
    id: CharacterId.KOUTH,
    name: "Kouth",
    imageUrl: "https://i.ibb.co/cK7KyWWr/dfdffff.png",
    baseQuotes: ["Oi...", "Tá frio aqui fora.", "Você tem um minuto?"],
    description: "Uma garota quieta com estilo gótico.",
    voiceStyle: "whisper",
    knowledgeBase: [
      "q: Quem é você? -> A: Kouth. Apenas uma sombra passando.",
      "q: O que você quer aqui? -> A: Calor. O frio lá fora entra nos ossos.",
      "q: Você está sozinho? -> A: A solidão é minha única amiga leal.",
      "q: De onde você veio? -> A: De um lugar onde a luz não alcança. Onde a música parou.",
      "q: Por que devo deixar você entrar? -> A: Porque eu posso tocar para você. Minha guitarra chora.",
      "q: Você parece nervoso... -> A: Não é nervosismo. É o tremor do vazio.",
      "q: O que tem aí fora? -> A: Nada. E tudo. Monstros com rostos de amigos.",
      "q: Você é humano? -> A: Ainda sou. Embora me sinta cada vez menos.",
      "q: Seus olhos parecem estranhos. -> A: Eles viram demais. Estão cansados de ver.",
      "q: Conte-me mais sobre você. -> A: Eu gosto do silêncio entre as notas musicais.",
      "q: Não vou abrir a porta. -> A: Então morrerei aqui, junto com a melodia.",
      "q: Qual é o seu nome mesmo? -> A: Kouth. Mas nomes são apenas rótulos.",
      "q: Você ouviu aquele barulho? -> A: É o som do mundo quebrando.",
      "q: Sua voz está diferente. -> A: Eu não falo muito. Minha voz enferrujou.",
      "q: Prove que não é um Xtrange. -> A: Minha alma dói. Monstros não sentem dor na alma.",
      "q: Preciso mesmo fazer isso? -> A: Não precisa de nada. Somos todos poeira.",
      "q: O que são os Xtranhos? -> A: Ecos distorcidos do que já fomos um dia."
    ]
  },
  [CharacterId.CARLOS]: {
    id: CharacterId.CARLOS,
    name: "Carlos Brandão",
    imageUrl: "https://i.ibb.co/23NK3LXf/Chat-GPT-Image-3-de-dez-de-2025-19-36-35.png",
    baseQuotes: ["Eu gosto de assistir um dorama japones.", "Sempre quis ter aqueles olhos.", "Acho que um pouco de hortelã vai fazer eu realizar esse sonho."],
    description: "Homem sério viciado em cultura japonesa.",
    voiceStyle: "rough",
    knowledgeBase: [
      "q: Quem é você? -> A: Carlos Brandão. Otimizador de plantas e apreciador de cultura nipônica.",
      "q: O que você quer aqui? -> A: Um lugar pra assistir meu dorama em paz. Minha TV pifou.",
      "q: Você está sozinho? -> A: Sim, só eu e minhas mudas de hortelã.",
      "q: De onde você veio? -> A: Do horto. Estava comprando adubo.",
      "q: Por que devo deixar você entrar? -> A: Tenho os melhores episódios de Naruto baixados num CD.",
      "q: Você parece nervoso... -> A: É ansiedade. O protagonista vai beijar a garota hoje.",
      "q: O que tem aí fora? -> A: Gente sem cultura. Ninguém entende a profundidade de um anime.",
      "q: Você é humano? -> A: Claro! Tenho minha mina (2D), meu dinheiro e minhas plantas.",
      "q: Seus olhos parecem estranhos. -> A: São lentes de contato. Quero ter olhos de anime.",
      "q: Conte-me mais sobre você. -> A: Eu cultivo hortelã. Dizem que ajuda a realizar sonhos.",
      "q: Não vou abrir a porta. -> A: Baka! Você vai se arrepender.",
      "q: Qual é o seu nome mesmo? -> A: Carlos Brandão-san. Respeita.",
      "q: Você ouviu aquele barulho? -> A: Parecia um Kaiju!",
      "q: Sua voz está diferente. -> A: Estou treinando meu japonês. Dattebayo.",
      "q: Prove que não é um Xtrange. -> A: Eu tenho um CD de J-Pop no bolso. Um monstro teria isso?",
      "q: Preciso mesmo fazer isso? -> A: É o seu destino ninja.",
      "q: O que são os Xtranhos? -> A: Bakemono! Demônios que precisam ser purificados."
    ]
  },
  [CharacterId.FAB]: {
    id: CharacterId.FAB,
    name: "Fab Godamn",
    imageUrl: "https://i.ibb.co/9k3P5Jv9/Chat-GPT-Image-3-de-dez-de-2025-19-15-42.png",
    baseQuotes: ["Eu tou com esse machado por que ele e meu filho.", "E aí vizinho!", "Tudo certo?"],
    description: "Trabalhador com distúrbios psicológicos em relação ao seu machado.",
    voiceStyle: "cheerful",
    knowledgeBase: [
      "q: Quem é você? -> A: Sou o Fab! E este aqui no meu ombro é o Júnior, meu filhão.",
      "q: O que você quer aqui? -> A: O Júnior tá com sede. Queria um copo d'água.",
      "q: Você está sozinho? -> A: Nunca! Um pai nunca abandona seu filho (o machado).",
      "q: De onde você veio? -> A: Do trabalho. Cortamos muita madeira hoje, né filho?",
      "q: Por que devo deixar você entrar? -> A: Somos boa gente! O Júnior é bem educado.",
      "q: Você parece nervoso... -> A: É que as pessoas olham torto pro meu menino. É preconceito.",
      "q: O que tem aí fora? -> A: Gente ruim que quer tirar meu filho de mim.",
      "q: Você é humano? -> A: Sou carne e osso. O Júnior é aço e madeira. Família completa.",
      "q: Seus olhos parecem estranhos. -> A: É amor paterno, vizinho.",
      "q: Conte-me mais sobre você. -> A: Sou lenhador. Pai solteiro.",
      "q: Não vou abrir a porta. -> A: O Júnior vai ficar triste... e você não quer ver ele bravo.",
      "q: Qual é o seu nome mesmo? -> A: Fab Godamn. Guarde esse nome.",
      "q: Você ouviu aquele barulho? -> A: Foi o Júnior rindo. Ele tem uma risada metálica.",
      "q: Sua voz está diferente. -> A: Cantei canções de ninar pro machado o caminho todo.",
      "q: Prove que não é um Xtrange. -> A: Eu tenho documentos! Tenho até o laudo médico do Júnior no bolso!",
      "q: Preciso mesmo fazer isso? -> A: Ajuda um pai de família, vai?",
      "q: O que são os Xtranhos? -> A: Gente que não respeita a família tradicional de homem e machado."
    ]
  },
  [CharacterId.MATHEUS]: {
    id: CharacterId.MATHEUS,
    name: "Matheus",
    imageUrl: "https://i.ibb.co/YTPLg2pP/0c5c5ffa-36d0-47da-8799-74c244b35b1d.png",
    baseQuotes: ["Voce ta sozinho em casa?", "Preciso da sua casa para eu poder meditar minhas plantas.", "Fala tu."],
    description: "Jovem com roupas largas, maconheiro.",
    voiceStyle: "slow",
    knowledgeBase: [
      "q: Quem é você? -> A: Matheus, pô. O alquimista das ervas.",
      "q: O que você quer aqui? -> A: Só um cantinho pra meditar e alinhar os chakras, sacou?",
      "q: Você está sozinho? -> A: Eu e o universo, bro. Somos um só.",
      "q: De onde você veio? -> A: De uma viagem astral muito louca.",
      "q: Por que devo deixar você entrar? -> A: Porque eu trago a paz... e talvez um prensado.",
      "q: Você parece nervoso... -> A: Que nada, tô zen. Só a polícia que me deixa tenso.",
      "q: O que tem aí fora? -> A: Bad vibes, mano. Muita energia negativa.",
      "q: Você é humano? -> A: Sou poeira das estrelas, tá ligado? Mas biologicamente, sim.",
      "q: Seus olhos parecem estranhos. -> A: É a fumaça, mano. Ardeu.",
      "q: Conte-me mais sobre você. -> A: Eu converso com plantas. Elas me contam segredos.",
      "q: Não vou abrir a porta. -> A: Pô, que bad trip. Vai deixar o irmão na chuva?",
      "q: Qual é o seu nome mesmo? -> A: Matheus. Mas pode me chamar de Mago.",
      "q: Você ouviu aquele barulho? -> A: Foi o trovão ou meu estômago?",
      "q: Sua voz está diferente. -> A: Tô na seca, mano. Preciso de água.",
      "q: Prove que não é um Xtrange. -> A: Mano, eu sou só vibrações positivas. Revista meu bolso, só tem coisa natural.",
      "q: Preciso mesmo fazer isso? -> A: Só se você quiser evoluir espiritualmente, mano.",
      "q: O que são os Xtranhos? -> A: Seres de baixa vibração, tá ligado? Cortam a brisa."
    ]
  },
  [CharacterId.RAFA]: {
    id: CharacterId.RAFA,
    name: "Rafa",
    imageUrl: "https://i.ibb.co/nM6fRSMw/Chat-GPT-Image-3-de-dez-de-2025-20-17-04.png",
    baseQuotes: ["Voce e gay bro?", "Tem certeza que voce e homem? falando desse jeito", "Não fode bro", "bro"],
    description: "Gym bro agressivo e inseguro.",
    voiceStyle: "nervous",
    knowledgeBase: [
      "q: Quem é você? -> A: Rafa. O alpha da quebrada.",
      "q: O que você quer aqui? -> A: Proteção, bro. Tá perigoso lá fora pra quem tem shape.",
      "q: Você está sozinho? -> A: Tou com minha gang bro, gang gang. (aponta pro vazio)",
      "q: De onde você veio? -> A: Da academia, bro. Tava puxando ferro.",
      "q: Por que devo deixar você entrar? -> A: Ou eu vou ter que dar um tiro na sua vó? Brincadeira bro, abre aí.",
      "q: Você parece nervoso... -> A: É o pré-treino batendo, bro. Muita cafeína.",
      "q: O que tem aí fora? -> A: Frangos e Xtranges. Tudo fraco.",
      "q: Você é humano? -> A: Sou humano, nasci gringo e não sou gay, o que voce mais quer saber bro?",
      "q: Seus olhos parecem estranhos. -> A: Misturei codein e sprite no double cup bro, é o lean.",
      "q: Conte-me mais sobre você. -> A: Eu subo nas coisas porque eu posso bro. Sou o rei.",
      "q: Não vou abrir a porta. -> A: Não fode bro. Abre essa merda.",
      "q: Qual é o seu nome mesmo? -> A: Rafa! Tu é surdo?",
      "q: Você ouviu aquele barulho? -> A: Foi meu bíceps rasgando a camisa.",
      "q: Sua voz está diferente. -> A: É a trembolona, bro. Deixa a voz grossa.",
      "q: Prove que não é um Xtrange. -> A: Eu estou em cima de uma cadeira, isso não é o suficiente? Um monstro faria isso?",
      "q: Preciso mesmo fazer isso? -> A: Deixa de ser maricas bro.",
      "q: O que são os Xtranhos? -> A: Uns caras sem shape que tentam copiar a gente."
    ]
  },
  [CharacterId.DELIVERY]: {
    id: CharacterId.DELIVERY,
    name: "Entregador",
    imageUrl: "https://i.ibb.co/zH6Mx7kX/unnamed-removebg-preview-1.png",
    baseQuotes: ["Como não existe mais emprego nessa cidade...", "Estão invadindo minha casa.", "Vou parar de vender em breve."],
    description: "Entregador de Double Cup, exausto e assustado.",
    voiceStyle: "fast",
    knowledgeBase: [
      "q: Quem é você? -> A: Sou o entregador do Sprite Plug. Só vim deixar a encomenda.",
      "q: O que você quer aqui? -> A: Entregar os Double Cups e ir embora. Tá perigoso.",
      "q: Você está sozinho? -> A: Graças a Deus sim. Não quero ninguém na minha garupa.",
      "q: De onde você veio? -> A: Do depósito. Tive que desviar de uns malucos no caminho.",
      "q: Por que devo deixar você entrar? -> A: Não precisa entrar! Só pega o pedido, mano.",
      "q: Você parece nervoso... -> A: Estão invadindo minha casa, roubando meu estoque. Tô no limite.",
      "q: O que tem aí fora? -> A: Caos. Ninguém quer trabalhar, só roubar.",
      "q: Você é humano? -> A: Sou, infelizmente. Queria ser um pássaro pra voar daqui.",
      "q: Seus olhos parecem estranhos. -> A: É cansaço. Trabalho 20 horas por dia.",
      "q: Conte-me mais sobre você. -> A: Vou parar de vender em breve. Não vale o risco.",
      "q: Não vou abrir a porta. -> A: Beleza, fico com os refris. Tchau.",
      "q: Qual é o seu nome mesmo? -> A: Não importa. Só assina aqui.",
      "q: Você ouviu aquele barulho? -> A: Moto estourando escapamento. Padrão.",
      "q: Sua voz está diferente. -> A: Gritei com um ladrão na esquina.",
      "q: Prove que não é um Xtrange. -> A: Eu tenho a mercadoria. Xtrange não bebe refrigerante.",
      "q: Preciso mesmo fazer isso? -> A: Só se você quiser beber.",
      "q: O que são os Xtranhos? -> A: Ladrões de alma."
    ]
  },
  [CharacterId.CLERITON]: {
    id: CharacterId.CLERITON,
    name: "Clériton",
    imageUrl: "https://i.ibb.co/Q71FW4BG/Chat-GPT-Image-5-de-dez-de-2025-13-03-44-removebg-preview.png",
    baseQuotes: ["Sou um viajante do tempo.", "Não sei como vim parar aqui?", "Cadê as pessoas?"],
    description: "Viajante do tempo confuso.",
    voiceStyle: "monotone",
    knowledgeBase: [
      "q: Quem é você? -> A: Clériton. Viajante temporal classe 5.",
      "q: O que você quer aqui? -> A: Respostas. Onde foi todo mundo? O futuro está... vazio.",
      "q: Você está sozinho? -> A: No tempo, estamos todos sozinhos.",
      "q: De onde você veio? -> A: Do ano 3000. Tudo lá é... silencioso.",
      "q: Por que devo deixar você entrar? -> A: Preciso carregar meu dispositivo de salto. E tenho informações.",
      "q: Você parece nervoso... -> A: O paradoxo temporal causa náuseas.",
      "q: O que tem aí fora? -> A: O início do fim. Eu li sobre isso nos arquivos históricos.",
      "q: Você é humano? -> A: Meu DNA é humano, apenas evoluído. 98% compatível.",
      "q: Seus olhos parecem estranhos. -> A: Implantes retinianos. Padrão no meu tempo.",
      "q: Conte-me mais sobre você. -> A: Eu vi o sol engolir a terra. Isso aqui é fichinha.",
      "q: Não vou abrir a porta. -> A: Ineficiente. Sua sobrevivência depende da cooperação.",
      "q: Qual é o seu nome mesmo? -> A: Clériton. Unidade 7.",
      "q: Você ouviu aquele barulho? -> A: Flutuação no continuum espaço-tempo.",
      "q: Sua voz está diferente. -> A: Tradutor universal calibrando.",
      "q: Prove que não é um Xtrange. -> A: Eu tenho um pendrive com a história do mundo no bolso.",
      "q: Preciso mesmo fazer isso? -> A: O destino é imutável.",
      "q: O que são os Xtranhos? -> A: Anomalias temporais que ganharam forma física."
    ]
  },
  [CharacterId.THIAGO]: {
    id: CharacterId.THIAGO,
    name: "Thiago",
    imageUrl: "https://i.ibb.co/NdFy85mD/Chat-GPT-Image-5-de-dez-de-2025-20-09-04-removebg-preview.png",
    baseQuotes: ["Oi eu me chamo thiago.", "Não sou um artista genérico como muitos falam por ai.", "Eu vim dos prédios."],
    description: "Artista pretensioso e estranho.",
    voiceStyle: "normal",
    knowledgeBase: [
      "q: Quem é você? -> A: Thiago. O único Thiago real. O artista definitivo.",
      "q: O que você quer aqui? -> A: Inspiração. Sua casa tem uma arquitetura... peculiar. Brutalista?",
      "q: Você está sozinho? -> A: Artistas são sempre solitários, mesmo na multidão.",
      "q: De onde você veio? -> A: Dos prédios cinzas. Onde a arte morre e o concreto chora.",
      "q: Por que devo deixar você entrar? -> A: Quero pintar um retrato da sua alma.",
      "q: Você parece nervoso... -> A: É a pressão estética. O mundo é feio demais.",
      "q: O que tem aí fora? -> A: Mediocridade. E monstros que não sabem combinar cores.",
      "q: Você é humano? -> A: Sou mais que humano. Sou um visionário.",
      "q: Seus olhos parecem estranhos. -> A: Eu vejo o mundo em 5 dimensões.",
      "q: Conte-me mais sobre você. -> A: Não sou um artista genérico como muitos falam por aí.",
      "q: Não vou abrir a porta. -> A: Você está rejeitando a vanguarda!",
      "q: Qual é o seu nome mesmo? -> A: Thiago. Assino minhas obras assim.",
      "q: Você ouviu aquele barulho? -> A: Foi o som de um pincel caindo.",
      "q: Sua voz está diferente. -> A: É a emoção da criação.",
      "q: Prove que não é um Xtrange. -> A: Minha arte é minha prova. Só humanos criam beleza do caos.",
      "q: Preciso mesmo fazer isso? -> A: A arte exige sacrifício.",
      "q: O que são os Xtranhos? -> A: Críticos de arte sem alma."
    ]
  },
  [CharacterId.DAVID_DEX]: {
    id: CharacterId.DAVID_DEX,
    name: "David Dex",
    imageUrl: "https://i.ibb.co/2Y0kw0yN/Chat-GPT-Image-5-de-dez-de-2025-20-13-50-removebg-preview.png",
    baseQuotes: ["Eu vim da bahia, tou meio perdido aqui.", "Trap city men.", "Muito swag.", "Voce e muito lame, eu tenho o swag."],
    description: "Trapper estiloso da Bahia.",
    voiceStyle: "cool",
    knowledgeBase: [
      "q: Quem é você? -> A: David Dex, o rei do swag, o príncipe do trap.",
      "q: O que você quer aqui? -> A: Só um lugar pra descansar o drip, tá ligado? Tou perdido.",
      "q: Você está sozinho? -> A: Eu e meu sauce. Sempre.",
      "q: De onde você veio? -> A: Eu vim da Bahia, man. Trap city.",
      "q: Por que devo deixar você entrar? -> A: Porque eu trago a vibe. Sem mim, essa casa é paia.",
      "q: Você parece nervoso... -> A: Nervoso? Eu? Jamais. Sou gelado, ice.",
      "q: O que tem aí fora? -> A: Haters. E uns bichos feios sem estilo.",
      "q: Você é humano? -> A: Sou humano com upgrade de estilo. Outro nível.",
      "q: Seus olhos parecem estranhos. -> A: É o brilho do sucesso, pai.",
      "q: Conte-me mais sobre você. -> A: Voce e muito lame, eu tenho o swag. Cade seu drip?",
      "q: Não vou abrir a porta. -> A: Perdeu a chance de andar com o hype.",
      "q: Qual é o seu nome mesmo? -> A: David Dex. Não esquece.",
      "q: Você ouviu aquele barulho? -> A: Foi o grave batendo.",
      "q: Sua voz está diferente. -> A: Auto-tune natural, tá ligado?",
      "q: Prove que não é um Xtrange. -> A: Mano, olha meu outfit. Xtranges não têm esse molho. Eles usam roupas básicas.",
      "q: Preciso mesmo fazer isso? -> A: Só se você quiser ter swag.",
      "q: O que são os Xtranhos? -> A: Posers."
    ]
  },
  [CharacterId.AGENT_X]: {
    id: CharacterId.AGENT_X,
    name: "Agente X",
    imageUrl: "https://i.ibb.co/zVXtMccZ/xterminadores-kk.png",
    baseQuotes: ["Vim recolher espécimes para análise.", "Cooperação é obrigatória.", "Abra a porta, cidadão."],
    description: "Agente da força tática Xterminadores.",
    voiceStyle: "military",
    knowledgeBase: [
      "q: Quem é você? -> A: Agente X, unidade de contenção Xterminadores. Identificação: Classificada.",
      "q: O que você quer aqui? -> A: Requisitar ocupantes da residência para testes laboratoriais compulsórios. Devolveremos... em breve.",
      "q: Você está sozinho? -> A: A unidade tática está no perímetro. Você não os vê, mas eles veem você.",
      "q: De onde você veio? -> A: Base de Operações Central. Setor de Bio-Contenção.",
      "q: Por que devo deixar você entrar? -> A: Obstrução da justiça é crime. Entregue os suspeitos.",
      "q: Você parece nervoso... -> A: Negativo. Minha pulsação é estável em 60bpm.",
      "q: O que tem aí fora? -> A: Zona de guerra biológica. Mantenha o confinamento.",
      "q: Você é humano? -> A: Afirmativo. Melhorado geneticamente para combate, mas humano.",
      "q: Seus olhos parecem estranhos. -> A: Visores táticos de realidade aumentada. Padrão.",
      "q: Conte-me mais sobre você. -> A: Informação restrita. Foque na missão.",
      "q: Não vou abrir a porta. -> A: Isso será anotado em seu registro permanente.",
      "q: Qual é o seu nome mesmo? -> A: Agente X. Isso é tudo que precisa saber.",
      "q: Você ouviu aquele barulho? -> A: Detonação tática controlada. Ignore.",
      "q: Sua voz está diferente. -> A: Modulador de voz para proteção de identidade.",
      "q: Prove que não é um Xtrange. -> A: Eu caço eles. Eles fogem de mim. Essa é a prova.",
      "q: Preciso mesmo fazer isso? -> A: É para o bem maior. A ciência requer sacrifícios.",
      "q: O que são os Xtranhos? -> A: Entidades biológicas anômalas. Se tiver dúvidas operacionais, ligue para a central: 085333111."
    ]
  }
};