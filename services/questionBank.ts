import { Question, OperationType } from '../types';

// Data arrays for contextual generation to ensure 200 unique but consistent questions
const names = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Carla', 'Marcos', 'Júlia', 'Roberto', 'Fernanda', 'Tiago', 'Beatriz'];
const items = ['figurinhas', 'balas', 'lápis', 'carrinhos', 'reais', 'frutas', 'folhas', 'livros', 'bolinhas de gude', 'canetas'];
const containers = ['caixas', 'pacotes', 'álbuns', 'potes', 'cestas'];

// Helper to get random item
const r = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate options (1 correct + 3 wrong)
const generateOptions = (correct: number): number[] => {
    const opts = new Set<number>();
    opts.add(correct);

    let safetyCounter = 0;
    while (opts.size < 4 && safetyCounter < 50) {
        safetyCounter++;
        // Create a variation between -10 and +10, excluding 0
        const diff = Math.floor(Math.random() * 21) - 10;
        if (diff === 0) continue;
        
        const val = correct + diff;
        // Ensure positive answers for this grade level context
        if (val >= 0) {
            opts.add(val);
        }
    }
    
    // Fallback if we couldn't find unique close numbers (rare)
    while (opts.size < 4) {
        opts.add(correct + opts.size + 10);
    }

    return Array.from(opts).sort(() => 0.5 - Math.random());
};

// Generators to ensure we have exactly the requested count and structure
const generateQuestions = (): Record<OperationType, Question[]> => {
  const bank: Record<OperationType, Question[]> = {
    ADD: [],
    SUB: [],
    MULT: [],
    DIV: []
  };

  let idCounter = 1;

  // --- 40 ADDITION ---
  for (let i = 0; i < 40; i++) {
    const n1 = Math.floor(Math.random() * 50) + 5;
    const n2 = Math.floor(Math.random() * 40) + 5;
    const name = r(names);
    const item = r(items);
    
    // Mix of templates
    let text = "";
    if (i % 2 === 0) {
        text = `${name} tinha ${n1} ${item} e ganhou ${n2}. Quantos ${item} ele tem agora?`;
    } else {
        text = `${name} comprou ${n1} ${item} e depois comprou mais ${n2}. Com quantos ficou no total?`;
    }

    const answer = n1 + n2;
    bank.ADD.push({
      id: `add-${idCounter++}`,
      type: 'ADD',
      text,
      answer,
      options: generateOptions(answer)
    });
  }

  // --- 40 SUBTRACTION ---
  for (let i = 0; i < 40; i++) {
    const n1 = Math.floor(Math.random() * 80) + 20; // Larger start
    const n2 = Math.floor(Math.random() * (n1 - 5)) + 1; // Ensure result > 0
    const name = r(names);
    const item = r(items);

    let text = "";
    if (i % 2 === 0) {
        text = `${name} tinha ${n1} ${item} e perdeu ${n2}. Com quantos ficou?`;
    } else {
        text = `De um total de ${n1} ${item}, ${name} usou ${n2}. Quantos restam?`;
    }

    const answer = n1 - n2;
    bank.SUB.push({
      id: `sub-${idCounter++}`,
      type: 'SUB',
      text,
      answer,
      options: generateOptions(answer)
    });
  }

  // --- 60 MULTIPLICATION ---
  for (let i = 0; i < 60; i++) {
    const n1 = Math.floor(Math.random() * 12) + 2;
    const n2 = Math.floor(Math.random() * 10) + 2;
    const name = r(names);
    const item = r(items);
    const container = r(containers);

    let text = "";
    if (i % 3 === 0) {
        text = `Um ${container.slice(0, -1)} tem ${n1} ${item}. ${name} comprou ${n2} ${container}. Quantos ${item} são?`;
    } else if (i % 3 === 1) {
        text = `${name} estuda ${n1} horas por dia durante ${n2} dias. Quantas horas estudou?`;
    } else {
        text = `${name} organizou ${n2} fileiras com ${n1} cadeiras cada. Quantas cadeiras há no total?`;
    }

    const answer = n1 * n2;
    bank.MULT.push({
      id: `mult-${idCounter++}`,
      type: 'MULT',
      text,
      answer,
      options: generateOptions(answer)
    });
  }

  // --- 60 DIVISION ---
  for (let i = 0; i < 60; i++) {
    const answer = Math.floor(Math.random() * 15) + 2;
    const divisor = Math.floor(Math.random() * 8) + 2;
    const total = answer * divisor; // Ensure integer result
    const name = r(names);
    const item = r(items);
    
    let text = "";
    if (i % 2 === 0) {
        text = `${name} tem ${total} ${item} e dividiu igualmente entre ${divisor} amigos. Quantos cada um recebeu?`;
    } else {
        text = `Para guardar ${total} ${item} em ${divisor} caixas iguais, quantos ${item} ficam em cada caixa?`;
    }

    bank.DIV.push({
      id: `div-${idCounter++}`,
      type: 'DIV',
      text,
      answer,
      options: generateOptions(answer)
    });
  }

  return bank;
};

const fullBank = generateQuestions();

export const getRandomQuestions = (): Question[] => {
  const shuffle = (array: Question[]) => [...array].sort(() => 0.5 - Math.random());

  const selectedAdd = shuffle(fullBank.ADD).slice(0, 2);
  const selectedSub = shuffle(fullBank.SUB).slice(0, 2);
  const selectedMult = shuffle(fullBank.MULT).slice(0, 3);
  const selectedDiv = shuffle(fullBank.DIV).slice(0, 3);

  // Combine and shuffle final list so types are mixed for the user
  return shuffle([
    ...selectedAdd,
    ...selectedSub,
    ...selectedMult,
    ...selectedDiv
  ]);
};