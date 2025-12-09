// Building Blocks (Wing) Questions - 5 per type = 45 total
// DNA Strand Discovery - No type/wing names shown to user
// Just behavioral "This or That" choices

export interface WingQuestion {
  id: string;
  wingA: number;  // Internal only - lower adjacent type
  wingB: number;  // Internal only - higher adjacent type
  optionA: string;
  optionB: string;
}

export interface TypeWingSet {
  coreType: number;
  wingA: number;  // Internal - not shown to user
  wingB: number;  // Internal - not shown to user
  questions: WingQuestion[];
}

export const WING_QUESTIONS: TypeWingSet[] = [
  // ============ TYPE 1 ============
  {
    coreType: 1,
    wingA: 9,
    wingB: 2,
    questions: [
      {
        id: "1_q1",
        wingA: 9, wingB: 2,
        optionA: "I prefer working quietly to get things right",
        optionB: "I prefer helping others do things right"
      },
      {
        id: "1_q2",
        wingA: 9, wingB: 2,
        optionA: "I keep my opinions mostly to myself",
        optionB: "I openly share advice to help people improve"
      },
      {
        id: "1_q3",
        wingA: 9, wingB: 2,
        optionA: "I focus on perfecting ideas and processes",
        optionB: "I focus on being useful to specific people"
      },
      {
        id: "1_q4",
        wingA: 9, wingB: 2,
        optionA: "Under pressure, I become detached and quiet",
        optionB: "Under pressure, I become more involved with others"
      },
      {
        id: "1_q5",
        wingA: 9, wingB: 2,
        optionA: "I'm more reserved and reflective",
        optionB: "I'm more warm and interpersonal"
      }
    ]
  },

  // ============ TYPE 2 ============
  {
    coreType: 2,
    wingA: 1,
    wingB: 3,
    questions: [
      {
        id: "2_q1",
        wingA: 1, wingB: 3,
        optionA: "I help because it's the right thing to do",
        optionB: "I help because connection energizes me"
      },
      {
        id: "2_q2",
        wingA: 1, wingB: 3,
        optionA: "I'm more serious and principled",
        optionB: "I'm more charming and adaptable"
      },
      {
        id: "2_q3",
        wingA: 1, wingB: 3,
        optionA: "I can be critical when people don't try hard enough",
        optionB: "I adapt my approach to win people over"
      },
      {
        id: "2_q4",
        wingA: 1, wingB: 3,
        optionA: "I give in a structured, reliable way",
        optionB: "I give in a way that builds my relationships"
      },
      {
        id: "2_q5",
        wingA: 1, wingB: 3,
        optionA: "I worry about doing things correctly",
        optionB: "I worry about being seen positively"
      }
    ]
  },

  // ============ TYPE 3 ============
  {
    coreType: 3,
    wingA: 2,
    wingB: 4,
    questions: [
      {
        id: "3_q1",
        wingA: 2, wingB: 4,
        optionA: "Success means helping others succeed too",
        optionB: "Success means creating something unique"
      },
      {
        id: "3_q2",
        wingA: 2, wingB: 4,
        optionA: "I'm naturally warm and encouraging",
        optionB: "I'm naturally introspective and artistic"
      },
      {
        id: "3_q3",
        wingA: 2, wingB: 4,
        optionA: "I focus on being liked while achieving",
        optionB: "I focus on being authentic while achieving"
      },
      {
        id: "3_q4",
        wingA: 2, wingB: 4,
        optionA: "I build success through relationships",
        optionB: "I build success through creative excellence"
      },
      {
        id: "3_q5",
        wingA: 2, wingB: 4,
        optionA: "Under stress, I seek validation from others",
        optionB: "Under stress, I become moody and withdrawn"
      }
    ]
  },

  // ============ TYPE 4 ============
  {
    coreType: 4,
    wingA: 3,
    wingB: 5,
    questions: [
      {
        id: "4_q1",
        wingA: 3, wingB: 5,
        optionA: "I want my uniqueness to be publicly recognized",
        optionB: "I want deep understanding more than recognition"
      },
      {
        id: "4_q2",
        wingA: 3, wingB: 5,
        optionA: "I express myself through style and image",
        optionB: "I express myself through ideas and knowledge"
      },
      {
        id: "4_q3",
        wingA: 3, wingB: 5,
        optionA: "I'm more ambitious and image-conscious",
        optionB: "I'm more withdrawn and cerebral"
      },
      {
        id: "4_q4",
        wingA: 3, wingB: 5,
        optionA: "I compete to stand out from others",
        optionB: "I observe from the sidelines"
      },
      {
        id: "4_q5",
        wingA: 3, wingB: 5,
        optionA: "My creativity seeks an audience",
        optionB: "My creativity is mostly for myself"
      }
    ]
  },

  // ============ TYPE 5 ============
  {
    coreType: 5,
    wingA: 4,
    wingB: 6,
    questions: [
      {
        id: "5_q1",
        wingA: 4, wingB: 6,
        optionA: "I'm drawn to the unusual and unconventional",
        optionB: "I'm drawn to systems and how things work"
      },
      {
        id: "5_q2",
        wingA: 4, wingB: 6,
        optionA: "I process through feelings and intuition",
        optionB: "I process through logic and analysis"
      },
      {
        id: "5_q3",
        wingA: 4, wingB: 6,
        optionA: "I'm more emotionally intense internally",
        optionB: "I'm more anxious and security-focused"
      },
      {
        id: "5_q4",
        wingA: 4, wingB: 6,
        optionA: "I value originality and self-expression",
        optionB: "I value reliability and trustworthy information"
      },
      {
        id: "5_q5",
        wingA: 4, wingB: 6,
        optionA: "I'm drawn to art, symbolism, and meaning",
        optionB: "I'm drawn to science, facts, and expertise"
      }
    ]
  },

  // ============ TYPE 6 ============
  {
    coreType: 6,
    wingA: 5,
    wingB: 7,
    questions: [
      {
        id: "6_q1",
        wingA: 5, wingB: 7,
        optionA: "I handle anxiety by gathering more information",
        optionB: "I handle anxiety by staying positive and busy"
      },
      {
        id: "6_q2",
        wingA: 5, wingB: 7,
        optionA: "I'm more serious and analytical",
        optionB: "I'm more playful and engaging"
      },
      {
        id: "6_q3",
        wingA: 5, wingB: 7,
        optionA: "I withdraw when feeling threatened",
        optionB: "I seek allies and support when threatened"
      },
      {
        id: "6_q4",
        wingA: 5, wingB: 7,
        optionA: "I'm cautious and need time to trust",
        optionB: "I'm friendly and build rapport quickly"
      },
      {
        id: "6_q5",
        wingA: 5, wingB: 7,
        optionA: "Security comes from knowledge and expertise",
        optionB: "Security comes from options and connections"
      }
    ]
  },

  // ============ TYPE 7 ============
  {
    coreType: 7,
    wingA: 6,
    wingB: 8,
    questions: [
      {
        id: "7_q1",
        wingA: 6, wingB: 8,
        optionA: "I check with others before big decisions",
        optionB: "I trust my gut and decide quickly"
      },
      {
        id: "7_q2",
        wingA: 6, wingB: 8,
        optionA: "I'm loyal and stick with my people",
        optionB: "I'm independent and go my own way"
      },
      {
        id: "7_q3",
        wingA: 6, wingB: 8,
        optionA: "I'm more anxious underneath my optimism",
        optionB: "I'm more aggressive underneath my optimism"
      },
      {
        id: "7_q4",
        wingA: 6, wingB: 8,
        optionA: "Fun is better when shared with my group",
        optionB: "Fun is about freedom and doing what I want"
      },
      {
        id: "7_q5",
        wingA: 6, wingB: 8,
        optionA: "I can be self-doubting despite my confidence",
        optionB: "I'm genuinely confident and assertive"
      }
    ]
  },

  // ============ TYPE 8 ============
  {
    coreType: 8,
    wingA: 7,
    wingB: 9,
    questions: [
      {
        id: "8_q1",
        wingA: 7, wingB: 9,
        optionA: "I seek excitement and new challenges",
        optionB: "I seek stability and steady control"
      },
      {
        id: "8_q2",
        wingA: 7, wingB: 9,
        optionA: "I'm quick to act and move on",
        optionB: "I'm patient and pick my battles"
      },
      {
        id: "8_q3",
        wingA: 7, wingB: 9,
        optionA: "I get restless and bored easily",
        optionB: "I'm content once things are settled"
      },
      {
        id: "8_q4",
        wingA: 7, wingB: 9,
        optionA: "I confront problems immediately and directly",
        optionB: "I wait for the right moment to act"
      },
      {
        id: "8_q5",
        wingA: 7, wingB: 9,
        optionA: "I want variety and multiple options",
        optionB: "I want peace and simplicity"
      }
    ]
  },

  // ============ TYPE 9 ============
  {
    coreType: 9,
    wingA: 8,
    wingB: 1,
    questions: [
      {
        id: "9_q1",
        wingA: 8, wingB: 1,
        optionA: "When pushed, I become stubborn and forceful",
        optionB: "When pushed, I become critical and rigid"
      },
      {
        id: "9_q2",
        wingA: 8, wingB: 1,
        optionA: "I'm more direct and confrontational when needed",
        optionB: "I'm more principled and judgmental when needed"
      },
      {
        id: "9_q3",
        wingA: 8, wingB: 1,
        optionA: "I value strength and standing my ground",
        optionB: "I value being right and doing things properly"
      },
      {
        id: "9_q4",
        wingA: 8, wingB: 1,
        optionA: "My anger comes out as explosive force",
        optionB: "My anger comes out as resentment and criticism"
      },
      {
        id: "9_q5",
        wingA: 8, wingB: 1,
        optionA: "I can be intimidating when I assert myself",
        optionB: "I can be preachy when I assert myself"
      }
    ]
  }
];

// Helper to get questions for a specific core type
export const getWingQuestionsForType = (coreType: number): TypeWingSet | undefined => {
  return WING_QUESTIONS.find(w => w.coreType === coreType);
};

// Helper to determine winning wing
export const determineWing = (coreType: number, wingAPicks: number, wingBPicks: number): { wing: number; margin: number; isBalanced: boolean } => {
  const typeData = WING_QUESTIONS.find(w => w.coreType === coreType);
  if (!typeData) throw new Error(`Invalid core type: ${coreType}`);
  
  const margin = Math.abs(wingAPicks - wingBPicks);
  const isBalanced = margin <= 1;
  const wing = wingAPicks >= wingBPicks ? typeData.wingA : typeData.wingB;
  
  return { wing, margin, isBalanced };
};
