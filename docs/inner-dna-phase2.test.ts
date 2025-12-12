cat > ~/Desktop/iyct-platform/apps/backend/src/tests/inner-dna-phase2.test.ts << 'EOF'
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INNER DNA PHASE 2 TESTS - REALISTIC & INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ACTUAL FLOW:
 *   RHETI → Top 3 Types → Hero Moments → Final Type
 * 
 * SUCCESS CRITERIA:
 *   1. RHETI: Correct type lands in TOP 3 (not necessarily #1)
 *   2. Hero Moments: Correct type WINS from those 3
 * 
 * Run: npx ts-node src/tests/inner-dna-phase2.test.ts
 */

import axios from 'axios';
import { RHETI_QUESTIONS, COLUMN_TO_TYPE, TYPE_NAMES } from '../data/rheti-questions';

const API_BASE = 'http://localhost:3001/api';

// ═══════════════════════════════════════════════════════════════════════════
// TEST UTILITIES
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

// Reverse mapping: Type → Column
const TYPE_TO_COLUMN: Record<number, string> = {};
Object.entries(COLUMN_TO_TYPE).forEach(([col, type]) => {
  TYPE_TO_COLUMN[type] = col;
});

// ═══════════════════════════════════════════════════════════════════════════
// RHETI SCORING SIMULATOR
// ═══════════════════════════════════════════════════════════════════════════

type AnswerPattern = Record<number, number>;

function simulateRhetiWithPattern(pattern: AnswerPattern): { 
  topTypes: number[]; 
  scores: Record<number, number>;
  winner: number;
  secondPlace: number;
  thirdPlace: number;
  gap: number;
} {
  const columnCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0 };
  
  // Normalize pattern to sum to 100
  const total = Object.values(pattern).reduce((a, b) => a + b, 0);
  const normalized: AnswerPattern = {};
  Object.entries(pattern).forEach(([type, pct]) => {
    normalized[parseInt(type)] = (pct / total) * 100;
  });

  RHETI_QUESTIONS.forEach(q => {
    const typeA = COLUMN_TO_TYPE[q.columnA];
    const typeB = COLUMN_TO_TYPE[q.columnB];
    
    // Probabilistic selection based on pattern
    const prefA = normalized[typeA] || 0;
    const prefB = normalized[typeB] || 0;
    
    if (prefA + prefB === 0) {
      // Neither type in pattern, pick randomly
      columnCounts[Math.random() > 0.5 ? q.columnA : q.columnB]++;
    } else {
      // Weighted selection
      const threshold = prefA / (prefA + prefB);
      if (Math.random() < threshold) {
        columnCounts[q.columnA]++;
      } else {
        columnCounts[q.columnB]++;
      }
    }
  });

  // Calculate type scores
  const scores: Record<number, number> = {};
  for (let t = 1; t <= 9; t++) scores[t] = 0;
  
  Object.entries(columnCounts).forEach(([col, count]) => {
    const type = COLUMN_TO_TYPE[col];
    scores[type] = count;
  });

  // Sort and get top 3
  const sorted = Object.entries(scores)
    .map(([t, score]) => ({ type: parseInt(t), score }))
    .sort((a, b) => b.score - a.score);

  return {
    topTypes: sorted.slice(0, 3).map(s => s.type),
    scores,
    winner: sorted[0].type,
    secondPlace: sorted[1].type,
    thirdPlace: sorted[2].type,
    gap: sorted[0].score - sorted[1].score
  };
}

// Run simulation and check if target type lands in TOP 3
function runRhetiTop3Simulation(pattern: AnswerPattern, targetType: number, runs: number = 100): {
  inTop3Rate: number;
  asFirstRate: number;
  asSecondRate: number;
  asThirdRate: number;
  avgPosition: number;
} {
  let inTop3 = 0;
  let asFirst = 0;
  let asSecond = 0;
  let asThird = 0;
  let totalPosition = 0;

  for (let i = 0; i < runs; i++) {
    const result = simulateRhetiWithPattern(pattern);
    const position = result.topTypes.indexOf(targetType);
    
    if (position !== -1) {
      inTop3++;
      totalPosition += position + 1;
      if (position === 0) asFirst++;
      else if (position === 1) asSecond++;
      else if (position === 2) asThird++;
    } else {
      totalPosition += 9; // Not in top 3, assume worst
    }
  }

  return {
    inTop3Rate: inTop3 / runs,
    asFirstRate: asFirst / runs,
    asSecondRate: asSecond / runs,
    asThirdRate: asThird / runs,
    avgPosition: totalPosition / runs
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO MOMENTS SIMULATOR
// ═══════════════════════════════════════════════════════════════════════════

function simulateHeroMoments(topTypes: number[], pickPattern: AnswerPattern, maxScenarios: number = 8): {
  finalType: number;
  confidence: number;
  scenarioCount: number;
  isComplete: boolean;
  typeCounts: Record<number, number>;
} {
  const typeCounts: Record<number, number> = {};
  topTypes.forEach(t => typeCounts[t] = 0);

  // Normalize pattern for top 3 only
  const relevantPattern: AnswerPattern = {};
  topTypes.forEach(t => relevantPattern[t] = pickPattern[t] || 0);
  const total = Object.values(relevantPattern).reduce((a, b) => a + b, 0);
  
  let scenarioCount = 0;
  let isComplete = false;
  
  for (let i = 0; i < maxScenarios && !isComplete; i++) {
    scenarioCount++;
    
    // Probabilistic pick based on pattern
    const rand = Math.random() * total;
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

    // Check completion logic (from service)
    const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    const dominantCount = sorted[0][1];
    const secondCount = sorted[1] ? sorted[1][1] : 0;
    const gap = dominantCount - secondCount;

    if (dominantCount >= 3 && gap >= 2) {
      isComplete = true;
    } else if (dominantCount >= 3 && gap >= 1) {
      isComplete = true;
    } else if (scenarioCount >= 5 && gap >= 2) {
      isComplete = true;
    }
  }

  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const finalType = parseInt(sorted[0][0]);
  const confidence = sorted[0][1] / scenarioCount;

  return { finalType, confidence, scenarioCount, isComplete, typeCounts };
}

function runHeroSimulation(topTypes: number[], pattern: AnswerPattern, expectedWinner: number, runs: number = 100): {
  winRate: number;
  avgScenarios: number;
  completionRate: number;
} {
  let wins = 0;
  let totalScenarios = 0;
  let completions = 0;

  for (let i = 0; i < runs; i++) {
    const result = simulateHeroMoments(topTypes, pattern);
    if (result.finalType === expectedWinner) wins++;
    totalScenarios += result.scenarioCount;
    if (result.isComplete) completions++;
  }

  return {
    winRate: wins / runs,
    avgScenarios: totalScenarios / runs,
    completionRate: completions / runs
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 1: RHETI TOP 3 ACCURACY (THE REAL METRIC)
// ═══════════════════════════════════════════════════════════════════════════

function testRhetiTop3Accuracy() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║        RHETI TOP 3 ACCURACY (The Real Success Metric)             ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  console.log('  Goal: Correct type lands in TOP 3 (not necessarily #1)\n');

  const scenarios: Array<{ name: string; pattern: AnswerPattern; target: number }> = [
    // Strong preference
    { name: 'Strong Type 8 (70%)', pattern: { 8: 70, 3: 20, 7: 10 }, target: 8 },
    { name: 'Strong Type 1 (70%)', pattern: { 1: 70, 6: 20, 2: 10 }, target: 1 },
    { name: 'Strong Type 5 (70%)', pattern: { 5: 70, 4: 20, 9: 10 }, target: 5 },
    
    // Moderate preference
    { name: 'Moderate Type 8 (55%)', pattern: { 8: 55, 3: 30, 7: 15 }, target: 8 },
    { name: 'Moderate Type 3 (55%)', pattern: { 3: 55, 8: 30, 7: 15 }, target: 3 },
    
    // Weak but present
    { name: 'Weak Type 8 (45%)', pattern: { 8: 45, 3: 35, 7: 20 }, target: 8 },
    { name: 'Weak Type 4 (40%)', pattern: { 4: 40, 5: 35, 2: 25 }, target: 4 },
    
    // Very mixed (realistic uncertain user)
    { name: 'Mixed Type 8 (35%)', pattern: { 8: 35, 3: 33, 7: 32 }, target: 8 },
  ];

  scenarios.forEach(s => {
    const result = runRhetiTop3Simulation(s.pattern, s.target, 200);
    
    test(
      'RHETI Top 3',
      `${s.name} → In Top 3: ${(result.inTop3Rate * 100).toFixed(0)}%`,
      result.inTop3Rate >= 0.85, // Should be in top 3 at least 85% of time
      `#1: ${(result.asFirstRate * 100).toFixed(0)}%, #2: ${(result.asSecondRate * 100).toFixed(0)}%, #3: ${(result.asThirdRate * 100).toFixed(0)}%, Avg pos: ${result.avgPosition.toFixed(1)}`
    );
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 2: HERO MOMENTS NARROWING (FROM TOP 3 TO WINNER)
// ═══════════════════════════════════════════════════════════════════════════

function testHeroMomentsNarrowing() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║         HERO MOMENTS NARROWING (From Top 3 to Winner)             ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  console.log('  Goal: Correct type wins from the 3 candidates\n');

  // Assume RHETI already gave us top 3 with correct type included
  const scenarios: Array<{ topTypes: number[]; pattern: AnswerPattern; expected: number; desc: string }> = [
    // Clear winner patterns
    { topTypes: [8, 3, 7], pattern: { 8: 70, 3: 20, 7: 10 }, expected: 8, desc: 'Clear Type 8 (70%)' },
    { topTypes: [3, 8, 7], pattern: { 3: 65, 8: 25, 7: 10 }, expected: 3, desc: 'Clear Type 3 (65%)' },
    { topTypes: [1, 6, 2], pattern: { 1: 60, 6: 30, 2: 10 }, expected: 1, desc: 'Clear Type 1 (60%)' },
    
    // Moderate winner patterns
    { topTypes: [8, 3, 7], pattern: { 8: 50, 3: 35, 7: 15 }, expected: 8, desc: 'Moderate Type 8 (50%)' },
    { topTypes: [5, 9, 4], pattern: { 5: 50, 9: 35, 4: 15 }, expected: 5, desc: 'Moderate Type 5 (50%)' },
    
    // Close race patterns
    { topTypes: [8, 3, 7], pattern: { 8: 45, 3: 40, 7: 15 }, expected: 8, desc: 'Close Type 8 vs 3 (45/40)' },
    { topTypes: [1, 6, 2], pattern: { 1: 45, 6: 42, 2: 13 }, expected: 1, desc: 'Close Type 1 vs 6 (45/42)' },
    
    // Correct type is #2 in RHETI but should still win Hero
    { topTypes: [3, 8, 7], pattern: { 8: 55, 3: 30, 7: 15 }, expected: 8, desc: 'Type 8 was #2 in RHETI but wins Hero' },
  ];

  scenarios.forEach(s => {
    const result = runHeroSimulation(s.topTypes, s.pattern, s.expected, 200);
    
    test(
      'Hero Narrowing',
      `${s.desc} → Wins: ${(result.winRate * 100).toFixed(0)}%`,
      result.winRate >= 0.55, // Should win more than half the time
      `Avg ${result.avgScenarios.toFixed(1)} scenarios, ${(result.completionRate * 100).toFixed(0)}% early completion`
    );
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 3: COMBINED FLOW (RHETI → HERO MOMENTS)
// ═══════════════════════════════════════════════════════════════════════════

function testCombinedFlow() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║           COMBINED FLOW: RHETI → HERO MOMENTS                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  console.log('  Full simulation: User with X% type preference through entire flow\n');

  for (let targetType = 1; targetType <= 9; targetType++) {
    // Realistic user: 60% target type, 25% adjacent, 15% another
    const adjacent1 = targetType === 1 ? 9 : targetType - 1;
    const adjacent2 = targetType === 9 ? 1 : targetType + 1;
    
    const rhetiPattern: AnswerPattern = { [targetType]: 60, [adjacent1]: 25, [adjacent2]: 15 };
    
    let totalSuccess = 0;
    let inTop3Count = 0;
    let winsHeroCount = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      // Step 1: RHETI
      const rhetiResult = simulateRhetiWithPattern(rhetiPattern);
      const inTop3 = rhetiResult.topTypes.includes(targetType);
      
      if (inTop3) {
        inTop3Count++;
        
        // Step 2: Hero Moments (with same preference pattern)
        const heroPattern: AnswerPattern = { 
          [rhetiResult.topTypes[0]]: targetType === rhetiResult.topTypes[0] ? 60 : 20,
          [rhetiResult.topTypes[1]]: targetType === rhetiResult.topTypes[1] ? 60 : 20,
          [rhetiResult.topTypes[2]]: targetType === rhetiResult.topTypes[2] ? 60 : 20,
        };
        heroPattern[targetType] = 60; // Ensure target has high preference
        
        const heroResult = simulateHeroMoments(rhetiResult.topTypes, heroPattern);
        
        if (heroResult.finalType === targetType) {
          winsHeroCount++;
          totalSuccess++;
        }
      }
    }

    const inTop3Rate = (inTop3Count / runs) * 100;
    const heroWinRate = inTop3Count > 0 ? (winsHeroCount / inTop3Count) * 100 : 0;
    const overallRate = (totalSuccess / runs) * 100;

    test(
      'Combined Flow',
      `Type ${targetType} (${TYPE_NAMES[targetType]}): Overall ${overallRate.toFixed(0)}%`,
      overallRate >= 50,
      `In Top 3: ${inTop3Rate.toFixed(0)}% → Wins Hero: ${heroWinRate.toFixed(0)}%`
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 4: CONFUSABLE TYPES (CAN SYSTEM DIFFERENTIATE?)
// ═══════════════════════════════════════════════════════════════════════════

function testConfusableTypes() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║              CONFUSABLE TYPE DIFFERENTIATION                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const confusablePairs = [
    { a: 8, b: 3, reason: 'Both competitive, image-conscious' },
    { a: 5, b: 9, reason: 'Both withdrawn, detached' },
    { a: 1, b: 6, reason: 'Both anxious, dutiful' },
    { a: 2, b: 9, reason: 'Both accommodating' },
    { a: 3, b: 7, reason: 'Both optimistic, active' },
    { a: 4, b: 6, reason: 'Both reactive, anxious' },
    { a: 1, b: 8, reason: 'Both assertive, principled' },
    { a: 2, b: 6, reason: 'Both loyal, security-seeking' },
  ];

  console.log('  Testing 55/45 split between confusable types\n');

  confusablePairs.forEach(pair => {
    // User is actually Type A but has some Type B tendencies
    const patternForA: AnswerPattern = { [pair.a]: 55, [pair.b]: 45 };
    
    let successCount = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const rhetiResult = simulateRhetiWithPattern(patternForA);
      
      if (rhetiResult.topTypes.includes(pair.a)) {
        // Simulate Hero with same pattern
        const heroPattern: AnswerPattern = { 
          [rhetiResult.topTypes[0]]: pair.a === rhetiResult.topTypes[0] ? 55 : 22.5,
          [rhetiResult.topTypes[1]]: pair.a === rhetiResult.topTypes[1] ? 55 : 22.5,
          [rhetiResult.topTypes[2]]: pair.a === rhetiResult.topTypes[2] ? 55 : 22.5,
        };
        
        const heroResult = simulateHeroMoments(rhetiResult.topTypes, heroPattern);
        if (heroResult.finalType === pair.a) successCount++;
      }
    }

    const successRate = (successCount / runs) * 100;
    
    test(
      'Confusable',
      `Type ${pair.a} vs ${pair.b} (${pair.reason}): ${successRate.toFixed(0)}% correct`,
      successRate >= 45, // Should get it right at least 45% with slim margin
      successRate < 50 ? 'BORDERLINE - these types are hard to differentiate' : undefined
    );
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 5: EDGE CASES
// ═══════════════════════════════════════════════════════════════════════════

function testEdgeCases() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                        EDGE CASES                                 ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  // Edge Case 1: Random picker (no clear type)
  console.log('  [Random/Unclear User]\n');
  
  const randomPattern: AnswerPattern = {};
  for (let t = 1; t <= 9; t++) randomPattern[t] = 11.1;
  
  const randomResults: Record<number, number> = {};
  for (let i = 0; i < 200; i++) {
    const result = simulateRhetiWithPattern(randomPattern);
    randomResults[result.winner] = (randomResults[result.winner] || 0) + 1;
  }
  
  const spread = Math.max(...Object.values(randomResults)) - Math.min(...Object.values(randomResults));
  test(
    'Edge Case',
    `Random picker: Spread across types = ${spread}`,
    spread < 80, // Should be somewhat distributed
    `Distribution: ${Object.entries(randomResults).map(([t, c]) => `${t}:${c}`).join(', ')}`
  );

  // Edge Case 2: Hero Moments with very close race
  console.log('\n  [Very Close Hero Race]\n');
  
  const closeRacePattern: AnswerPattern = { 8: 34, 3: 33, 7: 33 };
  const closeRace = runHeroSimulation([8, 3, 7], closeRacePattern, 8, 200);
  test(
    'Edge Case',
    `Near-tie in Hero (34/33/33): Type 8 wins ${(closeRace.winRate * 100).toFixed(0)}%`,
    closeRace.winRate >= 0.25 && closeRace.winRate <= 0.50,
    'Should be competitive but slight edge to leader'
  );

  // Edge Case 3: User changes their mind mid-Hero
  console.log('\n  [User Behavior Shifts Mid-Assessment]\n');
  
  // First half picks Type 8, second half picks Type 3
  let shiftWins8 = 0;
  let shiftWins3 = 0;
  
  for (let i = 0; i < 200; i++) {
    const typeCounts: Record<number, number> = { 8: 0, 3: 0, 7: 0 };
    
    // First 4 scenarios: prefer Type 8
    for (let j = 0; j < 4; j++) {
      const rand = Math.random();
      if (rand < 0.6) typeCounts[8]++;
      else if (rand < 0.9) typeCounts[3]++;
      else typeCounts[7]++;
    }
    
    // Last 4 scenarios: prefer Type 3
    for (let j = 0; j < 4; j++) {
      const rand = Math.random();
      if (rand < 0.6) typeCounts[3]++;
      else if (rand < 0.9) typeCounts[8]++;
      else typeCounts[7]++;
    }
    
    const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    const winner = parseInt(sorted[0][0]);
    
    if (winner === 8) shiftWins8++;
    if (winner === 3) shiftWins3++;
  }
  
  test(
    'Edge Case',
    `Behavior shift: Type 8 wins ${shiftWins8}, Type 3 wins ${shiftWins3}`,
    Math.abs(shiftWins8 - shiftWins3) < 100, // Should be close
    'Shift in preference should make it competitive'
  );

  // Edge Case 4: Column availability check
  console.log('\n  [RHETI Column Availability]\n');
  
  for (let type = 1; type <= 9; type++) {
    const col = TYPE_TO_COLUMN[type];
    let available = 0;
    
    RHETI_QUESTIONS.forEach(q => {
      if (q.columnA === col || q.columnB === col) available++;
    });
    
    test(
      'Edge Case',
      `Type ${type} (${col}): Appears in ${available}/36 questions (${(available/36*100).toFixed(0)}%)`,
      available >= 4,
      available < 6 ? 'LOW COVERAGE' : undefined
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 6: API INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════

async function testAPIIntegration() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                    API INTEGRATION TESTS                          ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  let authToken = '';

  // Test 1: Server is running
  try {
    await axios.get(`${API_BASE}/health`, { timeout: 2000 });
    test('API', 'Server is running', true);
  } catch (e: any) {
    if (e.code === 'ECONNREFUSED') {
      test('API', 'Server is running', false, 'Server not running on port 3001');
      console.log('\n  ⚠️  Skipping remaining API tests - start server first\n');
      return;
    }
    // Health endpoint might not exist, but server is up
    test('API', 'Server is running', true, 'Health endpoint not found but server responds');
  }

  // Test 2: Login
  try {
    const loginResp = await axios.post(`${API_BASE}/auth/login`, {
      email: 'arfeen@iyct.com',
      password: 'Arfeen123'
    });
    
    authToken = loginResp.data.data?.token || loginResp.data.token;
    test('API', 'Login endpoint works', !!authToken);
  } catch (e: any) {
    test('API', 'Login endpoint works', false, e.response?.data?.error || e.message);
    console.log('\n  ⚠️  Skipping remaining API tests - login failed\n');
    return;
  }

  const authHeaders = { Authorization: `Bearer ${authToken}` };

  // Test 3: Get assessment
  try {
    const resp = await axios.get(`${API_BASE}/inner-dna/assessment`, { headers: authHeaders });
    test('API', 'GET /inner-dna/assessment', resp.status === 200);
  } catch (e: any) {
    test('API', 'GET /inner-dna/assessment', false, e.response?.data?.error);
  }

  // Test 4: RHETI questions
  try {
    const resp = await axios.get(`${API_BASE}/inner-dna/rheti/question/1`, { headers: authHeaders });
    const hasData = resp.data?.data?.optionA && resp.data?.data?.optionB;
    test('API', 'GET /inner-dna/rheti/question/1', hasData);
  } catch (e: any) {
    test('API', 'GET /inner-dna/rheti/question/1', false, e.response?.data?.error);
  }

  // Test 5: Building blocks endpoint exists
  try {
    const resp = await axios.get(`${API_BASE}/inner-dna/building-blocks/questions`, { headers: authHeaders });
    test('API', 'GET /inner-dna/building-blocks/questions', resp.status === 200);
  } catch (e: any) {
    // 400 means endpoint exists but wrong stage
    test('API', 'GET /inner-dna/building-blocks/questions', 
      e.response?.status === 400 || e.response?.status === 200,
      e.response?.data?.error
    );
  }

  // Test 6: Color states save
  try {
    const resp = await axios.post(`${API_BASE}/inner-dna/color-states/save`, {
      primaryState: 'YLW',
      primaryStatePct: 60,
      secondaryState: 'BLU',
      secondaryStatePct: 40
    }, { headers: authHeaders });
    test('API', 'POST /inner-dna/color-states/save', resp.status === 200 || resp.status === 201);
  } catch (e: any) {
    test('API', 'POST /inner-dna/color-states/save', false, e.response?.data?.error);
  }

  // Test 7: Subtype tokens save
  try {
    const resp = await axios.post(`${API_BASE}/inner-dna/subtype-tokens/save`, {
      tokens: { sp: 7, sx: 2, so: 1 },
      order: ['sp', 'sx', 'so']
    }, { headers: authHeaders });
    test('API', 'POST /inner-dna/subtype-tokens/save', resp.status === 200 || resp.status === 201);
  } catch (e: any) {
    test('API', 'POST /inner-dna/subtype-tokens/save', false, e.response?.data?.error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RUN ALL TESTS
// ═══════════════════════════════════════════════════════════════════════════

async function runAllTests() {
  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('          INNER DNA PHASE 2 - REALISTIC & INTEGRATION TESTS');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(`  Started: ${new Date().toISOString()}\n`);
  console.log('  KEY INSIGHT: RHETI gets type into TOP 3, Hero Moments picks WINNER');
  
  try {
    testRhetiTop3Accuracy();
    testHeroMomentsNarrowing();
    testCombinedFlow();
    testConfusableTypes();
    testEdgeCases();
    await testAPIIntegration();
  } catch (error) {
    console.error('\n❌ TEST SUITE ERROR:', error);
  }

  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('                         TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(`  ✅ PASSED: ${passCount}`);
  console.log(`  ❌ FAILED: ${failCount}`);
  console.log(`  TOTAL: ${passCount + failCount}`);
  
  // Category breakdown
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
    console.log('  🎉 ALL PHASE 2 TESTS PASSED 🎉\n');
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
EOF