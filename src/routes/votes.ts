import { Router } from 'express';
import { prisma } from '../services/prisma';
import { z } from 'zod';
import { broadcastPollResults } from '../ws/realtime';

const router = Router();

const voteSchema = z.object({
  userId: z.string().uuid(),
  pollOptionId: z.string().uuid()
});

router.post('/', async (req, res) => {
  const parsed = voteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { userId, pollOptionId } = parsed.data;

  const [user, option] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.pollOption.findUnique({ where: { id: pollOptionId }, include: { poll: true } })
  ]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!option) return res.status(404).json({ error: 'Poll option not found' });

  // Enforce one vote per user per poll (not just per option)
  const existing = await prisma.vote.findFirst({
    where: { userId, pollOption: { pollId: option.pollId } }
  });
  if (existing) return res.status(409).json({ error: 'User already voted on this poll' });

  const vote = await prisma.vote.create({ data: { userId, pollOptionId } });

  // Aggregate results for the poll and broadcast
  const results = await prisma.pollOption.findMany({
    where: { pollId: option.pollId },
    select: {
      id: true,
      text: true,
      _count: { select: { votes: true } }
    }
  });

  await broadcastPollResults(option.pollId, results.map(r => ({ id: r.id, text: r.text, votes: r._count.votes })));

  res.status(201).json(vote);
});

export default router;


