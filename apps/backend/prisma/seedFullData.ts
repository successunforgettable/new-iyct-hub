import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// CORRECT DATA FROM LIVE SERVER
// Excluded: 23, 24, 27, 51, 52, 55 (tools/links, not programs)
const PROGRAMS = [
  { oldId: 1, code: "IYCTHINDI", title: "The Incredible You Mind Hacker Coach Training In Hindi", language: "HINDI", type: "HUB" },
  { oldId: 3, code: "IY10HINDI", title: "The Incredible You 10 Week Coaching In Hindi", language: "HINDI", type: "HUB" },
  { oldId: 4, code: "IYFC", title: "The Incredible You Foundation Hindi", language: "HINDI", type: "HUB" },
  { oldId: 5, code: "STFME", title: "Speak To A Fortune Mastermind Edition", language: "ENGLISH", type: "HUB" },
  { oldId: 6, code: "IYCTHUB", title: "The Incredible You Mind Hacker Coach Training", language: "ENGLISH", type: "HUB" },
  { oldId: 7, code: "CTFFX", title: "Coach to a Fortune Foundation X", language: "ENGLISH", type: "HUB" },
  { oldId: 8, code: "SMBP", title: "4 Week Incredible Wealth Mindset Reset", language: "ENGLISH", type: "HUB" },
  { oldId: 9, code: "SMB", title: "SMB Money Management System", language: "ENGLISH", type: "HUB" },
  { oldId: 10, code: "CFFX", title: "Coach to a Fortune Foundation X In Hindi", language: "HINDI", type: "HUB" },
  { oldId: 11, code: "IY10", title: "The Incredible You 10 week coaching", language: "ENGLISH", type: "HUB" },
  { oldId: 12, code: "STF2", title: "Speak To a Fortune 2.0 foundation", language: "ENGLISH", type: "HUB" },
  { oldId: 13, code: "BTF", title: "The Incredible 6 Figure Author System", language: "ENGLISH", type: "HUB" },
  { oldId: 14, code: "IYF", title: "The Incredible You Foundation", language: "ENGLISH", type: "HUB" },
  { oldId: 20, code: "IY10HINDIDEMO", title: "The Incredible You 10 Week Coaching In Hindi Demo", language: "HINDI", type: "FREE" },
  { oldId: 21, code: "IY10DEMO", title: "The Incredible You 10 week coaching Demo", language: "ENGLISH", type: "FREE" },
  { oldId: 22, code: "IYCTPRE", title: "The Incredible You Coach Training Pre Study", language: "ENGLISH", type: "HUB" },
  { oldId: 25, code: "SMBCRY", title: "The Secret Millionaire Blueprint", language: "ENGLISH", type: "OUTSIDE" },
  { oldId: 26, code: "MCLG", title: "The Incredible You Millionaire Challenge", language: "ENGLISH", type: "HUB" },
  { oldId: 31, code: "IYCTLEVEL1", title: "The Incredible You Coach Training Level 1 Program", language: "ENGLISH", type: "HUB" },
  { oldId: 32, code: "IYCTLEVEL2", title: "The Incredible You Coach Training Level 2 Program", language: "ENGLISH", type: "HUB" },
  { oldId: 38, code: "IYCTHINDILEVEL1", title: "The Incredible You Mind Hacker Coach Training In Hindi Level 1", language: "HINDI", type: "HUB" },
  { oldId: 39, code: "IYCTHINDILEVEL2", title: "The Incredible You Mind Hacker Coach Training In Hindi Level 2", language: "HINDI", type: "HUB" },
  { oldId: 40, code: "IY10LEVEL1", title: "The Incredible You 10 week coaching Level 1", language: "ENGLISH", type: "HUB" },
  { oldId: 41, code: "IY10LEVEL2", title: "The Incredible You 10 week coaching Level 2", language: "ENGLISH", type: "HUB" },
  { oldId: 42, code: "IY10HINDILEVEL1", title: "The Incredible You 10 Week Coaching In Hindi Level 1", language: "HINDI", type: "HUB" },
  { oldId: 43, code: "IY10HINDILEVEL2", title: "The Incredible You 10 Week Coaching In Hindi Level 2", language: "HINDI", type: "HUB" },
  { oldId: 44, code: "IY10HINDIDEMO1", title: "The Incredible You 10 Week Coaching Demo In Hindi Level 1", language: "HINDI", type: "FREE" },
  { oldId: 45, code: "IY10HINDIDEMO2", title: "The Incredible You 10 Week Coaching Demo In Hindi Level 2", language: "HINDI", type: "FREE" },
  { oldId: 46, code: "IYFCHINDI", title: "The Incredible You Foundation Hindi", language: "HINDI", type: "HUB" },
  { oldId: 47, code: "IYFENG", title: "The Incredible You Foundation", language: "ENGLISH", type: "HUB" },
  { oldId: 50, code: "CIY10", title: "Corporate The Incredible You 10 week coaching", language: "ENGLISH", type: "HUB" },
  { oldId: 53, code: "HTSM", title: "High Ticket Sales Mastery", language: "ENGLISH", type: "HUB" },
  { oldId: 54, code: "IY10CX", title: "The Incredible You CX", language: "ENGLISH", type: "HUB" },
];

const ACTIVITY_TYPES: { [key: string]: string } = {
  '0': 'video',
  '1': 'inner_dna',
  '2': 'personality',
  '3': 'wheel_of_life',
  '4': 'baselines',
  '8': 'coding_tool',
  '11': 'decision_wheel',
  '12': 'define_outcome',
  '17': 'video_debrief',
  '18': 'certification',
  '19': 'registration',
  '20': 'niche_discovery',
  '21': 'schedule',
  '24': 'hub_form',
};

const EXCLUDED_PROGRAM_IDS = [0, 23, 24, 27, 51, 52, 55];

function parseWeeksCSV(csvContent: string): any[] {
  const lines = csvContent.trim().split('\n');
  const weeks: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < 5) continue;
    const programId = parseInt(values[1]);
    if (EXCLUDED_PROGRAM_IDS.includes(programId)) continue;
    weeks.push({
      programId: programId,
      weekNumber: parseInt(values[2]) || 0,
      title: values[4] || `Week ${values[2]}`,
      weekType: values[11] || 'paid',
    });
  }
  return weeks;
}

function parseStepsCSV(csvContent: string): any[] {
  const lines = csvContent.trim().split('\n');
  const steps: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');
    if (values.length < 5) continue;
    const programId = parseInt(values[1]);
    if (isNaN(programId) || EXCLUDED_PROGRAM_IDS.includes(programId)) continue;
    steps.push({
      programId: programId,
      weekNumber: parseInt(values[3]) || 0,
      title: values[4] || 'Untitled Step',
      stepNumber: parseInt(values[5]) || 1,
      vimeoId: values[6] && values[6].trim() !== '' ? values[6].trim() : null,
      videoDuration: values[7] || null,
      activityType: values[8] || '0',
    });
  }
  return steps;
}

async function main() {
  console.log('🚀 IYCT Full Data Seed - Live Server Data (Corrected)\n');
  
  const weeksPath = path.join(__dirname, '../../../docs/weeks_export.csv');
  const stepsPath = path.join(__dirname, '../../../docs/steps_export.csv');
  
  if (!fs.existsSync(weeksPath)) {
    console.log('❌ weeks_export.csv not found at: ' + weeksPath);
    process.exit(1);
  }
  if (!fs.existsSync(stepsPath)) {
    console.log('❌ steps_export.csv not found at: ' + stepsPath);
    process.exit(1);
  }
  
  const weeksData = parseWeeksCSV(fs.readFileSync(weeksPath, 'utf-8'));
  const stepsData = parseStepsCSV(fs.readFileSync(stepsPath, 'utf-8'));
  console.log(`📅 Loaded ${weeksData.length} weeks from live server (excluded tools)`);
  console.log(`📝 Loaded ${stepsData.length} steps from live server (excluded tools)`);
  
  console.log('\n🧹 Clearing existing data...');
  await prisma.userStepProgress.deleteMany({});
  await prisma.userProgramEnrollment.deleteMany({});
  await prisma.programStep.deleteMany({});
  await prisma.programWeek.deleteMany({});
  await prisma.program.deleteMany({});
  console.log('✅ Cleared');
  
  console.log('\n📦 Creating programs...');
  const programIdMap: { [oldId: number]: string } = {};
  for (const prog of PROGRAMS) {
    const created = await prisma.program.create({
      data: {
        slug: prog.code.toLowerCase().replace(/\./g, ''),
        name: prog.title,
        description: `${prog.title} - ${prog.language}`,
        programType: prog.type as any,
        language: prog.language,
        isPublished: true,
        durationWeeks: 0,
      },
    });
    programIdMap[prog.oldId] = created.id;
  }
  console.log(`✅ Created ${PROGRAMS.length} programs`);
  
  console.log('\n📅 Creating weeks...');
  const weekIdMap: { [key: string]: string } = {};
  let weekCount = 0;
  for (const week of weeksData) {
    const programUUID = programIdMap[week.programId];
    if (!programUUID) continue;
    const weekKey = `${week.programId}-${week.weekNumber}`;
    if (weekIdMap[weekKey]) continue;
    const created = await prisma.programWeek.create({
      data: {
        programId: programUUID,
        weekNumber: week.weekNumber,
        title: week.title,
        isLocked: week.weekNumber > 0,
      },
    });
    weekIdMap[weekKey] = created.id;
    weekCount++;
  }
  console.log(`✅ Created ${weekCount} weeks`);
  
  console.log('\n📝 Creating steps...');
  let stepCount = 0;
  let skipped = 0;
  let duplicates = 0;
  const insertedSteps = new Set<string>();
  
  for (const step of stepsData) {
    const weekKey = `${step.programId}-${step.weekNumber}`;
    let weekUUID = weekIdMap[weekKey];
    
    if (!weekUUID) {
      const programUUID = programIdMap[step.programId];
      if (!programUUID) { skipped++; continue; }
      const newWeek = await prisma.programWeek.create({
        data: {
          programId: programUUID,
          weekNumber: step.weekNumber,
          title: `Week ${step.weekNumber}`,
          isLocked: step.weekNumber > 0,
        },
      });
      weekIdMap[weekKey] = newWeek.id;
      weekUUID = newWeek.id;
    }
    
    const stepKey = `${weekUUID}-${step.stepNumber}`;
    if (insertedSteps.has(stepKey)) { duplicates++; continue; }
    insertedSteps.add(stepKey);
    
    const activityCode = step.activityType?.toString() || '0';
    const contentType = ACTIVITY_TYPES[activityCode] || 'video';
    const contentUrl = step.vimeoId ? `https://player.vimeo.com/video/${step.vimeoId}` : null;
    
    let duration: number | null = null;
    if (step.videoDuration && step.videoDuration.includes(':')) {
      const [min, sec] = step.videoDuration.split(':');
      duration = parseInt(min) + (parseInt(sec) > 30 ? 1 : 0);
    }
    
    await prisma.programStep.create({
      data: {
        weekId: weekUUID,
        stepNumber: step.stepNumber,
        title: step.title,
        contentType: contentType,
        contentUrl: contentUrl,
        durationMinutes: duration,
        isMandatory: true,
      },
    });
    stepCount++;
  }
  console.log(`✅ Created ${stepCount} steps (${skipped} skipped, ${duplicates} duplicates)`);
  
  console.log('\n📊 Updating program durations...');
  for (const uuid of Object.values(programIdMap)) {
    const wc = await prisma.programWeek.count({ where: { programId: uuid } });
    await prisma.program.update({ where: { id: uuid }, data: { durationWeeks: wc } });
  }
  
  const totalPrograms = await prisma.program.count();
  const totalWeeks = await prisma.programWeek.count();
  const totalSteps = await prisma.programStep.count();
  
  const hindiCount = await prisma.program.count({ where: { language: 'HINDI' } });
  const englishCount = await prisma.program.count({ where: { language: 'ENGLISH' } });
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ SEED COMPLETE');
  console.log('='.repeat(50));
  console.log(`   Programs: ${totalPrograms} (${hindiCount} Hindi, ${englishCount} English)`);
  console.log(`   Weeks:    ${totalWeeks}`);
  console.log(`   Steps:    ${totalSteps}`);
  console.log('='.repeat(50));
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
