import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Filter, Search, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetMyVoteQueryKey, getGetRankingQueryKey, useCastVote, useGetCurrentMember, useGetMyVote, useGetRequests } from '@workspace/api-client-react';
import { ErrorNotice, LoadingList, PageHeader, StatPill } from '@/components/app-shell';
import { RequestCard } from '@/components/request-card';

export default function Requests() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const currentMember = useGetCurrentMember();
  const member = currentMember.data;
  const requests = useGetRequests();
  const vote = useGetMyVote({ query: { enabled: Boolean(member), queryKey: getGetMyVoteQueryKey() } });
  const castVote = useCastVote();
  const queryClient = useQueryClient();
  const allRequests = requests.data ?? [];
  const categories = ['All', ...Array.from(new Set(allRequests.map((item) => item.category)))];
  const filtered = useMemo(() => allRequests.filter((item) => (category === 'All' || item.category === category) && `${item.title} ${item.description} ${item.submittedBy}`.toLowerCase().includes(query.toLowerCase())), [allRequests, category, query]);

  function handleVote(requestId: number) {
    castVote.mutate({ data: { requestId } }, { onSuccess: (status) => { queryClient.setQueryData(getGetMyVoteQueryKey(), status); queryClient.invalidateQueries({ queryKey: getGetRankingQueryKey() }); queryClient.invalidateQueries({ queryKey: requests.queryKey }); } });
  }

  return <div className="page-enter mx-auto max-w-[1240px] px-5 py-12 lg:px-8 lg:py-16">
    <PageHeader eyebrow="The open list" title="Every request, in the clear." description="Browse what neighbors have asked for, see the context around each need, and add your one voice when you’re ready." />
    <div className="grid gap-3 sm:grid-cols-3"><StatPill label="Visible requests" value={requests.isLoading ? '—' : String(allRequests.length)} /><StatPill label="Categories" value={requests.isLoading ? '—' : String(Math.max(0, categories.length - 1))} /><StatPill label="Your vote" value={member ? (vote.data?.hasVoted ? 'Placed' : 'Available') : 'Sign in'} /></div>
    <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 md:flex-row">
      <div className="relative min-w-0 flex-1"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search requests or neighbors" className="h-11 w-full rounded-xl border-0 bg-muted/60 pl-11 pr-10 text-sm outline-none ring-0 placeholder:text-muted-foreground focus:bg-muted" data-testid="input-search-requests" />{query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground" aria-label="Clear search" data-testid="button-clear-search"><X className="h-4 w-4" /></button>}</div>
      <div className="flex items-center gap-2 overflow-x-auto px-1"><Filter className="h-4 w-4 shrink-0 text-secondary" />{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold transition-colors ${category === item ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} data-testid={`button-filter-${item.toLowerCase().replace(/\s/g, '-')}`}>{item}</button>)}</div>
    </div>
    <div className="mt-6">
      {requests.isLoading ? <LoadingList rows={4} /> : requests.isError ? <ErrorNotice onRetry={() => requests.refetch()} /> : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center" data-testid="status-empty-requests"><p className="font-serif text-3xl">Nothing matches that view.</p><p className="mt-2 text-sm text-muted-foreground">Try a different search or category. New needs belong here too.</p><button onClick={() => { setQuery(''); setCategory('All'); }} className="mt-5 rounded-full border border-border px-4 py-2 text-sm font-bold hover:border-primary" data-testid="button-reset-filters">Reset filters</button></div> : <div className="grid gap-3">{filtered.map((request) => <RequestCard key={request.id} request={request} member={member} hasVoted={vote.data?.hasVoted} votedRequestId={vote.data?.requestId} onVote={member ? handleVote : undefined} voting={castVote.isPending} />)}</div>}
    </div>
    {!member && <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-secondary p-6 text-secondary-foreground sm:flex-row sm:items-center"><div><p className="font-serif text-2xl">Your voice belongs in the mix.</p><p className="mt-1 text-sm text-secondary-foreground/75">Sign in to cast exactly one vote across the board.</p></div><Link href="/login" className="flex shrink-0 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground" data-testid="link-signin-to-vote">Sign in to vote</Link></div>}
  </div>;
}