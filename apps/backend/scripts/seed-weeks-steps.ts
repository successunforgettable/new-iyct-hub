/**
 * 📖 DOCUMENTATION REFERENCE:
 * - File: Program_Database_Structure_-_Migration.md
 * - Source: Old PHP/CodeIgniter database structure
 * - Tables: prg_week_management, prg_steps_management
 * 
 * 🎯 PURPOSE:
 * Seed the new PostgreSQL database with realistic week and step data
 * based on the exact structure from the old PHP system.
 * 
 * 📊 DATA TO CREATE:
 * - IY10 (The Incredible You): 10 weeks with 4-6 steps per week
 * - SMB (Secret Millionaire Blueprint): 12 weeks with 4-5 steps per week
 * - STFME (Speak To A Fortune): 8 weeks with 4-5 steps per week
 * 
 * ⚠️ SAFETY:
 * - Checks if data already exists before seeding
 * - Skips programs that already have weeks
 * - Prevents duplicate data
 * 
 * ✅ FIX: Changed videoUrl to contentUrl (correct Prisma field name)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedWeeksAndSteps() {
  console.log('🌱 Starting seed process for weeks and steps...\n');

  try {
    // Get all programs from database
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: 'asc' }
    });

    if (programs.length === 0) {
      console.log('❌ No programs found in database. Please seed programs first.');
      return;
    }

    console.log(`📚 Found ${programs.length} programs in database:\n`);
    programs.forEach(p => {
      console.log(`   - ${p.name} (${p.durationWeeks} weeks)`);
    });
    console.log('');

    // Seed each program based on its characteristics
    for (const program of programs) {
      await seedProgramWeeksAndSteps(program);
    }

    console.log('\n✅ Seeding complete!\n');
    
    // Display summary
    const weekCount = await prisma.programWeek.count();
    const stepCount = await prisma.programStep.count();
    console.log('📊 SUMMARY:');
    console.log(`   - Total weeks created: ${weekCount}`);
    console.log(`   - Total steps created: ${stepCount}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function seedProgramWeeksAndSteps(program: any) {
  console.log(`\n📚 Processing: ${program.name}`);
  console.log(`   Duration: ${program.durationWeeks} weeks`);

  // Check if already seeded
  const existingWeeks = await prisma.programWeek.count({
    where: { programId: program.id }
  });

  if (existingWeeks > 0) {
    console.log(`   ⏭️  Already has ${existingWeeks} weeks, skipping...`);
    return;
  }

  // Determine program type and seed accordingly
  const programName = program.name.toLowerCase();
  
  if (programName.includes('incredible you') && programName.includes('10')) {
    await seedIY10Program(program);
  } else if (programName.includes('hindi') || programName.includes('8 week')) {
    await seedHindiProgram(program);
  } else if (programName.includes('break through') || programName.includes('6 week')) {
    await seedBTFProgram(program);
  } else {
    // Generic seeding for other programs
    await seedGenericProgram(program);
  }
}

// ============================================================================
// IY10: The Incredible You 10 Week Program
// ============================================================================
async function seedIY10Program(program: any) {
  console.log('   Type: IY10 (10 weeks)');

  const weeks = [
    {
      weekNumber: 1,
      title: 'Getting Started - Introduction to Coaching',
      description: 'Welcome to Week 1! Learn the foundations of professional coaching.',
      steps: [
        {
          stepNumber: 1,
          title: 'What coaching really is?',
          contentHtml: '<p>Before we begin the incredible journey of becoming a coach, let\'s understand what coaching truly means.</p>',
          contentUrl: 'https://vimeo.com/745896321',
          durationMinutes: 8,
        },
        {
          stepNumber: 2,
          title: 'The difference between coaching and therapy',
          contentHtml: '<p>Learn the key distinctions between coaching, therapy, counseling, and consulting.</p>',
          contentUrl: 'https://vimeo.com/745896422',
          durationMinutes: 12,
        },
        {
          stepNumber: 3,
          title: 'Types of coaching specializations',
          contentHtml: '<p>Explore different coaching niches: life coaching, executive coaching, business coaching, and more.</p>',
          contentUrl: 'https://vimeo.com/745896523',
          durationMinutes: 15,
        },
        {
          stepNumber: 4,
          title: 'Your coaching journey begins',
          contentHtml: '<p>Set your intentions and commit to your transformation as a professional coach.</p>',
          contentUrl: 'https://vimeo.com/745896624',
          durationMinutes: 10,
        },
      ],
    },
    {
      weekNumber: 2,
      title: 'Inner DNA - Discovering Your Core',
      description: 'Dive deep into understanding your inner DNA, values, beliefs, and core identity.',
      steps: [
        {
          stepNumber: 1,
          title: 'Understanding the Inner DNA concept',
          contentHtml: '<p>Introduction to the Inner DNA framework and how it shapes your identity and behavior.</p>',
          contentUrl: 'https://vimeo.com/745897102',
          durationMinutes: 14,
        },
        {
          stepNumber: 2,
          title: 'Core values identification',
          contentHtml: '<p>Discover your top core values and how they influence every decision you make.</p>',
          contentUrl: 'https://vimeo.com/745897203',
          durationMinutes: 18,
        },
        {
          stepNumber: 3,
          title: 'The logical levels of change',
          contentHtml: '<p>Learn Dilts\' Logical Levels framework and how to create transformation at different levels.</p>',
          contentUrl: 'https://vimeo.com/745897304',
          durationMinutes: 12,
        },
        {
          stepNumber: 4,
          title: 'Timeline therapy basics',
          contentHtml: '<p>Introduction to timeline therapy and how to help clients release negative emotions.</p>',
          contentUrl: 'https://vimeo.com/745897405',
          durationMinutes: 17,
        },
        {
          stepNumber: 5,
          title: 'Inner DNA workshop practice',
          contentHtml: '<p>Complete the Inner DNA workshop exercise. Map your own values, beliefs, and identity elements.</p>',
          contentUrl: 'https://vimeo.com/745897506',
          durationMinutes: 10,
        },
      ],
    },
    {
      weekNumber: 3,
      title: 'Vision & Values - Defining Your Purpose',
      description: 'Clarify your vision and core values. Define what you stand for and where you\'re heading.',
      steps: [
        {
          stepNumber: 1,
          title: 'Creating your compelling vision',
          contentHtml: '<p>Learn how to craft a powerful, inspiring vision for your life and coaching practice.</p>',
          contentUrl: 'https://vimeo.com/745898101',
          durationMinutes: 16,
        },
        {
          stepNumber: 2,
          title: 'Values clarification exercise',
          contentHtml: '<p>Deep dive into your personal values and how they align with your vision.</p>',
          contentUrl: 'https://vimeo.com/745898202',
          durationMinutes: 14,
        },
        {
          stepNumber: 3,
          title: 'Purpose discovery process',
          contentHtml: '<p>Uncover your unique purpose and how it serves as your North Star.</p>',
          contentUrl: 'https://vimeo.com/745898303',
          durationMinutes: 20,
        },
        {
          stepNumber: 4,
          title: 'Aligning actions with values',
          contentHtml: '<p>Learn to make decisions and take actions that are aligned with your core values.</p>',
          contentUrl: 'https://vimeo.com/745898404',
          durationMinutes: 13,
        },
        {
          stepNumber: 5,
          title: 'Vision board creation',
          contentHtml: '<p>Create your visual representation of your ideal future as a successful coach.</p>',
          contentUrl: 'https://vimeo.com/745898505',
          durationMinutes: 11,
        },
        {
          stepNumber: 6,
          title: 'Assignment: Your vision statement',
          contentHtml: '<p>Write your compelling vision statement and submit it for review.</p>',
          contentUrl: 'https://vimeo.com/745898606',
          durationMinutes: 8,
        },
      ],
    },
    {
      weekNumber: 4,
      title: 'Building Rapport - Connection Mastery',
      description: 'Master the art of building deep rapport and powerful connections with clients.',
      steps: [
        {
          stepNumber: 1,
          title: 'The science of rapport',
          contentHtml: '<p>Understand the neuroscience behind rapport and why it\'s essential for coaching.</p>',
          contentUrl: 'https://vimeo.com/745899101',
          durationMinutes: 15,
        },
        {
          stepNumber: 2,
          title: 'Matching and mirroring techniques',
          contentHtml: '<p>Learn subtle body language and communication techniques to build instant rapport.</p>',
          contentUrl: 'https://vimeo.com/745899202',
          durationMinutes: 18,
        },
        {
          stepNumber: 3,
          title: 'Active listening mastery',
          contentHtml: '<p>Develop the skill of truly listening - the foundation of great coaching.</p>',
          contentUrl: 'https://vimeo.com/745899303',
          durationMinutes: 14,
        },
        {
          stepNumber: 4,
          title: 'Empathy and understanding',
          contentHtml: '<p>Cultivate deep empathy and the ability to understand your client\'s world.</p>',
          contentUrl: 'https://vimeo.com/745899404',
          durationMinutes: 16,
        },
        {
          stepNumber: 5,
          title: 'Rapport practice exercises',
          contentHtml: '<p>Practice rapport-building techniques with role-play scenarios.</p>',
          contentUrl: 'https://vimeo.com/745899505',
          durationMinutes: 12,
        },
      ],
    },
    {
      weekNumber: 5,
      title: 'Powerful Questions - The Coaching Toolkit',
      description: 'Master the skill of asking transformative questions that create breakthrough moments.',
      steps: [
        {
          stepNumber: 1,
          title: 'The art of powerful questioning',
          contentHtml: '<p>Learn why questions are more powerful than statements in coaching.</p>',
          contentUrl: 'https://vimeo.com/745900101',
          durationMinutes: 13,
        },
        {
          stepNumber: 2,
          title: 'Open vs closed questions',
          contentHtml: '<p>Understand the difference and when to use each type of question.</p>',
          contentUrl: 'https://vimeo.com/745900202',
          durationMinutes: 11,
        },
        {
          stepNumber: 3,
          title: 'The GROW model',
          contentHtml: '<p>Master the GROW coaching framework: Goal, Reality, Options, Will.</p>',
          contentUrl: 'https://vimeo.com/745900303',
          durationMinutes: 19,
        },
        {
          stepNumber: 4,
          title: 'Meta-model questions',
          contentHtml: '<p>Learn NLP meta-model questions to uncover deeper insights and challenge limiting beliefs.</p>',
          contentUrl: 'https://vimeo.com/745900404',
          durationMinutes: 17,
        },
        {
          stepNumber: 5,
          title: 'Miracle question technique',
          contentHtml: '<p>Use the miracle question to help clients envision their ideal future.</p>',
          contentUrl: 'https://vimeo.com/745900505',
          durationMinutes: 12,
        },
        {
          stepNumber: 6,
          title: 'Question practice session',
          contentHtml: '<p>Practice asking powerful questions in different coaching scenarios.</p>',
          contentUrl: 'https://vimeo.com/745900606',
          durationMinutes: 15,
        },
      ],
    },
    {
      weekNumber: 6,
      title: 'Goal Setting & Action Planning',
      description: 'Learn how to help clients set and achieve meaningful goals with effective action plans.',
      steps: [
        {
          stepNumber: 1,
          title: 'SMART goals framework',
          contentHtml: '<p>Master the SMART goal-setting methodology for maximum effectiveness.</p>',
          contentUrl: 'https://vimeo.com/745901101',
          durationMinutes: 14,
        },
        {
          stepNumber: 2,
          title: 'Outcome vs performance goals',
          contentHtml: '<p>Understand the difference between outcome and performance goals.</p>',
          contentUrl: 'https://vimeo.com/745901202',
          durationMinutes: 12,
        },
        {
          stepNumber: 3,
          title: 'Breaking down big goals',
          contentHtml: '<p>Learn to chunk large goals into manageable, actionable steps.</p>',
          contentUrl: 'https://vimeo.com/745901303',
          durationMinutes: 16,
        },
        {
          stepNumber: 4,
          title: 'Action planning strategies',
          contentHtml: '<p>Create effective action plans that clients will actually follow.</p>',
          contentUrl: 'https://vimeo.com/745901404',
          durationMinutes: 15,
        },
        {
          stepNumber: 5,
          title: 'Accountability systems',
          contentHtml: '<p>Set up accountability structures that ensure consistent progress.</p>',
          contentUrl: 'https://vimeo.com/745901505',
          durationMinutes: 13,
        },
      ],
    },
    {
      weekNumber: 7,
      title: 'Overcoming Obstacles - Breakthrough Techniques',
      description: 'Master advanced techniques to help clients overcome limiting beliefs and obstacles.',
      steps: [
        {
          stepNumber: 1,
          title: 'Identifying limiting beliefs',
          contentHtml: '<p>Learn how to uncover the hidden beliefs that hold clients back.</p>',
          contentUrl: 'https://vimeo.com/745902101',
          durationMinutes: 16,
        },
        {
          stepNumber: 2,
          title: 'Reframing techniques',
          contentHtml: '<p>Master the art of reframing to transform perspective and create new possibilities.</p>',
          contentUrl: 'https://vimeo.com/745902202',
          durationMinutes: 14,
        },
        {
          stepNumber: 3,
          title: 'Pattern interrupt strategies',
          contentHtml: '<p>Break destructive patterns and create space for new behaviors.</p>',
          contentUrl: 'https://vimeo.com/745902303',
          durationMinutes: 17,
        },
        {
          stepNumber: 4,
          title: 'Anchoring positive states',
          contentHtml: '<p>Use NLP anchoring to help clients access resourceful states on demand.</p>',
          contentUrl: 'https://vimeo.com/745902404',
          durationMinutes: 18,
        },
        {
          stepNumber: 5,
          title: 'Swish pattern for change',
          contentHtml: '<p>Apply the swish pattern technique for rapid behavioral change.</p>',
          contentUrl: 'https://vimeo.com/745902505',
          durationMinutes: 15,
        },
      ],
    },
    {
      weekNumber: 8,
      title: 'Business of Coaching - Building Your Practice',
      description: 'Learn how to build a successful, sustainable coaching business.',
      steps: [
        {
          stepNumber: 1,
          title: 'Defining your coaching niche',
          contentHtml: '<p>Discover your unique coaching niche and ideal client profile.</p>',
          contentUrl: 'https://vimeo.com/745903101',
          durationMinutes: 15,
        },
        {
          stepNumber: 2,
          title: 'Pricing your services',
          contentHtml: '<p>Learn how to price your coaching services for maximum value and profitability.</p>',
          contentUrl: 'https://vimeo.com/745903202',
          durationMinutes: 13,
        },
        {
          stepNumber: 3,
          title: 'Marketing fundamentals',
          contentHtml: '<p>Understand the basics of marketing your coaching practice effectively.</p>',
          contentUrl: 'https://vimeo.com/745903303',
          durationMinutes: 18,
        },
        {
          stepNumber: 4,
          title: 'Creating coaching packages',
          contentHtml: '<p>Design compelling coaching packages that attract and retain clients.</p>',
          contentUrl: 'https://vimeo.com/745903404',
          durationMinutes: 14,
        },
        {
          stepNumber: 5,
          title: 'Client acquisition strategies',
          contentHtml: '<p>Learn proven strategies to attract and convert ideal coaching clients.</p>',
          contentUrl: 'https://vimeo.com/745903505',
          durationMinutes: 16,
        },
      ],
    },
    {
      weekNumber: 9,
      title: 'Advanced Coaching Skills',
      description: 'Master advanced coaching techniques and handle challenging client situations.',
      steps: [
        {
          stepNumber: 1,
          title: 'Working with resistance',
          contentHtml: '<p>Learn how to effectively work with client resistance and objections.</p>',
          contentUrl: 'https://vimeo.com/745904101',
          durationMinutes: 17,
        },
        {
          stepNumber: 2,
          title: 'Coaching through crisis',
          contentHtml: '<p>Develop skills to coach clients who are experiencing crisis or major challenges.</p>',
          contentUrl: 'https://vimeo.com/745904202',
          durationMinutes: 19,
        },
        {
          stepNumber: 3,
          title: 'Group coaching mastery',
          contentHtml: '<p>Learn how to facilitate powerful group coaching sessions.</p>',
          contentUrl: 'https://vimeo.com/745904303',
          durationMinutes: 16,
        },
        {
          stepNumber: 4,
          title: 'Ethics and boundaries',
          contentHtml: '<p>Understand professional ethics and maintain healthy boundaries with clients.</p>',
          contentUrl: 'https://vimeo.com/745904404',
          durationMinutes: 14,
        },
        {
          stepNumber: 5,
          title: 'Supervision and self-care',
          contentHtml: '<p>Learn the importance of supervision, continuing education, and coach self-care.</p>',
          contentUrl: 'https://vimeo.com/745904505',
          durationMinutes: 12,
        },
      ],
    },
    {
      weekNumber: 10,
      title: 'Certification & Next Steps',
      description: 'Complete your certification and plan your next steps as a professional coach.',
      steps: [
        {
          stepNumber: 1,
          title: 'Certification requirements review',
          contentHtml: '<p>Review all certification requirements and prepare for your final assessment.</p>',
          contentUrl: 'https://vimeo.com/745905101',
          durationMinutes: 10,
        },
        {
          stepNumber: 2,
          title: 'Final coaching demonstration',
          contentHtml: '<p>Record and submit your certification coaching session demonstration.</p>',
          contentUrl: 'https://vimeo.com/745905202',
          durationMinutes: 5,
        },
        {
          stepNumber: 3,
          title: 'Your coaching business plan',
          contentHtml: '<p>Create your 90-day action plan for launching your coaching practice.</p>',
          contentUrl: 'https://vimeo.com/745905303',
          durationMinutes: 15,
        },
        {
          stepNumber: 4,
          title: 'Continuing education paths',
          contentHtml: '<p>Explore advanced training opportunities and specialization pathways.</p>',
          contentUrl: 'https://vimeo.com/745905404',
          durationMinutes: 12,
        },
        {
          stepNumber: 5,
          title: 'Graduation celebration',
          contentHtml: '<p>Congratulations! Celebrate your achievement and commitment to coaching excellence.</p>',
          contentUrl: 'https://vimeo.com/745905505',
          durationMinutes: 8,
        },
      ],
    },
  ];

  await createWeeksAndSteps(program.id, weeks);
  console.log(`   ✅ Created 10 weeks with ${weeks.reduce((sum, w) => sum + w.steps.length, 0)} total steps`);
}

// ============================================================================
// Hindi/8-Week Program
// ============================================================================
async function seedHindiProgram(program: any) {
  console.log('   Type: Hindi/8-Week Program');

  const weeks = [
    {
      weekNumber: 1,
      title: 'परिचय - कोचिंग की शुरुआत',
      description: 'सप्ताह 1 में आपका स्वागत है! पेशेवर कोचिंग की नींव सीखें।',
      steps: [
        {
          stepNumber: 1,
          title: 'कोचिंग वास्तव में क्या है?',
          contentHtml: '<p>कोच बनने की अविश्वसनीय यात्रा शुरू करने से पहले, आइए समझें कि कोचिंग का वास्तव में क्या अर्थ है।</p>',
          contentUrl: 'https://vimeo.com/746001101',
          durationMinutes: 10,
        },
        {
          stepNumber: 2,
          title: 'कोचिंग और थेरेपी में अंतर',
          contentHtml: '<p>कोचिंग, थेरेपी, परामर्श और सलाह के बीच मुख्य अंतर जानें।</p>',
          contentUrl: 'https://vimeo.com/746001202',
          durationMinutes: 12,
        },
        {
          stepNumber: 3,
          title: 'आपकी कोचिंग यात्रा शुरू होती है',
          contentHtml: '<p>अपने इरादे निर्धारित करें और एक पेशेवर कोच के रूप में अपने परिवर्तन के लिए प्रतिबद्ध हों।</p>',
          contentUrl: 'https://vimeo.com/746001303',
          durationMinutes: 8,
        },
      ],
    },
    {
      weekNumber: 2,
      title: 'आंतरिक DNA - अपने मूल की खोज',
      description: 'अपने आंतरिक DNA, मूल्यों, विश्वासों और मूल पहचान को समझने में गहराई से उतरें।',
      steps: [
        {
          stepNumber: 1,
          title: 'आंतरिक DNA अवधारणा को समझना',
          contentHtml: '<p>आंतरिक DNA ढांचे का परिचय और यह आपकी पहचान और व्यवहार को कैसे आकार देता है।</p>',
          contentUrl: 'https://vimeo.com/746002101',
          durationMinutes: 14,
        },
        {
          stepNumber: 2,
          title: 'मूल मूल्यों की पहचान',
          contentHtml: '<p>अपने शीर्ष मूल मूल्यों की खोज करें और वे आपके हर निर्णय को कैसे प्रभावित करते हैं।</p>',
          contentUrl: 'https://vimeo.com/746002202',
          durationMinutes: 16,
        },
        {
          stepNumber: 3,
          title: 'परिवर्तन के तार्किक स्तर',
          contentHtml: '<p>डिल्ट्स के तार्किक स्तर ढांचे को सीखें।</p>',
          contentUrl: 'https://vimeo.com/746002303',
          durationMinutes: 13,
        },
        {
          stepNumber: 4,
          title: 'आंतरिक DNA कार्यशाला अभ्यास',
          contentHtml: '<p>आंतरिक DNA कार्यशाला व्यायाम पूरा करें।</p>',
          contentUrl: 'https://vimeo.com/746002404',
          durationMinutes: 11,
        },
      ],
    },
    {
      weekNumber: 3,
      title: 'दृष्टि और मूल्य',
      description: 'अपनी दृष्टि और मूल मूल्यों को स्पष्ट करें।',
      steps: [
        {
          stepNumber: 1,
          title: 'अपनी सम्मोहक दृष्टि बनाना',
          contentHtml: '<p>अपने जीवन और कोचिंग अभ्यास के लिए एक शक्तिशाली, प्रेरक दृष्टि तैयार करना सीखें।</p>',
          contentUrl: 'https://vimeo.com/746003101',
          durationMinutes: 15,
        },
        {
          stepNumber: 2,
          title: 'मूल्य स्पष्टीकरण अभ्यास',
          contentHtml: '<p>अपने व्यक्तिगत मूल्यों में गहराई से उतरें।</p>',
          contentUrl: 'https://vimeo.com/746003202',
          durationMinutes: 13,
        },
        {
          stepNumber: 3,
          title: 'उद्देश्य खोज प्रक्रिया',
          contentHtml: '<p>अपने अनूठे उद्देश्य को उजागर करें।</p>',
          contentUrl: 'https://vimeo.com/746003303',
          durationMinutes: 17,
        },
        {
          stepNumber: 4,
          title: 'असाइनमेंट: आपका दृष्टि वक्तव्य',
          contentHtml: '<p>अपना सम्मोहक दृष्टि वक्तव्य लिखें और समीक्षा के लिए जमा करें।</p>',
          contentUrl: 'https://vimeo.com/746003404',
          durationMinutes: 9,
        },
      ],
    },
    {
      weekNumber: 4,
      title: 'तालमेल बनाना',
      description: 'ग्राहकों के साथ गहरा तालमेल और शक्तिशाली संबंध बनाने की कला में महारत हासिल करें।',
      steps: [
        {
          stepNumber: 1,
          title: 'तालमेल का विज्ञान',
          contentHtml: '<p>तालमेल के पीछे के तंत्रिका विज्ञान को समझें।</p>',
          contentUrl: 'https://vimeo.com/746004101',
          durationMinutes: 14,
        },
        {
          stepNumber: 2,
          title: 'मिलान और प्रतिबिंबित तकनीकें',
          contentHtml: '<p>तत्काल तालमेल बनाने के लिए सूक्ष्म शारीरिक भाषा सीखें।</p>',
          contentUrl: 'https://vimeo.com/746004202',
          durationMinutes: 16,
        },
        {
          stepNumber: 3,
          title: 'सक्रिय सुनने में महारत',
          contentHtml: '<p>वास्तव में सुनने का कौशल विकसित करें।</p>',
          contentUrl: 'https://vimeo.com/746004303',
          durationMinutes: 12,
        },
        {
          stepNumber: 4,
          title: 'तालमेल अभ्यास अभ्यास',
          contentHtml: '<p>भूमिका निभाने वाले परिदृश्यों के साथ तालमेल-निर्माण तकनीकों का अभ्यास करें।</p>',
          contentUrl: 'https://vimeo.com/746004404',
          durationMinutes: 11,
        },
      ],
    },
    {
      weekNumber: 5,
      title: 'शक्तिशाली प्रश्न',
      description: 'परिवर्तनकारी प्रश्न पूछने के कौशल में महारत हासिल करें।',
      steps: [
        {
          stepNumber: 1,
          title: 'शक्तिशाली प्रश्न पूछने की कला',
          contentHtml: '<p>जानें कि कोचिंग में प्रश्न कथनों से अधिक शक्तिशाली क्यों हैं।</p>',
          contentUrl: 'https://vimeo.com/746005101',
          durationMinutes: 13,
        },
        {
          stepNumber: 2,
          title: 'GROW मॉडल',
          contentHtml: '<p>GROW कोचिंग ढांचे में महारत हासिल करें।</p>',
          contentUrl: 'https://vimeo.com/746005202',
          durationMinutes: 18,
        },
        {
          stepNumber: 3,
          title: 'मेटा-मॉडल प्रश्न',
          contentHtml: '<p>गहरी अंतर्दृष्टि को उजागर करने के लिए NLP मेटा-मॉडल प्रश्न सीखें।</p>',
          contentUrl: 'https://vimeo.com/746005303',
          durationMinutes: 16,
        },
        {
          stepNumber: 4,
          title: 'प्रश्न अभ्यास सत्र',
          contentHtml: '<p>विभिन्न कोचिंग परिदृश्यों में शक्तिशाली प्रश्न पूछने का अभ्यास करें।</p>',
          contentUrl: 'https://vimeo.com/746005404',
          durationMinutes: 14,
        },
      ],
    },
    {
      weekNumber: 6,
      title: 'लक्ष्य निर्धारण',
      description: 'प्रभावी कार्य योजनाओं के साथ सार्थक लक्ष्य निर्धारित करने में ग्राहकों की मदद करना सीखें।',
      steps: [
        {
          stepNumber: 1,
          title: 'SMART लक्ष्य ढांचा',
          contentHtml: '<p>अधिकतम प्रभावशीलता के लिए SMART लक्ष्य-निर्धारण पद्धति में महारत हासिल करें।</p>',
          contentUrl: 'https://vimeo.com/746006101',
          durationMinutes: 14,
        },
        {
          stepNumber: 2,
          title: 'बड़े लक्ष्यों को तोड़ना',
          contentHtml: '<p>बड़े लक्ष्यों को प्रबंधनीय, कार्रवाई योग्य चरणों में विभाजित करना सीखें।</p>',
          contentUrl: 'https://vimeo.com/746006202',
          durationMinutes: 15,
        },
        {
          stepNumber: 3,
          title: 'कार्य योजना रणनीतियाँ',
          contentHtml: '<p>प्रभावी कार्य योजनाएँ बनाएं।</p>',
          contentUrl: 'https://vimeo.com/746006303',
          durationMinutes: 14,
        },
        {
          stepNumber: 4,
          title: 'जवाबदेही प्रणालियाँ',
          contentHtml: '<p>जवाबदेही संरचनाएं स्थापित करें।</p>',
          contentUrl: 'https://vimeo.com/746006404',
          durationMinutes: 12,
        },
      ],
    },
    {
      weekNumber: 7,
      title: 'बाधाओं पर काबू पाना',
      description: 'ग्राहकों को सीमित विश्वासों और बाधाओं को दूर करने में मदद करने की उन्नत तकनीकों में महारत हासिल करें।',
      steps: [
        {
          stepNumber: 1,
          title: 'सीमित विश्वासों की पहचान',
          contentHtml: '<p>उन छिपे हुए विश्वासों को उजागर करना सीखें जो ग्राहकों को रोकते हैं।</p>',
          contentUrl: 'https://vimeo.com/746007101',
          durationMinutes: 16,
        },
        {
          stepNumber: 2,
          title: 'रीफ्रेमिंग तकनीकें',
          contentHtml: '<p>परिप्रेक्ष्य को बदलने के लिए रीफ्रेमिंग की कला में महारत हासिल करें।</p>',
          contentUrl: 'https://vimeo.com/746007202',
          durationMinutes: 14,
        },
        {
          stepNumber: 3,
          title: 'पैटर्न इंटरप्ट रणनीतियाँ',
          contentHtml: '<p>विनाशकारी पैटर्न तोड़ें।</p>',
          contentUrl: 'https://vimeo.com/746007303',
          durationMinutes: 15,
        },
        {
          stepNumber: 4,
          title: 'सकारात्मक राज्यों को लंगर डालना',
          contentHtml: '<p>ग्राहकों को मांग पर संसाधनपूर्ण राज्यों तक पहुंचने में मदद करने के लिए NLP एंकरिंग का उपयोग करें।</p>',
          contentUrl: 'https://vimeo.com/746007404',
          durationMinutes: 17,
        },
      ],
    },
    {
      weekNumber: 8,
      title: 'प्रमाणन और अगले कदम',
      description: 'अपना प्रमाणन पूरा करें और एक पेशेवर कोच के रूप में अपने अगले कदमों की योजना बनाएं।',
      steps: [
        {
          stepNumber: 1,
          title: 'प्रमाणन आवश्यकताओं की समीक्षा',
          contentHtml: '<p>सभी प्रमाणन आवश्यकताओं की समीक्षा करें।</p>',
          contentUrl: 'https://vimeo.com/746008101',
          durationMinutes: 10,
        },
        {
          stepNumber: 2,
          title: 'अंतिम कोचिंग प्रदर्शन',
          contentHtml: '<p>अपने प्रमाणन कोचिंग सत्र प्रदर्शन को रिकॉर्ड और सबमिट करें।</p>',
          contentUrl: 'https://vimeo.com/746008202',
          durationMinutes: 5,
        },
        {
          stepNumber: 3,
          title: 'आपकी कोचिंग व्यवसाय योजना',
          contentHtml: '<p>अपनी कोचिंग प्रैक्टिस शुरू करने के लिए अपनी 90-दिवसीय कार्य योजना बनाएं।</p>',
          contentUrl: 'https://vimeo.com/746008303',
          durationMinutes: 14,
        },
        {
          stepNumber: 4,
          title: 'स्नातक समारोह',
          contentHtml: '<p>बधाई हो! अपनी उपलब्धि और कोचिंग उत्कृष्टता के प्रति प्रतिबद्धता का जश्न मनाएं।</p>',
          contentUrl: 'https://vimeo.com/746008404',
          durationMinutes: 8,
        },
      ],
    },
  ];

  await createWeeksAndSteps(program.id, weeks);
  console.log(`   ✅ Created 8 weeks with ${weeks.reduce((sum, w) => sum + w.steps.length, 0)} total steps`);
}

// ============================================================================
// BTF/6-Week Program
// ============================================================================
async function seedBTFProgram(program: any) {
  console.log('   Type: BTF/6-Week Program');

  const weeks = [
    {
      weekNumber: 1,
      title: 'Introduction to Break Through Formula',
      description: 'Welcome to the Break Through Formula. Discover the system that will help you break through your limitations.',
      steps: [
        {
          stepNumber: 1,
          title: 'What is Break Through Formula?',
          contentHtml: '<p>Introduction to the Break Through Formula methodology and how it creates rapid transformation.</p>',
          contentUrl: 'https://vimeo.com/747001101',
          durationMinutes: 12,
        },
        {
          stepNumber: 2,
          title: 'Understanding your limitations',
          contentHtml: '<p>Identify the key limitations that are holding you back from achieving your goals.</p>',
          contentUrl: 'https://vimeo.com/747001202',
          durationMinutes: 15,
        },
        {
          stepNumber: 3,
          title: 'The breakthrough mindset',
          contentHtml: '<p>Develop the mindset required for creating lasting breakthroughs in your life.</p>',
          contentUrl: 'https://vimeo.com/747001303',
          durationMinutes: 14,
        },
        {
          stepNumber: 4,
          title: 'Assignment: Your limitation list',
          contentHtml: '<p>Create a comprehensive list of your current limitations and rate their impact on your life.</p>',
          contentUrl: 'https://vimeo.com/747001404',
          durationMinutes: 8,
        },
      ],
    },
    {
      weekNumber: 2,
      title: 'Core Breakthrough Principles',
      description: 'Master the core principles that create breakthrough results.',
      steps: [
        {
          stepNumber: 1,
          title: 'The power of decision',
          contentHtml: '<p>Learn how decisive action creates momentum and breakthrough results.</p>',
          contentUrl: 'https://vimeo.com/747002101',
          durationMinutes: 16,
        },
        {
          stepNumber: 2,
          title: 'Pattern recognition',
          contentHtml: '<p>Identify the patterns that keep you stuck and learn how to break them.</p>',
          contentUrl: 'https://vimeo.com/747002202',
          durationMinutes: 14,
        },
        {
          stepNumber: 3,
          title: 'Leverage points',
          contentHtml: '<p>Discover the leverage points where small changes create massive results.</p>',
          contentUrl: 'https://vimeo.com/747002303',
          durationMinutes: 17,
        },
        {
          stepNumber: 4,
          title: 'The breakthrough action plan',
          contentHtml: '<p>Create your personalized action plan for achieving breakthrough results.</p>',
          contentUrl: 'https://vimeo.com/747002404',
          durationMinutes: 13,
        },
      ],
    },
    {
      weekNumber: 3,
      title: 'Breaking Through Mental Barriers',
      description: 'Overcome the mental barriers that prevent success.',
      steps: [
        {
          stepNumber: 1,
          title: 'Fear dissolution technique',
          contentHtml: '<p>Master the technique for dissolving fear and moving forward with confidence.</p>',
          contentUrl: 'https://vimeo.com/747003101',
          durationMinutes: 18,
        },
        {
          stepNumber: 2,
          title: 'Limiting belief transformation',
          contentHtml: '<p>Transform limiting beliefs into empowering beliefs that support your goals.</p>',
          contentUrl: 'https://vimeo.com/747003202',
          durationMinutes: 16,
        },
        {
          stepNumber: 3,
          title: 'Mental rehearsal mastery',
          contentHtml: '<p>Use mental rehearsal to program your mind for success.</p>',
          contentUrl: 'https://vimeo.com/747003303',
          durationMinutes: 14,
        },
        {
          stepNumber: 4,
          title: 'Building unshakeable confidence',
          contentHtml: '<p>Develop the confidence that allows you to take bold action toward your goals.</p>',
          contentUrl: 'https://vimeo.com/747003404',
          durationMinutes: 15,
        },
      ],
    },
    {
      weekNumber: 4,
      title: 'Breaking Through Behavioral Patterns',
      description: 'Change the behaviors that keep you stuck.',
      steps: [
        {
          stepNumber: 1,
          title: 'Behavior analysis',
          contentHtml: '<p>Analyze your current behaviors and identify which ones are holding you back.</p>',
          contentUrl: 'https://vimeo.com/747004101',
          durationMinutes: 14,
        },
        {
          stepNumber: 2,
          title: 'Creating new habits',
          contentHtml: '<p>Learn the science of habit formation and how to install new empowering habits.</p>',
          contentUrl: 'https://vimeo.com/747004202',
          durationMinutes: 17,
        },
        {
          stepNumber: 3,
          title: 'Breaking bad habits',
          contentHtml: '<p>Use proven strategies to break bad habits that sabotage your success.</p>',
          contentUrl: 'https://vimeo.com/747004303',
          durationMinutes: 15,
        },
        {
          stepNumber: 4,
          title: 'The 21-day challenge',
          contentHtml: '<p>Begin your 21-day habit installation challenge to cement your new behaviors.</p>',
          contentUrl: 'https://vimeo.com/747004404',
          durationMinutes: 10,
        },
      ],
    },
    {
      weekNumber: 5,
      title: 'Breaking Through to Peak Performance',
      description: 'Access your peak performance states consistently.',
      steps: [
        {
          stepNumber: 1,
          title: 'Peak state physiology',
          contentHtml: '<p>Learn how to use your physiology to access peak performance states instantly.</p>',
          contentUrl: 'https://vimeo.com/747005101',
          durationMinutes: 16,
        },
        {
          stepNumber: 2,
          title: 'Energy management',
          contentHtml: '<p>Master energy management to maintain peak performance throughout the day.</p>',
          contentUrl: 'https://vimeo.com/747005202',
          durationMinutes: 14,
        },
        {
          stepNumber: 3,
          title: 'Focus and concentration',
          contentHtml: '<p>Develop laser-like focus and concentration for maximum productivity.</p>',
          contentUrl: 'https://vimeo.com/747005303',
          durationMinutes: 15,
        },
        {
          stepNumber: 4,
          title: 'Morning success ritual',
          contentHtml: '<p>Create your personalized morning ritual that sets you up for daily success.</p>',
          contentUrl: 'https://vimeo.com/747005404',
          durationMinutes: 12,
        },
      ],
    },
    {
      weekNumber: 6,
      title: 'Integration and Breakthrough Action',
      description: 'Integrate everything and take breakthrough action toward your goals.',
      steps: [
        {
          stepNumber: 1,
          title: 'Integration review',
          contentHtml: '<p>Review and integrate all the breakthrough techniques you\'ve learned.</p>',
          contentUrl: 'https://vimeo.com/747006101',
          durationMinutes: 13,
        },
        {
          stepNumber: 2,
          title: 'Your breakthrough goal',
          contentHtml: '<p>Define your primary breakthrough goal and create a 90-day action plan.</p>',
          contentUrl: 'https://vimeo.com/747006202',
          durationMinutes: 16,
        },
        {
          stepNumber: 3,
          title: 'Accountability system',
          contentHtml: '<p>Set up an accountability system to ensure you follow through on your breakthrough goals.</p>',
          contentUrl: 'https://vimeo.com/747006303',
          durationMinutes: 11,
        },
        {
          stepNumber: 4,
          title: 'Breakthrough celebration',
          contentHtml: '<p>Celebrate your completion and commitment to creating breakthroughs in your life!</p>',
          contentUrl: 'https://vimeo.com/747006404',
          durationMinutes: 8,
        },
      ],
    },
  ];

  await createWeeksAndSteps(program.id, weeks);
  console.log(`   ✅ Created 6 weeks with ${weeks.reduce((sum, w) => sum + w.steps.length, 0)} total steps`);
}

// ============================================================================
// Generic Program (for other programs)
// ============================================================================
async function seedGenericProgram(program: any) {
  console.log('   Type: Generic Program');

  const weekCount = program.durationWeeks || 4;
  const weeks = [];

  for (let i = 1; i <= weekCount; i++) {
    const steps = [];
    const stepCount = 4; // Default 4 steps per week

    for (let j = 1; j <= stepCount; j++) {
      steps.push({
        stepNumber: j,
        title: `Week ${i} - Step ${j}: Learning Module`,
        contentHtml: `<p>Content for Week ${i}, Step ${j}. This step covers important concepts and practical exercises.</p>`,
        contentUrl: `https://vimeo.com/74800${i}${j}01`,
        durationMinutes: 10 + j * 2,
      });
    }

    weeks.push({
      weekNumber: i,
      title: `Week ${i}: Core Concepts`,
      description: `Week ${i} focuses on essential concepts and practical application.`,
      steps,
    });
  }

  await createWeeksAndSteps(program.id, weeks);
  console.log(`   ✅ Created ${weekCount} weeks with ${weekCount * 4} total steps`);
}

// ============================================================================
// Helper Function: Create Weeks and Steps
// ============================================================================
async function createWeeksAndSteps(programId: string, weeks: any[]) {
  for (const weekData of weeks) {
    // Create week
    const week = await prisma.programWeek.create({
      data: {
        programId: programId,
        weekNumber: weekData.weekNumber,
        title: weekData.title,
        description: weekData.description,
      },
    });

    // Create steps for this week
    for (const stepData of weekData.steps) {
      await prisma.programStep.create({
        data: {
          weekId: week.id,
          stepNumber: stepData.stepNumber,
          title: stepData.title,
          contentType: 'VIDEO',
          contentHtml: stepData.contentHtml,
          contentUrl: stepData.contentUrl,
          durationMinutes: stepData.durationMinutes,
          isMandatory: true,
        },
      });
    }
  }
}

// ============================================================================
// Run the seed function
// ============================================================================
seedWeeksAndSteps()
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
