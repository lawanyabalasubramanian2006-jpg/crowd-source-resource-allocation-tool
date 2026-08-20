import { Router, type IRouter, type Request } from "express";
import { and, asc, desc, eq } from "drizzle-orm";
import { createHash } from "node:crypto";
import { db, requestsTable, usersTable, votesTable } from "@workspace/db";
import {
  AuthResponse,
  CastVoteBody,
  CastVoteResponse,
  CreateRequestBody,
  CreateRequestResponse,
  GetCurrentMemberResponse,
  GetMyVoteResponse,
  GetRankingResponse,
  GetRequestsResponse,
  LoginMemberBody,
  LoginMemberResponse,
  RegisterMemberBody,
  RegisterMemberResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const hashPassword = (password: string) =>
  createHash("sha256").update(password).digest("hex");

const tokenFor = (userId: number) =>
  Buffer.from(String(userId), "utf8").toString("base64url");

const userIdFromRequest = (req: Request) => {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const value = Number(Buffer.from(header.slice(7), "base64url").toString("utf8"));
  return Number.isFinite(value) ? value : null;
};

const memberShape = (user: typeof usersTable.$inferSelect) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
});

const requestShape = (
  request: typeof requestsTable.$inferSelect,
  votes: Array<typeof votesTable.$inferSelect>,
  users: Array<typeof usersTable.$inferSelect>,
) => ({
  id: request.id,
  title: request.title,
  description: request.description,
  category: request.category,
  need: request.need,
  urgency: request.urgency,
  quantityNeeded: request.quantityNeeded,
  votes: votes.filter((vote) => vote.requestId === request.id).length,
  createdAt: request.createdAt.toISOString(),
  submittedBy:
    users.find((user) => user.id === request.submittedBy)?.username ?? "Community member",
});

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const count = await db.select({ id: usersTable.id }).from(usersTable);
  if (count.length >= 100) {
    res.status(400).json({ error: "The community has reached its 100-member limit." });
    return;
  }
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, parsed.data.email.toLowerCase()));
  if (existing[0]) {
    res.status(400).json({ error: "An account with that email already exists." });
    return;
  }
  const [user] = await db
    .insert(usersTable)
    .values({
      username: parsed.data.username,
      email: parsed.data.email.toLowerCase(),
      passwordHash: hashPassword(parsed.data.password),
    })
    .returning();
  const response = { member: memberShape(user), token: tokenFor(user.id) };
  res.status(201).json(RegisterMemberResponse.parse(response));
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, parsed.data.email.toLowerCase()));
  if (!user || user.passwordHash !== hashPassword(parsed.data.password)) {
    res.status(401).json({ error: "Email or password is incorrect." });
    return;
  }
  const response = { member: memberShape(user), token: tokenFor(user.id) };
  res.json(LoginMemberResponse.parse(response));
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const userId = userIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }
  res.json(GetCurrentMemberResponse.parse(memberShape(user)));
});

router.get("/requests", async (_req, res): Promise<void> => {
  const [requests, votes, users] = await Promise.all([
    db.select().from(requestsTable).orderBy(desc(requestsTable.createdAt)),
    db.select().from(votesTable),
    db.select().from(usersTable),
  ]);
  res.json(GetRequestsResponse.parse(requests.map((item) => requestShape(item, votes, users))));
});

router.post("/requests", async (req, res): Promise<void> => {
  const userId = userIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Sign in required to submit a request." });
    return;
  }
  const parsed = CreateRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [request] = await db.insert(requestsTable).values({
    ...parsed.data,
    submittedBy: userId,
  }).returning();
  const [votes, users] = await Promise.all([
    db.select().from(votesTable),
    db.select().from(usersTable),
  ]);
  res.status(201).json(CreateRequestResponse.parse(requestShape(request, votes, users)));
});

router.get("/ranking", async (_req, res): Promise<void> => {
  const [requests, votes, users] = await Promise.all([
    db.select().from(requestsTable),
    db.select().from(votesTable),
    db.select().from(usersTable),
  ]);
  const totalVotes = Math.max(votes.length, 1);
  const ranked = requests
    .map((request) => {
      const shaped = requestShape(request, votes, users);
      const daysWaiting = Math.min(
        30,
        Math.max(0, (Date.now() - request.createdAt.getTime()) / 86_400_000),
      );
      const needContribution = request.need * 8;
      const urgencyContribution = request.urgency * 6;
      const votesContribution = (shaped.votes / totalVotes) * 20;
      const waitingContribution = (daysWaiting / 30) * 10;
      return {
        ...shaped,
        score: Number((needContribution + urgencyContribution + votesContribution + waitingContribution).toFixed(1)),
        factors: [
          { label: "Need", value: request.need, contribution: needContribution, detail: `${request.need}/5 self-reported need · weighted 40%` },
          { label: "Urgency", value: request.urgency, contribution: urgencyContribution, detail: `${request.urgency}/5 urgency · weighted 30%` },
          { label: "Community support", value: shaped.votes, contribution: votesContribution, detail: `${shaped.votes} of ${votes.length} total votes · weighted 20%` },
          { label: "Waiting time", value: Number(daysWaiting.toFixed(1)), contribution: waitingContribution, detail: `${Math.floor(daysWaiting)} days waiting · weighted 10%` },
        ],
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((request, index) => ({ ...request, rank: index + 1 }));
  res.json(GetRankingResponse.parse(ranked));
});

router.post("/votes", async (req, res): Promise<void> => {
  const userId = userIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Sign in required to vote." });
    return;
  }
  const parsed = CastVoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [existingVote] = await db.select().from(votesTable).where(eq(votesTable.userId, userId));
  if (existingVote) {
    res.status(400).json({ error: "You have already used your community vote." });
    return;
  }
  const [request] = await db.select().from(requestsTable).where(eq(requestsTable.id, parsed.data.requestId));
  if (!request) {
    res.status(400).json({ error: "That request could not be found." });
    return;
  }
  await db.insert(votesTable).values({ userId, requestId: parsed.data.requestId });
  res.status(201).json(CastVoteResponse.parse({ hasVoted: true, requestId: parsed.data.requestId }));
});

router.get("/votes/mine", async (req, res): Promise<void> => {
  const userId = userIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }
  const [vote] = await db.select().from(votesTable).where(eq(votesTable.userId, userId));
  res.json(GetMyVoteResponse.parse({ hasVoted: Boolean(vote), requestId: vote?.requestId ?? null }));
});

export default router;