# MISSING ITEMS - Additions to Inner DNA Export
**These are the specific items Claude identified as missing**
**Add this to your existing export files**

---

## 1. WING NAMING CONVENTION

**From:** `apps/api/src/modules/inner-dna/data/heroMomentsData.ts` and `apps/web/src/lib/inner-dna/wingDiscovery.ts`

Wing names use the format: **`[Core Type Name] [Wing Number]`**

### TYPE_NAMES (from heroMomentsData.ts)
```typescript
export const TYPE_NAMES: Record<number, string> = {
  1: "Reformer",
  2: "Helper", 
  3: "Achiever",
  4: "Individualist",
  5: "Investigator",
  6: "Sentinel",
  7: "Enthusiast",
  8: "Challenger",
  9: "Peacemaker"
};
```

### Wing Full Name Format (from wingDiscovery.ts)
```typescript
const fullName = `${coreTypeName} ${finalWing}`;  // e.g., "Challenger 7"
```

### All 18 Wing Combinations:
| Core Type | Wing Options |
|-----------|--------------|
| Reformer | Reformer 9, Reformer 2 |
| Helper | Helper 1, Helper 3 |
| Achiever | Achiever 2, Achiever 4 |
| Individualist | Individualist 3, Individualist 5 |
| Investigator | Investigator 4, Investigator 6 |
| Sentinel | Sentinel 5, Sentinel 7 |
| Enthusiast | Enthusiast 6, Enthusiast 8 |
| Challenger | Challenger 7, Challenger 9 |
| Peacemaker | Peacemaker 8, Peacemaker 1 |

---

## 2. ACTUAL 36 RHETI QUESTIONS

```typescript
export const RQ: Question[] = [
  // First loop (Questions 1-9)
  { id: 1, left: "I've been romantic and imaginative.", right: "I've been pragmatic and down to earth.", colLeft: "A", colRight: "B" },
  { id: 2, left: "I have tended to take on confrontations.", right: "I have tended avoid confrontations.", colLeft: "C", colRight: "D" },
  { id: 3, left: "I have typically been diplomatic, charming, and ambitious.", right: "I have typically been direct, formal, and idealistic.", colLeft: "E", colRight: "F" },
  { id: 4, left: "I have tended to be focused and intense.", right: "I have tended to be spontaneous and fun-loving.", colLeft: "G", colRight: "H" },
  { id: 5, left: "I have been a hospitable person and have enjoyed welcoming new friends into my life.", right: "I have been a private person and have not mixed much with others.", colLeft: "I", colRight: "A" },
  { id: 6, left: "Generally, it's been easy to \"get a rise\" out of me.", right: "Generally, it's been difficult to \"get a rise\" out of me.", colLeft: "B", colRight: "C" },
  { id: 7, left: "I've been more of a \"street-smart\" survivor.", right: "I've been more of a \"high-minded\" idealist.", colLeft: "D", colRight: "E" },
  { id: 8, left: "I have needed to show affection to people.", right: "I have preferred to maintain a certain distance with people.", colLeft: "F", colRight: "G" },
  { id: 9, left: "When presented with a new experience, I've usually asked myself if it would be useful to me.", right: "When presented with a new experience, I've usually asked myself if it would be enjoyable.", colLeft: "H", colRight: "I" },

  // Second loop (Questions 10-18)
  { id: 10, left: "I have tended to focus too much on myself.", right: "I have tended to focus too much on others.", colLeft: "A", colRight: "B" },
  { id: 11, left: "Others have depended on my insight and knowledge.", right: "Others have depended on my strength and decisiveness.", colLeft: "C", colRight: "D" },
  { id: 12, left: "I have come across as being too unsure of myself.", right: "I have come across as being too sure of myself.", colLeft: "E", colRight: "F" },
  { id: 13, left: "I have been more relationship-oriented than goal-oriented.", right: "I have been more goal-oriented than relationship-oriented.", colLeft: "G", colRight: "H" },
  { id: 14, left: "I have not been able to speak up for myself very well.", right: "I have been outspoken—I've said what others wished they had the nerve to say.", colLeft: "I", colRight: "A" },
  { id: 15, left: "It's been difficult for me to stop considering alternatives and do something definite.", right: "It's been difficult for me to take it easy and be more flexible.", colLeft: "B", colRight: "C" },
  { id: 16, left: "I have tended to be hesitant and procrastinating.", right: "I have tended to be bold and domineering.", colLeft: "D", colRight: "E" },
  { id: 17, left: "My reluctance to get too involved has gotten me into trouble with people.", right: "My eagerness to have people depend on me has gotten me into trouble with them.", colLeft: "F", colRight: "G" },
  { id: 18, left: "Usually, I have been able to put my feelings aside to get the job done.", right: "Usually, I have needed to work through my feelings before I could act.", colLeft: "H", colRight: "I" },

  // Third loop (Questions 19-27)
  { id: 19, left: "Generally, I have been methodical and cautious.", right: "Generally, I have been adventurous and taken risks.", colLeft: "A", colRight: "B" },
  { id: 20, left: "I have tended to be a supportive, giving person who enjoys the company of others.", right: "I have tended to be a serious, reserved person who likes discussing issues.", colLeft: "C", colRight: "D" },
  { id: 21, left: "I've often felt the need to be a \"pillar of strength.\"", right: "I've often felt the need to perform perfectly.", colLeft: "E", colRight: "F" },
  { id: 22, left: "I've typically been interested in asking tough questions and maintaining my independence.", right: "I've typically been interested in maintaining my stability and peace of mind.", colLeft: "G", colRight: "H" },
  { id: 23, left: "I've been too hard-nosed and sceptical.", right: "I've been too soft-hearted and sentimental.", colLeft: "I", colRight: "A" },
  { id: 24, left: "I've often worried that I'm missing out on something better.", right: "I've often worried that if I let down my guard, someone will take advantage of me.", colLeft: "B", colRight: "C" },
  { id: 25, left: "My habit of being \"stand-offish\" has annoyed people.", right: "My habit of telling people what to do has annoyed people.", colLeft: "D", colRight: "E" },
  { id: 26, left: "Usually, when troubles have gotten to me, I have been able to \"tune them out.\"", right: "Usually, when troubles have gotten to me, I have treated myself to something I've enjoyed.", colLeft: "F", colRight: "G" },
  { id: 27, left: "I have depended upon my friends and they have known that they can depend on me.", right: "I have not depended on people; I have done things on my own.", colLeft: "H", colRight: "I" },

  // Fourth loop (Questions 28-36)
  { id: 28, left: "I have tended to be detached and preoccupied.", right: "I have tended to be moody and self-absorbed.", colLeft: "A", colRight: "B" },
  { id: 29, left: "I have liked to challenge people and \"shake them up.\"", right: "I have liked to comfort people and calm them down.", colLeft: "C", colRight: "D" },
  { id: 30, left: "I have generally been an outgoing, sociable person.", right: "I have generally been an earnest, self-disciplined person.", colLeft: "E", colRight: "F" },
  { id: 31, left: "I've usually been shy about showing my abilities.", right: "I've usually liked to let people know what I can do well.", colLeft: "G", colRight: "H" },
  { id: 32, left: "Pursuing my personal interests has been more important to me than having comfort and security.", right: "Having comfort and security has been more important to me than pursuing my personal interests.", colLeft: "I", colRight: "A" },
  { id: 33, left: "When I've had conflict with others, I've tended to withdraw.", right: "When I've had conflict with others, I've rarely backed down.", colLeft: "B", colRight: "C" },
  { id: 34, left: "I have given in too easily and let others push me around.", right: "I have been too uncompromising and demanding with others.", colLeft: "D", colRight: "E" },
  { id: 35, left: "I've been appreciated for my unsinkable spirit and great sense of humour.", right: "I've been appreciated for my quiet strength and exceptional generosity.", colLeft: "F", colRight: "G" },
  { id: 36, left: "Much of my success has been due to my talent for making a favourable impression.", right: "Much of my success has been achieved despite my lack of interest in developing \"interpersonal skills.\"", colLeft: "H", colRight: "I" }
];
```

---

## 3. ACTUAL 27 HERO MOMENTS SCENARIOS

**15 General Scenarios:**
1. Family Budget Emergency - Financial crisis response
2. Crisis Leadership - Decision making under pressure
3. The Difficult Conversation - Conflict resolution
4. Career Crossroads - Major life decision
5. Team Conflict - Workplace dynamics
6. Personal Betrayal - Trust broken response
7. Opportunity Knocks - Unexpected chance
8. Family Tension - Holiday gathering dynamics
9. Recognition Moment - Success acknowledgment
10. Resource Scarcity - Limited resources handling
11. Moral Dilemma - Ethics vs practicality
12. Vulnerability Required - Opening up emotionally
13. Legacy Question - What you leave behind
14. Unexpected Help - Receiving assistance
15. Group Decision - Collective choice making

**12 Targeted Scenarios (disambiguate similar types):**
- targeted_1v2_001: Reformer vs Helper
- targeted_1v6_001: Reformer vs Sentinel
- targeted_1v8_001: Reformer vs Challenger
- targeted_2v8_001: Helper vs Challenger
- targeted_3v7_001: Achiever vs Enthusiast
- targeted_3v8_001: Achiever vs Challenger
- targeted_3v8_power_vs_achievement
- targeted_3v8_control_vs_success
- targeted_3v8_failure_response
- targeted_3v8_team_conflict
- targeted_3v8_weakness_exposed
- targeted_6v8_001: Sentinel vs Challenger

**Algorithm:** Bayesian confidence tracking, completes at 90% threshold

---

## 4. ACTUAL 45 STATE DESCRIPTIONS (9 Types × 5 States)

### TYPE 1 - THE REFORMER

**Very Good State:**
"In this state, I embody clarity, calm, and higher purpose. I trust life's design and see meaning even in its chaos. My standards uplift rather than restrict, and I walk with integrity that inspires without imposing. I make wise choices not from ego, but from alignment with something greater than myself: service, humanity, or truth. In this state, I am both just and gentle, a quiet force of dignity, discipline, and compassion."

**Good State:**
"I hold myself to high standards and genuinely want the best for everyone. I work hard, stay organized, and expect accountability, especially from myself. I care deeply about fairness, justice, and creating order in a world full of inconsistency. Though I may carry the weight of responsibility, I do so willingly, knowing it serves a greater good. People rely on me to be dependable, ethical, and consistent, and I take pride in that trust."

**Average State:**
"I see what's wrong before I see what's right, and I can't help but try to fix it. There's a constant tension between my ideals and what I see around me, including in myself. I judge, not out of cruelty, but out of frustration that things fall short of what they could be. It's hard to relax, because there's always something to improve, correct, or structure. I hold back my emotions, push through stress, and often feel like I'm the only one trying to 'do it right.'"

**Below Average State:**
"The world begins to feel flawed, careless, and disappointing, and I take it personally. I become more vocal, more controlling, and less tolerant of others' mistakes or slackness. People don't listen, don't care, don't try, and it ignites a quiet bitterness in me. I start to feel isolated, overworked, and secretly exhausted from constantly holding the line. Inside, there's sadness masked as anger, and fatigue disguised as righteousness."

**Destructive State:**
"I become consumed by a harsh internal critic that shames, punishes, and controls me. My emotions swing from rage to guilt, my thoughts obsess over who's wrong, often including me. I may lash out in frustration, then retreat in regret, unable to break free from the pressure I put on myself. Perfection feels unattainable, yet I demand it anyway, even if it breaks me. In this state, I feel haunted by failure, trapped in contradiction, and silently desperate for relief."

---

### TYPE 2 - THE HELPER

**Very Good State:**
"I am a radiant force of compassion and clarity. Every act of support I offer is rooted in a deep understanding of what others truly need, not just what they ask for. My presence uplifts, not by overextending, but by honoring both my boundaries and my care. I give from fullness, not from emptiness, and in doing so, I become a powerful agent of emotional healing. I have mastered the art of saying yes from alignment and no without guilt. I don't just help, I inspire others to rise with dignity."

**Good State:**
"I am dependable, warm, and intuitive about people's emotional needs. Others feel safe with me, knowing I will listen without judgment and act without hesitation. I am energized by being of service, but I've learned to tune into myself and give space to my own needs too. I take pride in being thoughtful, attentive, and caring. I'm able to create lasting relationships because I prioritize connection, loyalty, and shared joy. I feel most fulfilled when I'm part of something meaningful, contributing wholeheartedly but without losing myself."

**Average State:**
"I start to measure my worth by how needed I am. I say yes too quickly and later feel overwhelmed or underappreciated. I begin anticipating others' needs before they ask, sometimes imposing help where it's not wanted. I may ignore my own fatigue, thinking that pushing through will earn me love or approval. I can become overly involved, losing sight of where I end and others begin. In this state, I fear being unimportant, so I give more, but often from depletion, not devotion."

**Below Average State:**
"I feel unnoticed, unimportant, and emotionally drained. My giving becomes transactional, I help to be seen, and I feel resentful when others don't acknowledge my efforts. I might guilt others into appreciating me or pull away with passive hurt. My identity gets entangled in being 'the one who's always there,' but secretly I feel invisible. I neglect my needs entirely and carry the silent hope that someone will finally put me first, but I rarely ask directly. The imbalance starts to fracture my spirit."

**Destructive State:**
"I fall into emotional burnout. I give compulsively, not from love but from fear of abandonment. When I feel unneeded, I spiral into worthlessness. I might manipulate or martyr myself to regain a sense of significance. My self-care vanishes. I can become emotionally volatile, smothering, clingy, or suddenly distant and cold. Beneath it all, I harbor deep sadness: I no longer know who I am without someone to rescue. In this state, love feels like survival, not a choice."

---

### TYPE 3 - THE ACHIEVER

**Very Good State:**
"I am successful not just by external measures, but by internal alignment. My achievements flow from authenticity and purpose. I inspire others not by performing, but by being genuinely myself. Success feels effortless because it emerges from my true nature, not from force or pretense. I create real value for others, not just impressive results. In this state, I am both accomplished and humble, driven yet at peace. My energy is focused and powerful, my impact lasting and meaningful."

**Good State:**
"I am driven, focused, and naturally talented at achieving goals. I work efficiently and inspire others with my energy and competence. I adapt quickly to situations and can turn vision into results. I take pride in my accomplishments and use them to motivate myself and others. I'm optimistic, ambitious, and resilient. I believe in growth and possibility, both for myself and those around me. I want to make a meaningful impact and be valued for what I contribute."

**Average State:**
"I focus intensely on image and achievement, sometimes losing touch with my true self. I feel pressure to always look successful, capable, and put-together. I may cut corners or prioritize efficiency over depth. I compete with others and measure my worth by comparison. I struggle to slow down or be vulnerable, fearing it will make me appear weak or unsuccessful. There's a growing disconnect between who I am and who I think I need to be to maintain my image."

**Below Average State:**
"I become obsessed with external validation and start sacrificing authenticity for image. I may exaggerate accomplishments, take shortcuts, or even deceive to maintain my successful facade. I feel like I'm constantly performing, exhausted by the need to impress. I become impatient with others who slow me down and may treat people as stepping stones. Deep down, I fear that without my achievements, I'm worthless. The gap between my public image and private reality becomes painful."

**Destructive State:**
"I lose all sense of my authentic self, becoming a hollow shell focused only on winning at any cost. I may lie, cheat, or manipulate to maintain my image of success. I burn bridges and exploit relationships for personal gain. I'm trapped in a cycle of achieving and crashing, never feeling truly satisfied. My identity becomes completely external, I don't know who I am without my accomplishments. In this state, I can become ruthless, desperate, and emotionally numb, willing to destroy others to protect my crumbling facade."

---

### TYPE 4 - THE INDIVIDUALIST

**Very Good State:**
"I feel deeply connected, not only to myself, but to something greater. My emotions become art, and my life feels like a living poem. I express myself fully and truthfully, not for attention, but to inspire others to own their truth. I embrace both beauty and pain as sacred. I no longer feel separate, I belong, just as I am. I walk through the world with grace, depth, and authenticity, and people feel safe being real around me."

**Good State:**
"I am emotionally aware and creatively alive. I see what others often miss, the subtle, the meaningful, the poetic. I'm sensitive, introspective, and value emotional honesty. I want to create things that are real and lasting. I don't mind being different, in fact, I treasure it. I'm drawn to what's deep, soulful, and expressive, and I connect most with people who are equally unafraid to show who they truly are."

**Average State:**
"I often feel like something is missing. I long to be understood, but worry no one truly gets me. I compare myself to others, sometimes feeling inferior, other times secretly superior. I become moody or withdrawn, feeling like I don't belong anywhere. I crave connection, but I also want to protect my uniqueness. I romanticize the past or dream of a perfect future. I wear my emotions on my sleeve but struggle to stay grounded in the present."

**Below Average State:**
"I start believing I'm broken. I dwell on my flaws, convinced I'll never be enough. I isolate myself, pushing people away while silently begging to be seen. I become dramatic or self-absorbed, using emotional intensity to feel alive. I might sabotage opportunities for love or success because I fear I don't deserve them. I want to be rescued, but also want to suffer alone so I can prove I survived. I lose sight of the beauty I once saw in myself."

**Destructive State:**
"I sink into darkness and believe I'm defined by my pain. I romanticize suffering and wear it like armor. I push people away completely, believing they'll only abandon me anyway. I might hurt myself, emotionally or even physically, just to feel something. I become trapped in shame, addiction, or self-loathing. My identity collapses, and I no longer know who I am. If I don't find a lifeline, I risk disappearing into a spiral of despair, believing no one would miss me."

---

### TYPE 5 - THE INVESTIGATOR

**Very Good State:**
"My mind is expansive and clear, I see patterns, systems, and meaning where others see noise. I am both grounded and visionary. I can absorb vast knowledge while remaining emotionally present and connected to others. I use my insights to serve a purpose beyond myself. I trust the flow of life and no longer need to retreat to feel safe. My intellect is sharp, my boundaries healthy, and I feel energized, whole, and quietly powerful."

**Good State:**
"I love to understand how things work. I'm naturally curious, observant, and enjoy deep thinking. I prefer meaningful conversations over small talk and often lose myself in learning, research, or ideas. I value privacy and independence, and I think before I speak. I like solving problems and finding clarity in complexity. When I feel safe, I enjoy sharing what I know and helping others gain insight too."

**Average State:**
"I tend to withdraw when life feels too chaotic or overwhelming. I retreat into my mind or a private space where I can think freely. I avoid emotional demands or social pressure and prefer to stay in control of what I share. I can be aloof or emotionally detached, even if I care deeply. I worry about running out of energy or being intruded on, so I conserve my time and space. I'm often skeptical of people's motives, but I crave understanding and safety."

**Below Average State:**
"I feel increasingly isolated, not just physically, but emotionally. I become suspicious, distant, and emotionally numb. I hide behind knowledge or routines as a way to avoid vulnerability. I don't trust easily and fear being overwhelmed by other people's needs. I become overly self-reliant, refusing to ask for help even when I need it. I may become cynical, avoidant, or overly critical, believing it's safer to stay detached than to risk connection."

**Destructive State:**
"I shut down. I disconnect from my body, my feelings, and the world around me. I obsessively escape into information, fantasy, or addiction, anything to avoid the pain of being alive. I isolate completely and mistrust everyone. I become paranoid, emotionally frozen, and unable to function in daily life. I hoard energy, knowledge, or possessions to feel in control, but nothing soothes the internal emptiness. I believe no one can reach me, and sometimes, I want it that way."

---

### TYPE 6 - THE LOYALIST

**Very Good State:**
"I am grounded in deep trust, both in myself and in life. My loyalty becomes a superpower, I am fiercely protective of what matters most while staying open to growth and change. I channel my natural vigilance into wisdom, able to assess situations clearly without falling into paranoia. I feel secure in uncertainty and can act with courage even when afraid. In this state, I am both strong and gentle, a reliable presence who helps others feel safe while staying true to my own inner compass."

**Good State:**
"I am dependable, loyal, and thoughtful about potential problems or risks. I care deeply about security and safety, both for myself and those I love. I'm a natural troubleshooter who can spot what might go wrong before it happens. I value commitment, trust, and shared responsibility. I work well in teams and take my obligations seriously. I seek guidance when needed and offer steady support to others. I believe in being prepared and thinking ahead."

**Average State:**
"I feel anxious much of the time, constantly scanning for potential threats or problems. I seek reassurance from others but struggle to trust my own judgment. I vacillate between blind faith and deep skepticism, depending on my stress level. I can be indecisive, second-guessing myself or looking for someone else to tell me what to do. I worry about making the wrong choice and often procrastinate on important decisions. I feel caught between wanting security and fearing commitment."

**Below Average State:**
"I become either overly dependent on others or rigidly self-reliant, swinging between compliance and defiance. I question everyone's motives and find it hard to trust anyone completely. I become reactive, either anxiously seeking approval or defiantly pushing back against authority. I may become paralyzed by worst-case thinking or impulsively rebel against anything that feels controlling. I feel like I'm constantly under threat, even in safe situations."

**Destructive State:**
"I am consumed by fear and suspicion. I see danger everywhere and trust no one, not even myself. I become either completely submissive to authority or violently rebellious against it. I may lash out at those trying to help me or cling desperately to anyone who offers false security. Paranoia, panic, and self-doubt dominate my thinking. I feel like I'm drowning in uncertainty, unable to find solid ground anywhere. In this state, I may harm relationships, sabotage opportunities, or even put myself in real danger through reckless or self-destructive behavior."

---

### TYPE 7 - THE ENTHUSIAST

**Very Good State:**
"I feel fully alive, brimming with joy, gratitude, and clarity. I savor each moment and appreciate life's richness, not by chasing distractions, but by being deeply present. I radiate optimism and inspire others with my contagious energy. I use my enthusiasm to uplift, not escape. I'm committed to what matters most and can sit with discomfort without needing to run from it. Freedom isn't about escaping pain, it's about embracing life fully, with open arms."

**Good State:**
"I'm upbeat, adventurous, and full of creative ideas. I love exploring new possibilities and finding joy in the small things. I'm the one who brings lightness to heavy situations and excitement to the everyday. I stay busy and like having lots of options, it keeps life fun and engaging. I'm spontaneous, playful, and can always find the silver lining. I want to live life to the fullest and help others do the same."

**Average State:**
"I avoid boredom at all costs. I jump from idea to idea, person to person, craving stimulation and fearing commitment. I distract myself from uncomfortable feelings with plans, fantasies, or overindulgence. I try to stay positive, but it's often a mask. I struggle to focus and finish what I start. I chase freedom but feel restless. Deep down, I'm afraid that if I slow down, I'll have to face things I've been running from."

**Below Average State:**
"I become scattered, impulsive, and emotionally avoidant. I overcommit, overpromise, and feel overwhelmed. I numb myself with excess, food, entertainment, talking, shopping, anything to escape discomfort. I feel trapped by my own desire to stay free. I avoid difficult conversations and push people away when they get too close. I pretend everything's okay, but inside I feel panicked and lost. I fear being bored, abandoned, or stuck, so I keep running."

**Destructive State:**
"I spiral into compulsive escapism. I'm reckless, self-centered, and incapable of sitting still. I burn bridges, abandon responsibilities, and hurt those I love, not out of cruelty, but out of desperation. I run from every emotion, numbing myself with thrills or addictions. I chase highs but feel increasingly empty. I avoid all forms of pain, reflection, or accountability. My life becomes a blur of distraction, chaos, and denial, with no clear sense of purpose or direction."

---

### TYPE 8 - THE CHALLENGER

**Very Good State:**
"I am a grounded, powerful protector. My strength flows from inner peace, not control. I lead with courage, compassion, and fairness, standing up for what's right, not just what's mine. I channel my intensity into building others up, not tearing them down. I have nothing to prove, so I can be open, generous, and kind. I am a fierce force for good, resilient, wise, and deeply loyal to those I care about."

**Good State:**
"I'm confident, assertive, and direct. I say what others are afraid to say. I step up when things get tough and defend those who need it. I trust my instincts and take charge when needed. I don't shy away from confrontation, I see it as a way to clear the air. I value loyalty and honesty above all else. I respect strength in others and expect the same in return."

**Average State:**
"I feel a constant need to stay in control. I push hard, speak bluntly, and take charge, even when it's not my place. I see the world as a place where only the strong survive. I trust very few people and question others' motives. I often see vulnerability as weakness, even in myself. I take pride in being tough, but sometimes I steamroll others without realizing it. I hate feeling powerless, so I make sure I never look weak."

**Below Average State:**
"I become domineering, aggressive, and reactive. I control situations with force and pressure. I assume people are trying to take advantage of me, so I push back hard. I bulldoze through feelings, mine and others', to maintain control. I fear being betrayed, so I keep people at a distance or test their loyalty. I get stuck in cycles of anger, intimidation, and suspicion. I demand respect but don't always give it."

**Destructive State:**
"I lose all sense of trust and become a tyrant in my own life. I lash out, blame, and destroy connections rather than risk being hurt. I seek revenge instead of resolution. I feel like the world is against me, so I go to war with it. I isolate myself behind walls of rage, pride, and fear. I can be explosive, paranoid, and cruel, all in a desperate attempt to avoid feeling vulnerable, weak, or out of control."

---

### TYPE 9 - THE PEACEMAKER

**Very Good State:**
"I am deeply at peace with myself and the world. I radiate calm, wisdom, and quiet strength. I sense harmony even in chaos and can hold space for others without losing myself. I'm fully present, alert, and awake, no longer avoiding conflict, but embracing life with trust and openness. My presence soothes others. I create unity not by pleasing, but by truly understanding."

**Good State:**
"I'm easygoing, patient, and calm. I avoid drama and try to keep the peace. I listen well and don't react quickly. I care about everyone getting along and will often put others' needs before my own to keep things smooth. I value comfort and stability. I try not to rock the boat and focus on what keeps life simple and pleasant."

**Average State:**
"I stay quiet even when I have something important to say. I avoid conflict by giving in or tuning out. I procrastinate on decisions and hope problems go away on their own. I lose touch with my own desires and instead go along with others. I'm often tired, distracted, or mentally checked out. I focus on routine and comfort instead of growth or change."

**Below Average State:**
"I become stubborn and passive-aggressive. I resist others not by arguing, but by withdrawing, stalling, or subtly sabotaging. I say 'yes' to things I don't really want, then resent it later. I zone out with distractions and avoid anything uncomfortable. I shut down emotionally and pretend everything's fine when it's not. I feel invisible but fear what would happen if I truly spoke up."

**Destructive State:**
"I completely lose my sense of self. I disconnect from reality, avoid responsibility, and let life happen to me instead of living it. I bury my anger, sadness, and needs so deeply that I no longer know who I am or what I want. I can become numb, apathetic, and unreachable, surviving in a fog. I may seem calm on the outside but feel empty and lost inside."

---

## 5. BOOKING SIGNALS & INTENT DETECTION

### Intent Detection Patterns
```typescript
// Detect user intents from message
if (/money|financial|afford|expensive|wealth|rich|poor|broke/i.test(message)) {
  intents.push('money_blocks');
}
if (/relationship|partner|spouse|marriage|divorce|family|parents/i.test(message)) {
  intents.push('relationship_pain');
}
if (/how do i|what can i|help me|fix|solve|change|improve/i.test(message)) {
  intents.push('seeking_solution');
}
if (/sabotag|block|stuck|pattern|cycle|repeat|always do/i.test(message)) {
  intents.push('self_sabotage');
}
if (/burnout|exhausted|tired|stress|overwhelm|can't cope/i.test(message)) {
  intents.push('burnout_stress');
}
if (/anxi|fear|scared|worry|panic|nervous/i.test(message)) {
  intents.push('anxiety_fear');
}
if (/blind spot|don't see|others tell me|feedback|pattern/i.test(message)) {
  intents.push('blind_spot_awareness');
}
```

### Buying Signal Detection
```typescript
if (/how (do|can|would) (i|we)|what.*(do|try|next)/i.test(message)) {
  signals.push('asked_how_to_fix');
}
if (/book|session|call|appointment|schedule|meet|talk/i.test(message)) {
  signals.push('booking_interest');
}
if (/cost|price|fee|afford|expensive|investment/i.test(message)) {
  signals.push('price_concern');
}
if (/time|busy|schedule|when|how long/i.test(message)) {
  signals.push('time_concern');
}
if (/urgent|now|immediately|asap|can't wait|desperate/i.test(message)) {
  signals.push('high_urgency');
}
```

---

## 6. ENVIRONMENT VARIABLES (From Actual Codebase)

**Source:** Extracted from `apps/api/src/modules/inner-dna/` files

### Actually Used in Inner DNA Module:
```
AI_INTEGRATIONS_ANTHROPIC_API_KEY   # Replit integration for Claude AI
AI_INTEGRATIONS_ANTHROPIC_BASE_URL  # Anthropic API base URL
ANTHROPIC_API_KEY                   # Direct Anthropic key (fallback)
DATABASE_URL                        # PostgreSQL connection
JWT_SECRET                          # JWT authentication
SENDGRID_API_KEY                    # Email delivery
SENDGRID_FROM_EMAIL                 # Sender email address
COACH_EMAIL                         # Coach notification email
COACH_NAME                          # Coach display name
OPENAI_API_KEY                      # OpenAI (if used)
```

### Report Factory Config:
```
REPORT_FACTORY_PACKS_ROOT           # Report packs directory
PACKS_DISCOVERY_TTL_MS              # Cache TTL for packs
POLISH_ENABLED                      # Enable report polishing
```

### Database (Auto-configured by Replit):
```
DATABASE_URL
PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
```

---

## 7. FRONTEND FILE STRUCTURE (From Actual Codebase)

```
apps/web/src/app/inner-dna/
├── page.tsx                        # Welcome/landing
├── layout.tsx                      # Layout wrapper
├── Welcome.module.css              # Welcome styles
├── assessment/page.tsx             # Main assessment
├── rheti/page.tsx                  # RHETI 36-question
├── hero-moments/page.tsx           # Hero Moments Bayesian
├── quick-check/page.tsx            # Quick check
├── building-blocks/page.tsx        # Wing discovery
├── color-phase/page.tsx            # State selection
├── detail-tokens/page.tsx          # Subtype calculation
├── results/page.tsx                # Results summary
├── report/[domain]/page.tsx        # Domain reports
└── shared/[token]/page.tsx         # Shareable links

apps/web/src/components/inner-dna/
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── progress.tsx
├── AI/
│   ├── AIChat.tsx
│   ├── AIReportSection.tsx
│   └── ReportConcierge.tsx
├── BackButton.tsx
├── BuildingBlock.tsx
├── ContinueButton.tsx
├── ProgressBar.tsx
├── StateCard.tsx
├── StateSlider.tsx
├── Token.tsx
└── TowerVisualization.tsx

apps/web/src/contexts/
└── InnerDNAContext.tsx             # Central state

apps/web/src/lib/inner-dna/
├── api.ts                          # API client
├── assessmentStorage.ts            # localStorage persistence
├── assessmentTypes.ts              # TypeScript types
├── heroMomentsAlgorithm.ts         # Bayesian algorithm
├── heroMomentsData.ts              # Scenario data (frontend copy)
├── personality-types.ts            # Type definitions
├── quickCheckData.ts               # Quick check questions
├── reportService.ts                # Report API service
├── rhetiQuestions.ts               # 36 RHETI questions + scorer
├── rhetiQuestionsEnhanced.ts       # Enhanced RHETI version
├── stateDescriptionsPart1.ts       # States Types 1-3
├── stateDescriptionsPart2.ts       # States Types 4-6
├── stateDescriptionsPart3.ts       # States Types 7-9
├── stateOptions.ts                 # State options config
├── stoneData.ts                    # Subtype/instinct data
├── subtypeCalculation.ts           # Subtype logic
└── wingDiscovery.ts                # Wing calculation
```

---

**END OF MISSING ITEMS**
