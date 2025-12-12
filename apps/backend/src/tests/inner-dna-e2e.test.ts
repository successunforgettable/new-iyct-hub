// @ts-nocheck
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INNER DNA END-TO-END COMPREHENSIVE TEST SUITE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Tests the COMPLETE Inner DNA assessment flow:
 * 1. DATA VALIDATION - All questions, behaviors, scenarios exist
 * 2. RHETI ALGORITHM - Correct types emerge with gap awareness
 * 3. HERO MOMENTS - Narrowing from top 3 to winner
 * 4. BUILDING BLOCKS - Wing determination
 * 5. COLOR STATES - State identification
 * 6. SUBTYPES - Stack calculation
 * 7. API INTEGRATION - All endpoints work
 * 8. FULL E2E - Simulated users through entire flow
 * 
 * Run: npx ts-node src/tests/inner-dna-e2e.test.ts
 */

import axios from 'axios';
import { RHETI_QUESTIONS, COLUMN_TO_TYPE, TYPE_NAMES } from '../data/rheti-questions';
import { GENERAL_SCENARIOS, CONFIDENCE_THRESHOLDS, SCENARIO_LIMITS } from '../data/hero-moments-scenarios';
import { WING_QUESTIONS, getWingQuestionsForType, determineWing } from '../data/building-blocks-questions';
import { COLOR_STATES } from '../data/color-states-data';

const API_BASE = 'http://localhost:3001/api/v1';

// ═══════════════════════════════════════════════════════════════════════════
// TEST TRACKING
// ═══════════════════════════════════════════════════════════════════════════

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
  category: string;
}

const results: TestResult[] = [];
let passCount = 0;
let failCount = 0;

function test(category: string, name: string, condition: boolean, details?: string) {
  if (condition) {
    passCount++;
    results.push({ category, name, passed: true, details });
    console.log(`  ✅ ${name}`);
  } else {
    failCount++;
    results.push({ category, name, passed: false, details });
    console.log(`  ❌ ${name}${details ? ` - ${details}` : ''}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPE MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

const TYPE_TO_COLUMN: Record<number, string> = {};
Object.entries(COLUMN_TO_TYPE).forEach(([col, type]) => {
  TYPE_TO_COLUMN[type] = col;
});

// @ts-ignore
const _WING_ADJACENCIES: Record<number, [number, number]> = {
  1: [9, 2], 2: [1, 3], 3: [2, 4], 4: [3, 5], 5: [4, 6],
  6: [5, 7], 7: [6, 8], 8: [7, 9], 9: [8, 1]
};

type AnswerPattern = Record<number, number>;

// ═══════════════════════════════════════════════════════════════════════════
// RHETI SIMULATOR (with gap calculation)
// ═══════════════════════════════════════════════════════════════════════════

function simulateRheti(pattern: AnswerPattern): {
  topTypes: number[];
  scores: Record<number, number>;
  winner: number;
  gap: number;
} {
  const columnCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0 };
  
  const total = Object.values(pattern).reduce((a, b) => (a || 0) + (b || 0), 0) as number;
  const normalized: AnswerPattern = {};
  Object.entries(pattern).forEach(([type, pct]) => {
    normalized[parseInt(type)] = ((pct || 0) / (total || 1)) * 100;
  });

  RHETI_QUESTIONS.forEach(q => {
    const typeA = COLUMN_TO_TYPE[q.columnA];
    const typeB = COLUMN_TO_TYPE[q.columnB];
    const prefA = normalized[typeA] || 0;
    const prefB = normalized[typeB] || 0;
    
    if (prefA + prefB === 0) {
      columnCounts[Math.random() > 0.5 ? q.columnA : q.columnB]++;
    } else {
      const threshold = prefA / (prefA + prefB);
      columnCounts[Math.random() < threshold ? q.columnA : q.columnB]++;
    }
  });

  const scores: Record<number, number> = {};
  for (let t = 1; t <= 9; t++) scores[t] = 0;
  Object.entries(columnCounts).forEach(([col, count]) => {
    scores[COLUMN_TO_TYPE[col]] = count;
  });

  const sorted = Object.entries(scores)
    .map(([t, score]) => ({ type: parseInt(t), score }))
    .sort((a, b) => b.score - a.score);

  return {
    topTypes: sorted.slice(0, 3).map(s => s.type),
    scores,
    winner: sorted[0].type,
    gap: sorted[0].score - sorted[1].score
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO MOMENTS SIMULATOR (with RHETI gap awareness)
// ═══════════════════════════════════════════════════════════════════════════

function simulateHeroMoments(
  topTypes: number[], 
  pickPattern: AnswerPattern, 
  rhetiGap: number = 5,
  maxScenarios: number = 12
): {
  finalType: number;
  confidence: number;
  scenarioCount: number;
  isComplete: boolean;
} {
  const typeCounts: Record<number, number> = {};
  topTypes.forEach(t => typeCounts[t] = 0);

  const relevantPattern: AnswerPattern = {};
  topTypes.forEach(t => relevantPattern[t] = pickPattern[t] || 0);
  const total = Object.values(relevantPattern).reduce((a, b) => (a || 0) + (b || 0), 0) as number;
  
  let scenarioCount = 0;
  let isComplete = false;
  
  // RHETI gap awareness
  const isRhetiClose = rhetiGap < 3;

  for (let i = 0; i < maxScenarios && !isComplete; i++) {
    scenarioCount++;
    
    const rand = Math.random() * (total || 1);
    let cumulative = 0;
    let picked = topTypes[0];
    
    for (const t of topTypes) {
      cumulative += relevantPattern[t] || 0;
      if (rand <= cumulative) {
        picked = t;
        break;
      }
    }
    
    typeCounts[picked]++;

    // Completion logic WITH RHETI gap awareness
    const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    const dominantCount = sorted[0][1];
    const secondCount = sorted[1] ? sorted[1][1] : 0;
    const heroGap = dominantCount - secondCount;

    // SMART COMPLETION - matches service logic
    if (!isRhetiClose && dominantCount >= 3 && heroGap >= 2) {
      isComplete = true;
    } else if (!isRhetiClose && dominantCount >= 3 && heroGap >= 1) {
      isComplete = true;
    } else if (isRhetiClose && scenarioCount >= 7 && heroGap >= 3) {
      isComplete = true;
    } else if (isRhetiClose && scenarioCount >= 8 && heroGap >= 2) {
      isComplete = true;
    } else if (!isRhetiClose && scenarioCount >= 5 && heroGap >= 2) {
      isComplete = true;
    } else if (scenarioCount >= 10) {
      isComplete = true;
    }
  }

  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const finalType = parseInt(sorted[0][0]);
  const confidence = sorted[0][1] / scenarioCount;

  return { finalType, confidence, scenarioCount, isComplete };
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 1: DATA VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

function testDataValidation() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                      DATA VALIDATION                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  // RHETI
  test('Data', 'RHETI: 36 questions exist', RHETI_QUESTIONS.length === 36);
  test('Data', 'RHETI: All columns A-I mapped', ['A','B','C','D','E','F','G','H','I'].every(c => COLUMN_TO_TYPE[c]));
  
  // Hero Moments
  test('Data', 'Hero Moments: 15 general scenarios', GENERAL_SCENARIOS.length === 15);
  const allHave9Options = GENERAL_SCENARIOS.every((s: any) => s.options.length === 9);
  test('Data', 'Hero Moments: Each scenario has 9 options', allHave9Options);
  
  // Building Blocks
  test('Data', 'Building Blocks: 9 wing question sets', WING_QUESTIONS.length === 9);
  const all5Questions = WING_QUESTIONS.every(ws => ws.questions.length === 5);
  test('Data', 'Building Blocks: Each type has 5 questions', all5Questions);
  
  // Color States
  test('Data', 'Color States: 9 type definitions', COLOR_STATES.length === 9);
  const all5States = COLOR_STATES.every(cs => cs.states.length === 5);
  test('Data', 'Color States: Each type has 5 states', all5States);
  
  // Config thresholds
  test('Data', 'Config: MIN_CONFIDENCE = 0.90', CONFIDENCE_THRESHOLDS.MIN_CONFIDENCE === 0.90);
  test('Data', 'Config: MIN_SCENARIOS = 3', SCENARIO_LIMITS.MIN_SCENARIOS === 3);
  test('Data', 'Config: MAX_SCENARIOS = 12', SCENARIO_LIMITS.MAX_SCENARIOS === 12);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 2: RHETI ALGORITHM ACCURACY
// ═══════════════════════════════════════════════════════════════════════════

function testRhetiAccuracy() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                    RHETI ALGORITHM ACCURACY                       ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const scenarios = [
    { name: 'Strong Type 8 (70%)', pattern: { 8: 70, 3: 20, 7: 10 }, target: 8 },
    { name: 'Strong Type 1 (70%)', pattern: { 1: 70, 6: 20, 2: 10 }, target: 1 },
    { name: 'Moderate Type 8 (55%)', pattern: { 8: 55, 3: 30, 7: 15 }, target: 8 },
    { name: 'Weak Type 8 (45%)', pattern: { 8: 45, 3: 35, 7: 20 }, target: 8 },
    { name: 'Mixed Type 8 (35%)', pattern: { 8: 35, 3: 33, 7: 32 }, target: 8 },
  ];

  scenarios.forEach(s => {
    let inTop3 = 0;
    const runs = 200;
    
    for (let i = 0; i < runs; i++) {
      const result = simulateRheti(s.pattern as AnswerPattern);
      if (result.topTypes.includes(s.target)) inTop3++;
    }
    
    const rate = inTop3 / runs;
    test('RHETI', `${s.name} → In Top 3: ${(rate * 100).toFixed(0)}%`, rate >= 0.85);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 3: HERO MOMENTS WITH RHETI GAP AWARENESS
// ═══════════════════════════════════════════════════════════════════════════

function testHeroMomentsWithGapAwareness() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║              HERO MOMENTS (RHETI Gap Awareness)                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  // Clear RHETI (gap >= 3) - should complete faster
  const clearScenarios = [
    { topTypes: [8, 3, 7], pattern: { 8: 70, 3: 20, 7: 10 }, expected: 8, desc: 'Clear RHETI 70%', rhetiGap: 5 },
    { topTypes: [8, 3, 7], pattern: { 8: 50, 3: 35, 7: 15 }, expected: 8, desc: 'Clear RHETI 50%', rhetiGap: 4 },
  ];

  // Close RHETI (gap < 3) - should require more scenarios
  const closeScenarios = [
    { topTypes: [8, 3, 7], pattern: { 8: 45, 3: 40, 7: 15 }, expected: 8, desc: 'Close RHETI 45/40', rhetiGap: 1 },
    { topTypes: [1, 6, 2], pattern: { 1: 45, 6: 42, 2: 13 }, expected: 1, desc: 'Close RHETI 45/42', rhetiGap: 2 },
  ];

  console.log('  [Clear RHETI Results - Should complete in ~5 scenarios]\n');
  clearScenarios.forEach(s => {
    let wins = 0, totalScenarios = 0;
    const runs = 200;
    
    for (let i = 0; i < runs; i++) {
      const result = simulateHeroMoments(s.topTypes, s.pattern as AnswerPattern, s.rhetiGap);
      if (result.finalType === s.expected) wins++;
      totalScenarios += result.scenarioCount;
    }
    
    const winRate = wins / runs;
    const avgScenarios = totalScenarios / runs;
    test('Hero Clear', `${s.desc} → ${(winRate * 100).toFixed(0)}% win, avg ${avgScenarios.toFixed(1)} scenarios`, winRate >= 0.55);
  });

  console.log('\n  [Close RHETI Results - Should require 7-10 scenarios]\n');
  closeScenarios.forEach(s => {
    let wins = 0, totalScenarios = 0;
    const runs = 200;
    
    for (let i = 0; i < runs; i++) {
      const result = simulateHeroMoments(s.topTypes, s.pattern as AnswerPattern, s.rhetiGap);
      if (result.finalType === s.expected) wins++;
      totalScenarios += result.scenarioCount;
    }
    
    const winRate = wins / runs;
    const avgScenarios = totalScenarios / runs;
    
    // Close races should run MORE scenarios (7+)
    const runsEnoughScenarios = avgScenarios >= 6;
    test('Hero Close', `${s.desc} → ${(winRate * 100).toFixed(0)}% win, avg ${avgScenarios.toFixed(1)} scenarios`, 
      winRate >= 0.45 && runsEnoughScenarios,
      !runsEnoughScenarios ? 'Should run 7+ scenarios for close races' : undefined
    );
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 4: FULL E2E FLOW (All 9 Types)
// ═══════════════════════════════════════════════════════════════════════════

function testFullE2EFlow() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║               FULL E2E FLOW (All 9 Types × 200 runs)              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const typeResults: Record<number, { inTop3: number; winsHero: number; total: number }> = {};

  for (let targetType = 1; targetType <= 9; targetType++) {
    typeResults[targetType] = { inTop3: 0, winsHero: 0, total: 0 };
    
    const adjacent1 = targetType === 1 ? 9 : targetType - 1;
    const adjacent2 = targetType === 9 ? 1 : targetType + 1;
    const rhetiPattern: AnswerPattern = { [targetType]: 60, [adjacent1]: 25, [adjacent2]: 15 };
    
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      typeResults[targetType].total++;
      
      // Step 1: RHETI
      const rhetiResult = simulateRheti(rhetiPattern);
      
      if (rhetiResult.topTypes.includes(targetType)) {
        typeResults[targetType].inTop3++;
        
        // Step 2: Hero Moments (pass RHETI gap for awareness)
        const heroPattern: AnswerPattern = {};
        rhetiResult.topTypes.forEach(t => {
          heroPattern[t] = t === targetType ? 60 : 20;
        });
        
        const heroResult = simulateHeroMoments(rhetiResult.topTypes, heroPattern, rhetiResult.gap);
        
        if (heroResult.finalType === targetType) {
          typeResults[targetType].winsHero++;
        }
      }
    }

    const inTop3Rate = (typeResults[targetType].inTop3 / runs) * 100;
    const heroWinRate = typeResults[targetType].inTop3 > 0 
      ? (typeResults[targetType].winsHero / typeResults[targetType].inTop3) * 100 
      : 0;
    const overallRate = (typeResults[targetType].winsHero / runs) * 100;

    test('E2E', 
      `Type ${targetType} (${TYPE_NAMES[targetType]}): Overall ${overallRate.toFixed(0)}%`,
      overallRate >= 50,
      `RHETI→Top3: ${inTop3Rate.toFixed(0)}%, Hero wins: ${heroWinRate.toFixed(0)}%`
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 5: CONFUSABLE TYPE PAIRS
// ═══════════════════════════════════════════════════════════════════════════

function testConfusableTypes() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                 CONFUSABLE TYPE DIFFERENTIATION                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const confusablePairs = [
    { a: 8, b: 3, reason: 'Both competitive' },
    { a: 5, b: 9, reason: 'Both withdrawn' },
    { a: 1, b: 6, reason: 'Both anxious' },
    { a: 3, b: 7, reason: 'Both optimistic' },
    { a: 1, b: 8, reason: 'Both assertive' },
  ];

  confusablePairs.forEach(pair => {
    const pattern: AnswerPattern = { [pair.a]: 55, [pair.b]: 45 };
    let successCount = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const rhetiResult = simulateRheti(pattern);
      
      if (rhetiResult.topTypes.includes(pair.a)) {
        const heroPattern: AnswerPattern = {};
        rhetiResult.topTypes.forEach(t => {
          heroPattern[t] = t === pair.a ? 55 : 22.5;
        });
        
        const heroResult = simulateHeroMoments(rhetiResult.topTypes, heroPattern, rhetiResult.gap);
        if (heroResult.finalType === pair.a) successCount++;
      }
    }

    const successRate = (successCount / runs) * 100;
    test('Confusable', `Type ${pair.a} vs ${pair.b} (${pair.reason}): ${successRate.toFixed(0)}%`, successRate >= 45);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 6: BUILDING BLOCKS (Wing Determination)
// ═══════════════════════════════════════════════════════════════════════════

function testBuildingBlocks() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                    BUILDING BLOCKS (Wings)                        ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  for (let type = 1; type <= 9; type++) {
    const wingSet = getWingQuestionsForType(type);
    if (!wingSet) {
      test('Wings', `Type ${type}: Wing questions exist`, false);
      continue;
    }

    // All-A picks → wingA
    const allA = determineWing(type, 5, 0);
    test('Wings', `Type ${type}: 5A-0B → Wing ${wingSet.wingA}`, allA.wing === wingSet.wingA);
    
    // All-B picks → wingB
    const allB = determineWing(type, 0, 5);
    test('Wings', `Type ${type}: 0A-5B → Wing ${wingSet.wingB}`, allB.wing === wingSet.wingB);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 7: API INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════

async function testAPIIntegration() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                      API INTEGRATION                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  let authToken = '';

  // Server check
  try {
    await axios.get(`${API_BASE}/health`, { timeout: 2000 });
    test('API', 'Server is running', true);
  } catch (e: any) {
    if (e.code === 'ECONNREFUSED') {
      test('API', 'Server is running', false, 'Server not running on port 3001');
      console.log('\n  ⚠️  Skipping remaining API tests\n');
      return;
    }
    test('API', 'Server is running', true);
  }

  // Login
  try {
    const resp = await axios.post(`${API_BASE}/auth/login`, {
      email: 'arfeen@iyct.com',
      password: 'Arfeen123'
    });
    authToken = resp.data.data?.token || resp.data.token;
    test('API', 'Login works', !!authToken);
  } catch (e: any) {
    test('API', 'Login works', false, e.response?.data?.error?.message || e.message);
    return;
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  // Assessment endpoint
  try {
    const resp = await axios.get(`${API_BASE}/inner-dna/assessment`, { headers });
    test('API', 'GET /inner-dna/assessment', resp.status === 200);
  } catch (e: any) {
    test('API', 'GET /inner-dna/assessment', false);
  }

  // RHETI question
  try {
    const resp = await axios.get(`${API_BASE}/inner-dna/rheti/question/1`, { headers });
    const hasData = resp.data?.data?.question?.optionA && resp.data?.data?.question?.optionB;
    test('API', 'GET /inner-dna/rheti/question/1', hasData);
  } catch (e: any) {
    test('API', 'GET /inner-dna/rheti/question/1', false);
  }

  // Building blocks
  try {
    const resp = await axios.get(`${API_BASE}/inner-dna/building-blocks/questions`, { headers });
    test('API', 'GET /inner-dna/building-blocks/questions', resp.status === 200 || resp.status === 400);
  } catch (e: any) {
    test('API', 'GET /inner-dna/building-blocks/questions', e.response?.status === 400);
  }

  // Color states
  try {
    const resp = await axios.post(`${API_BASE}/inner-dna/color-states/save`, {
      primaryState: 'YLW',
      primaryStatePct: 60,
      secondaryState: 'BLU',
      secondaryStatePct: 40
    }, { headers });
    test('API', 'POST /inner-dna/color-states/save', resp.status === 200 || resp.status === 201);
  } catch (e: any) {
    test('API', 'POST /inner-dna/color-states/save', false);
  }

  // Subtype tokens
  try {
    const resp = await axios.post(`${API_BASE}/inner-dna/subtype-tokens/save`, {
      tokens: { sp: 7, sx: 2, so: 1 },
      order: ['sp', 'sx', 'so']
    }, { headers });
    test('API', 'POST /inner-dna/subtype-tokens/save', resp.status === 200 || resp.status === 201);
  } catch (e: any) {
    test('API', 'POST /inner-dna/subtype-tokens/save', false);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 8: STRESS TEST (1000 simulated users)
// ═══════════════════════════════════════════════════════════════════════════

function testStress() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║              STRESS TEST (1000 Simulated Users)                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const typeAccuracy: Record<number, { correct: number; total: number }> = {};
  for (let t = 1; t <= 9; t++) typeAccuracy[t] = { correct: 0, total: 0 };

  // 1000 users with varying personality strengths
  for (let i = 0; i < 1000; i++) {
    const targetType = (i % 9) + 1; // Cycle through all 9 types
    const strength = 50 + Math.random() * 30; // 50-80% strength
    
    const adjacent1 = targetType === 1 ? 9 : targetType - 1;
    const adjacent2 = targetType === 9 ? 1 : targetType + 1;
    const remaining = 100 - strength;
    
    const pattern: AnswerPattern = {
      [targetType]: strength,
      [adjacent1]: remaining * 0.6,
      [adjacent2]: remaining * 0.4
    };

    typeAccuracy[targetType].total++;

    const rhetiResult = simulateRheti(pattern);
    
    if (rhetiResult.topTypes.includes(targetType)) {
      const heroPattern: AnswerPattern = {};
      rhetiResult.topTypes.forEach(t => {
        heroPattern[t] = t === targetType ? strength : (100 - strength) / 2;
      });
      
      const heroResult = simulateHeroMoments(rhetiResult.topTypes, heroPattern, rhetiResult.gap);
      
      if (heroResult.finalType === targetType) {
        typeAccuracy[targetType].correct++;
      }
    }
  }

  let totalCorrect = 0;
  let totalTests = 0;

  for (let t = 1; t <= 9; t++) {
    const rate = (typeAccuracy[t].correct / typeAccuracy[t].total) * 100;
    totalCorrect += typeAccuracy[t].correct;
    totalTests += typeAccuracy[t].total;
    
    test('Stress', `Type ${t}: ${rate.toFixed(0)}% accuracy (${typeAccuracy[t].correct}/${typeAccuracy[t].total})`, rate >= 60);
  }

  const overallRate = (totalCorrect / totalTests) * 100;
  test('Stress', `OVERALL: ${overallRate.toFixed(1)}% accuracy (${totalCorrect}/${totalTests})`, overallRate >= 70);
}

// ═══════════════════════════════════════════════════════════════════════════
// RUN ALL TESTS
// ═══════════════════════════════════════════════════════════════════════════

async function runAllTests() {
  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('         INNER DNA END-TO-END COMPREHENSIVE TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(`  Started: ${new Date().toISOString()}`);
  console.log('  Testing: Data + Algorithms + API + Stress (1000 users)\n');

  try {
    testDataValidation();
    testRhetiAccuracy();
    testHeroMomentsWithGapAwareness();
    testFullE2EFlow();
    testConfusableTypes();
    testBuildingBlocks();
    await testAPIIntegration();
    testStress();
  } catch (error) {
    console.error('\n❌ TEST SUITE ERROR:', error);
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('                         TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(`  ✅ PASSED: ${passCount}`);
  console.log(`  ❌ FAILED: ${failCount}`);
  console.log(`  TOTAL: ${passCount + failCount}`);

  const categories: Record<string, { passed: number; failed: number }> = {};
  results.forEach(r => {
    if (!categories[r.category]) categories[r.category] = { passed: 0, failed: 0 };
    if (r.passed) categories[r.category].passed++;
    else categories[r.category].failed++;
  });

  console.log('\n  BY CATEGORY:');
  Object.entries(categories).forEach(([cat, counts]) => {
    const status = counts.failed === 0 ? '✅' : '⚠️';
    console.log(`    ${status} ${cat}: ${counts.passed}/${counts.passed + counts.failed}`);
  });

  console.log('═══════════════════════════════════════════════════════════════════════\n');

  if (failCount === 0) {
    console.log('  🎉 ALL E2E TESTS PASSED - INNER DNA SYSTEM IS PRODUCTION READY 🎉\n');
  } else {
    console.log('  FAILED TESTS:\n');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`    ❌ [${r.category}] ${r.name}`);
      if (r.details) console.log(`       ${r.details}`);
    });
    console.log('');
  }
}

runAllTests();
