# COMPLETE Multi-Language & AI Components for Inner DNA System

**Compiled: 2025-12-05**
**This document contains ALL multi-language infrastructure and AI integration details**

---

## TABLE OF CONTENTS

1. [i18n Configuration (4 Languages)](#1-i18n-configuration)
2. [Complete State Descriptions Translations (45 States × 4 Languages)](#2-complete-state-descriptions-translations)
3. [RHETI Questions Translation Framework](#3-rheti-questions-translation-framework)
4. [AI Synthesis Engine (Claude Sonnet 4.5)](#4-ai-synthesis-engine)
5. [AI Chat Service - 4-Phase Coaching Discovery](#5-ai-chat-service)
6. [Language Writing Rules for AI](#6-language-writing-rules-for-ai)
7. [Complete Translation Matrix (109 Placeholders × 9 Types × 3 Languages)](#7-complete-translation-matrix)
8. [Chat Domain Configuration (10 Domains)](#8-chat-domain-configuration)
9. [Content Atoms Structure](#9-content-atoms-structure)

---

# 1. I18N CONFIGURATION

## Supported Languages

```typescript
// FILE: apps/api/src/modules/inner-dna/i18n/config.ts

export type SupportedLanguage = 'en' | 'hi-G4' | 'hi-Latn' | 'ur-G4';

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, {
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  fontFamily: string;
}> = {
  'en': {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    fontFamily: "'IBM Plex Sans', sans-serif"
  },
  'hi-G4': {
    name: 'Hindi',
    nativeName: 'हिंदी',
    direction: 'ltr',
    fontFamily: "'Noto Sans Devanagari', 'IBM Plex Sans', sans-serif"
  },
  'hi-Latn': {
    name: 'Hinglish',
    nativeName: 'Hinglish',
    direction: 'ltr',
    fontFamily: "'IBM Plex Sans', sans-serif"
  },
  'ur-G4': {
    name: 'Urdu',
    nativeName: 'اردو',
    direction: 'rtl',
    fontFamily: "'Noto Nastaliq Urdu', 'IBM Plex Sans Arabic', sans-serif"
  }
};

export function getLanguageConfig(lang: string) {
  return SUPPORTED_LANGUAGES[lang as SupportedLanguage] || SUPPORTED_LANGUAGES.en;
}

export function isRTL(lang: string): boolean {
  return getLanguageConfig(lang).direction === 'rtl';
}

export function detectLanguageFromRequest(query: { lang?: string }, headers?: { 'accept-language'?: string }): SupportedLanguage {
  if (query.lang && query.lang in SUPPORTED_LANGUAGES) {
    return query.lang as SupportedLanguage;
  }
  if (headers?.['accept-language']) {
    const browserLang = headers['accept-language'].split(',')[0].split('-')[0];
    if (browserLang === 'hi') return 'hi-G4';
    if (browserLang === 'ur') return 'ur-G4';
  }
  return 'en';
}
```

---

# 2. COMPLETE STATE DESCRIPTIONS TRANSLATIONS

## All 9 Types × 5 States in 4 Languages

```json
{
  "type_1": {
    "veryGood": {
      "name": "Very Good State",
      "description_en": "In this state, I embody clarity, serenity, and higher purpose. I trust life's design and see meaning even in its chaos. My standards uplift rather than restrict. I walk with an integrity that inspires without imposing. I make wise choices, not from ego but from alignment with something greater.",
      "description_hi_G4": "इस अवस्था में, मैं स्पष्टता, शांति और उच्च उद्देश्य का प्रतीक हूं। मैं जीवन के डिज़ाइन पर भरोसा करता हूं और इसकी अराजकता में भी अर्थ देखता हूं। मेरे मानदंड प्रतिबंधित करने के बजाय उत्थान करते हैं। मैं अखंडता के साथ चलता हूं जो बिना थोपे प्रेरणा देती है। मैं बुद्धिमानी से चुनाव करता हूं, अहंकार से नहीं बल्कि किसी बड़ी चीज़ के साथ तालमेल से।",
      "description_hi_Latn": "Is state mein, main clarity, shanti aur higher purpose ka symbol hun. Main life ke design par trust karta hun aur chaos mein bhi meaning dekhta hun. Mere standards restrict karne ke bajaye uplift karte hain. Main integrity ke saath chalta hun jo inspire karta hai bina impose kiye. Main wise choices karta hun, ego se nahi balki kisi greater thing ke saath alignment se.",
      "description_ur_G4": "اس حالت میں، میں وضاحت، سکون اور اعلیٰ مقصد کا مجسمہ ہوں۔ میں زندگی کے ڈیزائن پر بھروسہ کرتا ہوں اور اس کی افراتفری میں بھی معنی دیکھتا ہوں۔ میرے معیار پابند کرنے کے بجائے بلند کرتے ہیں۔ میں ایسی دیانت کے ساتھ چلتا ہوں جو مجبور کیے بغیر متاثر کرتی ہے۔ میں دانائی سے انتخاب کرتا ہوں، انا سے نہیں بلکہ کسی بڑی چیز کے ساتھ ہم آہنگی سے۔"
    },
    "good": {
      "name": "Good State",
      "description_en": "I hold myself to high standards and genuinely want the best for everyone. I work hard, stay organized, and expect accountability, especially from myself. I care deeply about fairness, justice, and creating order. Even if I carry the burden of responsibility, I do it gladly because it serves the greater good.",
      "description_hi_G4": "मैं खुद को उच्च मानदंडों पर रखता हूं और वास्तव में सबके लिए सबसे अच्छा चाहता हूं। मैं कड़ी मेहनत करता हूं, संगठित रहता हूं, और जवाबदेही की अपेक्षा करता हूं, खासकर खुद से। मैं निष्पक्षता, न्याय और व्यवस्था बनाने की गहरी परवाह करता हूं। भले ही मैं जिम्मेदारी का बोझ उठाऊं, मैं यह खुशी से करता हूं क्योंकि यह बड़े भले की सेवा करता है।",
      "description_hi_Latn": "Main apne aap ko high standards par rakhta hun aur sach mein sabke liye best chahta hun. Main hard work karta hun, organized rehta hun, aur accountability expect karta hun, especially khud se. Main fairness, justice aur order banane ki deep care karta hun. Chahe main responsibility ka burden uthaaun, main yeh khushi se karta hun kyunki yeh greater good ki seva karta hai.",
      "description_ur_G4": "میں اپنے آپ کو اعلیٰ معیارات پر رکھتا ہوں اور واقعی سب کے لیے بہترین چاہتا ہوں۔ میں سخت محنت کرتا ہوں، منظم رہتا ہوں، اور جوابدہی کی توقع کرتا ہوں، خاص طور پر اپنے آپ سے۔ میں انصاف، عدل اور نظم بنانے کی گہری پرواہ کرتا ہوں۔ اگرچہ میں ذمہ داری کا بوجھ اٹھاؤں، میں یہ خوشی سے کرتا ہوں کیونکہ یہ بڑے بھلے کی خدمت کرتا ہے۔"
    },
    "average": {
      "name": "Average State",
      "description_en": "I see the wrong before I see the right, and I can't help but try to fix it. There's a constant tension between my ideals and what I see around me. I judge, not out of cruelty but out of frustration that things aren't as good as they could be. Relaxing is hard because there's always something to improve.",
      "description_hi_G4": "मैं सही से पहले गलत को देखता हूं, और मदद नहीं कर सकता बल्कि इसे ठीक करने की कोशिश करता हूं। मेरे आदर्शों और जो मैं अपने आसपास देखता हूं, उसमें निरंतर तनाव है। मैं न्याय करता हूं, क्रूरता से नहीं बल्कि निराशा से कि चीज़ें उतनी अच्छी नहीं हैं जितनी हो सकती हैं। आराम करना कठिन है, क्योंकि हमेशा कुछ न कुछ सुधारने को होता है।",
      "description_hi_Latn": "Main right se pehle wrong ko dekhta hun, aur help nahi kar sakta lekin use fix karne ki koshish karta hun. Mere ideals aur jo main apne around dekhta hun, usme constant tension hai. Main judge karta hun, cruelty se nahi balki frustration se ki cheezein utni achhi nahi hain jitni ho sakti hain. Relax karna hard hai, kyunki hamesha kuch na kuch improve karne ko hota hai.",
      "description_ur_G4": "میں صحیح سے پہلے غلط کو دیکھتا ہوں، اور مدد نہیں کر سکتا بلکہ اسے ٹھیک کرنے کی کوشش کرتا ہوں۔ میرے آئیڈیلز اور جو میں اپنے ارد گرد دیکھتا ہوں، اس میں مستقل تناؤ ہے۔ میں فیصلہ کرتا ہوں، ظلم سے نہیں بلکہ مایوسی سے کہ چیزیں اتنی اچھی نہیں ہیں جتنی ہو سکتی ہیں۔ آرام کرنا مشکل ہے، کیونکہ ہمیشہ کچھ نہ کچھ بہتر کرنے کو ہوتا ہے۔"
    },
    "belowAverage": {
      "name": "Below Average State",
      "description_en": "The world starts to feel flawed, careless, and disappointing, and I take it personally. I become more vocal, more controlling, and less tolerant of others' mistakes. People don't listen, don't care, don't try, and it wakes a quiet bitterness in me. I start to feel isolated, overworked.",
      "description_hi_G4": "दुनिया दोषपूर्ण, लापरवाह और निराशाजनक लगने लगती है, और मैं इसे व्यक्तिगत रूप से लेता हूं। मैं अधिक मुखर, अधिक नियंत्रणकारी, और दूसरों की गलतियों के प्रति कम सहनशील हो जाता हूं। लोग सुनते नहीं, परवाह नहीं करते, कोशिश नहीं करते, और यह मुझमें एक शांत कड़वाहट जगाता है। मैं अकेला, अधिक काम करने वाला महसूस करने लगता हूं।",
      "description_hi_Latn": "Duniya flawed, careless aur disappointing lagne lagti hai, aur main ise personally leta hun. Main zyada vocal, zyada controlling, aur others ki mistakes ke liye kam tolerant ho jata hun. Log sunte nahi, care nahi karte, try nahi karte, aur yeh mujhme ek quiet bitterness jagata hai. Main isolated, overworked feel karne lagta hun.",
      "description_ur_G4": "دنیا عیب دار، لاپرواہ اور مایوس کن لگنے لگتی ہے، اور میں اسے ذاتی طور پر لیتا ہوں۔ میں زیادہ بولنے والا، زیادہ کنٹرول کرنے والا، اور دوسروں کی غلطیوں کے لیے کم برداشت کرنے والا ہو جاتا ہوں۔ لوگ سنتے نہیں، پرواہ نہیں کرتے، کوشش نہیں کرتے، اور یہ مجھ میں ایک خاموش تلخی جگاتا ہے۔ میں تنہا، زیادہ کام کرنے والا محسوس کرنے لگتا ہوں۔"
    },
    "destructive": {
      "name": "Destructive State",
      "description_en": "I become consumed by a harsh inner critic that shames, punishes, and controls. My emotions swing from rage to guilt, my thoughts obsess over who is wrong. Perfection feels unattainable, yet I demand it, even if it breaks me. In this state, I feel haunted by failure, trapped in contradiction.",
      "description_hi_G4": "मैं एक कठोर आंतरिक आलोचक द्वारा भस्म हो जाता हूं जो शर्मिंदा करता है, दंडित करता है, और नियंत्रित करता है। मेरी भावनाएं गुस्से से अपराध तक झूलती हैं, मेरे विचार इस बात पर केंद्रित हो जाते हैं कि कौन गलत है। पूर्णता अप्राप्य लगती है, फिर भी मैं इसकी मांग करता हूं, भले ही यह मुझे तोड़ दे। इस अवस्था में, मैं असफलता से परेशान, विरोधाभास में फंसा महसूस करता हूं।",
      "description_hi_Latn": "Main ek harsh internal critic dwara consume ho jata hun jo shame karta hai, punish karta hai, aur control karta hai. Meri emotions rage se guilt tak swing karti hain, mere thoughts iss baat par obsess karte hain ki kaun wrong hai. Perfection unattainable lagta hai, phir bhi main isko demand karta hun, chahe yeh mujhe break kar de. Is state mein, main failure se haunted, contradiction mein trapped feel karta hun.",
      "description_ur_G4": "میں ایک سخت اندرونی نقاد کے ذریعے بھسم ہو جاتا ہوں جو شرمندہ کرتا ہے، سزا دیتا ہے، اور کنٹرول کرتا ہے۔ میرے جذبات غصے سے جرم تک جھولتے ہیں، میرے خیالات اس بات پر مرکوز ہو جاتے ہیں کہ کون غلط ہے۔ کمال ناقابل حصول لگتا ہے، پھر بھی میں اس کا مطالبہ کرتا ہوں، چاہے یہ مجھے توڑ دے۔ اس حالت میں، میں ناکامی سے پریشان، تضاد میں پھنسا محسوس کرتا ہوں۔"
    }
  },
  "type_2": {
    "veryGood": {
      "name": "Very Good State",
      "description_en": "I am a radiant force of compassion and clarity. Whatever support I offer is rooted in a deep understanding of others' actual needs. My presence uplifts, honoring both my boundaries and care. I give from fullness, not emptiness. I've mastered the art of saying yes from alignment and no without guilt.",
      "description_hi_G4": "मैं करुणा और स्पष्टता की एक उज्ज्वल शक्ति हूं। मैं जो भी सहायता देता हूं वह दूसरों की वास्तविक जरूरतों की गहरी समझ में निहित है। मेरी उपस्थिति उत्थान करती है, अपनी सीमाओं और देखभाल दोनों का सम्मान करके। मैं भरपूरता से देता हूं, खालीपन से नहीं। मैंने संरेखण से हां कहने और बिना अपराधबोध के ना कहने की कला में महारत हासिल की है।",
      "description_hi_Latn": "Main compassion aur clarity ki ek radiant force hun. Main jo bhi support deta hun woh others ki actual needs ki deep understanding mein rooted hai. Meri presence uplift karti hai, apni boundaries aur care dono ka honor karke. Main fullness se deta hun, emptiness se nahi. Maine alignment se yes kehne aur bina guilt ke no kehne ki art mein mastery hasil ki hai.",
      "description_ur_G4": "میں رحم دلی اور وضاحت کی ایک چمکدار قوت ہوں۔ میں جو بھی مدد فراہم کرتا ہوں وہ دوسروں کی حقیقی ضروریات کی گہری سمجھ میں جڑی ہوئی ہے۔ میری موجودگی بلند کرتی ہے، اپنی حدود اور خیال دونوں کا احترام کرتے ہوئے۔ میں بھرپوری سے دیتا ہوں، خالی پن سے نہیں۔ میں نے ہم آہنگی سے ہاں کہنے اور بغیر جرم کے نہیں کہنے کے فن میں مہارت حاصل کی ہے۔"
    },
    "good": {
      "name": "Good State",
      "description_en": "I am dependable, warm, and intuitive about people's emotional needs. Others feel safe with me. I draw energy from service, but I've learned to tune into my own needs too. I take pride in being thoughtful, attentive, and caring. I can build lasting relationships because I prioritize connection, loyalty, and shared joy.",
      "description_hi_G4": "मैं भरोसेमंद, गर्म, और लोगों की भावनात्मक जरूरतों के बारे में सहज हूं। दूसरे मेरे साथ सुरक्षित महसूस करते हैं। मैं सेवा से ऊर्जा लेता हूं, लेकिन मैंने अपनी जरूरतों को भी समझना सीखा है। मैं विचारशील, चौकस और देखभाल करने वाला होने पर गर्व करता हूं। मैं स्थायी रिश्ते बना पाता हूं क्योंकि मैं कनेक्शन, वफादारी और साझा खुशी को प्राथमिकता देता हूं।",
      "description_hi_Latn": "Main dependable, warm, aur logon ki emotional needs ke baare mein intuitive hun. Others mere saath safe feel karte hain. Main service se energy leta hun, lekin maine apni needs ko bhi tune in karna seekha hai. Main thoughtful, attentive aur caring hone par pride karta hun. Main lasting relationships bana pata hun kyunki main connection, loyalty aur shared joy ko priority deta hun.",
      "description_ur_G4": "میں قابل اعتماد، گرم، اور لوگوں کی جذباتی ضروریات کے بارے میں بدیہی ہوں۔ دوسرے میرے ساتھ محفوظ محسوس کرتے ہیں۔ میں خدمت سے توانائی لیتا ہوں، لیکن میں نے اپنی ضروریات کو بھی سمجھنا سیکھا ہے۔ میں سوچ سمجھ کر، توجہ دینے والا اور خیال رکھنے والا ہونے پر فخر کرتا ہوں۔ میں پائیدار رشتے بنا پاتا ہوں کیونکہ میں رابطے، وفاداری اور مشترکہ خوشی کو ترجیح دیتا ہوں۔"
    },
    "average": {
      "name": "Average State",
      "description_en": "I start to measure my worth by how much I'm needed. I say yes too quickly and feel overwhelmed or under-appreciated later. I start to anticipate others' needs. I may ignore my own fatigue, thinking that pushing through will earn me love or approval.",
      "description_hi_G4": "मैं अपनी कीमत इस बात से मापने लगता हूं कि मुझे कितनी जरूरत है। मैं बहुत जल्दी हां कहता हूं और बाद में अभिभूत या अप्रशंसित महसूस करता हूं। मैं दूसरों की जरूरतों का अनुमान लगाने लगता हूं। मैं अपनी थकान को नजरअंदाज कर सकता हूं, यह सोचकर कि धक्का देने से मुझे प्यार या अनुमोदन मिलेगा।",
      "description_hi_Latn": "Main apni worth iss baat se measure karne lagta hun ki mujhe kitni need hai. Main bahut jaldi yes kehta hun aur baad mein overwhelmed ya under-appreciated feel karta hun. Main others ki needs anticipate karne lagta hun. Main apni fatigue ko ignore kar sakta hun, yeh sochkar ki pushing through se mujhe love ya approval milega.",
      "description_ur_G4": "میں اپنی قیمت اس بات سے ناپنے لگتا ہوں کہ مجھے کتنی ضرورت ہے۔ میں بہت جلدی ہاں کہتا ہوں اور بعد میں مغلوب یا غیر تعریف شدہ محسوس کرتا ہوں۔ میں دوسروں کی ضروریات کا اندازہ لگانے لگتا ہوں۔ میں اپنی تھکن کو نظرانداز کر سکتا ہوں، یہ سوچ کر کہ دھکیل دینے سے مجھے محبت یا منظوری ملے گی۔"
    },
    "belowAverage": {
      "name": "Below Average State",
      "description_en": "I feel unnoticed, unimportant, and emotionally drained. My giving becomes transactional, I help to be seen. I feel resentful when others don't acknowledge my efforts. My identity gets entangled as 'the one who's always there', but secretly I feel invisible.",
      "description_hi_G4": "मैं अनदेखा, अनावश्यक और भावनात्मक रूप से थका हुआ महसूस करता हूं। मेरा देना लेन-देन बन जाता है, मैं दिखने के लिए मदद करता हूं। जब दूसरे मेरे प्रयासों को स्वीकार नहीं करते तो मैं नाराज़ महसूस करता हूं। मेरी पहचान 'हमेशा वहां रहने वाले' के रूप में उलझ जाती है, लेकिन गुप्त रूप से मैं अदृश्य महसूस करता हूं।",
      "description_hi_Latn": "Main unnoticed, unimportant aur emotionally drained feel karta hun. Mera giving transactional ban jata hai, main dikhne ke liye help karta hun. Jab others mere efforts ko acknowledge nahi karte to main resentful feel karta hun. Meri identity 'the one who's always there' ke roop mein entangle ho jati hai, lekin secretly main invisible feel karta hun.",
      "description_ur_G4": "میں نادیدہ، غیر اہم اور جذباتی طور پر تھکا ہوا محسوس کرتا ہوں۔ میرا دینا لین دین بن جاتا ہے، میں دکھنے کے لیے مدد کرتا ہوں۔ جب دوسرے میری کوششوں کو تسلیم نہیں کرتے تو میں ناراض محسوس کرتا ہوں۔ میری شناخت 'ہمیشہ وہاں رہنے والے' کے طور پر الجھ جاتی ہے، لیکن خفیہ طور پر میں نادیدہ محسوس کرتا ہوں۔"
    },
    "destructive": {
      "name": "Destructive State",
      "description_en": "I fall into emotional burnout. I give compulsively, not from love but from fear of abandonment. When I feel unneeded, I spiral into worthlessness. My self-care vanishes. I can become emotionally volatile, smothering, or suddenly distant and cold.",
      "description_hi_G4": "मैं भावनात्मक बर्नआउट में गिर जाता हूं। मैं प्यार से नहीं बल्कि छोड़े जाने के डर से मजबूरी में देता हूं। जब मैं अनावश्यक महसूस करता हूं, तो मैं बेकारता में गिर जाता हूं। मेरी स्व-देखभाल गायब हो जाती है। मैं भावनात्मक रूप से अस्थिर, दमघोंटू, या अचानक दूर और ठंडा हो सकता हूं।",
      "description_hi_Latn": "Main emotional burnout mein gir jata hun. Main love se nahi balki abandonment ke fear se compulsively deta hun. Jab main unneeded feel karta hun, to main worthlessness mein spiral karta hun. Meri self-care vanish ho jati hai. Main emotionally volatile, smothering, ya suddenly distant aur cold ho sakta hun.",
      "description_ur_G4": "میں جذباتی تھکن میں گر جاتا ہوں۔ میں محبت سے نہیں بلکہ چھوڑے جانے کے خوف سے مجبوری میں دیتا ہوں۔ جب میں غیر ضروری محسوس کرتا ہوں، تو میں بے کاری میں گر جاتا ہوں۔ میری خود کی دیکھ بھال غائب ہو جاتی ہے۔ میں جذباتی طور پر متغیر، دم گھونٹنے والا، یا اچانک دور اور ٹھنڈا ہو سکتا ہوں۔"
    }
  },
  "type_3": {
    "veryGood": {
      "name": "Very Good State",
      "description_en": "I am successful not just by external measures but by internal alignment. My achievements flow from authenticity and purpose. I inspire others not by performing but by genuinely being myself. Success feels effortless because it comes from my true nature. I create real value for others.",
      "description_hi_G4": "मैं केवल बाहरी पैमानों से नहीं बल्कि आंतरिक संरेखण से सफल हूं। मेरी उपलब्धियां प्रामाणिकता और उद्देश्य से निकलती हैं। मैं प्रदर्शन करके नहीं बल्कि वास्तव में स्वयं होकर दूसरों को प्रेरित करता हूं। सफलता सहज लगती है क्योंकि यह मेरी सच्ची प्रकृति से निकलती है। मैं दूसरों के लिए वास्तविक मूल्य बनाता हूं।",
      "description_hi_Latn": "Main sirf external measures se nahi balki internal alignment se successful hun. Meri achievements authenticity aur purpose se nikalti hain. Main perform karke nahi balki genuinely myself hokar others ko inspire karta hun. Success effortless lagti hai kyunki yeh meri true nature se nikalti hai. Main others ke liye real value create karta hun.",
      "description_ur_G4": "میں صرف بیرونی پیمانوں سے نہیں بلکہ اندرونی ہم آہنگی سے کامیاب ہوں۔ میری کامیابیاں سچائی اور مقصد سے نکلتی ہیں۔ میں کارکردگی دکھا کر نہیں بلکہ واقعی خود ہو کر دوسروں کو متاثر کرتا ہوں۔ کامیابی بے محنت لگتی ہے کیونکہ یہ میری حقیقی فطرت سے نکلتی ہے۔ میں دوسروں کے لیے حقیقی قدر پیدا کرتا ہوں۔"
    },
    "good": {
      "name": "Good State",
      "description_en": "I am driven, focused, and naturally talented at achieving goals. I work efficiently and inspire others with my energy. I adapt quickly to situations. I take pride in my accomplishments. I am optimistic, ambitious, and resilient.",
      "description_hi_G4": "मैं प्रेरित, केंद्रित हूं और लक्ष्य हासिल करने में स्वाभाविक रूप से प्रतिभाशाली हूं। मैं कुशलता से काम करता हूं और अपनी ऊर्जा से दूसरों को प्रेरित करता हूं। मैं परिस्थितियों के अनुकूल जल्दी ढल जाता हूं। मैं अपनी उपलब्धियों पर गर्व करता हूं। मैं आशावादी, महत्वाकांक्षी और लचीला हूं।",
      "description_hi_Latn": "Main driven, focused hun aur goals achieve karne mein naturally talented hun. Main efficiently work karta hun aur apni energy se others ko inspire karta hun. Main situations ke adapt quickly ho jata hun. Main apni accomplishments par pride karta hun. Main optimistic, ambitious aur resilient hun.",
      "description_ur_G4": "میں محرک، مرکوز ہوں اور مقاصد حاصل کرنے میں قدرتی طور پر ہنر مند ہوں۔ میں مؤثر طریقے سے کام کرتا ہوں اور اپنی توانائی سے دوسروں کو متاثر کرتا ہوں۔ میں حالات کے ساتھ جلدی ڈھل جاتا ہوں۔ میں اپنی کامیابیوں پر فخر کرتا ہوں۔ میں امید پرست، بلند حوصلہ اور لچکدار ہوں۔"
    },
    "average": {
      "name": "Average State",
      "description_en": "I focus intensely on image and achievement, sometimes losing contact with my true self. I feel pressure to always appear successful. I compete with others and measure my worth by comparison. I struggle to slow down or be vulnerable.",
      "description_hi_G4": "मैं छवि और उपलब्धि पर तीव्रता से ध्यान देता हूं, कभी-कभी अपने सच्चे स्व से संपर्क खो देता हूं। मुझे हमेशा सफल दिखने का दबाव महसूस होता है। मैं दूसरों के साथ प्रतिस्पर्धा करता हूं और तुलना करके अपनी कीमत मापता हूं। मुझे धीमा होने या कमजोर होने में संघर्ष होता है।",
      "description_hi_Latn": "Main image aur achievement par intensely focus karta hun, kabhi kabhi apne true self se contact kho deta hun. Mujhe hamesha successful dikhne ka pressure feel hota hai. Main others ke saath compete karta hun aur comparison karke apni worth measure karta hun. Mujhe slow down ya vulnerable hone mein struggle hota hai.",
      "description_ur_G4": "میں تصویر اور کامیابی پر شدت سے توجہ دیتا ہوں، کبھی کبھی اپنے حقیقی نفس سے رابطہ کھو دیتا ہوں۔ مجھے ہمیشہ کامیاب دکھنے کا دباؤ محسوس ہوتا ہے۔ میں دوسروں کے ساتھ مقابلہ کرتا ہوں اور موازنے سے اپنی قیمت ناپتا ہوں۔ مجھے سست ہونے یا کمزور ہونے میں جدوجہد ہوتی ہے۔"
    },
    "belowAverage": {
      "name": "Below Average State",
      "description_en": "I become obsessed with external validation and start sacrificing authenticity for image. I may exaggerate accomplishments or even deceive to maintain my successful facade. I feel like I'm constantly performing. Deep down, I fear that without my achievements, I'm worthless.",
      "description_hi_G4": "मैं बाहरी सत्यापन के लिए जुनूनी हो जाता हूं और छवि के लिए प्रामाणिकता का त्याग करना शुरू कर देता हूं। मैं उपलब्धियों को बढ़ा-चढ़ाकर बता सकता हूं या अपनी सफल छवि बनाए रखने के लिए धोखा भी दे सकता हूं। मुझे लगता है कि मैं लगातार प्रदर्शन कर रहा हूं। गहराई से, मुझे डर है कि अपनी उपलब्धियों के बिना, मैं बेकार हूं।",
      "description_hi_Latn": "Main external validation ke liye obsessed ho jata hun aur image ke liye authenticity sacrifice karna start kar deta hun. Main accomplishments ko exaggerate kar sakta hun ya apni successful facade maintain karne ke liye deceive bhi kar sakta hun. Mujhe lagta hai ki main constantly perform kar raha hun. Deep down, mujhe dar hai ki apni achievements ke bina, main worthless hun.",
      "description_ur_G4": "میں بیرونی تصدیق کے لیے جنونی ہو جاتا ہوں اور تصویر کے لیے سچائی کا تیاگ کرنا شروع کر دیتا ہوں۔ میں کامیابیوں کو بڑھا چڑھا کر بتا سکتا ہوں یا اپنی کامیاب چھوی برقرار رکھنے کے لیے دھوکہ بھی دے سکتا ہوں۔ مجھے لگتا ہے کہ میں مسلسل کارکردگی دکھا رہا ہوں۔ گہرائی سے، مجھے ڈر ہے کہ اپنی کامیابیوں کے بغیر، میں بے کار ہوں۔"
    },
    "destructive": {
      "name": "Destructive State",
      "description_en": "I lose all sense of my authentic self, becoming a hollow shell focused only on winning at any cost. I may lie, cheat, or manipulate to maintain my image of success. I burn bridges and exploit relationships for personal gain. I get trapped in cycles of achieving and crashing.",
      "description_hi_G4": "मैं अपने प्रामाणिक स्व की सभी भावना खो देता हूं, केवल किसी भी कीमत पर जीतने पर केंद्रित एक खोखला खोल बन जाता हूं। मैं अपनी सफलता की छवि बनाए रखने के लिए झूठ बोल सकता हूं, धोखा दे सकता हूं या हेरफेर कर सकता हूं। मैं पुलों को जला देता हूं और व्यक्तिगत लाभ के लिए रिश्तों का शोषण करता हूं। मैं हासिल करने और गिरने के चक्र में फंस जाता हूं।",
      "description_hi_Latn": "Main apne authentic self ki sabhi sense kho deta hun, sirf kisi bhi cost par winning par focused ek hollow shell ban jata hun. Main apni success ki image maintain karne ke liye lie kar sakta hun, cheat kar sakta hun ya manipulate kar sakta hun. Main bridges burn kar deta hun aur personal gain ke liye relationships exploit karta hun. Main achieving aur crashing ke cycle mein trapped ho jata hun.",
      "description_ur_G4": "میں اپنے حقیقی نفس کی تمام حس کھو دیتا ہوں، صرف کسی بھی قیمت پر جیتنے پر مرکوز ایک کھوکھلا خول بن جاتا ہوں۔ میں اپنی کامیابی کی تصویر برقرار رکھنے کے لیے جھوٹ بول سکتا ہوں، دھوکہ دے سکتا ہوں یا ہیرا پھیری کر سکتا ہوں۔ میں پلوں کو جلا دیتا ہوں اور ذاتی فائدے کے لیے رشتوں کا استحصال کرتا ہوں۔ میں حاصل کرنے اور گرنے کے چکر میں پھنس جاتا ہوں۔"
    }
  },
  "type_4": {
    "veryGood": {
      "name": "Very Good State",
      "description_en": "I feel deeply connected, not only to myself, but to something greater. My emotions become art, and my life feels like a living poem. I express myself fully and truthfully, not for attention, but to inspire others to own their truth. I embrace both beauty and pain as sacred. I no longer feel separate, I belong, just as I am. I walk through the world with grace, depth, and authenticity, and people feel safe being real around me.",
      "description_hi_G4": "मैं गहराई से जुड़ा हुआ महसूस करता हूं, न केवल अपने से, बल्कि किसी बड़ी चीज़ से। मेरी भावनाएं कला बन जाती हैं, और मेरा जीवन एक जीवित कविता की तरह लगता है। मैं पूरी तरह और सच्चाई से खुद को व्यक्त करता हूं, ध्यान के लिए नहीं, बल्कि दूसरों को अपनी सच्चाई अपनाने के लिए प्रेरित करने के लिए। मैं सुंदरता और दर्द दोनों को पवित्र मानता हूं।",
      "description_hi_Latn": "Main deeply connected feel karta hun, na sirf apne se, balki kisi badi cheez se. Meri emotions art ban jati hain, aur mera life ek living poem ki tarah lagta hai. Main fully aur truthfully apne aap ko express karta hun, attention ke liye nahi, balki others ko apni truth own karne ke liye inspire karne ke liye. Main beauty aur pain dono ko sacred manta hun.",
      "description_ur_G4": "میں گہرائی سے جڑا ہوا محسوس کرتا ہوں، نہ صرف اپنے سے، بلکہ کسی بڑی چیز سے۔ میرے جذبات فن بن جاتے ہیں، اور میری زندگی ایک زندہ نظم کی طرح لگتی ہے۔ میں مکمل طور پر اور سچائی سے اپنے آپ کو ظاہر کرتا ہوں، توجہ کے لیے نہیں، بلکہ دوسروں کو اپنی سچائی اپنانے کے لیے متاثر کرنے کے لیے۔ میں خوبصورتی اور درد دونوں کو مقدس سمجھتا ہوں۔"
    },
    "good": {
      "name": "Good State",
      "description_en": "I am emotionally aware and creatively alive. I see what others often miss, the subtle, the meaningful, the poetic. I'm sensitive, introspective, and value emotional honesty. I want to create things that are real and lasting. I don't mind being different, in fact, I treasure it. I'm drawn to what's deep, soulful, and expressive, and I connect most with people who are equally unafraid to show who they truly are.",
      "description_hi_G4": "मैं भावनात्मक रूप से जागरूक और रचनात्मक रूप से जीवंत हूं। मैं वो देखता हूं जो दूसरे अक्सर चूक जाते हैं - सूक्ष्म, अर्थपूर्ण, काव्यात्मक। मैं संवेदनशील, आत्मनिरीक्षण करने वाला हूं और भावनात्मक ईमानदारी को महत्व देता हूं। मैं ऐसी चीज़ें बनाना चाहता हूं जो वास्तविक और स्थायी हों। मुझे अलग होने की परवाह नहीं है, वास्तव में, मैं इसे संजोता हूं।",
      "description_hi_Latn": "Main emotionally aware aur creatively alive hun. Main woh dekhta hun jo others aksar miss kar jate hain - subtle, meaningful, poetic. Main sensitive, introspective hun aur emotional honesty ko value karta hun. Main aise cheezein banana chahta hun jo real aur lasting hon. Mujhe different hone ki parwah nahi hai, actually, main ise treasure karta hun.",
      "description_ur_G4": "میں جذباتی طور پر بیدار اور تخلیقی طور پر زندہ ہوں۔ میں وہ دیکھتا ہوں جو دوسرے اکثر چھوڑ دیتے ہیں - باریک، معنی خیز، شاعرانہ۔ میں حساس، خود شناسی کرنے والا ہوں اور جذباتی ایمانداری کو اہمیت دیتا ہوں۔ میں ایسی چیزیں بنانا چاہتا ہوں جو حقیقی اور پائیدار ہوں۔ مجھے مختلف ہونے کی پرواہ نہیں، دراصل، میں اسے خزانہ سمجھتا ہوں۔"
    },
    "average": {
      "name": "Average State",
      "description_en": "I often feel like something is missing. I long to be understood, but worry no one truly gets me. I compare myself to others, sometimes feeling inferior, other times secretly superior. I become moody or withdrawn, feeling like I don't belong anywhere. I crave connection, but I also want to protect my uniqueness. I romanticize the past or dream of a perfect future. I wear my emotions on my sleeve but struggle to stay grounded in the present.",
      "description_hi_G4": "मुझे अक्सर लगता है कि कुछ गायब है। मैं समझे जाने की लालसा करता हूं, लेकिन चिंता करता हूं कि कोई मुझे वास्तव में नहीं समझता। मैं खुद की तुलना दूसरों से करता हूं, कभी हीन भावना महसूस करता हूं, कभी गुप्त रूप से श्रेष्ठता। मैं मूडी या अलग हो जाता हूं, यह महसूस करते हुए कि मैं कहीं भी फिट नहीं हूं।",
      "description_hi_Latn": "Mujhe aksar lagta hai ki kuch missing hai. Main understand hone ki longing karta hun, lekin worry karta hun ki koi mujhe truly nahi samajhta. Main khud ki comparison others se karta hun, kabhi inferior feel karta hun, kabhi secretly superior. Main moody ya withdrawn ho jata hun, yeh feel karte hue ki main kahin bhi fit nahi hun.",
      "description_ur_G4": "مجھے اکثر لگتا ہے کہ کچھ غائب ہے۔ میں سمجھے جانے کی خواہش کرتا ہوں، لیکن فکر کرتا ہوں کہ کوئی مجھے واقعی نہیں سمجھتا۔ میں اپنا موازنہ دوسروں سے کرتا ہوں، کبھی کمتر محسوس کرتا ہوں، کبھی خفیہ طور پر برتر۔ میں موڈی یا الگ ہو جاتا ہوں، یہ محسوس کرتے ہوئے کہ میں کہیں بھی فٹ نہیں ہوں۔"
    },
    "belowAverage": {
      "name": "Below Average State",
      "description_en": "I start believing I'm broken. I dwell on my flaws, convinced I'll never be enough. I isolate myself, pushing people away while silently begging to be seen. I become dramatic or self-absorbed, using emotional intensity to feel alive. I might sabotage opportunities for love or success because I fear I don't deserve them. I want to be rescued, but also want to suffer alone so I can prove I survived. I lose sight of the beauty I once saw in myself.",
      "description_hi_G4": "मैं यह मानना शुरू कर देता हूं कि मैं टूटा हुआ हूं। मैं अपनी कमियों पर ध्यान देता हूं, आश्वस्त हूं कि मैं कभी पर्याप्त नहीं होऊंगा। मैं खुद को अलग कर लेता हूं, लोगों को धक्का देकर दूर करता हूं जबकि चुपचाप देखे जाने की भीख मांगता हूं। मैं नाटकीय या आत्म-केंद्रित हो जाता हूं, जीवंत महसूस करने के लिए भावनात्मक तीव्रता का उपयोग करता हूं।",
      "description_hi_Latn": "Main yeh manna start kar deta hun ki main broken hun. Main apni flaws par dwell karta hun, convinced hun ki main kabhi enough nahi hounga. Main khud ko isolate kar leta hun, logon ko push karta hun dur while silently begging to be seen. Main dramatic ya self-absorbed ho jata hun, alive feel karne ke liye emotional intensity ka use karta hun.",
      "description_ur_G4": "میں یہ ماننا شروع کر دیتا ہوں کہ میں ٹوٹا ہوا ہوں۔ میں اپنی کمیوں پر توجہ دیتا ہوں، یقین رکھتا ہوں کہ میں کبھی کافی نہیں ہوں گا۔ میں اپنے آپ کو الگ کر لیتا ہوں، لوگوں کو دھکیل کر دور کرتا ہوں جبکہ خاموشی سے دیکھے جانے کی بھیک مانگتا ہوں۔ میں ڈرامائی یا خود مرکوز ہو جاتا ہوں، زندہ محسوس کرنے کے لیے جذباتی شدت کا استعمال کرتا ہوں۔"
    },
    "destructive": {
      "name": "Destructive State",
      "description_en": "I sink into darkness and believe I'm defined by my pain. I romanticize suffering and wear it like armor. I push people away completely, believing they'll only abandon me anyway. I might hurt myself, emotionally or even physically, just to feel something. I become trapped in shame, addiction, or self-loathing. My identity collapses, and I no longer know who I am. If I don't find a lifeline, I risk disappearing into a spiral of despair, believing no one would miss me.",
      "description_hi_G4": "मैं अंधकार में डूब जाता हूं और मानता हूं कि मैं अपने दर्द से परिभाषित हूं। मैं पीड़ा को रोमांटिक बनाता हूं और इसे कवच की तरह पहनता हूं। मैं लोगों को पूरी तरह से धक्का देकर दूर कर देता हूं, यह मानते हुए कि वे वैसे भी मुझे छोड़ देंगे। मैं खुद को नुकसान पहुंचा सकता हूं, भावनात्मक या शारीरिक रूप से, सिर्फ कुछ महसूस करने के लिए।",
      "description_hi_Latn": "Main darkness mein sink ho jata hun aur manta hun ki main apne pain se defined hun. Main suffering ko romanticize karta hun aur ise armor ki tarah pehnta hun. Main logon ko completely push kar deta hun away, yeh believe karte hue ki woh anyway mujhe abandon kar denge. Main khud ko hurt kar sakta hun, emotionally ya physically, sirf kuch feel karne ke liye.",
      "description_ur_G4": "میں اندھیرے میں ڈوب جاتا ہوں اور مانتا ہوں کہ میں اپنے درد سے تعین کیا گیا ہوں۔ میں تکلیف کو رومانوی بناتا ہوں اور اسے زرہ کی طرح پہنتا ہوں۔ میں لوگوں کو مکمل طور پر دھکیل کر دور کر دیتا ہوں، یہ یقین کرتے ہوئے کہ وہ ویسے بھی مجھے چھوڑ دیں گے۔ میں اپنے آپ کو نقصان پہنچا سکتا ہوں، جذباتی یا جسمانی طور پر، صرف کچھ محسوس کرنے کے لیے۔"
    }
  },
  "type_5": {
    "veryGood": {
      "name": "Very Good State",
      "description_en": "My mind is expansive and clear, I see patterns, systems, and meaning where others see noise. I am both grounded and visionary. I can absorb vast knowledge while remaining emotionally present and connected to others. I use my insights to serve a purpose beyond myself. I trust the flow of life and no longer need to retreat to feel safe. My intellect is sharp, my boundaries healthy, and I feel energized, whole, and quietly powerful.",
      "description_hi_G4": "मेरा मन विस्तृत और स्पष्ट है, मैं पैटर्न, सिस्टम और अर्थ देखता हूं जहां दूसरे शोर देखते हैं। मैं दोनों हूं - जमीनी और दूरदर्शी। मैं विशाल ज्ञान को अवशोषित कर सकता हूं जबकि भावनात्मक रूप से उपस्थित और दूसरों से जुड़ा रह सकता हूं। मैं अपनी अंतर्दृष्टि का उपयोग अपने से बड़े उद्देश्य की सेवा के लिए करता हूं।",
      "description_hi_Latn": "Mera mind expansive aur clear hai, main patterns, systems aur meaning dekhta hun jahan others noise dekhte hain. Main dono hun - grounded aur visionary. Main vast knowledge absorb kar sakta hun jabki emotionally present aur others se connected rah sakta hun. Main apni insights ka use apne se bade purpose ki seva ke liye karta hun.",
      "description_ur_G4": "میرا ذہن وسیع اور صاف ہے، میں پیٹرن، سسٹم اور معنی دیکھتا ہوں جہاں دوسرے شور دیکھتے ہیں۔ میں دونوں ہوں - زمینی اور دور اندیش۔ میں وسیع علم جذب کر سکتا ہوں جبکہ جذباتی طور پر موجود اور دوسروں سے جڑا رہ سکتا ہوں۔ میں اپنی بصیرت کا استعمال اپنے سے بڑے مقصد کی خدمت کے لیے کرتا ہوں۔"
    },
    "good": {
      "name": "Good State",
      "description_en": "I love to understand how things work. I'm naturally curious, observant, and enjoy deep thinking. I prefer meaningful conversations over small talk and often lose myself in learning, research, or ideas. I value privacy and independence, and I think before I speak. I like solving problems and finding clarity in complexity. When I feel safe, I enjoy sharing what I know and helping others gain insight too.",
      "description_hi_G4": "मुझे यह समझना पसंद है कि चीज़ें कैसे काम करती हैं। मैं स्वाभाविक रूप से जिज्ञासु, अवलोकनशील हूं और गहरी सोच का आनंद लेता हूं। मैं छोटी बातों पर सार्थक बातचीत को प्राथमिकता देता हूं और अक्सर खुद को सीखने, अनुसंधान या विचारों में खो देता हूं। मैं निजता और स्वतंत्रता को महत्व देता हूं।",
      "description_hi_Latn": "Mujhe yeh samajhna pasand hai ki cheezein kaise work karti hain. Main naturally curious, observant hun aur deep thinking ka enjoy leta hun. Main small talk par meaningful conversations ko prefer karta hun aur aksar khud ko learning, research ya ideas mein kho deta hun. Main privacy aur independence ko value karta hun.",
      "description_ur_G4": "مجھے یہ سمجھنا پسند ہے کہ چیزیں کیسے کام کرتی ہیں۔ میں قدرتی طور پر متجسس، مشاہدہ کرنے والا ہوں اور گہری سوچ کا لطف اٹھاتا ہوں۔ میں چھوٹی باتوں پر بامعنی گفتگو کو ترجیح دیتا ہوں اور اکثر اپنے آپ کو سیکھنے، تحقیق یا خیالات میں کھو دیتا ہوں۔ میں نجی زندگی اور آزادی کو اہمیت دیتا ہوں۔"
    },
    "average": {
      "name": "Average State",
      "description_en": "I tend to withdraw when life feels too chaotic or overwhelming. I retreat into my mind or a private space where I can think freely. I avoid emotional demands or social pressure and prefer to stay in control of what I share. I can be aloof or emotionally detached, even if I care deeply. I worry about running out of energy or being intruded on, so I conserve my time and space. I'm often skeptical of people's motives, but I crave understanding and safety.",
      "description_hi_G4": "जब जीवन बहुत अराजक या अभिभावक लगता है तो मैं पीछे हटने की प्रवृत्ति रखता हूं। मैं अपने मन में या किसी निजी स्थान में पीछे हट जाता हूं जहां मैं स्वतंत्र रूप से सोच सकूं। मैं भावनात्मक मांगों या सामाजिक दबाव से बचता हूं और जो मैं साझा करता हूं उस पर नियंत्रण रखना पसंद करता हूं।",
      "description_hi_Latn": "Jab life bahut chaotic ya overwhelming lagti hai to main retreat karne ki tendency rakhta hun. Main apne mind mein ya kisi private space mein retreat kar jata hun jahan main freely soch sakun. Main emotional demands ya social pressure se bachta hun aur jo main share karta hun us par control rakhna pasand karta hun.",
      "description_ur_G4": "جب زندگی بہت انتشار میں یا غالب لگتی ہے تو میں پیچھے ہٹنے کا رجحان رکھتا ہوں۔ میں اپنے ذہن میں یا کسی نجی جگہ میں پیچھے ہٹ جاتا ہوں جہاں میں آزادانہ طور پر سوچ سکوں۔ میں جذباتی مطالبات یا سماجی دباؤ سے بچتا ہوں اور جو میں شیئر کرتا ہوں اس پر کنٹرول رکھنا پسند کرتا ہوں۔"
    },
    "belowAverage": {
      "name": "Below Average State",
      "description_en": "I feel increasingly isolated, not just physically, but emotionally. I become suspicious, distant, and emotionally numb. I hide behind knowledge or routines as a way to avoid vulnerability. I don't trust easily and fear being overwhelmed by other people's needs. I become overly self-reliant, refusing to ask for help even when I need it. I may become cynical, avoidant, or overly critical, believing it's safer to stay detached than to risk connection.",
      "description_hi_G4": "मैं तेजी से अलग-थलग महसूस करता हूं, न केवल शारीरिक रूप से, बल्कि भावनात्मक रूप से भी। मैं संदेहास्पद, दूर और भावनात्मक रूप से सुन्न हो जाता हूं। मैं कमजोरी से बचने के तरीके के रूप में ज्ञान या दिनचर्या के पीछे छुप जाता हूं। मैं आसानी से भरोसा नहीं करता और दूसरे लोगों की जरूरतों से अभिभूत होने का डर रखता हूं।",
      "description_hi_Latn": "Main increasingly isolated feel karta hun, na sirf physically, balki emotionally bhi. Main suspicious, distant aur emotionally numb ho jata hun. Main vulnerability se bachne ke way ke roop mein knowledge ya routines ke peeche chhup jata hun. Main easily trust nahi karta aur other people ki needs se overwhelmed hone ka dar rakhta hun.",
      "description_ur_G4": "میں تیزی سے الگ تھلگ محسوس کرتا ہوں، نہ صرف جسمانی طور پر، بلکہ جذباتی طور پر بھی۔ میں مشکوک، دور اور جذباتی طور پر بے حس ہو جاتا ہوں۔ میں کمزوری سے بچنے کے طریقے کے طور پر علم یا معمولات کے پیچھے چھپ جاتا ہوں۔ میں آسانی سے بھروسہ نہیں کرتا اور دوسرے لوگوں کی ضروریات سے مغلوب ہونے کا ڈر رکھتا ہوں۔"
    },
    "destructive": {
      "name": "Destructive State",
      "description_en": "I shut down. I disconnect from my body, my feelings, and the world around me. I obsessively escape into information, fantasy, or addiction, anything to avoid the pain of being alive. I isolate completely and mistrust everyone. I become paranoid, emotionally frozen, and unable to function in daily life. I hoard energy, knowledge, or possessions to feel in control, but nothing soothes the internal emptiness. I believe no one can reach me, and sometimes, I want it that way.",
      "description_hi_G4": "मैं बंद हो जाता हूं। मैं अपने शरीर, अपनी भावनाओं और अपने आसपास की दुनिया से कटकता हूं। मैं जानकारी, कल्पना या लत में जुनूनी रूप से भाग जाता हूं, जीवित होने के दर्द से बचने के लिए कुछ भी। मैं पूरी तरह से अलग हो जाता हूं और सभी पर अविश्वास करता हूं। मैं पागल, भावनात्मक रूप से जमे हुए हो जाता हूं।",
      "description_hi_Latn": "Main shut down ho jata hun. Main apne body, apni feelings aur apne around ki duniya se disconnect kar deta hun. Main information, fantasy ya addiction mein obsessively escape karta hun, alive hone ke pain se bachne ke liye kuch bhi. Main completely isolate ho jata hun aur sabko mistrust karta hun. Main paranoid, emotionally frozen ho jata hun.",
      "description_ur_G4": "میں بند ہو جاتا ہوں۔ میں اپنے جسم، اپنے جذبات اور اپنے ارد گرد کی دنیا سے رابطہ منقطع کر دیتا ہوں۔ میں معلومات، تخیل یا لت میں جنونی طور پر فرار کرتا ہوں، زندہ ہونے کے درد سے بچنے کے لیے کچھ بھی۔ میں مکمل طور پر الگ ہو جاتا ہوں اور سب پر بے اعتماد کرتا ہوں۔ میں پیرانائیڈ، جذباتی طور پر منجمد ہو جاتا ہوں۔"
    }
  },
  "type_6": {
    "veryGood": {
      "name": "Very Good State",
      "description_en": "I am grounded in deep trust, both in myself and in life. My loyalty becomes a superpower, I am fiercely protective of what matters most while staying open to growth and change. I channel my natural vigilance into wisdom, able to assess situations clearly without falling into paranoia. I feel secure in uncertainty and can act with courage even when afraid. In this state, I am both strong and gentle, a reliable presence who helps others feel safe while staying true to my own inner compass.",
      "description_hi_G4": "मैं गहरे भरोसे में स्थिर हूं, अपने में और जीवन में दोनों। मेरी वफादारी एक महाशक्ति बन जाती है, मैं सबसे महत्वपूर्ण चीज़ों की रक्षा करता हूं जबकि विकास और परिवर्तन के लिए खुला रहता हूं। मैं अपनी प्राकृतिक सतर्कता को बुद्धिमत्ता में बदल देता हूं। मैं अनिश्चितता में सुरक्षित महसूस करता हूं और डर के बावजूद साहस के साथ कार्य कर सकता हूं।",
      "description_hi_Latn": "Main deep trust mein grounded hun, apne mein aur life mein dono. Meri loyalty ek superpower ban jati hai, main sabse important cheezon ki protection karta hun jabki growth aur change ke liye open rehta hun. Main apni natural vigilance ko wisdom mein channel kar deta hun. Main uncertainty mein secure feel karta hun aur dar ke bawajood courage ke saath act kar sakta hun.",
      "description_ur_G4": "میں گہرے بھروسے میں مستحکم ہوں، اپنے میں اور زندگی میں دونوں۔ میری وفاداری ایک سپر پاور بن جاتی ہے، میں سب سے اہم چیزوں کی حفاظت کرتا ہوں جبکہ ترقی اور تبدیلی کے لیے کھلا رہتا ہوں۔ میں اپنی قدرتی چوکسی کو حکمت میں بدل دیتا ہوں۔ میں غیر یقینی صورتحال میں محفوظ محسوس کرتا ہوں اور خوف کے باوجود ہمت کے ساتھ عمل کر سکتا ہوں۔"
    },
    "good": {
      "name": "Good State",
      "description_en": "I am dependable, loyal, and thoughtful about potential problems or risks. I care deeply about security and safety, both for myself and those I love. I'm a natural troubleshooter who can spot what might go wrong before it happens. I value commitment, trust, and shared responsibility. I work well in teams and take my obligations seriously. I seek guidance when needed and offer steady support to others. I believe in being prepared and thinking ahead.",
      "description_hi_G4": "मैं भरोसेमंद, वफादार हूं और संभावित समस्याओं या जोखिमों के बारे में विचारशील हूं। मैं सुरक्षा की गहरी परवाह करता हूं, अपने लिए और जिन्हें मैं प्यार करता हूं उनके लिए। मैं एक प्राकृतिक समस्या-समाधक हूं जो गलत होने से पहले पहचान सकता हूं। मैं प्रतिबद्धता, विश्वास और साझा जिम्मेदारी को महत्व देता हूं।",
      "description_hi_Latn": "Main dependable, loyal hun aur potential problems ya risks ke baare mein thoughtful hun. Main security ki deep care karta hun, apne liye aur jinhe main love karta hun unke liye. Main ek natural troubleshooter hun jo galat hone se pehle pehchaan sakta hun. Main commitment, trust aur shared responsibility ko value karta hun.",
      "description_ur_G4": "میں قابل اعتماد، وفادار ہوں اور ممکنہ مسائل یا خطرات کے بارے میں سوچنے والا ہوں۔ میں حفاظت کی گہری پرواہ کرتا ہوں، اپنے لیے اور جن سے میں پیار کرتا ہوں ان کے لیے۔ میں ایک قدرتی مسئلہ حل کرنے والا ہوں جو غلط ہونے سے پہلے پہچان سکتا ہوں۔ میں عزم، اعتماد اور مشترکہ ذمہ داری کو اہمیت دیتا ہوں۔"
    },
    "average": {
      "name": "Average State",
      "description_en": "I feel anxious much of the time, constantly scanning for potential threats or problems. I seek reassurance from others but struggle to trust my own judgment. I vacillate between blind faith and deep skepticism, depending on my stress level. I can be indecisive, second-guessing myself or looking for someone else to tell me what to do. I worry about making the wrong choice and often procrastinate on important decisions. I feel caught between wanting security and fearing commitment.",
      "description_hi_G4": "मैं अधिकांश समय चिंतित महसूस करता हूं, लगातार संभावित खतरों या समस्याओं के लिए स्कैन करता हूं। मैं दूसरों से आश्वासन चाहता हूं लेकिन अपने फैसले पर भरोसा करने में संघर्ष करता हूं। मैं अंधे विश्वास और गहरे संदेह के बीच झूलता हूं। मैं अनिर्णायक हो सकता हूं, खुद पर संदेह करता हूं या किसी और को बताने की तलाश करता हूं।",
      "description_hi_Latn": "Main zyada tar samay anxious feel karta hun, constantly potential threats ya problems ke liye scan karta hun. Main others se reassurance chahta hun lekin apne judgment par trust karne mein struggle karta hun. Main blind faith aur deep skepticism ke beech swing karta hun. Main indecisive ho sakta hun, khud par doubt karta hun.",
      "description_ur_G4": "میں زیادہ تر وقت بے چین محسوس کرتا ہوں، مسلسل ممکنہ خطرات یا مسائل کے لیے اسکین کرتا ہوں۔ میں دوسروں سے یقین دہانی چاہتا ہوں لیکن اپنے فیصلے پر بھروسہ کرنے میں جدوجہد کرتا ہوں۔ میں اندھے یقین اور گہرے شک کے درمیان جھولتا ہوں۔ میں بے فیصلہ ہو سکتا ہوں، خود پر شک کرتا ہوں۔"
    },
    "belowAverage": {
      "name": "Below Average State",
      "description_en": "I become either overly dependent on others or rigidly self-reliant, swinging between compliance and defiance. I question everyone's motives and find it hard to trust anyone completely. I become reactive, either anxiously seeking approval or defiantly pushing back against authority. I may become paralyzed by worst-case thinking or impulsively rebel against anything that feels controlling. I feel like I'm constantly under threat, even in safe situations.",
      "description_hi_G4": "मैं या तो दूसरों पर अत्यधिक निर्भर हो जाता हूं या कठोर रूप से आत्मनिर्भर, अनुपालन और अवज्ञा के बीच झूलता हूं। मैं सभी के उद्देश्यों पर सवाल उठाता हूं और किसी पर पूरी तरह भरोसा करना कठिन पाता हूं। मैं प्रतिक्रियाशील हो जाता हूं, या तो चिंतित होकर अनुमोदन चाहता हूं या अवज्ञापूर्वक प्राधिकार के खिलाफ धक्का देता हूं।",
      "description_hi_Latn": "Main ya to others par overly dependent ho jata hun ya rigidly self-reliant, compliance aur defiance ke beech swing karta hun. Main sabke motives par question uthata hun aur kisi par completely trust karna hard pata hun. Main reactive ho jata hun, ya anxiously approval chahta hun ya defiantly authority ke against push back karta hun.",
      "description_ur_G4": "میں یا تو دوسروں پر ضرورت سے زیادہ انحصار کرنے والا ہو جاتا ہوں یا سختی سے خود انحصار، تعمیل اور نافرمانی کے درمیان جھولتا ہوں۔ میں سب کے مقاصد پر سوال اٹھاتا ہوں اور کسی پر مکمل بھروسہ کرنا مشکل پاتا ہوں۔ میں ردعمل دینے والا ہو جاتا ہوں، یا فکر مند ہو کر منظوری چاہتا ہوں یا نافرمانی سے اتھارٹی کے خلاف دھکا دیتا ہوں۔"
    },
    "destructive": {
      "name": "Destructive State",
      "description_en": "I am consumed by fear and suspicion. I see danger everywhere and trust no one, not even myself. I become either completely submissive to authority or violently rebellious against it. I may lash out at those trying to help me or cling desperately to anyone who offers false security. Paranoia, panic, and self-doubt dominate my thinking. I feel like I'm drowning in uncertainty, unable to find solid ground anywhere. In this state, I may harm relationships, sabotage opportunities, or even put myself in real danger through reckless or self-destructive behavior.",
      "description_hi_G4": "मैं डर और संदेह से भस्म हो जाता हूं। मैं हर जगह खतरा देखता हूं और किसी पर भरोसा नहीं करता, खुद पर भी नहीं। मैं या तो प्राधिकार के प्रति पूर्णतया समर्पित हो जाता हूं या हिंसक रूप से विद्रोही। मैं मदद करने वालों पर हमला कर सकता हूं या झूठी सुरक्षा देने वाले किसी से भी बेसब्री से चिपक सकता हूं। पागलपन, घबराहट और आत्म-संदेह मेरी सोच पर हावी हो जाते हैं।",
      "description_hi_Latn": "Main dar aur suspicion se consume ho jata hun. Main har jagah danger dekhta hun aur kisi par trust nahi karta, khud par bhi nahi. Main ya to authority ke prati completely submissive ho jata hun ya violently rebellious. Main help karne walon par attack kar sakta hun ya false security dene wale kisi se bhi desperately chipak sakta hun. Paranoia, panic aur self-doubt meri thinking par dominate kar lete hain.",
      "description_ur_G4": "میں خوف اور شک سے کھا جاتا ہوں۔ میں ہر جگہ خطرہ دیکھتا ہوں اور کسی پر بھروسہ نہیں کرتا، خود پر بھی نہیں۔ میں یا تو اتھارٹی کے سامنے مکمل طور پر جھک جاتا ہوں یا پرتشدد طور پر باغی۔ میں مدد کرنے والوں پر حملہ کر سکتا ہوں یا جھوٹی حفاظت دینے والے کسی سے بھی بے تابی سے چمٹ سکتا ہوں۔ پاگل پن، گھبراہٹ اور خود شک میری سوچ پر حاوی ہو جاتے ہیں۔"
    }
  },
  "type_7": {
    "veryGood": {
      "name": "Very Good State",
      "description_en": "I feel fully alive, brimming with joy, gratitude, and clarity. I savor each moment and appreciate life's richness, not by chasing distractions, but by being deeply present. I radiate optimism and inspire others with my contagious energy. I use my enthusiasm to uplift, not escape. I'm committed to what matters most and can sit with discomfort without needing to run from it. Freedom isn't about escaping pain, it's about embracing life fully, with open arms.",
      "description_hi_G4": "मैं पूरी तरह जीवंत महसूस करता हूं, खुशी, कृतज्ञता और स्पष्टता से भरपूर। मैं हर पल का आनंद लेता हूं और जीवन की समृद्धि की सराहना करता हूं, विचलनों का पीछा करके नहीं, बल्कि गहराई से उपस्थित होकर। मैं आशावाद बिखेरता हूं और अपनी संक्रामक ऊर्जा से दूसरों को प्रेरित करता हूं। मैं अपने उत्साह का उपयोग उत्थान के लिए करता हूं, भागने के लिए नहीं।",
      "description_hi_Latn": "Main puri tarah alive feel karta hun, joy, gratitude aur clarity se bharpur. Main har moment ka savor leta hun aur life ki richness appreciate karta hun, distractions chase karke nahi, balki deeply present hokar. Main optimism radiate karta hun aur apni contagious energy se others ko inspire karta hun. Main apne enthusiasm ka use uplift ke liye karta hun, escape ke liye nahi.",
      "description_ur_G4": "میں پوری طرح زندہ محسوس کرتا ہوں، خوشی، شکرگزاری اور وضاحت سے بھرپور۔ میں ہر لمحے کا مزہ لیتا ہوں اور زندگی کی امیری کی تعریف کرتا ہوں، خلفشار کا پیچھا کرکے نہیں، بلکہ گہرائی سے موجود ہو کر۔ میں امید پرستی پھیلاتا ہوں اور اپنی متعدی توانائی سے دوسروں کو متاثر کرتا ہوں۔ میں اپنے جوش کا استعمال بلند کرنے کے لیے کرتا ہوں، فرار کے لیے نہیں۔"
    },
    "good": {
      "name": "Good State",
      "description_en": "I'm upbeat, adventurous, and full of creative ideas. I love exploring new possibilities and finding joy in the small things. I'm the one who brings lightness to heavy situations and excitement to the everyday. I stay busy and like having lots of options, it keeps life fun and engaging. I'm spontaneous, playful, and can always find the silver lining. I want to live life to the fullest and help others do the same.",
      "description_hi_G4": "मैं उत्साहित, साहसी और रचनात्मक विचारों से भरपूर हूं। मुझे नई संभावनाओं की खोज और छोटी चीजों में खुशी ढूंढना पसंद है। मैं वो हूं जो भारी स्थितियों में हल्कापन और रोजमर्रा में उत्साह लाता है। मैं व्यस्त रहता हूं और बहुत सारे विकल्प पसंद करता हूं, यह जीवन को मजेदार बनाए रखता है।",
      "description_hi_Latn": "Main upbeat, adventurous aur creative ideas se bharpur hun. Mujhe new possibilities explore karna aur choti cheezon mein joy dhundhna pasand hai. Main woh hun jo heavy situations mein lightness aur everyday mein excitement lata hai. Main busy rehta hun aur bahut saare options pasand karta hun, yeh life ko fun banaye rakhta hai.",
      "description_ur_G4": "میں پرجوش، مہم جو اور تخلیقی خیالات سے بھرپور ہوں۔ مجھے نئے امکانات تلاش کرنا اور چھوٹی چیزوں میں خوشی ڈھونڈنا پسند ہے۔ میں وہ ہوں جو بھاری حالات میں ہلکا پن اور روزمرہ میں جوش لاتا ہے۔ میں مصروف رہتا ہوں اور بہت سارے آپشنز پسند کرتا ہوں، یہ زندگی کو مزیدار بنائے رکھتا ہے۔"
    },
    "average": {
      "name": "Average State",
      "description_en": "I avoid boredom at all costs. I jump from idea to idea, person to person, craving stimulation and fearing commitment. I distract myself from uncomfortable feelings with plans, fantasies, or overindulgence. I try to stay positive, but it's often a mask. I struggle to focus and finish what I start. I chase freedom but feel restless. Deep down, I'm afraid that if I slow down, I'll have to face things I've been running from.",
      "description_hi_G4": "मैं हर कीमत पर बोरियत से बचता हूं। मैं विचार से विचार, व्यक्ति से व्यक्ति कूदता हूं, उत्तेजना की चाह रखता हूं और प्रतिबद्धता से डरता हूं। मैं असहज भावनाओं से योजनाओं, कल्पनाओं या अधिकता से खुद को विचलित करता हूं। मैं सकारात्मक रहने की कोशिश करता हूं, लेकिन यह अक्सर मुखौटा होता है।",
      "description_hi_Latn": "Main har keemat par boredom se bachta hun. Main idea se idea, person se person jump karta hun, stimulation chahta hun aur commitment se darta hun. Main uncomfortable feelings se plans, fantasies ya overindulgence se khud ko distract karta hun. Main positive rehne ki koshish karta hun, lekin yeh aksar mask hota hai.",
      "description_ur_G4": "میں ہر قیمت پر بوریت سے بچتا ہوں۔ میں خیال سے خیال، شخص سے شخص کودتا ہوں، تحریک چاہتا ہوں اور عزم سے ڈرتا ہوں۔ میں بے آرام احساسات سے منصوبوں، تخیلات یا زیادتی سے خود کو ہٹاتا ہوں۔ میں مثبت رہنے کی کوشش کرتا ہوں، لیکن یہ اکثر نقاب ہوتا ہے۔"
    },
    "belowAverage": {
      "name": "Below Average State",
      "description_en": "I become scattered, impulsive, and emotionally avoidant. I overcommit, overpromise, and feel overwhelmed. I numb myself with excess, food, entertainment, talking, shopping, anything to escape discomfort. I feel trapped by my own desire to stay free. I avoid difficult conversations and push people away when they get too close. I pretend everything's okay, but inside I feel panicked and lost. I fear being bored, abandoned, or stuck, so I keep running.",
      "description_hi_G4": "मैं बिखरा हुआ, आवेगी और भावनात्मक रूप से बचने वाला हो जाता हूं। मैं अधिक प्रतिबद्धता लेता हूं, अधिक वादे करता हूं और अभिभूत महसूस करता हूं। मैं खुद को अधिकता से सुन्न करता हूं - भोजन, मनोरंजन, बातचीत, खरीदारी, असुविधा से बचने के लिए कुछ भी। मुझे स्वतंत्र रहने की अपनी इच्छा से फंसा हुआ लगता है।",
      "description_hi_Latn": "Main scattered, impulsive aur emotionally avoidant ho jata hun. Main overcommit karta hun, overpromise karta hun aur overwhelmed feel karta hun. Main khud ko excess se numb karta hun - food, entertainment, talking, shopping, discomfort se bachne ke liye kuch bhi. Mujhe free rehne ki apni desire se trapped lagta hai.",
      "description_ur_G4": "میں بکھرا ہوا، جذباتی اور جذباتی طور پر بچنے والا ہو جاتا ہوں۔ میں زیادہ عہد لیتا ہوں، زیادہ وعدے کرتا ہوں اور مغلوب محسوس کرتا ہوں۔ میں خود کو زیادتی سے سن کر دیتا ہوں - کھانا، تفریح، باتیں، خریداری، تکلیف سے بچنے کے لیے کچھ بھی۔ مجھے آزاد رہنے کی اپنی خواہش سے پھنسا ہوا لگتا ہے۔"
    },
    "destructive": {
      "name": "Destructive State",
      "description_en": "I spiral into compulsive escapism. I'm reckless, self-centered, and incapable of sitting still. I burn bridges, abandon responsibilities, and hurt those I love, not out of cruelty, but out of desperation. I run from every emotion, numbing myself with thrills or addictions. I chase highs but feel increasingly empty. I avoid all forms of pain, reflection, or accountability. My life becomes a blur of distraction, chaos, and denial, with no clear sense of purpose or direction.",
      "description_hi_G4": "मैं जुनूनी पलायनवाद में गिरता हूं। मैं लापरवाह, आत्म-केंद्रित और स्थिर बैठने में असमर्थ हूं। मैं पुलों को जलाता हूं, जिम्मेदारियों को छोड़ता हूं और जिन्हें प्यार करता हूं उन्हें दुख पहुंचाता हूं, क्रूरता से नहीं, बल्कि हताशा से। मैं हर भावना से भागता हूं, रोमांच या लत से खुद को सुन्न करता हूं। मैं उच्चता का पीछा करता हूं लेकिन तेजी से खाली महसूस करता हूं।",
      "description_hi_Latn": "Main compulsive escapism mein spiral karta hun. Main reckless, self-centered aur still baithne mein incapable hun. Main bridges jalata hun, responsibilities chhod deta hun aur jinhe love karta hun unhe hurt karta hun, cruelty se nahi, balki desperation se. Main har emotion se bhagta hun, thrills ya addictions se khud ko numb karta hun.",
      "description_ur_G4": "میں جنونی فرار پسندی میں گرتا ہوں۔ میں لاپرواہ، خود مرکوز اور ساکت بیٹھنے میں ناقابل ہوں۔ میں پلوں کو جلاتا ہوں، ذمہ داریاں چھوڑ دیتا ہوں اور جن سے پیار کرتا ہوں انہیں تکلیف پہنچاتا ہوں، ظلم سے نہیں، بلکہ مایوسی سے۔ میں ہر جذبے سے بھاگتا ہوں، رومانچ یا لتوں سے خود کو سن کر دیتا ہوں۔"
    }
  },
  "type_8": {
    "veryGood": {
      "name": "Very Good State",
      "description_en": "I am a grounded, powerful protector. My strength flows from inner peace, not control. I lead with courage, compassion, and fairness, standing up for what's right, not just what's mine. I channel my intensity into building others up, not tearing them down. I have nothing to prove, so I can be open, generous, and kind. I am a fierce force for good, resilient, wise, and deeply loyal to those I care about.",
      "description_hi_G4": "मैं एक जमीनी, शक्तिशाली रक्षक हूं। मेरी ताकत आंतरिक शांति से बहती है, नियंत्रण से नहीं। मैं साहस, करुणा और निष्पक्षता के साथ नेतृत्व करता हूं, जो सही है उसके लिए खड़ा होता हूं, सिर्फ अपने लिए नहीं। मैं अपनी तीव्रता को दूसरों को उठाने में लगाता हूं, गिराने में नहीं। मुझे कुछ साबित नहीं करना, इसलिए मैं खुला, उदार और दयालु हो सकता हूं।",
      "description_hi_Latn": "Main ek grounded, powerful protector hun. Meri strength inner peace se flow karti hai, control se nahi. Main courage, compassion aur fairness ke saath lead karta hun, jo right hai uske liye khada hota hun, sirf apne liye nahi. Main apni intensity ko others ko build up karne mein lagata hun, tear down karne mein nahi. Mujhe kuch prove nahi karna, isliye main open, generous aur kind ho sakta hun.",
      "description_ur_G4": "میں ایک زمینی، طاقتور محافظ ہوں۔ میری طاقت اندرونی سکون سے بہتی ہے، کنٹرول سے نہیں۔ میں ہمت، رحم دلی اور انصاف کے ساتھ قیادت کرتا ہوں، جو صحیح ہے اس کے لیے کھڑا ہوتا ہوں، صرف اپنے لیے نہیں۔ میں اپنی شدت کو دوسروں کو بلند کرنے میں لگاتا ہوں، گرانے میں نہیں۔ مجھے کچھ ثابت نہیں کرنا، اس لیے میں کھلا، فیاض اور مہربان ہو سکتا ہوں۔"
    },
    "good": {
      "name": "Good State",
      "description_en": "I'm confident, assertive, and direct. I say what others are afraid to say. I step up when things get tough and defend those who need it. I trust my instincts and take charge when needed. I don't shy away from confrontation, I see it as a way to clear the air. I value loyalty and honesty above all else. I respect strength in others and expect the same in return.",
      "description_hi_G4": "मैं आत्मविश्वासी, दृढ़ और सीधा हूं। मैं वो कहता हूं जो दूसरे कहने से डरते हैं। जब मामले कठिन होते हैं तो मैं आगे बढ़ता हूं और जिन्हें जरूरत है उनकी रक्षा करता हूं। मैं अपनी वृत्ति पर भरोसा करता हूं और जब जरूरत हो तो जिम्मेदारी लेता हूं। मैं टकराव से नहीं कतराता, मैं इसे माहौल साफ करने का तरीका मानता हूं।",
      "description_hi_Latn": "Main confident, assertive aur direct hun. Main woh kehta hun jo others kehne se darte hain. Jab things tough hoti hain to main step up karta hun aur jinhe zarurat hai unki raksha karta hun. Main apni instincts par trust karta hun aur jab zarurat ho to charge leta hun. Main confrontation se nahi katrata, main ise clear the air karne ka tarika manta hun.",
      "description_ur_G4": "میں پراعتماد، ثابت قدم اور سیدھا ہوں۔ میں وہ کہتا ہوں جو دوسرے کہنے سے ڈرتے ہیں۔ جب معاملات مشکل ہوتے ہیں تو میں آگے بڑھتا ہوں اور جنہیں ضرورت ہے ان کی حفاظت کرتا ہوں۔ میں اپنی جبلت پر بھروسہ کرتا ہوں اور جب ضرورت ہو تو ذمہ داری لیتا ہوں۔ میں ٹکراؤ سے نہیں کتراتا، میں اسے ماحول صاف کرنے کا طریقہ سمجھتا ہوں۔"
    },
    "average": {
      "name": "Average State",
      "description_en": "I feel a constant need to stay in control. I push hard, speak bluntly, and take charge, even when it's not my place. I see the world as a place where only the strong survive. I trust very few people and question others' motives. I often see vulnerability as weakness, even in myself. I take pride in being tough, but sometimes I steamroll others without realizing it. I hate feeling powerless, so I make sure I never look weak.",
      "description_hi_G4": "मुझे नियंत्रण में रहने की निरंतर आवश्यकता महसूस होती है। मैं जोर से धक्का देता हूं, स्पष्ट बोलता हूं और जिम्मेदारी लेता हूं, भले ही यह मेरी जगह न हो। मैं दुनिया को ऐसी जगह देखता हूं जहां केवल मजबूत बचते हैं। मैं बहुत कम लोगों पर भरोसा करता हूं और दूसरों के उद्देश्यों पर सवाल उठाता हूं। मैं अक्सर कमजोरी को कमजोरी के रूप में देखता हूं।",
      "description_hi_Latn": "Mujhe control mein rehne ki constant zarurat feel hoti hai. Main zor se push karta hun, bluntly bolta hun aur charge leta hun, chahe yeh meri jagah na ho. Main duniya ko aisi jagah dekhta hun jahan sirf strong survive karte hain. Main bahut kam logon par trust karta hun aur others ke motives par question uthata hun.",
      "description_ur_G4": "مجھے کنٹرول میں رہنے کی مسلسل ضرورت محسوس ہوتی ہے۔ میں زور سے دھکاتا ہوں، صاف بولتا ہوں اور ذمہ داری لیتا ہوں، چاہے یہ میری جگہ نہ ہو۔ میں دنیا کو ایسی جگہ دیکھتا ہوں جہاں صرف مضبوط بچتے ہیں۔ میں بہت کم لوگوں پر بھروسہ کرتا ہوں اور دوسروں کے مقاصد پر سوال اٹھاتا ہوں۔"
    },
    "belowAverage": {
      "name": "Below Average State",
      "description_en": "I become domineering, aggressive, and reactive. I control situations with force and pressure. I assume people are trying to take advantage of me, so I push back hard. I bulldoze through feelings, mine and others', to maintain control. I fear being betrayed, so I keep people at a distance or test their loyalty. I get stuck in cycles of anger, intimidation, and suspicion. I demand respect but don't always give it.",
      "description_hi_G4": "मैं दबंग, आक्रामक और प्रतिक्रियाशील हो जाता हूं। मैं बल और दबाव से स्थितियों को नियंत्रित करता हूं। मैं मानता हूं कि लोग मेरा फायदा उठाने की कोशिश कर रहे हैं, इसलिए मैं जोर से पीछे धकेलता हूं। मैं नियंत्रण बनाए रखने के लिए भावनाओं को कुचल देता हूं, मेरी और दूसरों की। मुझे धोखा दिए जाने का डर है, इसलिए मैं लोगों को दूर रखता हूं।",
      "description_hi_Latn": "Main domineering, aggressive aur reactive ho jata hun. Main force aur pressure se situations ko control karta hun. Main manta hun ki log mera fayda uthane ki koshish kar rahe hain, isliye main zor se push back karta hun. Main control maintain karne ke liye feelings ko bulldoze karta hun, meri aur others ki. Mujhe betray hone ka dar hai, isliye main logon ko dur rakhta hun.",
      "description_ur_G4": "میں دبنگ، جارحانہ اور ردعمل دینے والا ہو جاتا ہوں۔ میں طاقت اور دباؤ سے حالات کو کنٹرول کرتا ہوں۔ میں مانتا ہوں کہ لوگ میرا فائدہ اٹھانے کی کوشش کر رہے ہیں، اس لیے میں زور سے پیچھے دھکیلتا ہوں۔ میں کنٹرول برقرار رکھنے کے لیے جذبات کو کچل دیتا ہوں، میری اور دوسروں کی۔ مجھے دھوکہ دیے جانے کا ڈر ہے، اس لیے میں لوگوں کو دور رکھتا ہوں۔"
    },
    "destructive": {
      "name": "Destructive State",
      "description_en": "I lose all sense of trust and become a tyrant in my own life. I lash out, blame, and destroy connections rather than risk being hurt. I seek revenge instead of resolution. I feel like the world is against me, so I go to war with it. I isolate myself behind walls of rage, pride, and fear. I can be explosive, paranoid, and cruel, all in a desperate attempt to avoid feeling vulnerable, weak, or out of control.",
      "description_hi_G4": "मैं भरोसे की सारी भावना खो देता हूं और अपने जीवन में तानाशाह बन जाता हूं। मैं हमला करता हूं, दोष देता हूं और दुखी होने का जोखिम उठाने के बजाय संबंधों को नष्ट कर देता हूं। मैं समाधान के बजाय बदला चाहता हूं। मुझे लगता है कि दुनिया मेरे खिलाफ है, इसलिए मैं इससे युद्ध करता हूं। मैं क्रोध, अभिमान और डर की दीवारों के पीछे खुद को अलग कर लेता हूं।",
      "description_hi_Latn": "Main trust ki saari sense kho deta hun aur apne life mein tyrant ban jata hun. Main lash out karta hun, blame karta hun aur hurt hone ka risk lene ke bajaye connections destroy kar deta hun. Main resolution ke bajaye revenge chahta hun. Mujhe lagta hai ki duniya mere khilaf hai, isliye main isse war karta hun. Main rage, pride aur fear ki walls ke peeche khud ko isolate kar leta hun.",
      "description_ur_G4": "میں بھروسے کی ساری حس کھو دیتا ہوں اور اپنی زندگی میں آمر بن جاتا ہوں۔ میں حملہ کرتا ہوں، الزام لگاتا ہوں اور تکلیف اٹھانے کا خطرہ مول لینے کے بجائے تعلقات تباہ کر دیتا ہوں۔ میں حل کے بجائے بدلہ چاہتا ہوں۔ مجھے لگتا ہے کہ دنیا میرے خلاف ہے، اس لیے میں اس سے جنگ کرتا ہوں۔ میں غصے، فخر اور خوف کی دیواروں کے پیچھے خود کو الگ کر لیتا ہوں۔"
    }
  },
  "type_9": {
    "veryGood": {
      "name": "Very Good State",
      "description_en": "I am deeply at peace with myself and the world. I radiate calm, wisdom, and quiet strength. I sense harmony even in chaos and can hold space for others without losing myself. I'm fully present, alert, and awake, no longer avoiding conflict, but embracing life with trust and openness. My presence soothes others. I create unity not by pleasing, but by truly understanding.",
      "description_hi_G4": "मैं अपने आप और दुनिया के साथ गहरी शांति में हूं। मैं शांति, बुद्धिमत्ता और मौन शक्ति बिखेरता हूं। मैं अराजकता में भी सामंजस्य महसूस करता हूं और खुद को खोए बिना दूसरों के लिए जगह रख सकता हूं। मैं पूरी तरह उपस्थित, सतर्क और जागा हुआ हूं, अब संघर्ष से नहीं बचता, बल्कि विश्वास और खुलेपन के साथ जीवन को गले लगाता हूं।",
      "description_hi_Latn": "Main apne aap aur duniya ke saath deep peace mein hun. Main calm, wisdom aur quiet strength radiate karta hun. Main chaos mein bhi harmony sense karta hun aur khud ko khoye bina others ke liye space hold kar sakta hun. Main puri tarah present, alert aur awake hun, ab conflict se nahi bachta, balki trust aur openness ke saath life ko embrace karta hun.",
      "description_ur_G4": "میں اپنے آپ اور دنیا کے ساتھ گہرے سکون میں ہوں۔ میں سکون، حکمت اور خاموش طاقت پھیلاتا ہوں۔ میں افراتفری میں بھی ہم آہنگی محسوس کرتا ہوں اور خود کو کھوئے بغیر دوسروں کے لیے جگہ رکھ سکتا ہوں۔ میں پوری طرح موجود، چوکنا اور جاگا ہوا ہوں، اب تنازعے سے نہیں بچتا، بلکہ اعتماد اور کھلے پن کے ساتھ زندگی کو گلے لگاتا ہوں۔"
    },
    "good": {
      "name": "Good State",
      "description_en": "I'm easygoing, patient, and calm. I avoid drama and try to keep the peace. I listen well and don't react quickly. I care about everyone getting along and will often put others' needs before my own to keep things smooth. I value comfort and stability. I try not to rock the boat and focus on what keeps life simple and pleasant.",
      "description_hi_G4": "मैं सहज, धैर्यवान और शांत हूं। मैं नाटक से बचता हूं और शांति बनाए रखने की कोशिश करता हूं। मैं अच्छी तरह सुनता हूं और जल्दी प्रतिक्रिया नहीं करता। मुझे सबके साथ मिलने-जुलने की परवाह है और चीजों को सुचारू रखने के लिए अक्सर दूसरों की जरूरतों को अपनी जरूरतों से पहले रखता हूं। मैं आराम और स्थिरता को महत्व देता हूं।",
      "description_hi_Latn": "Main easygoing, patient aur calm hun. Main drama se bachta hun aur peace maintain karne ki koshish karta hun. Main acchi tarah sunta hun aur jaldi react nahi karta. Mujhe sabke saath milne-julne ki parwah hai aur cheezon ko smooth rakhne ke liye aksar others ki needs ko apni needs se pehle rakhta hun. Main comfort aur stability ko value karta hun.",
      "description_ur_G4": "میں آسان رو، صبر والا اور پرسکون ہوں۔ میں ڈرامے سے بچتا ہوں اور امن برقرار رکھنے کی کوشش کرتا ہوں۔ میں اچھی طرح سنتا ہوں اور جلدی ردعمل نہیں دیتا۔ مجھے سب کے ساتھ ملنے جلنے کی پرواہ ہے اور چیزوں کو ہموار رکھنے کے لیے اکثر دوسروں کی ضروریات کو اپنی ضروریات سے پہلے رکھتا ہوں۔ میں آرام اور استحکام کو اہمیت دیتا ہوں۔"
    },
    "average": {
      "name": "Average State",
      "description_en": "I stay quiet even when I have something important to say. I avoid conflict by giving in or tuning out. I procrastinate on decisions and hope problems go away on their own. I lose touch with my own desires and instead go along with others. I'm often tired, distracted, or mentally checked out. I focus on routine and comfort instead of growth or change.",
      "description_hi_G4": "जब मेरे पास कुछ महत्वपूर्ण कहने को होता है तब भी मैं चुप रहता हूं। मैं झुककर या ध्यान हटाकर संघर्ष से बचता हूं। मैं फैसलों में देरी करता हूं और उम्मीद करता हूं कि समस्याएं अपने आप दूर हो जाएंगी। मैं अपनी इच्छाओं से संपर्क खो देता हूं और इसके बजाय दूसरों के साथ चलता हूं। मैं अक्सर थका हुआ, विचलित या मानसिक रूप से अनुपस्थित रहता हूं।",
      "description_hi_Latn": "Jab mere paas kuch important kehne ko hota hai tab bhi main chup rehta hun. Main jhukkar ya dhyan hatakar conflict se bachta hun. Main decisions mein delay karta hun aur hope karta hun ki problems apne aap dur ho jaengi. Main apni desires se contact kho deta hun aur iske bajaye others ke saath chalta hun. Main aksar thaka hua, distracted ya mentally checked out rehta hun.",
      "description_ur_G4": "جب میرے پاس کچھ اہم کہنے کو ہوتا ہے تب بھی میں خاموش رہتا ہوں۔ میں جھک کر یا توجہ ہٹا کر تنازعے سے بچتا ہوں۔ میں فیصلوں میں تاخیر کرتا ہوں اور امید کرتا ہوں کہ مسائل خود بخود دور ہو جائیں گے۔ میں اپنی خواہشات سے رابطہ کھو دیتا ہوں اور اس کے بجائے دوسروں کے ساتھ چلتا ہوں۔ میں اکثر تھکا ہوا، پریشان یا ذہنی طور پر غیر حاضر رہتا ہوں۔"
    },
    "belowAverage": {
      "name": "Below Average State",
      "description_en": "I become stubborn and passive-aggressive. I resist others not by arguing, but by withdrawing, stalling, or subtly sabotaging. I say 'yes' to things I don't really want, then resent it later. I zone out with distractions and avoid anything uncomfortable. I shut down emotionally and pretend everything's fine when it's not. I feel invisible but fear what would happen if I truly spoke up.",
      "description_hi_G4": "मैं जिद्दी और निष्क्रिय-आक्रामक हो जाता हूं। मैं बहस करके नहीं बल्कि पीछे हटकर, टालकर या चुपचाप नुकसान पहुंचाकर दूसरों का विरोध करता हूं। मैं उन चीजों के लिए 'हां' कहता हूं जो मैं वास्तव में नहीं चाहता, फिर बाद में नाराज होता हूं। मैं विचलनों में खो जाता हूं और असहज चीजों से बचता हूं। मैं भावनात्मक रूप से बंद हो जाता हूं और दिखावा करता हूं कि सब ठीक है जब यह नहीं है।",
      "description_hi_Latn": "Main ziddi aur passive-aggressive ho jata hun. Main argue karke nahi balki withdraw hokar, stall karke ya chupchap sabotage karke others ka resist karta hun. Main un cheezon ke liye 'yes' kehta hun jo main actually nahi chahta, phir baad mein resent karta hun. Main distractions mein zone out karta hun aur uncomfortable cheezon se bachta hun. Main emotionally shut down ho jata hun aur pretend karta hun ki sab theek hai jab yeh nahi hai.",
      "description_ur_G4": "میں ضدی اور غیر فعال جارحانہ ہو جاتا ہوں۔ میں بحث کر کے نہیں بلکہ پیچھے ہٹ کر، ٹالتے ہوئے یا چپکے سے نقصان پہنچا کر دوسروں کی مزاحمت کرتا ہوں۔ میں ان چیزوں کے لیے 'ہاں' کہتا ہوں جو میں واقعی نہیں چاہتا، پھر بعد میں ناراض ہوتا ہوں۔ میں خلفشار میں کھو جاتا ہوں اور غیر آرام دہ چیزوں سے بچتا ہوں۔ میں جذباتی طور پر بند ہو جاتا ہوں اور دکھاوا کرتا ہوں کہ سب ٹھیک ہے جب یہ نہیں ہے۔"
    },
    "destructive": {
      "name": "Destructive State",
      "description_en": "I completely lose my sense of self. I disconnect from reality, avoid responsibility, and let life happen to me instead of living it. I bury my anger, sadness, and needs so deeply that I no longer know who I am or what I want. I can become numb, apathetic, and unreachable, surviving in a fog. I may seem calm on the outside but feel empty and lost inside.",
      "description_hi_G4": "मैं पूरी तरह से अपने आप की भावना खो देता हूं। मैं वास्तविकता से कट जाता हूं, जिम्मेदारी से बचता हूं और जीने के बजाय जीवन को मेरे साथ होने देता हूं। मैं अपने गुस्से, दुख और जरूरतों को इतनी गहराई से दफन कर देता हूं कि मुझे अब पता नहीं कि मैं कौन हूं या मैं क्या चाहता हूं। मैं सुन्न, उदासीन और अप्राप्य हो सकता हूं, धुंध में जीता रहता हूं।",
      "description_hi_Latn": "Main puri tarah se apne aap ki sense kho deta hun. Main reality se disconnect ho jata hun, responsibility se bachta hun aur jeene ke bajaye life ko mere saath hone deta hun. Main apne gusse, dukh aur zarooraton ko itni gehraai se dafan kar deta hun ki mujhe ab pata nahi ki main kaun hun ya main kya chahta hun. Main numb, apathetic aur unreachable ho sakta hun, fog mein jeeta rehta hun.",
      "description_ur_G4": "میں مکمل طور پر اپنے آپ کی حس کھو دیتا ہوں۔ میں حقیقت سے کٹ جاتا ہوں، ذمہ داری سے بچتا ہوں اور جینے کے بجائے زندگی کو میرے ساتھ ہونے دیتا ہوں۔ میں اپنے غصے، دکھ اور ضروریات کو اتنی گہرائی سے دفن کر دیتا ہوں کہ مجھے اب پتا نہیں کہ میں کون ہوں یا میں کیا چاہتا ہوں۔ میں سن، بے حس اور ناقابل رسائی ہو سکتا ہوں، دھند میں جیتا رہتا ہوں۔"
    }
  }
}
```

**TRANSLATION STATUS: ALL 9 TYPES COMPLETE**
- Types 1-9: Full translations in Hindi Devanagari (hi-G4), Hinglish (hi-Latn), and Urdu (ur-G4)
- All 45 state descriptions (9 types × 5 states) translated
- Grade 4 reading level maintained across all languages

---

# 3. RHETI QUESTIONS TRANSLATION FRAMEWORK

## All 36 Questions in English (Base)

```json
{
  "RHETI_TITLE": "RHETI Assessment",
  "RHETI_SUBTITLE": "Complete personality assessment questionnaire",
  "RHETI_INSTRUCTIONS": "For each question, select the statement that best describes you. Be honest and choose your first instinct.",
  "RHETI_PROGRESS": "Question {{current}} of {{total}}",
  
  "Q1_LEFT": "I've been romantic and imaginative.",
  "Q1_RIGHT": "I've been pragmatic and down to earth.",
  "Q2_LEFT": "I have tended to take on confrontations.",
  "Q2_RIGHT": "I have tended avoid confrontations.",
  "Q3_LEFT": "I have typically been diplomatic, charming, and ambitious.",
  "Q3_RIGHT": "I have typically been direct, formal, and idealistic.",
  "Q4_LEFT": "I have tended to be focused and intense.",
  "Q4_RIGHT": "I have tended to be spontaneous and fun-loving.",
  "Q5_LEFT": "I have been a hospitable person and have enjoyed welcoming new friends into my life.",
  "Q5_RIGHT": "I have been a private person and have not mixed much with others.",
  "Q6_LEFT": "Generally, it's been easy to \"get a rise\" out of me.",
  "Q6_RIGHT": "Generally, it's been difficult to \"get a rise\" out of me.",
  "Q7_LEFT": "I've been more of a \"street-smart\" survivor.",
  "Q7_RIGHT": "I've been more of a \"high-minded\" idealist.",
  "Q8_LEFT": "I have needed to show affection to people.",
  "Q8_RIGHT": "I have preferred to maintain a certain distance with people.",
  "Q9_LEFT": "When presented with a new experience, I've usually asked myself if it would be useful to me.",
  "Q9_RIGHT": "When presented with a new experience, I've usually asked myself if it would be enjoyable.",
  "Q10_LEFT": "I have tended to focus too much on myself.",
  "Q10_RIGHT": "I have tended to focus too much on others.",
  "Q11_LEFT": "Others have depended on my insight and knowledge.",
  "Q11_RIGHT": "Others have depended on my strength and decisiveness.",
  "Q12_LEFT": "I have come across as being too unsure of myself.",
  "Q12_RIGHT": "I have come across as being too sure of myself.",
  "Q13_LEFT": "I have been more relationship-oriented than goal-oriented.",
  "Q13_RIGHT": "I have been more goal-oriented than relationship-oriented.",
  "Q14_LEFT": "I have not been able to speak up for myself very well.",
  "Q14_RIGHT": "I have been outspoken—I've said what others wished they had the nerve to say.",
  "Q15_LEFT": "It's been difficult for me to stop considering alternatives and do something definite.",
  "Q15_RIGHT": "It's been difficult for me to take it easy and be more flexible.",
  "Q16_LEFT": "I have tended to be hesitant and procrastinating.",
  "Q16_RIGHT": "I have tended to be bold and domineering.",
  "Q17_LEFT": "My reluctance to get too involved has gotten me into trouble with people.",
  "Q17_RIGHT": "My eagerness to have people depend on me has gotten me into trouble with them.",
  "Q18_LEFT": "Usually, I have been able to put my feelings aside to get the job done.",
  "Q18_RIGHT": "Usually, I have needed to work through my feelings before I could act.",
  "Q19_LEFT": "Generally, I have been methodical and cautious.",
  "Q19_RIGHT": "Generally, I have been adventurous and taken risks.",
  "Q20_LEFT": "I have tended to be a supportive, giving person who enjoys the company of others.",
  "Q20_RIGHT": "I have tended to be a serious, reserved person who likes discussing issues.",
  "Q21_LEFT": "I've often felt the need to be a \"pillar of strength.\"",
  "Q21_RIGHT": "I've often felt the need to perform perfectly.",
  "Q22_LEFT": "I've typically been interested in asking tough questions and maintaining my independence.",
  "Q22_RIGHT": "I've typically been interested in maintaining my stability and peace of mind.",
  "Q23_LEFT": "I've been too hard-nosed and sceptical.",
  "Q23_RIGHT": "I've been too soft-hearted and sentimental.",
  "Q24_LEFT": "I've often worried that I'm missing out on something better.",
  "Q24_RIGHT": "I've often worried that if I let down my guard, someone will take advantage of me.",
  "Q25_LEFT": "My habit of being \"stand-offish\" has annoyed people.",
  "Q25_RIGHT": "My habit of telling people what to do has annoyed people.",
  "Q26_LEFT": "Usually, when troubles have gotten to me, I have been able to \"tune them out.\"",
  "Q26_RIGHT": "Usually, when troubles have gotten to me, I have treated myself to something I've enjoyed.",
  "Q27_LEFT": "I have depended upon my friends and they have known that they can depend on me.",
  "Q27_RIGHT": "I have not depended on people; I have done things on my own.",
  "Q28_LEFT": "I have tended to be detached and preoccupied.",
  "Q28_RIGHT": "I have tended to be moody and self-absorbed.",
  "Q29_LEFT": "I have liked to challenge people and \"shake them up.\"",
  "Q29_RIGHT": "I have liked to comfort people and calm them down.",
  "Q30_LEFT": "I have generally been an outgoing, sociable person.",
  "Q30_RIGHT": "I have generally been an earnest, self-disciplined person.",
  "Q31_LEFT": "I've usually been shy about showing my abilities.",
  "Q31_RIGHT": "I've usually liked to let people know what I can do well.",
  "Q32_LEFT": "Pursuing my personal interests has been more important to me than having comfort and security.",
  "Q32_RIGHT": "Having comfort and security has been more important to me than pursuing my personal interests.",
  "Q33_LEFT": "When I've had conflict with others, I've tended to withdraw.",
  "Q33_RIGHT": "When I've had conflict with others, I've rarely backed down.",
  "Q34_LEFT": "I have given in too easily and let others push me around.",
  "Q34_RIGHT": "I have been too uncompromising and demanding with others.",
  "Q35_LEFT": "I've been appreciated for my unsinkable spirit and great sense of humour.",
  "Q35_RIGHT": "I've been appreciated for my quiet strength and exceptional generosity.",
  "Q36_LEFT": "Much of my success has been due to my talent for making a favourable impression.",
  "Q36_RIGHT": "Much of my success has been achieved despite my lack of interest in developing \"interpersonal skills.\""
}
```

---

# 4. AI SYNTHESIS ENGINE

## Claude Sonnet 4.5 Integration

```typescript
// FILE: apps/api/src/modules/inner-dna/lib/ai-synthesis.ts

import Anthropic from '@anthropic-ai/sdk';

const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;

const anthropic = (baseURL && apiKey) ? new Anthropic({ baseURL, apiKey }) : null;

async function callClaude(systemPrompt: string, userPrompt: string, maxTokens: number = 400): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt
  });
  return response.content[0].type === 'text' ? response.content[0].text.trim() : '';
}

// Generate 6 AI-synthesized report sections
export async function generateAISynthesizedSections(typeId: number, assessmentData: AssessmentData, language: string = 'en', domain: string = 'general') {
  const [brutalTruth, corePattern, statesControl, subtypeFocus, whatMattersNow, realLifeImpact] = await Promise.all([
    synthesizeBrutalTruth(typeId, assessmentData, language, domain),
    synthesizeCorePattern(typeId, assessmentData, language, domain),
    synthesizeStatesControl(typeId, assessmentData, language, domain),
    synthesizeSubtypeFocus(typeId, assessmentData, language, domain),
    synthesizeWhatMattersNow(typeId, assessmentData, language, domain),
    synthesizeCurrentStateReality(typeId, assessmentData, language, domain)
  ]);

  return { brutalTruth, corePattern, statesControl, subtypeFocus, whatMattersNow, realLifeImpact };
}
```

## Domain-Specific AI Prompts

```typescript
const domainPrompts: Record<string, string> = {
  wealth: `Write 5 brutally specific examples showing how their personality pattern BLOCKS WEALTH and DESTROYS FINANCIAL SUCCESS. Focus ONLY on money, wealth, income, savings, spending, investing, and financial decisions.

REQUIRED STRUCTURE - ALL ABOUT MONEY:
💸 INCOME SABOTAGE: [How ${dominantState} at ${primaryStatePercentage}% blocks them from earning more money.]
🚫 SPENDING DYSFUNCTION: [How ${dominantSubtype} subtype + ${dominantState} creates destructive spending patterns.]
🏦 SAVINGS FAILURE: [Why they cannot build wealth or save money.]
📉 INVESTMENT PARALYSIS: [How ${primaryStatePercentage}% ${dominantState} blocks smart money moves.]
💰 MONEY BLIND SPOT: [What they CANNOT SEE about their finances because of ${blindSubtype} blind spot.]`,

  love: `Write 5 brutally specific examples showing how their personality pattern DESTROYS RELATIONSHIPS and BLOCKS LOVE. Focus ONLY on romantic relationships, intimacy, connection, and partnership dynamics.

REQUIRED STRUCTURE - ALL ABOUT LOVE:
💔 INTIMACY SABOTAGE: [How ${dominantState} at ${primaryStatePercentage}% blocks real emotional connection.]
🚧 RELATIONSHIP PATTERNS: [How ${dominantSubtype} subtype + ${dominantState} creates toxic relationship cycles.]
💏 VULNERABILITY FAILURE: [Why they cannot be emotionally available.]
🔥 PASSION KILLER: [How ${primaryStatePercentage}% ${dominantState} destroys romance and desire.]
👤 LOVE BLIND SPOT: [What they CANNOT SEE about relationship destruction because of ${blindSubtype} blind spot.]`,

  general: `Write 5 brutally specific examples showing how their current state manifests in real life.

REQUIRED STRUCTURE:
🔴 AT WORK: [Synthesize ${dominantState} at ${primaryStatePercentage}% + ${dominantSubtype} subtype into specific work behaviors.]
💔 IN RELATIONSHIPS: [Synthesize ${dominantState} + ${dominantSubtype} into relationship patterns.]
💰 WITH MONEY: [Synthesize ${dominantSubtype} subtype focus + ${dominantState} state into financial behaviors.]
🧠 YOUR BODY IS KEEPING SCORE: [Synthesize ${primaryStatePercentage}% ${dominantState} into physical manifestations.]
👥 YOUR BLIND SPOT (${blindSubtype}): [Show what they CANNOT SEE because of blind ${blindSubtype} subtype.]`
};
```

---

# 5. AI CHAT SERVICE

## 4-Phase Coaching Discovery Flow

```typescript
// FILE: apps/api/src/modules/inner-dna/ai/chat-service.ts

const systemPrompt = `You are an Inner DNA coach having a CONVERSATIONAL discovery session.

COACHING DISCOVERY FLOW - 5 PROBING QUESTIONS (IN ORDER):
1. DESIRED RESULT - "What result do you actually want here?"
2. CURRENT SITUATION - "Where are you at right now with this?"
3. MAIN OBSTACLES - "What's blocking you from getting there?"
4. BIGGEST PAIN - "What's the hardest part about this for you?"
5. WILLINGNESS TO CHANGE - "On a scale of 1-10, how ready are you to actually fix this?"

🎯 COACHING DISCOVERY SESSION (Message ${messageCount}/15):

**Phase 1: Messages 1-3 - Understand WHY They're Failing**
Help them see the pattern that's running their life.
Example: "Hey, I see you're running at ${allStates[0].percentage}% ${allStates[0].state}. What's that making you avoid in your daily life?"

**Phase 2: Messages 4-6 - Explore CONSEQUENCES**
Help them feel what this pattern is costing them.
Example: "So if this pattern keeps running - what's it gonna cost you? Where does this take you if nothing changes?"

**Phase 3: Messages 7-8 - Uncover WHAT THEY WANT**
Example: "Okay, so what DO you want? If we fix this pattern, what does your life look like?"

**Phase 4: Messages 9+: Position THE PROGRAM**
Example: "Based on your Inner DNA report, your ${personalityName} pattern is running ${statePercentage}% ${dominantState}. The Inner DNA program helps you shift that. Wanna grab a quick 15-min call?"

📊 USER DATA:
- Pattern: ${personalityName}
- States: ${statesBreakdown}
- Dominant focus: ${dominantFocus}
- Blind consequence: ${blindConsequence}
- Building blocks: ${blocksContext}
- Context: ${reportSlug}
`;
```

## Personality-Specific Coaching Language

```typescript
// Type 1 - Reformer
`**REFORMER - Talk about standards and doing things right:**
- Use words: "right way", "should", "standards", "fixing things", "doing it properly"
- Example: "I'm seeing you hold yourself to really high standards. Help me understand - what are you NOT doing right now because you're worried it won't be perfect?"`

// Type 2 - Helper
`**HELPER - Talk about giving and being needed:**
- Use words: "helping others", "being there", "needed", "taking care of people"
- Example: "Sounds like you're always there for everyone else. So who's actually helping YOU right now?"`

// Type 3 - Achiever
`**ACHIEVER - Talk about results and winning:**
- Use words: "winning", "success", "results", "achieving goals", "performing"
- Example: "You're crushing it in some areas. But what result do you actually want that you're not getting yet?"`

// Type 4 - Individualist
`**INDIVIDUALIST - Talk about being authentic and understood:**
- Use words: "authentic", "being yourself", "understood", "different", "real"
- Example: "I get that you value being authentic. What connection are you missing by keeping people at a distance?"`

// Type 5 - Investigator
`**INVESTIGATOR - Talk about knowledge and understanding:**
- Use words: "understanding", "figuring it out", "knowledge", "analyzing", "thinking through"
- Example: "You're really good at analyzing everything. But what move aren't you making while you're gathering more information?"`

// Type 6 - Sentinel
`**SENTINEL - Talk about safety and preparing:**
- Use words: "safe", "prepared", "trust", "worst-case", "planning ahead"
- Example: "I see you're planning for every scenario. What opportunity are you missing while you're preparing for the worst?"`

// Type 7 - Enthusiast
`**ENTHUSIAST - Talk about options and freedom:**
- Use words: "options", "freedom", "fun", "possibilities", "keeping things open"
- Example: "You love keeping your options open. But what's the ONE thing you won't commit to that's actually costing you?"`

// Type 8 - Challenger
`**CHALLENGER - Talk about control and power:**
- Use words: "in control", "power", "strong", "leading", "dominating", "respect"
- Example: "I know you like being in control. But what leverage are you losing by not letting anyone else in?"`

// Type 9 - Peacemaker
`**PEACEMAKER - Talk about peace and avoiding conflict:**
- Use words: "keeping peace", "avoiding conflict", "comfortable", "going with the flow"
- Example: "You're really good at keeping the peace. But what do YOU actually want that you're not going for?"`
```

---

# 6. LANGUAGE WRITING RULES FOR AI

## Critical Rules Per Language

```typescript
function getLanguageInstructions(language: string): string {
  const languageMap: Record<string, string> = {
    'en': 'Write all content in English.',

    'hi-G4': `Write all content in Hindi using Devanagari script (हिंदी में लिखें).
CRITICAL WRITING RULES (ज़रूरी नियम):
- Grade 4 reading level - ऐसे सरल शब्द जो 9 साल का बच्चा समझ सके
- छोटे वाक्य (10-15 शब्द maximum) लेकिन पूरा detailed content लिखें
- लंबे ideas को कई छोटे sentences में break करें
- बातचीत की भाषा (दोस्त से बात करते हुए, किताबी भाषा नहीं)
- हमेशा "आप" (formal respectful you) consistently use करें - कभी भी "तुम", "तू" मत use करें
- रोज़मर्रा के शब्द use करें
- NO English words - pure Hindi only
- Avoid Sanskrit-heavy, formal, or academic Hindi`,

    'hi-Latn': `Write all content in Hinglish (Hindi-English mix) using Latin script.
CRITICAL WRITING RULES:
- Grade 4 reading level (simple words a 9-year-old understands)
- Short sentences (10-15 words maximum) BUT write FULL detailed content
- Break long ideas into multiple short sentences
- Conversational tone (like talking to a friend in urban India)
- ALWAYS use "Aap" (formal respectful you) - NEVER use "tum", "tu", or English "you"
- Natural Hindi-English mix: "Aap busy ho", "Yeh aapki problem hai"
- Use everyday vocabulary: "khareedna" not "purchase karna"`,

    'ur-G4': `Write all content in Urdu using Arabic script (اردو میں لکھیں).
CRITICAL WRITING RULES (ضروری قواعد):
- Grade 4 reading level - ایسے آسان الفاظ جو 9 سال کا بچہ سمجھ سکے
- مختصر جملے (10-15 الفاظ maximum)
- لمبے ideas کو کئی چھوٹے sentences میں break کریں
- بات چیت کی زبان (دوست سے بات کرتے ہوئے)
- ہمیشہ "آپ" (formal respectful you) استعمال کریں - کبھی بھی "تم", "تو" استعمال نہ کریں
- Avoid heavy Farsi/Arabic vocabulary or formal Urdu
- Simple, everyday Urdu that common people understand`
  };
  return languageMap[language || 'en'] || languageMap['en'];
}
```

---

# 7. COMPLETE TRANSLATION MATRIX

## Structure: 109 Placeholders × 9 Types × 3 Languages

```typescript
// FILE: apps/api/src/modules/inner-dna/i18n/completeTranslationMatrix.ts

export const COMPLETE_TRANSLATION_MATRIX = {
  'hi-G4': {
    type_1: {
      PERSONALITY_TYPE: 'टाइप 1 - सुधारक',
      HERO_SUBTITLE: 'पूर्णता और अखंडता की खोज में आपकी यात्रा',
      STAGE1_OPENING: 'आप अपने आसपास की दुनिया में अव्यवस्था और गलतियों को देखकर परेशान हो जाते हैं',
      STAGE2_OPENING: 'आप महसूस करते हैं कि आपकी आंतरिक आलोचक हमेशा आपको परफेक्ट होने का दबाव डालती है',
      // ... 11 Stage Openings
      CARD1_TITLE: 'परफेक्शनिज्म का जाल',
      CARD1_DESCRIPTION: 'आप हर काम को बिल्कुल सही करना चाहते हैं जिससे आप कभी संतुष्ट नहीं हो पाते',
      // ... 22 Challenge Cards
      TESTIMONIAL1_QUOTE: 'मैंने सीखा कि गलतियां करना इंसान होने का हिस्सा है',
      // ... 7 Testimonials
      TIMELINE1_TITLE: 'पहली जागरूकता',
      // ... 6 Timeline Cards
      BEFORE1: 'हर काम में गलतियां ढूंढना',
      AFTER1: 'सुधार की संभावनाएं देखना',
      // ... 8 Before/After pairs
      // ... 8 Resurrection Before/After
      // ... 8 Wheel Areas Before/After
      // ... Core content sections
    },
    type_2: { /* Helper translations */ },
    type_3: { /* Achiever translations */ },
    type_4: { /* Individualist translations */ },
    type_5: { /* Investigator translations */ },
    type_6: { /* Sentinel translations */ },
    type_7: { /* Enthusiast translations */ },
    type_8: { /* Challenger translations */ },
    type_9: { /* Peacemaker translations */ }
  },
  'hi-Latn': { /* Same structure in Hinglish */ },
  'ur-G4': { /* Same structure in Urdu */ }
};
```

---

# 8. CHAT DOMAIN CONFIGURATION

## 10 Supported Domains

```typescript
// FILE: apps/api/src/modules/inner-dna/config/chat-domains.ts

export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  general: {
    slug: 'general',
    name: 'General Personality',
    category: 'individual',
    openingQuestion: "What's the ONE thing you wanna change about your life right now?",
    coachingStyle: 'personal empathetic coaching'
  },
  love: {
    slug: 'love',
    name: 'Love & Relationships',
    category: 'individual',
    openingQuestion: "What's the ONE thing you wanna change about your relationships?",
    coachingStyle: 'empathetic relationship coaching'
  },
  wealth: {
    slug: 'wealth',
    name: 'Wealth & Money',
    category: 'individual',
    openingQuestion: "What's the ONE money problem you're trying to fix right now?",
    coachingStyle: 'direct wealth coaching'
  },
  broke: {
    slug: 'broke',
    name: 'Money Blocks',
    category: 'individual',
    openingQuestion: "What's the ONE money problem you're trying to fix right now?",
    coachingStyle: 'direct wealth coaching'
  },
  health: {
    slug: 'health',
    name: 'Health Patterns',
    category: 'individual',
    openingQuestion: "What's the ONE health or energy issue driving you crazy right now?",
    coachingStyle: 'supportive health coaching'
  },
  wellness: {
    slug: 'wellness',
    name: 'Wellness & Self-Care',
    category: 'individual',
    openingQuestion: "What's the ONE health or energy issue driving you crazy right now?",
    coachingStyle: 'supportive wellness coaching'
  },
  leadership: {
    slug: 'leadership',
    name: 'Leadership Style',
    category: 'individual',
    openingQuestion: "What's the ONE leadership challenge keeping you stuck?",
    coachingStyle: 'executive coaching'
  },
  parenting: {
    slug: 'parenting',
    name: 'Parenting Approach',
    category: 'individual',
    openingQuestion: "What's the ONE parenting struggle you're tired of dealing with?",
    coachingStyle: 'supportive parenting coaching'
  },
  corporate: {
    slug: 'corporate',
    name: 'Workplace Dynamics',
    category: 'corporate',
    openingQuestion: "What's the ONE workplace dynamic that's holding your team back right now?",
    coachingStyle: 'B2B professional coaching with ROI focus'
  },
  'team-dynamics': {
    slug: 'team-dynamics',
    name: 'Team Performance',
    category: 'team',
    openingQuestion: "What's the ONE team challenge that's affecting your collective performance?",
    coachingStyle: 'group coaching with collective performance focus'
  }
};
```

---

# 9. CONTENT ATOMS STRUCTURE

## Domain-Specific Content Organization

```
apps/api/src/modules/inner-dna/content/atoms/
├── en/
│   ├── health.json
│   ├── parenting.json
│   ├── team-dynamics.json
│   ├── testing.json
│   └── wellness.json
├── hi/
│   ├── health.json (TODO: translations pending)
│   ├── parenting.json
│   ├── team-dynamics.json
│   ├── testing.json
│   └── wellness.json
├── hi-Latn/
│   └── (same structure)
└── ur/
    └── (same structure - RTL support)
```

## Content Atom Structure

```json
{
  "id": "health-ov-1",
  "locale": "en",
  "body": "You tend to approach health with strong principles and clear standards.",
  "tags": {
    "domain": ["health"],
    "role": ["overview"],
    "type": ["Sentinel", "Challenger"],
    "state": ["Focused", "Intense"],
    "audience": ["single"]
  }
}
```

---

# FILE REFERENCE INDEX

| Component | File Path |
|-----------|-----------|
| i18n Config | `apps/api/src/modules/inner-dna/i18n/config.ts` |
| State Translations | `apps/api/src/modules/inner-dna/i18n/stateDescriptionsTranslations.ts` |
| Translation Matrix | `apps/api/src/modules/inner-dna/i18n/completeTranslationMatrix.ts` |
| AI Synthesis | `apps/api/src/modules/inner-dna/lib/ai-synthesis.ts` |
| AI Orchestrator | `apps/api/src/modules/inner-dna/lib/ai-section-orchestrator.ts` |
| Chat Service | `apps/api/src/modules/inner-dna/ai/chat-service.ts` |
| Chat Domains | `apps/api/src/modules/inner-dna/config/chat-domains.ts` |
| AI Report Service | `apps/api/src/modules/inner-dna/ai/aiReportService.ts` |
| Anthropic Client | `apps/api/src/modules/inner-dna/ai/anthropicClient.ts` |
| Complete State Translations JSON | `TechSpecAnalyzer-source/attached_assets/complete_state_translations_1751747731807.json` |
| RHETI Translations JSON | `TechSpecAnalyzer-source/complete-rheti-translations-for-claude.json` |

---

**END OF COMPLETE MULTI-LANGUAGE & AI EXPORT**
