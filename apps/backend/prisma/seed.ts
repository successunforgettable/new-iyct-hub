import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const programs = [
  { code: "IY10", name: "The Incredible You Coach Training 10 Weeks", weeks: 10, lang: "en", type: "AKU", price: 997 },
  { code: "IY10-L1", name: "The Incredible You 10 Week Coaching Level 1", weeks: 10, lang: "en", type: "AKU", price: 497 },
  { code: "IY10-HI", name: "The Incredible You 10 Week Coaching In Hindi", weeks: 10, lang: "hi", type: "AKU", price: 75000 },
  { code: "IY10-HI-L1", name: "The Incredible You 10 Week Coaching In Hindi Level 1", weeks: 10, lang: "hi", type: "AKU", price: 35000 },
  { code: "IY10-HI-L2", name: "The Incredible You 10 Week Coaching In Hindi Level 2", weeks: 10, lang: "hi", type: "AKU", price: 35000 },
  { code: "IYF", name: "The Incredible You Coach Training 5 Weeks Program", weeks: 5, lang: "en", type: "AKU", price: 497 },
  { code: "IYF-HI", name: "The Incredible You Coach Training 5 Weeks Program Hindi", weeks: 5, lang: "hi", type: "AKU", price: 25000 },
  { code: "IY-CT-L1", name: "The Incredible You Coach Training Level 1 Program", weeks: 4, lang: "en", type: "AKU", price: 297 },
  { code: "IY-CT-L2", name: "The Incredible You Coach Training Level 2 Program", weeks: 4, lang: "en", type: "AKU", price: 297 },
  { code: "IY-FND", name: "The Incredible You Foundation", weeks: 4, lang: "en", type: "AKU", price: 197 },
  { code: "IY-FND-HI", name: "The Incredible You Foundation Hindi", weeks: 4, lang: "hi", type: "AKU", price: 15000 },
  { code: "IY-MH", name: "The Incredible You Mind Hacker Coach Training", weeks: 6, lang: "en", type: "AKU", price: 597 },
  { code: "IY-MH-HI", name: "The Incredible You Mind Hacker Coach Training In Hindi", weeks: 6, lang: "hi", type: "AKU", price: 45000 },
  { code: "IY-MH-HI-L1", name: "The Incredible You Mind Hacker Coach Training In Hindi Level 1", weeks: 5, lang: "hi", type: "AKU", price: 25000 },
  { code: "IY-MH-HI-L2", name: "The Incredible You Mind Hacker Coach Training In Hindi Level 2", weeks: 5, lang: "hi", type: "AKU", price: 25000 },
  { code: "IY-MC", name: "The Incredible You Millionaire Challenge", weeks: 4, lang: "en", type: "AKU", price: 497 },
  { code: "IY-PRE", name: "The Incredible You Prestudy", weeks: 2, lang: "en", type: "AKU", price: 0 },
  { code: "IY-DEMO", name: "The Incredible You Demo", weeks: 1, lang: "en", type: "AKU", price: 0 },
  { code: "CTF-FND", name: "Coach To A Fortune Foundation X", weeks: 2, lang: "en", type: "BTF", price: 197 },
  { code: "CTF-FND-HI", name: "Coach to a Fortune Foundation X In Hindi", weeks: 2, lang: "hi", type: "BTF", price: 15000 },
  { code: "STFME", name: "Speak To A Fortune Mastermind Edition", weeks: 8, lang: "en", type: "STF", price: 997 },
  { code: "STF2-FND", name: "Speak To a Fortune 2.0 Foundation", weeks: 4, lang: "en", type: "STF", price: 297 },
  { code: "STF-FND", name: "Speak To A Fortune Foundation", weeks: 4, lang: "en", type: "STF", price: 297 },
  { code: "STF-PRE", name: "Speak To A Fortune Prestudy", weeks: 2, lang: "en", type: "STF", price: 0 },
  { code: "STF-DEMO", name: "Speak To A Fortune Demo", weeks: 1, lang: "en", type: "STF", price: 0 },
  { code: "SMB", name: "The Secret Millionaire Blueprint Program", weeks: 12, lang: "en", type: "SMB", price: 1497 },
  { code: "SMB-MMS", name: "SMB Money Management System", weeks: 4, lang: "en", type: "SMB", price: 297 },
  { code: "SMB-FND", name: "Secret Millionaire Blueprint Foundation", weeks: 4, lang: "en", type: "SMB", price: 297 },
  { code: "SMB-PRE", name: "Secret Millionaire Blueprint Prestudy", weeks: 2, lang: "en", type: "SMB", price: 0 },
  { code: "SMB-DEMO", name: "Secret Millionaire Blueprint Demo", weeks: 1, lang: "en", type: "SMB", price: 0 },
  { code: "6FAS", name: "The Incredible 6 Figure Author System", weeks: 8, lang: "en", type: "AKU", price: 997 },
  { code: "WMR-4W", name: "4 Week Incredible Wealth Mindset Reset", weeks: 4, lang: "en", type: "AKU", price: 197 },
];

async function main() {
  console.log('Seeding 32 programs...');
  await prisma.program.deleteMany({});
  
  for (const p of programs) {
    const slug = p.code.toLowerCase().replace(/[^a-z0-9]/g, '-');
    await prisma.program.create({
      data: {
        name: p.name,
        slug: slug,
        description: p.name + ' - ' + p.weeks + ' week program',
        programType: p.type as any,
        language: p.lang,
        basePriceUsd: p.lang === 'en' ? p.price : Math.round(p.price / 83),
        basePriceInr: p.lang === 'hi' ? p.price : Math.round(p.price * 83),
      },
    });
    console.log('Created: ' + p.name);
  }
  console.log('Done! 32 programs added.');
}

main().finally(() => prisma.$disconnect());
