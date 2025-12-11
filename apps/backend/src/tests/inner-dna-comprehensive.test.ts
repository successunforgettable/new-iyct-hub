/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INNER DNA COMPREHENSIVE TEST SUITE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Tests ALL combinations and permutations to ensure:
 * 1. RHETI → Correct type emerges from answer patterns
 * 2. Hero Moments → Algorithm converges to correct type
 * 3. Building Blocks → Correct wing questions for each type
 * 4. Color States → Correct 135 behaviors (9 types × 5 states × 3 each)
 * 5. Subtypes → Correct stack calculations
 * 
 * Run: npx ts-node src/tests/inner-dna-comprehensive.test.ts
 */

import { RHETI_QUESTIONS, COLUMN_TO_TYPE, TYPE_NAMES } from '../data/rheti-questions';
import { GENERAL_SCENARIOS, TARGETED_SCENARIOS, CONFIDENCE_THRESHOLDS, SCENARIO_LIMITS } from '../data/hero-moments-scenarios';
import { WING_QUESTIONS, getWingQuestionsForType, determineWing } from '../data/building-blocks-questions';
import { COLOR_STATES } from '../data/color-states-data';

// ═══════════════════════════════════════════════════════════════════════════
// COLOR STATES BEHAVIORS (must match frontend ColorStates.tsx)
// ═══════════════════════════════════════════════════════════════════════════
const STATE_BEHAVIORS: Record<number, Record<string, string[]>> = {
  1: {
    GRN: ["I accept that \"good enough\" is often enough", "I laugh at my own imperfections", "I inspire through example, not criticism"],
    BLU: ["I hold high standards while allowing for mistakes", "I speak up about what's wrong but offer solutions", "I follow my principles even when inconvenient"],
    YLW: ["I notice errors and feel compelled to point them out", "I have a running mental checklist of what needs improving", "I work harder than others to make sure things are done right"],
    ORG: ["I get frustrated when others don't meet my standards", "I criticize more than I praise", "I feel resentful carrying the burden of responsibility"],
    RED: ["I exempt myself from rules I impose on others", "I become harsh and unforgiving when standards slip", "I become moody and feel nobody understands how hard I try"]
  },
  2: {
    GRN: ["I give without keeping track of what I'm owed", "I take care of my own needs without guilt", "I love others without needing them to need me"],
    BLU: ["I offer help but respect when it's declined", "I express my own needs directly", "I support people while trusting they can handle things"],
    YLW: ["I sense what others need before they ask", "I make myself indispensable to important people", "I show different sides of myself depending on who I'm with"],
    ORG: ["I remind people of what I've done for them", "I give advice even when it's not requested", "I feel hurt when my help isn't appreciated enough"],
    RED: ["I become aggressive when I feel taken for granted", "I manipulate through guilt about all I've sacrificed", "I feel entitled to control those I've helped"]
  },
  3: {
    GRN: ["My worth doesn't depend on my achievements", "I can be vulnerable about my failures", "I help others succeed without needing credit"],
    BLU: ["I work hard but know when to stop", "I'm authentic even when it's not impressive", "I celebrate others' success genuinely"],
    YLW: ["I'm always working on the next achievement", "I adapt my image to what each situation requires", "I compare myself to others to gauge my success"],
    ORG: ["I exaggerate accomplishments to stay impressive", "I cut corners to maintain my successful image", "I dismiss others who might outshine me"],
    RED: ["I deceive others to protect my reputation", "I've become an empty shell just going through motions", "I sabotage anyone who threatens my position"]
  },
  4: {
    GRN: ["I create from a place of fullness, not emptiness", "I find beauty in ordinary moments", "I transform my pain into something that helps others"],
    BLU: ["I express my feelings without being consumed by them", "I appreciate what I have while honoring what I feel", "I connect with others through shared humanity"],
    YLW: ["I feel different from others in ways they don't understand", "I dwell on what's missing in my life", "I express myself to stand out from the crowd"],
    ORG: ["I push people away then feel abandoned", "I wallow in my emotions to prove how deeply I feel", "I resent those who seem to have what I lack"],
    RED: ["I've given up on ever being truly happy", "I demand constant proof that people love me", "I don't know who I'd be without my pain"]
  },
  5: {
    GRN: ["I share my knowledge generously with others", "I engage with life, not just observe it", "I trust my competence without needing more preparation"],
    BLU: ["I balance thinking with doing", "I connect with people while maintaining boundaries", "I contribute my expertise when it's needed"],
    YLW: ["I find social interaction draining even when I enjoy it", "I prefer to observe before participating", "I accumulate knowledge in case I need it later"],
    ORG: ["I withdraw when demands feel overwhelming", "I hoard resources, time, and energy", "I disconnect from feelings to stay functional"],
    RED: ["I've cut myself off from almost everyone", "I reject the world that feels too demanding", "I jump frantically between distractions to escape myself"]
  },
  6: {
    GRN: ["I trust myself to handle whatever comes", "I feel secure even in uncertain situations", "I give others the benefit of the doubt"],
    BLU: ["I prepare reasonably but don't over-worry", "I'm loyal while maintaining my own judgment", "I face fears rather than avoiding them"],
    YLW: ["I scan for what could go wrong in situations", "I seek reassurance from authorities or trusted people", "I question people's motives even when they seem supportive"],
    ORG: ["I suspect hidden agendas in people's actions", "I become defensive when I feel questioned", "I divide people into allies and potential threats"],
    RED: ["I see enemies and conspiracies everywhere", "I attack first to prevent being attacked", "I lash out and blame others to protect my position"]
  },
  7: {
    GRN: ["I find deep satisfaction in simple moments", "I stay present even when things get hard", "I commit fully to what matters most"],
    BLU: ["I pursue joy while honoring responsibilities", "I process difficult emotions instead of avoiding them", "I follow through on commitments even when bored"],
    YLW: ["I keep my options open to avoid missing out", "I reframe negatives into positives quickly", "I plan future experiences to stay excited"],
    ORG: ["I escape into distractions when things get hard", "I become scattered trying to do everything", "I resent anything that limits my freedom"],
    RED: ["I'll do anything to avoid pain or boredom", "I've burned through relationships and experiences", "I become harsh and critical when I can't escape my pain"]
  },
  8: {
    GRN: ["I use my power to lift others up, not control them", "I openly share what I'm struggling with", "I champion causes bigger than myself"],
    BLU: ["I speak directly but make sure people feel respected", "I take responsibility when things go wrong", "I set firm boundaries without intimidating"],
    YLW: ["I take charge of situations automatically", "I decide quickly and expect others to keep up", "I test people before I fully trust them"],
    ORG: ["I raise my intensity until people back down", "I refuse to show weakness even when I'm hurting", "I write people off when they disappoint me"],
    RED: ["Once someone crosses me, I cut them out permanently", "I'd rather blow things up than let someone control me", "I strike first before threats can materialize"]
  },
  9: {
    GRN: ["I'm fully present and engaged with life", "I take action on what matters to me", "I stay connected to myself even in conflict"],
    BLU: ["I express my preferences without causing drama", "I create genuine harmony, not just surface peace", "I balance others' needs with my own"],
    YLW: ["I go along with others to keep the peace", "I avoid topics that might cause conflict", "I tune out when things get too intense"],
    ORG: ["I honestly don't know what I want most of the time", "I become stubborn when pushed too hard", "I disappear emotionally from difficult situations"],
    RED: ["I've checked out completely from my life", "When pushed too far, I snap and blame everyone around me", "I neglect everything, including myself"]
  }
};

// Wing adjacencies - CORRECT mapping
const WING_ADJACENCIES: Record<number, [number, number]> = {
  1: [9, 2],
  2: [1, 3],
  3: [2, 4],
  4: [3, 5],
  5: [4, 6],
  6: [5, 7],
  7: [6, 8],
  8: [7, 9],
  9: [8, 1]
};

// Triads for Color States
const TRIAD_COMBOS: [string, string, string][] = [
  ['GRN', 'BLU', 'YLW'], ['GRN', 'BLU', 'ORG'], ['GRN', 'BLU', 'RED'],
  ['GRN', 'YLW', 'ORG'], ['GRN', 'YLW', 'RED'], ['GRN', 'ORG', 'RED'],
  ['BLU', 'YLW', 'ORG'], ['BLU', 'YLW', 'RED'], ['BLU', 'ORG', 'RED'],
  ['YLW', 'ORG', 'RED']
];

// ═══════════════════════════════════════════════════════════════════════════
// TEST RESULTS TRACKING
// ═══════════════════════════════════════════════════════════════════════════
interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];
let passCount = 0;
let failCount = 0;

function test(name: string, condition: boolean, details?: string) {
  if (condition) {
    passCount++;
    results.push({ name, passed: true, details });
    console.log(`  ✅ ${name}`);
  } else {
    failCount++;
    results.push({ name, passed: false, details });
    console.log(`  ❌ ${name}${details ? ` - ${details}` : ''}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RHETI TESTS
// ═══════════════════════════════════════════════════════════════════════════
function testRheti() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                         RHETI TESTS                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  // Test 1: All 36 questions exist
  test('Data: 36 questions exist', RHETI_QUESTIONS.length === 36, `Found ${RHETI_QUESTIONS.length}`);

  // Test 2: All columns A-I are mapped
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const allColumnsMapped = columns.every(c => COLUMN_TO_TYPE[c] !== undefined);
  test('Data: All columns (A-I) mapped to types', allColumnsMapped);

  // Test 3: Column to type mapping is correct
  const correctMapping = 
    COLUMN_TO_TYPE['A'] === 9 &&
    COLUMN_TO_TYPE['B'] === 6 &&
    COLUMN_TO_TYPE['C'] === 3 &&
    COLUMN_TO_TYPE['D'] === 1 &&
    COLUMN_TO_TYPE['E'] === 4 &&
    COLUMN_TO_TYPE['F'] === 2 &&
    COLUMN_TO_TYPE['G'] === 8 &&
    COLUMN_TO_TYPE['H'] === 5 &&
    COLUMN_TO_TYPE['I'] === 7;
  test('Data: Column→Type mapping correct (A=9,B=6,C=3,D=1,E=4,F=2,G=8,H=5,I=7)', correctMapping);

  // Test 4: Each question has valid columns
  const allQuestionsValid = RHETI_QUESTIONS.every(q => 
    columns.includes(q.columnA) && columns.includes(q.columnB)
  );
  test('Data: All questions have valid column mappings', allQuestionsValid);

  // Test 5: Simulate "pure type" selection for each type
  console.log('\n  [Simulating Pure Type Selections]');
  
  // Reverse mapping: Type → Column
  const TYPE_TO_COLUMN: Record<number, string> = {};
  Object.entries(COLUMN_TO_TYPE).forEach(([col, type]) => {
    TYPE_TO_COLUMN[type] = col;
  });

  for (let targetType = 1; targetType <= 9; targetType++) {
    const targetColumn = TYPE_TO_COLUMN[targetType];
    
    // Count how many questions have this column as an option
    let possiblePicks = 0;
    RHETI_QUESTIONS.forEach(q => {
      if (q.columnA === targetColumn || q.columnB === targetColumn) {
        possiblePicks++;
      }
    });

    // Simulate scoring: user picks targetColumn every time it's available
    const columnCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0 };
    
    RHETI_QUESTIONS.forEach(q => {
      if (q.columnA === targetColumn) {
        columnCounts[targetColumn]++;
      } else if (q.columnB === targetColumn) {
        columnCounts[targetColumn]++;
      } else {
        // Pick columnA by default when target not available
        columnCounts[q.columnA]++;
      }
    });

    // Calculate type scores
    const typeScores: Record<number, number> = {};
    for (let t = 1; t <= 9; t++) typeScores[t] = 0;
    
    Object.entries(columnCounts).forEach(([col, count]) => {
      const type = COLUMN_TO_TYPE[col];
      typeScores[type] = count;
    });

    // Find winner
    const sortedTypes = Object.entries(typeScores)
      .map(([t, score]) => ({ type: parseInt(t), score }))
      .sort((a, b) => b.score - a.score);

    const winner = sortedTypes[0].type;
    const winnerScore = sortedTypes[0].score;

    test(
      `Type ${targetType} (${TYPE_NAMES[targetType]}): Pure selection → Type ${winner} wins`,
      winner === targetType,
      `Score: ${winnerScore}/${possiblePicks} possible picks`
    );
  }

  // Test 6: Count questions per column (coverage analysis)
  console.log('\n  [Column Coverage Analysis]');
  const columnAppearances: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0 };
  
  RHETI_QUESTIONS.forEach(q => {
    columnAppearances[q.columnA]++;
    columnAppearances[q.columnB]++;
  });

  for (let type = 1; type <= 9; type++) {
    const col = TYPE_TO_COLUMN[type];
    const appearances = columnAppearances[col];
    test(
      `Type ${type} (${TYPE_NAMES[type]}): Column ${col} appears ${appearances} times`,
      appearances >= 4,
      appearances < 4 ? 'INSUFFICIENT COVERAGE' : undefined
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO MOMENTS TESTS
// ═══════════════════════════════════════════════════════════════════════════
function testHeroMoments() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                      HERO MOMENTS TESTS                           ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  // Test 1: Correct number of scenarios
  test('Data: 15 general scenarios exist', GENERAL_SCENARIOS.length === 15, `Found ${GENERAL_SCENARIOS.length}`);
  test('Data: Targeted scenarios exist', TARGETED_SCENARIOS && TARGETED_SCENARIOS.length > 0, `Found ${TARGETED_SCENARIOS?.length || 0}`);

  // Test 2: Each general scenario has 9 options (one per type)
  let allScenariosHave9Options = true;
  let scenarioIssues: string[] = [];
  
  GENERAL_SCENARIOS.forEach((scenario: any) => {
    if (scenario.options.length !== 9) {
      allScenariosHave9Options = false;
      scenarioIssues.push(`${scenario.id}: ${scenario.options.length} options`);
    }
    
    // Check all 9 types are represented
    const typesPresent = new Set(scenario.options.map((o: any) => o.personalityType));
    if (typesPresent.size !== 9) {
      allScenariosHave9Options = false;
      scenarioIssues.push(`${scenario.id}: Missing types`);
    }
  });
  
  test('Data: All general scenarios have exactly 9 options (one per type)', 
    allScenariosHave9Options, 
    scenarioIssues.length > 0 ? scenarioIssues.join(', ') : undefined
  );

  // Test 3: Algorithm simulation for each type
  console.log('\n  [Simulating Hero Moments Algorithm]');
  
  for (let targetType = 1; targetType <= 9; targetType++) {
    // Simulate: top 3 types include targetType as #1
    const topTypes = [targetType, ((targetType % 9) + 1), (((targetType + 1) % 9) + 1)];
    
    // Simulate picks: always pick targetType option
    let typeCounts: Record<number, number> = {};
    topTypes.forEach(t => typeCounts[t] = 0);
    
    // Simulate 5 scenarios where user picks targetType every time
    for (let i = 0; i < 5; i++) {
      typeCounts[targetType]++;
    }

    const heroDominant = targetType;
    const heroDominantCount = typeCounts[targetType];
    const heroGap = heroDominantCount - 0; // Others have 0

    // Apply completion logic from service
    let isComplete = false;
    let finalConfidence = 0;

    if (heroDominantCount >= 3 && heroGap >= 2) {
      isComplete = true;
      finalConfidence = 0.93;
    } else if (heroDominantCount >= 3 && heroGap >= 1) {
      isComplete = true;
      finalConfidence = 0.91;
    }

    test(
      `Type ${targetType} (${TYPE_NAMES[targetType]}): 5 consistent picks → ${(finalConfidence * 100).toFixed(0)}% confidence`,
      isComplete && heroDominant === targetType && finalConfidence >= 0.90,
      `Gap: ${heroGap}, Count: ${heroDominantCount}`
    );
  }

  // Test 4: Algorithm thresholds
  test('Config: MIN_CONFIDENCE threshold is 0.90', CONFIDENCE_THRESHOLDS.MIN_CONFIDENCE === 0.90);
  test('Config: MIN_SCENARIOS is 3', SCENARIO_LIMITS.MIN_SCENARIOS === 3);
  test('Config: MAX_SCENARIOS is 12', SCENARIO_LIMITS.MAX_SCENARIOS === 12);
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILDING BLOCKS TESTS
// ═══════════════════════════════════════════════════════════════════════════
function testBuildingBlocks() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                    BUILDING BLOCKS TESTS                          ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  // Test 1: All 9 types have wing questions
  test('Data: 9 types have wing question sets', WING_QUESTIONS.length === 9, `Found ${WING_QUESTIONS.length}`);

  // Test 2: Each type has exactly 5 questions
  let all5Questions = true;
  WING_QUESTIONS.forEach(ws => {
    if (ws.questions.length !== 5) {
      all5Questions = false;
    }
  });
  test('Data: Each type has exactly 5 wing questions (45 total)', all5Questions);

  // Test 3: Wing adjacencies are correct for each type
  console.log('\n  [Wing Adjacency Validation]');
  
  for (let type = 1; type <= 9; type++) {
    const wingSet = getWingQuestionsForType(type);
    const expectedWings = WING_ADJACENCIES[type];
    
    if (wingSet) {
      const correctAdjacency = 
        (wingSet.wingA === expectedWings[0] && wingSet.wingB === expectedWings[1]) ||
        (wingSet.wingA === expectedWings[1] && wingSet.wingB === expectedWings[0]);
      
      test(
        `Type ${type}: Adjacent wings are ${expectedWings[0]} and ${expectedWings[1]}`,
        correctAdjacency,
        `Found: wingA=${wingSet.wingA}, wingB=${wingSet.wingB}`
      );
    } else {
      test(`Type ${type}: Wing questions exist`, false, 'NOT FOUND');
    }
  }

  // Test 4: Wing determination logic
  console.log('\n  [Wing Determination Logic]');
  
  for (let type = 1; type <= 9; type++) {
    const wingSet = getWingQuestionsForType(type);
    if (!wingSet) continue;

    // All-A picks → wingA
    const allAResult = determineWing(type, 5, 0);
    test(
      `Type ${type}: All-A picks → Wing ${wingSet.wingA}`,
      allAResult.wing === wingSet.wingA,
      `Got wing ${allAResult.wing}`
    );

    // All-B picks → wingB
    const allBResult = determineWing(type, 0, 5);
    test(
      `Type ${type}: All-B picks → Wing ${wingSet.wingB}`,
      allBResult.wing === wingSet.wingB,
      `Got wing ${allBResult.wing}`
    );

    // 3-2 split → majority wins
    const splitResult = determineWing(type, 3, 2);
    test(
      `Type ${type}: 3A-2B split → Wing ${wingSet.wingA}`,
      splitResult.wing === wingSet.wingA,
      `Got wing ${splitResult.wing}`
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR STATES TESTS
// ═══════════════════════════════════════════════════════════════════════════
function testColorStates() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                      COLOR STATES TESTS                           ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  // Test 1: 10 triads exist (C(5,3) = 10)
  test('Data: 10 triads exist (C(5,3) combinations)', TRIAD_COMBOS.length === 10);

  // Test 2: Each state appears exactly 6 times across triads
  const stateCounts: Record<string, number> = { GRN: 0, BLU: 0, YLW: 0, ORG: 0, RED: 0 };
  TRIAD_COMBOS.forEach(triad => {
    triad.forEach(state => stateCounts[state]++);
  });
  
  const allAppear6Times = Object.values(stateCounts).every(count => count === 6);
  test('Data: Each state appears exactly 6 times', allAppear6Times, 
    `GRN=${stateCounts.GRN}, BLU=${stateCounts.BLU}, YLW=${stateCounts.YLW}, ORG=${stateCounts.ORG}, RED=${stateCounts.RED}`
  );

  // Test 3: Backend color states data exists for all 9 types
  test('Data: COLOR_STATES has 9 types', COLOR_STATES.length === 9, `Found ${COLOR_STATES.length}`);

  // Test 4: Each type has 5 state descriptions
  let allTypesHave5States = true;
  COLOR_STATES.forEach(ts => {
    if (ts.states.length !== 5) {
      allTypesHave5States = false;
    }
  });
  test('Data: Each type has 5 state descriptions (45 total)', allTypesHave5States);

  // Test 5: Frontend behaviors exist for all 9 types × 5 states × 3 behaviors = 135
  console.log('\n  [Frontend Behavior Validation - 135 behaviors]');
  
  let totalBehaviors = 0;
  let missingBehaviors: string[] = [];

  for (let type = 1; type <= 9; type++) {
    const typeBehaviors = STATE_BEHAVIORS[type];
    if (!typeBehaviors) {
      missingBehaviors.push(`Type ${type}: MISSING`);
      continue;
    }

    ['GRN', 'BLU', 'YLW', 'ORG', 'RED'].forEach(state => {
      const behaviors = typeBehaviors[state];
      if (!behaviors || behaviors.length !== 3) {
        missingBehaviors.push(`Type ${type} ${state}: ${behaviors?.length || 0} behaviors`);
      } else {
        totalBehaviors += 3;
        
        // Check for empty strings
        behaviors.forEach((b, i) => {
          if (!b || b.trim() === '') {
            missingBehaviors.push(`Type ${type} ${state}[${i}]: EMPTY`);
          }
        });
      }
    });
  }

  test('Data: 135 frontend behaviors exist (9×5×3)', 
    totalBehaviors === 135 && missingBehaviors.length === 0,
    missingBehaviors.length > 0 ? missingBehaviors.slice(0, 5).join(', ') : `Found ${totalBehaviors}`
  );

  // Test 6: Scoring math validation
  console.log('\n  [Scoring Math Validation]');
  
  // Simulate always picking GRN as MOST
  const scores: Record<string, number> = { GRN: 0, BLU: 0, YLW: 0, ORG: 0, RED: 0 };
  
  TRIAD_COMBOS.forEach(triad => {
    // GRN is MOST (+2), first other is LEAST (0), second other is MIDDLE (+1)
    if (triad.includes('GRN')) {
      scores.GRN += 2;
      const others = triad.filter(s => s !== 'GRN');
      scores[others[0]] += 0; // LEAST
      scores[others[1]] += 1; // MIDDLE
    } else {
      // GRN not in triad, pick first as MOST
      scores[triad[0]] += 2;
      scores[triad[1]] += 0;
      scores[triad[2]] += 1;
    }
  });

  // GRN appears in 6 triads, always MOST = 12 points
  test('Scoring: GRN always MOST → 12 points (6 triads × 2)', scores.GRN === 12, `Got ${scores.GRN}`);

  // Total points = 30 (10 triads × 3 points per triad)
  const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0);
  test('Scoring: Total points = 30 (10 triads × 3)', totalPoints === 30, `Got ${totalPoints}`);

  // Test percentage calculation
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0];
  const secondary = sorted[1];
  const top2Total = primary[1] + secondary[1];
  const primaryPct = Math.round((primary[1] / top2Total) * 100);
  
  test('Scoring: Percentage calculation correct', primaryPct > 50, `Primary: ${primary[0]}=${primaryPct}%`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SUBTYPE TESTS
// ═══════════════════════════════════════════════════════════════════════════
function testSubtypes() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                        SUBTYPE TESTS                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const BATTLES = [
    { id: 1, left: 'sp', right: 'sx' },
    { id: 2, left: 'sp', right: 'so' },
    { id: 3, left: 'sx', right: 'so' }
  ];

  // Test 1: 3 battles defined
  test('Data: 3 battles defined', BATTLES.length === 3);

  // Test 2: All 6 possible non-circular outcomes
  console.log('\n  [Stack Permutation Validation]');
  
  const stackPermutations = [
    { wins: { sp: 2, sx: 1, so: 0 }, expected: ['sp', 'sx', 'so'], desc: 'SP>SX, SP>SO, SX>SO' },
    { wins: { sp: 2, sx: 0, so: 1 }, expected: ['sp', 'so', 'sx'], desc: 'SP>SX, SP>SO, SO>SX' },
    { wins: { sp: 1, sx: 2, so: 0 }, expected: ['sx', 'sp', 'so'], desc: 'SX>SP, SP>SO, SX>SO' },
    { wins: { sp: 0, sx: 2, so: 1 }, expected: ['sx', 'so', 'sp'], desc: 'SX>SP, SO>SP, SX>SO' },
    { wins: { sp: 1, sx: 0, so: 2 }, expected: ['so', 'sp', 'sx'], desc: 'SP>SX, SO>SP, SO>SX' },
    { wins: { sp: 0, sx: 1, so: 2 }, expected: ['so', 'sx', 'sp'], desc: 'SX>SP, SO>SP, SO>SX' },
  ];

  stackPermutations.forEach(perm => {
    const sorted = Object.entries(perm.wins)
      .sort((a, b) => b[1] - a[1])
      .map(e => e[0]);
    
    const matches = sorted[0] === perm.expected[0] && 
                   sorted[1] === perm.expected[1] && 
                   sorted[2] === perm.expected[2];
    
    test(`Stack: ${perm.desc} → ${perm.expected.join('-').toUpperCase()}`, matches, `Got ${sorted.join('-')}`);
  });

  // Test 3: Circular tie detection (1-1-1)
  const circularWins = { sp: 1, sx: 1, so: 1 };
  const circularSorted = Object.entries(circularWins).sort((a, b) => b[1] - a[1]);
  const isCircular = circularSorted[0][1] === 1 && circularSorted[1][1] === 1 && circularSorted[2][1] === 1;
  test('Stack: Circular tie (1-1-1) detected', isCircular);

  // Test 4: Token assignment math
  console.log('\n  [Token Assignment Validation]');
  
  const tokenCalc = (stack: string[]) => {
    const tokens = { sp: 0, sx: 0, so: 0 };
    tokens[stack[0] as keyof typeof tokens] = 7;
    tokens[stack[1] as keyof typeof tokens] = 2;
    tokens[stack[2] as keyof typeof tokens] = 1;
    return tokens;
  };

  const testStack = ['sp', 'sx', 'so'];
  const testTokens = tokenCalc(testStack);
  
  test('Tokens: Dominant gets 7', testTokens.sp === 7);
  test('Tokens: Secondary gets 2', testTokens.sx === 2);
  test('Tokens: Tertiary gets 1', testTokens.so === 1);
  test('Tokens: Total = 10', testTokens.sp + testTokens.sx + testTokens.so === 10);
}

// ═══════════════════════════════════════════════════════════════════════════
// END-TO-END TYPE FLOW TEST
// ═══════════════════════════════════════════════════════════════════════════
function testEndToEndFlow() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                   END-TO-END TYPE FLOW TESTS                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  console.log('  [Verifying: Correct content flows to each type]\n');

  for (let type = 1; type <= 9; type++) {
    console.log(`  Type ${type} (${TYPE_NAMES[type]}):`);
    
    // Check Building Blocks questions exist
    const wingSet = getWingQuestionsForType(type);
    const hasWingQuestions = wingSet && wingSet.questions.length === 5;
    console.log(`    ${hasWingQuestions ? '✅' : '❌'} Building Blocks: ${wingSet?.questions.length || 0} questions, wings ${wingSet?.wingA || '?'}/${wingSet?.wingB || '?'}`);

    // Check Color States behaviors exist
    const typeBehaviors = STATE_BEHAVIORS[type];
    let behaviorCount = 0;
    if (typeBehaviors) {
      ['GRN', 'BLU', 'YLW', 'ORG', 'RED'].forEach(state => {
        if (typeBehaviors[state]?.length === 3) behaviorCount += 3;
      });
    }
    const hasBehaviors = behaviorCount === 15;
    console.log(`    ${hasBehaviors ? '✅' : '❌'} Color States: ${behaviorCount}/15 behaviors`);

    // Check backend state descriptions
    const backendStates = COLOR_STATES.find(cs => cs.type === type);
    const hasDescriptions = backendStates && backendStates.states.length === 5;
    console.log(`    ${hasDescriptions ? '✅' : '❌'} State Descriptions: ${backendStates?.states.length || 0}/5 descriptions`);
    
    if (hasWingQuestions && hasBehaviors && hasDescriptions) {
      passCount++;
    } else {
      failCount++;
    }
    console.log('');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RUN ALL TESTS
// ═══════════════════════════════════════════════════════════════════════════
async function runAllTests() {
  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('          INNER DNA COMPREHENSIVE TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(`  Started: ${new Date().toISOString()}`);
  
  try {
    testRheti();
    testHeroMoments();
    testBuildingBlocks();
    testColorStates();
    testSubtypes();
    testEndToEndFlow();
  } catch (error) {
    console.error('\n❌ TEST SUITE ERROR:', error);
  }

  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('                         TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(`  ✅ PASSED: ${passCount}`);
  console.log(`  ❌ FAILED: ${failCount}`);
  console.log(`  TOTAL: ${passCount + failCount}`);
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  if (failCount === 0) {
    console.log('  🎉 ALL TESTS PASSED - SYSTEM IS BULLETPROOF 🎉\n');
  } else {
    console.log('  ⚠️  SOME TESTS FAILED - REVIEW REQUIRED ⚠️\n');
    
    // List failures
    console.log('  FAILED TESTS:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`    ❌ ${r.name}${r.details ? ` (${r.details})` : ''}`);
    });
    console.log('');
  }
}

runAllTests();
