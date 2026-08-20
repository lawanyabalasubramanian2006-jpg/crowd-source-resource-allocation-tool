import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, BarChart3, Check, CircleUserRound, Menu, X } from 'lucide-react';
import { useGetCurrentMember } from '@workspace/api-client-react';

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const memberQuery = useGetCurrentMember();
  const member = memberQuery.data;

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <div className="grain min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Link href="/" className="group flex items-center gap-3" data-testid="link-home">
            <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-primary text-primary-foreground shadow-[4px_4px_0_hsl(var(--secondary)/.22)] transition-transform group-hover:-translate-y-0.5">
              <BarChart3 className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span>
              <span className="block font-serif text-[23px] leading-none tracking-[-.02em]">Common Ground</span>
              <span className="mt-1 block font-mono text-[9px] font-bold uppercase tracking-[.18em] text-muted-foreground">shared resources</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            <NavLink href="/" current={location === '/'} testId="link-board">The board</NavLink>
            <NavLink href="/requests" current={location === '/requests'} testId="link-requests">All requests</NavLink>
            {member && <NavLink href="/submit" current={location === '/submit'} testId="link-submit">Submit a request</NavLink>}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {member ? (
              <Link href="/submit" className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary" data-testid="link-member">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">{member.username.slice(0, 2).toUpperCase()}</span>
                {member.username}
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary hover:bg-card" data-testid="link-login">
                <CircleUserRound className="h-4 w-4" /> Member sign in
              </Link>
            )}
          </div>
          <button className="rounded-lg p-2 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" data-testid="button-menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-card px-5 py-4 md:hidden">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              <NavLink href="/" current={location === '/'} testId="link-mobile-board">The board</NavLink>
              <NavLink href="/requests" current={location === '/requests'} testId="link-mobile-requests">All requests</NavLink>
              {member ? <NavLink href="/submit" current={location === '/submit'} testId="link-mobile-submit">Submit a request</NavLink> : <NavLink href="/login" current={location === '/login'} testId="link-mobile-login">Member sign in</NavLink>}
            </nav>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="font-serif text-lg text-foreground">Resources move further when we decide together.</p>
          <p className="font-mono text-[10px] uppercase tracking-[.16em]">A public board for our neighborhood</p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, current, children, testId }: { href: string; current: boolean; children: ReactNode; testId: string }) {
  return <Link href={href} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${current ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} data-testid={testId}>{children}</Link>;
}

export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="rise-in mb-9 max-w-3xl">
    <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-accent">{eyebrow}</p>
    <h1 className="font-serif text-5xl leading-[.98] tracking-[-.03em] text-foreground md:text-7xl">{title}</h1>
    {description && <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{description}</p>}
  </div>;
}

export function LoadingList({ rows = 3 }: { rows?: number }) {
  return <div className="grid gap-3" aria-label="Loading content" data-testid="status-loading">
    {Array.from({ length: rows }).map((_, index) => <div key={index} className="h-[124px] animate-pulse rounded-2xl border border-border bg-card/70" />)}
  </div>;
}

export function ErrorNotice({ onRetry }: { onRetry: () => void }) {
  return <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6" data-testid="status-error">
    <p className="font-semibold text-destructive">We couldn’t load the board.</p>
    <p className="mt-1 text-sm text-muted-foreground">Please try again. Your place in the community is still here.</p>
    <button onClick={onRetry} className="mt-4 rounded-full bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground transition-opacity hover:opacity-85" data-testid="button-retry">Try again</button>
  </div>;
}

export function StatPill({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-card px-4 py-3"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">{label}</p><p className="mt-1 font-serif text-2xl leading-none">{value}</p></div>;
}

export function CheckMark() {
  return <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-secondary-foreground"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>;
}