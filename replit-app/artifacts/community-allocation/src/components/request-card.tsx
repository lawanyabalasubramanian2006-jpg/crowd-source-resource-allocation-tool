import { useState } from 'react';
import { ArrowUp, ChevronDown, Clock3, Info, UsersRound } from 'lucide-react';
import type { RankedRequest, ResourceRequest } from '@workspace/api-client-react';

type RequestLike = ResourceRequest | RankedRequest;

export function RequestCard({
  request,
  member,
  hasVoted,
  votedRequestId,
  onVote,
  voting,
  ranked = false,
}: {
  request: RequestLike;
  member?: { id: number; username: string } | null;
  hasVoted?: boolean;
  votedRequestId?: number | null;
  onVote?: (id: number) => void;
  voting?: boolean;
  ranked?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const rankedRequest = request as RankedRequest;
  const alreadyVoted = Boolean(hasVoted || votedRequestId === request.id);
  const canVote = Boolean(member && onVote && !alreadyVoted);
  const created = new Date(request.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <article className={`group relative overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-0.5 hover:border-secondary/60 hover:shadow-[0_12px_24px_hsl(var(--foreground)/.06)] ${ranked && 'border-border/80'}`} data-testid={`card-request-${request.id}`}>
      <div className="flex gap-4 p-5 sm:gap-6 sm:p-6">
        {ranked && <div className="flex w-9 shrink-0 flex-col items-center pt-1"><span className={`font-mono text-sm font-bold ${rankedRequest.rank === 1 ? 'text-primary' : 'text-muted-foreground'}`}>{String(rankedRequest.rank).padStart(2, '0')}</span><span className="mt-2 h-full w-px bg-border" /></div>}
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[.12em] text-accent">{request.category}</span>
            <span className="font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">{created}</span>
          </div>
          <h3 className="font-serif text-[27px] leading-[1.02] tracking-[-.015em] text-foreground" data-testid={`text-request-title-${request.id}`}>{request.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{request.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><UsersRound className="h-3.5 w-3.5 text-secondary" /> {request.submittedBy}</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Clock3 className="h-3.5 w-3.5 text-secondary" /> {request.quantityNeeded} {request.quantityNeeded === 1 ? 'unit' : 'units'} needed</span>
            <span className="font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">Need {request.need}/5 · Urgency {request.urgency}/5</span>
          </div>
          {ranked && expanded && <div className="mt-5 border-t border-border pt-4" data-testid={`details-request-${request.id}`}>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-secondary"><Info className="h-3.5 w-3.5" /> How this score was made</div>
            <div className="grid gap-2 sm:grid-cols-3">
              {rankedRequest.factors.map((factor) => <div className="rounded-xl bg-muted/70 p-3" key={`${request.id}-${factor.label}`}><div className="flex items-baseline justify-between gap-2"><span className="text-xs font-semibold">{factor.label}</span><span className="font-mono text-[10px] text-accent">+{factor.contribution.toFixed(1)}</span></div><p className="mt-1 text-[11px] leading-4 text-muted-foreground">{factor.detail}</p></div>)}
            </div>
          </div>}
          {ranked && <button className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-secondary transition-colors hover:text-accent" onClick={() => setExpanded((value) => !value)} data-testid={`button-explain-${request.id}`}>{expanded ? 'Hide scoring detail' : 'Explain this ranking'} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} /></button>}
        </div>
        <div className="flex shrink-0 flex-col items-end justify-between gap-4">
          <div className="text-right">
            <div className="font-serif text-3xl leading-none text-foreground" data-testid={`text-votes-${request.id}`}>{request.votes}</div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">voices</div>
          </div>
          {ranked && <div className="hidden text-right sm:block"><div className="font-mono text-xs font-bold text-primary">{rankedRequest.score.toFixed(1)}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">score</div></div>}
          {onVote && <VoteButton requestId={request.id} member={member} canVote={canVote} alreadyVoted={alreadyVoted} voting={voting} onVote={() => onVote(request.id)} />}
        </div>
      </div>
    </article>
  );
}

function VoteButton({ requestId, member, canVote, alreadyVoted, voting, onVote }: { requestId: number; member?: { id: number; username: string } | null; canVote: boolean; alreadyVoted: boolean; voting?: boolean; onVote: () => void }) {
  if (!member) return <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">Sign in to vote</span>;
  return <button disabled={!canVote || voting} onClick={onVote} className={`group/vote flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition-all ${alreadyVoted ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border text-muted-foreground hover:border-primary hover:bg-primary/10 hover:text-foreground'} disabled:cursor-not-allowed`} data-testid={`button-vote-request-${requestId}`}>
    <ArrowUp className={`h-3.5 w-3.5 ${voting ? 'animate-pulse' : ''}`} /> {alreadyVoted ? 'Your vote' : voting ? 'Saving' : 'Vote'}
  </button>;
}