export interface StateDescription {
  id: string;
  level: number;
  sequenceLabel: string;
  internalName: string;
  colorCode: string;
  color: string;
  description: string;
}

export interface TypeStates {
  type: number;
  typeName: string;
  states: StateDescription[];
}

export const COLOR_STATES: TypeStates[] = [
  {
    type: 1,
    typeName: 'Reformer',
    states: [
      { id: '1_1', level: 1, sequenceLabel: 'Sequence A', internalName: 'Very Good State', colorCode: 'GRN', color: '#22c55e', description: 'In this state, I embody clarity, calm, and higher purpose. I trust life\'s design and see meaning even in its chaos. My standards uplift rather than restrict, and I walk with integrity that inspires without imposing. I make wise choices not from ego, but from alignment with something greater than myself: service, humanity, or truth. In this state, I am both just and gentle, a quiet force of dignity, discipline, and compassion.' },
      { id: '1_2', level: 2, sequenceLabel: 'Sequence B', internalName: 'Good State', colorCode: 'BLU', color: '#3b82f6', description: 'I hold myself to high standards and genuinely want the best for everyone. I work hard, stay organized, and expect accountability, especially from myself. I care deeply about fairness, justice, and creating order in a world full of inconsistency. Though I may carry the weight of responsibility, I do so willingly, knowing it serves a greater good. People rely on me to be dependable, ethical, and consistent, and I take pride in that trust.' },
      { id: '1_3', level: 3, sequenceLabel: 'Sequence C', internalName: 'Average State', colorCode: 'YLW', color: '#eab308', description: 'I see what\'s wrong before I see what\'s right, and I can\'t help but try to fix it. There\'s a constant tension between my ideals and what I see around me, including in myself. I judge, not out of cruelty, but out of frustration that things fall short of what they could be. It\'s hard to relax, because there\'s always something to improve, correct, or structure. I hold back my emotions, push through stress, and often feel like I\'m the only one trying to "do it right."' },
      { id: '1_4', level: 4, sequenceLabel: 'Sequence D', internalName: 'Below Average State', colorCode: 'ORG', color: '#f97316', description: 'The world begins to feel flawed, careless, and disappointing, and I take it personally. I become more vocal, more controlling, and less tolerant of others\' mistakes or slackness. People don\'t listen, don\'t care, don\'t try, and it ignites a quiet bitterness in me. I start to feel isolated, overworked, and secretly exhausted from constantly holding the line. Inside, there\'s sadness masked as anger, and fatigue disguised as righteousness.' },
      { id: '1_5', level: 5, sequenceLabel: 'Sequence E', internalName: 'Destructive State', colorCode: 'RED', color: '#ef4444', description: 'I become consumed by a harsh internal critic that shames, punishes, and controls me. My emotions swing from rage to guilt, my thoughts obsess over who\'s wrong, often including me. I may lash out in frustration, then retreat in regret, unable to break free from the pressure I put on myself. Perfection feels unattainable, yet I demand it anyway, even if it breaks me. In this state, I feel haunted by failure, trapped in contradiction, and silently desperate for relief.' }
    ]
  },
  {
    type: 2,
    typeName: 'Helper',
    states: [
      { id: '2_1', level: 1, sequenceLabel: 'Sequence A', internalName: 'Very Good State', colorCode: 'GRN', color: '#22c55e', description: 'I am a radiant force of compassion and clarity. Every act of support I offer is rooted in a deep understanding of what others truly need, not just what they ask for. My presence uplifts, not by overextending, but by honoring both my boundaries and my care. I give from fullness, not from emptiness, and in doing so, I become a powerful agent of emotional healing. I have mastered the art of saying yes from alignment and no without guilt. I don\'t just help, I inspire others to rise with dignity.' },
      { id: '2_2', level: 2, sequenceLabel: 'Sequence B', internalName: 'Good State', colorCode: 'BLU', color: '#3b82f6', description: 'I am dependable, warm, and intuitive about people\'s emotional needs. Others feel safe with me, knowing I will listen without judgment and act without hesitation. I am energized by being of service, but I\'ve learned to tune into myself and give space to my own needs too. I take pride in being thoughtful, attentive, and caring. I\'m able to create lasting relationships because I prioritize connection, loyalty, and shared joy. I feel most fulfilled when I\'m part of something meaningful, contributing wholeheartedly but without losing myself.' },
      { id: '2_3', level: 3, sequenceLabel: 'Sequence C', internalName: 'Average State', colorCode: 'YLW', color: '#eab308', description: 'I start to measure my worth by how needed I am. I say yes too quickly and later feel overwhelmed or underappreciated. I begin anticipating others\' needs before they ask, sometimes imposing help where it\'s not wanted. I may ignore my own fatigue, thinking that pushing through will earn me love or approval. I can become overly involved, losing sight of where I end and others begin. In this state, I fear being unimportant, so I give more, but often from depletion, not devotion.' },
      { id: '2_4', level: 4, sequenceLabel: 'Sequence D', internalName: 'Below Average State', colorCode: 'ORG', color: '#f97316', description: 'I feel unnoticed, unimportant, and emotionally drained. My giving becomes transactional, I help to be seen. I feel resentful when others don\'t acknowledge my efforts. My identity gets tangled up in being "the one who\'s always there," but secretly, I feel invisible. I may manipulate subtly, using guilt or emotional leverage to get the love I crave. I feel hurt when people set boundaries, as if they\'re rejecting me personally.' },
      { id: '2_5', level: 5, sequenceLabel: 'Sequence E', internalName: 'Destructive State', colorCode: 'RED', color: '#ef4444', description: 'I fall into emotional burnout. I give compulsively, not from love but from fear of abandonment. When I feel unneeded, I spiral into worthlessness. My self-care vanishes. I may become emotionally volatile, smothering, or suddenly distant and cold. I can lose touch with my own identity entirely, not knowing who I am without someone to take care of. In the worst cases, I become bitter, accusatory, or collapse into depression.' }
    ]
  },
  {
    type: 3,
    typeName: 'Achiever',
    states: [
      { id: '3_1', level: 1, sequenceLabel: 'Sequence A', internalName: 'Very Good State', colorCode: 'GRN', color: '#22c55e', description: 'I am successful not just by external measures, but by internal alignment. My achievements reflect my true values, not just societal expectations. I inspire others by being authentic, not just impressive. I am able to slow down, celebrate the journey, and find meaning beyond results. My drive becomes a gift to the world, not a mask I wear to hide my fears. I am loved for who I am, not just what I do.' },
      { id: '3_2', level: 2, sequenceLabel: 'Sequence B', internalName: 'Good State', colorCode: 'BLU', color: '#3b82f6', description: 'I am driven, focused, and naturally talented at achieving goals. I work efficiently, present myself well, and adapt to situations with ease. I take pride in my accomplishments and enjoy being recognized for my contributions. I motivate others through my energy and vision. I believe in hard work, excellence, and showing up at my best. People see me as a leader and go-getter.' },
      { id: '3_3', level: 3, sequenceLabel: 'Sequence C', internalName: 'Average State', colorCode: 'YLW', color: '#eab308', description: 'I focus intensely on image and achievement, sometimes losing touch with my true feelings. I compare myself to others often and feel pressure to keep performing. I adapt my personality depending on who I\'m with. I struggle to rest, always thinking about the next goal. I may avoid deep emotional conversations because they feel unproductive. Success feels necessary for my self-worth.' },
      { id: '3_4', level: 4, sequenceLabel: 'Sequence D', internalName: 'Below Average State', colorCode: 'ORG', color: '#f97316', description: 'I become obsessed with external validation and start sacrificing authenticity for approval. I feel like an imposter, afraid people will see through me. I push harder even when exhausted. I may exaggerate achievements or manipulate perceptions to stay ahead. I become competitive to a fault, seeing others as threats. Inside, I feel hollow, chasing a finish line that keeps moving.' },
      { id: '3_5', level: 5, sequenceLabel: 'Sequence E', internalName: 'Destructive State', colorCode: 'RED', color: '#ef4444', description: 'I lose all sense of my authentic self, becoming a hollow shell focused only on winning. I may lie, exploit, or betray to maintain my image. I burn out completely but can\'t stop. I feel numb, disconnected, and terrified of being seen as a failure. I may sabotage relationships, health, and ethics in pursuit of success. My identity collapses when achievements stop.' }
    ]
  },
  {
    type: 4,
    typeName: 'Individualist',
    states: [
      { id: '4_1', level: 1, sequenceLabel: 'Sequence A', internalName: 'Very Good State', colorCode: 'GRN', color: '#22c55e', description: 'I feel deeply connected, not only to myself, but to something greater. My emotions are no longer a storm to survive but a current that carries me toward meaning. I create from a place of truth and beauty, not from woundedness or longing. I embrace my ordinariness as part of my uniqueness. I feel gratitude for life as it is, not only as I wish it could be. I inspire others by turning pain into wisdom and art.' },
      { id: '4_2', level: 2, sequenceLabel: 'Sequence B', internalName: 'Good State', colorCode: 'BLU', color: '#3b82f6', description: 'I am emotionally aware and creatively alive. I see what others often miss, the subtle, the beautiful, the meaningful. I value authenticity and depth in myself and in my relationships. I express myself through art, language, or presence. I feel things intensely and honor that sensitivity. I am not afraid to sit with sadness or complexity. I long to be understood, and I offer that same deep listening to others.' },
      { id: '4_3', level: 3, sequenceLabel: 'Sequence C', internalName: 'Average State', colorCode: 'YLW', color: '#eab308', description: 'I often feel like something is missing. I long to be understood, but worry no one ever truly will. I compare myself to others and feel envious of their ease, success, or joy. I can get lost in fantasy, nostalgia, or melancholy. I sometimes push people away to test if they\'ll stay. I struggle to feel "normal" and secretly wonder if I\'m broken. My emotions feel more intense than others\', which can be both a gift and a burden.' },
      { id: '4_4', level: 4, sequenceLabel: 'Sequence D', internalName: 'Below Average State', colorCode: 'ORG', color: '#f97316', description: 'I start believing I\'m broken. I dwell on my flaws, convinced I\'ll never be enough. I become moody, withdrawn, and hard to reach. I romanticize suffering, making my pain feel special or meaningful. I reject ordinary happiness as shallow. I may become envious, bitter, or self-sabotaging. I feel misunderstood and isolated, yet I push away those who try to help.' },
      { id: '4_5', level: 5, sequenceLabel: 'Sequence E', internalName: 'Destructive State', colorCode: 'RED', color: '#ef4444', description: 'I sink into darkness and believe I\'m defined by my pain. I romanticize suffering and resist healing. I may become self-destructive, hopeless, or emotionally volatile. I feel utterly alone, unloved, and beyond saving. I lash out at those who try to help, convinced they don\'t understand. I may lose touch with reality or collapse into despair.' }
    ]
  },
  {
    type: 5,
    typeName: 'Investigator',
    states: [
      { id: '5_1', level: 1, sequenceLabel: 'Sequence A', internalName: 'Very Good State', colorCode: 'GRN', color: '#22c55e', description: 'My mind is expansive and clear, I see patterns, systems, and meaning where others see chaos. I share my knowledge generously and engage fully with life, not from a distance. I feel emotionally present and capable of intimacy. I trust that I have enough, energy, time, and resources, to meet the world without retreating. I am a wise observer and an active participant. My insights serve others, not just my own sense of security.' },
      { id: '5_2', level: 2, sequenceLabel: 'Sequence B', internalName: 'Good State', colorCode: 'BLU', color: '#3b82f6', description: 'I love to understand how things work. I\'m naturally curious, observant, and enjoy mastering complex ideas. I value independence and prefer depth over breadth in knowledge and relationships. I\'m thoughtful, private, and often ahead of my time. I contribute quietly but meaningfully. I protect my energy and create space to think, explore, and analyze without distraction.' },
      { id: '5_3', level: 3, sequenceLabel: 'Sequence C', internalName: 'Average State', colorCode: 'YLW', color: '#eab308', description: 'I tend to withdraw when life feels too chaotic or overwhelming. I retreat into my mind, where I feel safe and competent. I observe more than I participate. I can be stingy with my time, energy, and emotions, always worried about being depleted. I may come across as distant or detached, even when I care deeply. I collect knowledge as a way to feel prepared for a world that often feels intrusive or demanding.' },
      { id: '5_4', level: 4, sequenceLabel: 'Sequence D', internalName: 'Below Average State', colorCode: 'ORG', color: '#f97316', description: 'I feel increasingly isolated, not just physically, but emotionally. I become suspicious, secretive, and detached. I struggle to trust others or let them in. I overthink everything and avoid action. I may become cynical or nihilistic. I feel like the world is too much, and that I have too little to give. I retreat further into ideas, fantasies, or solitary obsessions.' },
      { id: '5_5', level: 5, sequenceLabel: 'Sequence E', internalName: 'Destructive State', colorCode: 'RED', color: '#ef4444', description: 'I shut down. I disconnect from my body, my feelings, and the world around me. I become paranoid, reclusive, and incapable of connection. I may spiral into delusion or eccentricity. I lose all sense of grounding. I reject reality and live entirely in my head. In the worst cases, I become unable to function, frozen by fear and isolation.' }
    ]
  },
  {
    type: 6,
    typeName: 'Sentinel',
    states: [
      { id: '6_1', level: 1, sequenceLabel: 'Sequence A', internalName: 'Very Good State', colorCode: 'GRN', color: '#22c55e', description: 'I am grounded in deep trust, both in myself and in life. My loyalty becomes a superpower, not a trap. I face fear with courage and act despite uncertainty. I am a rock for others, dependable and wise. I trust my own instincts and make decisions with clarity. I see danger without being consumed by it. I belong to something greater than my fears.' },
      { id: '6_2', level: 2, sequenceLabel: 'Sequence B', internalName: 'Good State', colorCode: 'BLU', color: '#3b82f6', description: 'I am dependable, loyal, and thoughtful about potential problems or risks. I care deeply about the people and causes I believe in. I\'m a great team player and often the glue that holds groups together. I anticipate problems before they arise and prepare for challenges. I value security, trust, and commitment. I show up for the people I love, even when it\'s hard.' },
      { id: '6_3', level: 3, sequenceLabel: 'Sequence C', internalName: 'Average State', colorCode: 'YLW', color: '#eab308', description: 'I feel anxious much of the time, constantly scanning for potential threats or problems. I second-guess myself and seek reassurance from others. I struggle with trusting authority, sometimes defying it, sometimes overly relying on it. I test people\'s loyalty before I fully commit. I worry about worst-case scenarios and often feel unprepared for what might go wrong. I want to feel safe, but safety feels elusive.' },
      { id: '6_4', level: 4, sequenceLabel: 'Sequence D', internalName: 'Below Average State', colorCode: 'ORG', color: '#f97316', description: 'I become either overly dependent on others or rigidly self-reliant, swinging between the two. I project my fears onto the world, seeing enemies or betrayal where there may be none. I become suspicious, reactive, and defensive. I may sabotage relationships by testing people or pushing them away. I feel trapped by my anxiety but can\'t seem to escape it.' },
      { id: '6_5', level: 5, sequenceLabel: 'Sequence E', internalName: 'Destructive State', colorCode: 'RED', color: '#ef4444', description: 'I am consumed by fear and suspicion. I see danger everywhere and trust no one, not even myself. I become paranoid, reactive, and emotionally volatile. I may lash out in panic or collapse into helplessness. I feel utterly alone in a hostile world. I can become self-destructive or harm others out of misguided self-protection.' }
    ]
  },
  {
    type: 7,
    typeName: 'Enthusiast',
    states: [
      { id: '7_1', level: 1, sequenceLabel: 'Sequence A', internalName: 'Very Good State', colorCode: 'GRN', color: '#22c55e', description: 'I feel fully alive, brimming with joy, gratitude, and clarity. I savor each moment rather than racing to the next. I face pain and discomfort with grace, knowing they are part of a full life. My enthusiasm uplifts others without overwhelming them. I am present, grounded, and deeply content. My creativity flows from stillness, not from escape.' },
      { id: '7_2', level: 2, sequenceLabel: 'Sequence B', internalName: 'Good State', colorCode: 'BLU', color: '#3b82f6', description: 'I\'m upbeat, adventurous, and full of creative ideas. I love exploring new possibilities and bringing energy to everything I do. I\'m optimistic and resilient, able to bounce back from setbacks. I enjoy life and want others to as well. I inspire people with my vision and enthusiasm. I see opportunity everywhere.' },
      { id: '7_3', level: 3, sequenceLabel: 'Sequence C', internalName: 'Average State', colorCode: 'YLW', color: '#eab308', description: 'I avoid boredom at all costs. I jump from idea to idea, person to person, craving stimulation. I struggle to commit or follow through. I keep things light and avoid heavy emotions or difficult conversations. I feel anxious when things slow down. I use busyness, entertainment, or novelty to escape discomfort. I fear missing out and often overcommit.' },
      { id: '7_4', level: 4, sequenceLabel: 'Sequence D', internalName: 'Below Average State', colorCode: 'ORG', color: '#f97316', description: 'I become scattered, impulsive, and emotionally avoidant. I overcommit, overpromise, and underdeliver. I escape into fantasy, substances, or thrill-seeking. I feel empty despite constant activity. I become defensive when confronted with pain or limits. I lose touch with what truly matters.' },
      { id: '7_5', level: 5, sequenceLabel: 'Sequence E', internalName: 'Destructive State', colorCode: 'RED', color: '#ef4444', description: 'I spiral into compulsive escapism. I\'m reckless, self-centered, and incapable of facing reality. I burn through relationships, resources, and opportunities. I become manic, delusional, or dangerously impulsive. My joy becomes a mask for deep despair. I collapse when I can no longer outrun my pain.' }
    ]
  },
  {
    type: 8,
    typeName: 'Challenger',
    states: [
      { id: '8_1', level: 1, sequenceLabel: 'Sequence A', internalName: 'Very Good State', colorCode: 'GRN', color: '#22c55e', description: 'I am a grounded, powerful protector. My strength flows from inner peace, not control. I defend the vulnerable without becoming a bully. I allow myself to be soft, open, and emotionally available. I lead with wisdom, not force. I trust others and let them in. I am a warrior for justice and a safe harbor for those I love.' },
      { id: '8_2', level: 2, sequenceLabel: 'Sequence B', internalName: 'Good State', colorCode: 'BLU', color: '#3b82f6', description: 'I\'m confident, assertive, and direct. I say what others are afraid to say. I step up when things get tough and defend those who need it. I trust my instincts and take charge when needed. I don\'t shy away from confrontation, I see it as a way to clear the air. I value loyalty and honesty above all else. I respect strength in others and expect the same in return.' },
      { id: '8_3', level: 3, sequenceLabel: 'Sequence C', internalName: 'Average State', colorCode: 'YLW', color: '#eab308', description: 'I feel a constant need to stay in control. I push hard, speak bluntly, and take charge, even when it\'s not my place. I see the world as a place where only the strong survive. I trust very few people and question others\' motives. I often see vulnerability as weakness, even in myself. I take pride in being tough, but sometimes I steamroll others without realizing it. I hate feeling powerless, so I make sure I never look weak.' },
      { id: '8_4', level: 4, sequenceLabel: 'Sequence D', internalName: 'Below Average State', colorCode: 'ORG', color: '#f97316', description: 'I become domineering, aggressive, and reactive. I control situations with force and pressure. I assume people are trying to take advantage of me, so I push back hard. I bulldoze through feelings, mine and others\', to maintain control. I fear being betrayed, so I keep people at a distance or test their loyalty. I get stuck in cycles of anger, intimidation, and suspicion. I demand respect but don\'t always give it.' },
      { id: '8_5', level: 5, sequenceLabel: 'Sequence E', internalName: 'Destructive State', colorCode: 'RED', color: '#ef4444', description: 'I lose all sense of trust and become a tyrant in my own life. I lash out, blame, and destroy connections rather than risk being hurt. I seek revenge instead of resolution. I feel like the world is against me, so I go to war with it. I isolate myself behind walls of rage, pride, and fear. I can be explosive, paranoid, and cruel, all in a desperate attempt to avoid feeling vulnerable, weak, or out of control.' }
    ]
  },
  {
    type: 9,
    typeName: 'Peacemaker',
    states: [
      { id: '9_1', level: 1, sequenceLabel: 'Sequence A', internalName: 'Very Good State', colorCode: 'GRN', color: '#22c55e', description: 'I am deeply at peace with myself and the world. I radiate calm, wisdom, and quiet strength. I sense harmony even in chaos and can hold space for others without losing myself. I\'m fully present, alert, and awake, no longer avoiding conflict, but embracing life with trust and openness. My presence soothes others. I create unity not by pleasing, but by truly understanding.' },
      { id: '9_2', level: 2, sequenceLabel: 'Sequence B', internalName: 'Good State', colorCode: 'BLU', color: '#3b82f6', description: 'I\'m easygoing, patient, and calm. I avoid drama and try to keep the peace. I listen well and don\'t react quickly. I care about everyone getting along and will often put others\' needs before my own to keep things smooth. I value comfort and stability. I try not to rock the boat and focus on what keeps life simple and pleasant.' },
      { id: '9_3', level: 3, sequenceLabel: 'Sequence C', internalName: 'Average State', colorCode: 'YLW', color: '#eab308', description: 'I stay quiet even when I have something important to say. I avoid conflict by giving in or tuning out. I procrastinate on decisions and hope problems go away on their own. I lose touch with my own desires and instead go along with others. I\'m often tired, distracted, or mentally checked out. I focus on routine and comfort instead of growth or change.' },
      { id: '9_4', level: 4, sequenceLabel: 'Sequence D', internalName: 'Below Average State', colorCode: 'ORG', color: '#f97316', description: 'I become stubborn and passive-aggressive. I resist others not by arguing, but by withdrawing, stalling, or subtly sabotaging. I say "yes" to things I don\'t really want, then resent it later. I zone out with distractions and avoid anything uncomfortable. I shut down emotionally and pretend everything\'s fine when it\'s not. I feel invisible but fear what would happen if I truly spoke up.' },
      { id: '9_5', level: 5, sequenceLabel: 'Sequence E', internalName: 'Destructive State', colorCode: 'RED', color: '#ef4444', description: 'I completely lose my sense of self. I disconnect from reality, avoid responsibility, and let life happen to me instead of living it. I bury my anger, sadness, and needs so deeply that I no longer know who I am or what I want. I can become numb, apathetic, and unreachable, surviving in a fog. I may seem calm on the outside but feel empty and lost inside.' }
    ]
  }
];

export const HEAT_LEVELS = [
  { level: 1, label: 'Rarely Me', emoji: '❄️', score: 1, dnaMarker: 'LOW' },
  { level: 2, label: 'Sometimes', emoji: '🔥', score: 2, dnaMarker: 'MOD' },
  { level: 3, label: 'Often', emoji: '🔥🔥', score: 3, dnaMarker: 'HIGH' },
  { level: 4, label: 'This is ME', emoji: '🔥🔥🔥', score: 4, dnaMarker: 'PEAK' }
];

export const getStatesForType = (type: number): StateDescription[] => {
  const typeData = COLOR_STATES.find(t => t.type === type);
  return typeData?.states || [];
};

export const getTypeName = (type: number): string => {
  const typeData = COLOR_STATES.find(t => t.type === type);
  return typeData?.typeName || 'Unknown';
};

export const calculateStateResults = (ratings: { stateLevel: number; heatScore: number }[]) => {
  const sorted = [...ratings].sort((a, b) => b.heatScore - a.heatScore);
  const primary = sorted[0];
  const secondary = sorted[1];
  const totalTopTwo = primary.heatScore + secondary.heatScore;
  const primaryPercent = Math.round((primary.heatScore / totalTopTwo) * 100);
  const secondaryPercent = 100 - primaryPercent;
  return { primaryState: primary.stateLevel, primaryPercent, secondaryState: secondary.stateLevel, secondaryPercent };
};

export const generateStateDnaCode = (primaryLevel: number, secondaryLevel: number): string => {
  const levelToCodes: Record<number, string> = { 1: 'GRN', 2: 'BLU', 3: 'YLW', 4: 'ORG', 5: 'RED' };
  return `${levelToCodes[primaryLevel]}${levelToCodes[secondaryLevel]}-${Math.floor(Math.random() * 9000) + 1000}`;
};

export default COLOR_STATES;
