import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import candidatesDataRaw from '../src/data/candidates.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SQLite database with 20 sample candidates...');
  const candidates = candidatesDataRaw.candidates;
  const defaultPasswordHash = await bcrypt.hash('demo-password', 10);

  for (const c of candidates) {
    const email = `${c.id.replace('cand_', '')}@synapse.ai`;

    const existing = await prisma.candidate.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`Candidate ${c.member.name} (${email}) already exists.`);
      continue;
    }

    const candidate = await prisma.candidate.create({
      data: {
        id: c.id,
        name: c.member.name,
        jobRole: c.member.role,
        yearsExperience: typeof c.member.yearsExperience === 'number' ? c.member.yearsExperience : parseFloat(c.member.yearsExperience) || 3.0,
        education: c.member.education,
        status: c.member.statusBadge,
        email,
        passwordHash: defaultPasswordHash,
        isSeedProfile: true,
        signals: {
          create: {
            commitDays: c.signals.commitDays,
            missionsCompleted: c.signals.missionsCompleted,
            missionsFirstTry: c.signals.missionsFirstTry,
          },
        },
        missions: {
          create: c.missions.map((m) => ({
            day: m.day,
            title: m.title,
            passed: m.completed,
            skipped: m.skipped,
            attempts: m.attempts,
          })),
        },
      },
    });

    console.log(`Seeded: ${candidate.name} <${candidate.email}>`);
  }

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
