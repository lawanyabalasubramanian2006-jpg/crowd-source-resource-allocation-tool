import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, Mail } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { getGetCurrentMemberQueryKey, useGetCurrentMember, useLoginMember } from '@workspace/api-client-react';
import { storeToken } from '@/lib/auth';

export default function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const current = useGetCurrentMember();
  const login = useLoginMember();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => { if (current.data) setLocation('/'); }, [current.data, setLocation]);

  function submit(event: FormEvent) {
    event.preventDefault();
    login.mutate({ data: { email, password } }, { onSuccess: (response) => { storeToken(response.token); queryClient.setQueryData(getGetCurrentMemberQueryKey(), response.member); setLocation('/'); } });
  }

  return <AuthLayout eyebrow="Welcome back" title={<>Your place<br /><em>is here.</em></>} aside="The board works when people who care can see it, understand it, and take part.">
    <form onSubmit={submit} className="grid gap-5" data-testid="form-login">
      <div><label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Email address</label><div className="relative"><Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" /><input id="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm outline-none focus:border-primary" placeholder="you@example.org" data-testid="input-email" /></div></div>
      <div><label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Password</label><div className="relative"><LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" /><input id="password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm outline-none focus:border-primary" placeholder="At least 6 characters" data-testid="input-password" /></div></div>
      {login.isError && <p className="rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive" data-testid="status-login-error">That email and password did not match. Please try again.</p>}
      <button disabled={login.isPending} className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70" data-testid="button-login">{login.isPending ? 'Checking your details…' : 'Sign in'} {!login.isPending && <ArrowRight className="h-4 w-4" />}</button>
      <p className="text-center text-sm text-muted-foreground">New to the board? <Link href="/register" className="font-bold text-secondary hover:text-accent" data-testid="link-register">Create a member account</Link></p>
    </form>
  </AuthLayout>;
}

export function AuthLayout({ eyebrow, title, aside, children }: { eyebrow: string; title: ReactNode; aside: string; children: ReactNode }) {
  return <div className="page-enter mx-auto grid min-h-[calc(100dvh-150px)] max-w-[1240px] gap-12 px-5 py-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-24 lg:px-8 lg:py-20">
    <div className="relative hidden overflow-hidden rounded-[30px] bg-secondary p-10 text-secondary-foreground lg:block"><div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[26px] border-primary/25" /><div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full border-[22px] border-accent/25" /><p className="relative font-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary">{eyebrow}</p><h1 className="relative mt-16 font-serif text-7xl leading-[.88] tracking-[-.04em]">{title}</h1><p className="relative mt-10 max-w-sm text-base leading-7 text-secondary-foreground/75">{aside}</p><div className="relative mt-16 flex items-center gap-3 border-t border-secondary-foreground/20 pt-5 text-xs font-semibold"><CheckCircle2 className="h-4 w-4 text-primary" /> One member. One vote. Shared clarity.</div></div>
    <div className="mx-auto w-full max-w-[440px]"><Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground" data-testid="link-back-home"><ArrowLeft className="h-4 w-4" /> Back to the board</Link><div className="mb-9 lg:hidden"><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-accent">{eyebrow}</p><h1 className="mt-3 font-serif text-6xl leading-[.88] tracking-[-.04em]">{title}</h1></div><p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-accent">Member access</p><h2 className="font-serif text-4xl tracking-[-.02em]">Sign in to participate.</h2><p className="mt-3 mb-8 text-sm leading-6 text-muted-foreground">Your account keeps voting fair and makes sure each request has one clear voice from you.</p>{children}</div>
  </div>;
}