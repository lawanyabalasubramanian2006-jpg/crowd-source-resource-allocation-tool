import { type ReactNode } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Check, ChevronRight, Scale, Sparkles, Vote } from 'lucide-react';
import { useCastVote, useGetCurrentMember, useGetMyVote, useGetRanking, getGetMyVoteQueryKey, getGetRankingQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorNotice, LoadingList, StatPill } from '@/components/app-shell';
import { RequestCard } from '@/components/request-card';

export default function Home() {
  const queryClient = useQueryClient();
  const ranking = useGetRanking();
  const currentMember = useGetCurrentMember();
  const member = currentMember.data;
  const vote = useGetMyVote({ query: { enabled: Boolean(member), queryKey: getGetMyVoteQueryKey() } });
  const castVote = useCastVote();
  const ranked = ranking.data ?? [];

  function handleVote(requestId: number) {
    if (!member) return;
    castVote.mutate({ data: { requestId } }, {
      onSuccess: (status) => {
        queryClient.setQueryData(getGetMyVoteQueryKey(), status);
        queryClient.invalidateQueries({ queryKey: getGetRankingQueryKey() });
      },
    });
  }

  return <div className="page-enter">
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 pb-16 pt-14 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:px-8 lg:pb-20 lg:pt-20">
        <div>
          <div className="mb-7 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-accent"><span className="h-px w-8 bg-accent" /> Live community allocation</div>
          <h1 className="max-w-3xl font-serif text-[clamp(4rem,9vw,8rem)] leading-[.82] tracking-[-.055em]">What we need,<br /><em className="text-secondary">we decide.</em></h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">Common Ground is a public, neighbor-powered board for sharing limited resources fairly. Every request is visible. Every member gets one voice.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/requests" className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[4px_4px_0_hsl(var(--secondary)/.25)] transition-transform hover:-translate-y-0.5" data-testid="link-view-board">View the requests <ArrowRight className="h-4 w-4" /></Link>
            {member ? <Link href="/submit" className="flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-bold transition-colors hover:border-primary" data-testid="link-submit-hero">Bring a need forward</Link> : <Link href="/register" className="flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-bold transition-colors hover:border-primary" data-testid="link-join-hero">Join the board</Link>}
          </div>
        </div>
        <div className="relative lg:pb-2">
          <div className="relative overflow-hidden rounded-[28px] bg-secondary p-7 text-secondary-foreground shadow-[10px_10px_0_hsl(var(--primary)/.26)] md:p-9">
            <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full border-[20px] border-primary/30" />
            <div className="absolute -bottom-14 -left-10 h-32 w-32 rounded-full border-[18px] border-accent/30" />
            <Sparkles className="mb-12 h-7 w-7 text-primary" />
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-secondary-foreground/65">The promise</p>
            <p className="mt-3 max-w-sm font-serif text-4xl leading-[.98] tracking-[-.02em]">No back rooms. No mystery math. Just a shared view of what matters now.</p>
            <div className="mt-10 flex items-center gap-2 border-t border-secondary-foreground/20 pt-4 text-xs font-semibold"><Check className="h-4 w-4 text-primary" /> Updated as neighbors participate</div>
          </div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8 lg:py-20">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-accent">01 / The live board</p><h2 className="mt-3 font-serif text-4xl tracking-[-.025em]">Ranked by real needs</h2></div>
        <Link href="/requests" className="flex items-center gap-1 text-sm font-bold text-secondary hover:text-accent" data-testid="link-see-all">See every request <ChevronRight className="h-4 w-4" /></Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-3"><StatPill label="Requests in view" value={ranking.isLoading ? '—' : String(ranked.length)} /><StatPill label="Community voices" value={ranking.isLoading ? '—' : String(ranked.reduce((sum, item) => sum + item.votes, 0))} /><StatPill label="Scoring lens" value="Need + time" /></div>
      <div className="mt-6">
        {ranking.isLoading ? <LoadingList rows={3} /> : ranking.isError ? <ErrorNotice onRetry={() => ranking.refetch()} /> : ranked.length === 0 ? <EmptyBoard /> : <div className="grid gap-3">{ranked.slice(0, 5).map((request) => <RequestCard key={request.id} request={request} ranked member={member} hasVoted={vote.data?.hasVoted} votedRequestId={vote.data?.requestId} onVote={member ? handleVote : undefined} voting={castVote.isPending} />)}</div>}
      </div>
    </section>
    <ScoringSection />
  </div>;
}

function EmptyBoard() {
  return <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center" data-testid="status-empty-board"><Scale className="mx-auto h-8 w-8 text-secondary" /><h3 className="mt-4 font-serif text-3xl">The board is waiting for its first need.</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">When a neighbor submits a request, it will appear here with the reasoning behind its place.</p></div>;
}

function ScoringSection() {
  return <section className="border-y border-border bg-muted/50"><div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 lg:grid-cols-[.7fr_1.3fr] lg:px-8 lg:py-20"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-accent">02 / The shared method</p><h2 className="mt-3 max-w-sm font-serif text-5xl leading-[.94] tracking-[-.03em]">A little math.<br /><span className="text-secondary">A lot of context.</span></h2><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">The ranking is a guide, not a verdict. We show our work so the community can ask better questions.</p></div><div className="grid gap-3 sm:grid-cols-3"><ScoreTile icon={<Vote />} number="01" title="Need" copy="How much this resource changes someone’s day-to-day." /><ScoreTile icon={<Sparkles />} number="02" title="Urgency" copy="How quickly a neighbor needs a helpful response." /><ScoreTile icon={<Scale />} number="03" title="Voices" copy="One vote per member keeps the signal collective." /></div></div></section>;
}

function ScoreTile({ icon, number, title, copy }: { icon: ReactNode; number: string; title: string; copy: string }) {
  return <div className="border-l-2 border-primary/60 pl-5"><div className="flex items-center justify-between text-secondary"><span className="font-mono text-[10px] font-bold">{number}</span>{icon}</div><h3 className="mt-10 font-serif text-3xl">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div>;
}