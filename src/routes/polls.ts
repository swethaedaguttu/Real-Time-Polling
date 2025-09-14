import { Router } from 'express';
import { prisma } from '../services/prisma';
import { z } from 'zod';

const router = Router();

const createPollSchema = z.object({
  question: z.string().min(1),
  isPublished: z.boolean().optional().default(false),
  creatorId: z.string().uuid(),
  options: z.array(z.string().min(1)).min(2)
});

router.post('/', async (req, res) => {
  const parsed = createPollSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { question, isPublished, creatorId, options } = parsed.data;

  const creator = await prisma.user.findUnique({ where: { id: creatorId } });
  if (!creator) return res.status(404).json({ error: 'Creator not found' });

  const poll = await prisma.poll.create({
    data: {
      question,
      isPublished: Boolean(isPublished),
      creatorId,
      options: { create: options.map(text => ({ text })) }
    },
    include: { options: true }
  });
  res.status(201).json(poll);
});

router.get('/', async (_req, res) => {
  const polls = await prisma.poll.findMany({ include: { options: true, creator: { select: { id: true, name: true } } } });
  res.json(polls);
});

router.get('/:id', async (req, res) => {
  const poll = await prisma.poll.findUnique({ where: { id: req.params.id }, include: { options: true, creator: { select: { id: true, name: true } } } });
  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  res.json(poll);
});

router.get('/:id/results', async (req, res) => {
  const poll = await prisma.poll.findUnique({ where: { id: req.params.id } });
  if (!poll) return res.status(404).json({ error: 'Poll not found' });

  const results = await prisma.pollOption.findMany({
    where: { pollId: req.params.id },
    select: {
      id: true,
      text: true,
      _count: { select: { votes: true } }
    }
  });

  res.json({
    pollId: req.params.id,
    question: poll.question,
    options: results.map(r => ({ id: r.id, text: r.text, votes: r._count.votes }))
  });
});

router.patch('/:id', async (req, res) => {
  const updateSchema = z.object({
    isPublished: z.boolean().optional(),
    question: z.string().min(1).optional()
  });

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const poll = await prisma.poll.findUnique({ where: { id: req.params.id } });
  if (!poll) return res.status(404).json({ error: 'Poll not found' });

  const updatedPoll = await prisma.poll.update({
    where: { id: req.params.id },
    data: parsed.data,
    include: { options: true, creator: { select: { id: true, name: true } } }
  });

  res.json(updatedPoll);
});

export default router;


