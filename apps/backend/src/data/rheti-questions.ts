// RHETI Questionnaire - 36 Forced-Choice Questions
// Column to Type mapping: A=9, B=6, C=3, D=1, E=4, F=2, G=8, H=5, I=7

export const COLUMN_TO_TYPE: Record<string, number> = {
  A: 9, // Peacemaker
  B: 6, // Sentinel
  C: 3, // Achiever
  D: 1, // Reformer
  E: 4, // Individualist
  F: 2, // Helper
  G: 8, // Challenger
  H: 5, // Investigator
  I: 7, // Enthusiast
};

export const TYPE_NAMES: Record<number, string> = {
  1: 'Reformer',
  2: 'Helper',
  3: 'Achiever',
  4: 'Individualist',
  5: 'Investigator',
  6: 'Sentinel',
  7: 'Enthusiast',
  8: 'Challenger',
  9: 'Peacemaker',
};

export interface RhetiQuestion {
  id: number;
  optionA: string;
  optionB: string;
  columnA: string;
  columnB: string;
}

export const RHETI_QUESTIONS: RhetiQuestion[] = [
  {
    id: 1,
    optionA: "I've been romantic and imaginative.",
    optionB: "I've been pragmatic and down to earth.",
    columnA: 'E',
    columnB: 'A',
  },
  {
    id: 2,
    optionA: "I have tended to take on confrontations.",
    optionB: "I have tended to avoid confrontations.",
    columnA: 'G',
    columnB: 'B',
  },
  {
    id: 3,
    optionA: "I have typically been diplomatic, charming, and ambitious.",
    optionB: "I have typically been direct, formal, and idealistic.",
    columnA: 'C',
    columnB: 'D',
  },
  {
    id: 4,
    optionA: "I have tended to be focused and intense.",
    optionB: "I have tended to be spontaneous and fun-loving.",
    columnA: 'H',
    columnB: 'I',
  },
  {
    id: 5,
    optionA: "I have been a hospitable person and have enjoyed welcoming new friends into my life.",
    optionB: "I have been a private person and have not mixed much with others.",
    columnA: 'F',
    columnB: 'H',
  },
  {
    id: 6,
    optionA: "Generally, it's been easy to 'get a rise' out of me.",
    optionB: "Generally, it's been difficult to 'get a rise' out of me.",
    columnA: 'B',
    columnB: 'A',
  },
  {
    id: 7,
    optionA: "I've been more of a 'street-smart' survivor.",
    optionB: "I've been more of a 'high-minded' idealist.",
    columnA: 'G',
    columnB: 'D',
  },
  {
    id: 8,
    optionA: "I have needed to show affection to people.",
    optionB: "I have preferred to maintain a certain distance with people.",
    columnA: 'F',
    columnB: 'H',
  },
  {
    id: 9,
    optionA: "When presented with a new experience, I've usually asked myself if it would be useful to me.",
    optionB: "When presented with a new experience, I've usually asked myself if it would be enjoyable.",
    columnA: 'C',
    columnB: 'I',
  },
  {
    id: 10,
    optionA: "I have tended to focus too much on myself.",
    optionB: "I have tended to focus too much on others.",
    columnA: 'E',
    columnB: 'F',
  },
  {
    id: 11,
    optionA: "Others have depended on my insight and knowledge.",
    optionB: "Others have depended on my strength and decisiveness.",
    columnA: 'H',
    columnB: 'G',
  },
  {
    id: 12,
    optionA: "I have come across as being too unsure of myself.",
    optionB: "I have come across as being too sure of myself.",
    columnA: 'B',
    columnB: 'C',
  },
  {
    id: 13,
    optionA: "I have been more relationship-oriented than goal-oriented.",
    optionB: "I have been more goal-oriented than relationship-oriented.",
    columnA: 'A',
    columnB: 'C',
  },
  {
    id: 14,
    optionA: "I have not been able to speak up for myself very well.",
    optionB: "I have been outspoken—I've said what others wished they had the nerve to say.",
    columnA: 'E',
    columnB: 'G',
  },
  {
    id: 15,
    optionA: "It's been difficult for me to stop considering alternatives and do something definite.",
    optionB: "It's been difficult for me to take it easy and be more flexible.",
    columnA: 'I',
    columnB: 'D',
  },
  {
    id: 16,
    optionA: "I have tended to be careful and hesitant.",
    optionB: "I have tended to be bold and domineering.",
    columnA: 'B',
    columnB: 'G',
  },
  {
    id: 17,
    optionA: "My reluctance to get too involved has gotten me into trouble with people.",
    optionB: "My eagerness to have people depend on me has gotten me into trouble with them.",
    columnA: 'H',
    columnB: 'F',
  },
  {
    id: 18,
    optionA: "Usually, I have been able to put my feelings aside to get the job done.",
    optionB: "Usually, I have had to work through my feelings before I could act.",
    columnA: 'C',
    columnB: 'E',
  },
  {
    id: 19,
    optionA: "Generally, I've been methodical and cautious.",
    optionB: "Generally, I've been adventurous and taken risks.",
    columnA: 'B',
    columnB: 'I',
  },
  {
    id: 20,
    optionA: "I have tended to be a supportive, giving person who enjoys the company of others.",
    optionB: "I have tended to be a serious, reserved person who likes discussing issues.",
    columnA: 'F',
    columnB: 'D',
  },
  {
    id: 21,
    optionA: "I've often felt the need to be a 'pillar of strength.'",
    optionB: "I've often felt the need to perform perfectly.",
    columnA: 'G',
    columnB: 'D',
  },
  {
    id: 22,
    optionA: "I've typically been interested in asking tough questions and maintaining my independence.",
    optionB: "I've typically been interested in maintaining my stability and peace of mind.",
    columnA: 'H',
    columnB: 'A',
  },
  {
    id: 23,
    optionA: "I've been too hard-nosed and skeptical.",
    optionB: "I've been too soft-hearted and sentimental.",
    columnA: 'H',
    columnB: 'F',
  },
  {
    id: 24,
    optionA: "I've often worried that I'm missing out on something better.",
    optionB: "I've often worried that if I let my guard down, someone will take advantage of me.",
    columnA: 'I',
    columnB: 'B',
  },
  {
    id: 25,
    optionA: "My habit of being 'stand-offish' has annoyed people.",
    optionB: "My habit of telling people what to do has annoyed people.",
    columnA: 'E',
    columnB: 'D',
  },
  {
    id: 26,
    optionA: "Usually, when troubles have gotten to me, I have been able to 'tune them out.'",
    optionB: "Usually, when troubles have gotten to me, I have treated myself to something I've enjoyed.",
    columnA: 'A',
    columnB: 'I',
  },
  {
    id: 27,
    optionA: "I have depended upon my friends and they have known that they can depend on me.",
    optionB: "I have not depended on people; I have done things on my own.",
    columnA: 'B',
    columnB: 'G',
  },
  {
    id: 28,
    optionA: "I have tended to be detached and preoccupied.",
    optionB: "I have tended to be moody and self-absorbed.",
    columnA: 'H',
    columnB: 'E',
  },
  {
    id: 29,
    optionA: "I have liked to challenge people and 'shake them up.'",
    optionB: "I have liked to comfort people and calm them down.",
    columnA: 'G',
    columnB: 'A',
  },
  {
    id: 30,
    optionA: "I have generally been an outgoing, sociable person.",
    optionB: "I have generally not been an outgoing, sociable person.",
    columnA: 'F',
    columnB: 'E',
  },
  {
    id: 31,
    optionA: "I have usually liked to confront my problems head on.",
    optionB: "I have usually tried to find diversions from my problems.",
    columnA: 'D',
    columnB: 'I',
  },
  {
    id: 32,
    optionA: "I have generally been shy about showing my abilities.",
    optionB: "I have generally liked to let people know what I can do.",
    columnA: 'A',
    columnB: 'C',
  },
  {
    id: 33,
    optionA: "Pursuing my personal interests has been more important to me than having comfort and security.",
    optionB: "Having comfort and security has been more important to me than pursuing my personal interests.",
    columnA: 'E',
    columnB: 'B',
  },
  {
    id: 34,
    optionA: "When I've had conflict with others, I've tended to withdraw.",
    optionB: "When I've had conflict with others, I've rarely backed down.",
    columnA: 'A',
    columnB: 'G',
  },
  {
    id: 35,
    optionA: "I have given in too easily and let others push me around.",
    optionB: "I have been too uncompromising and demanding with others.",
    columnA: 'A',
    columnB: 'D',
  },
  {
    id: 36,
    optionA: "I have been appreciated for my unsinkable spirit and great sense of humor.",
    optionB: "I have been appreciated for my quiet strength and exceptional generosity.",
    columnA: 'I',
    columnB: 'F',
  },
];
