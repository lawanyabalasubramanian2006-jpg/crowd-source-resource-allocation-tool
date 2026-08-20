import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { ArrowRight, AtSign, CheckCircle2, LockKeyhole, UserRound } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { getGetCurrentMemberQueryKey, useGetCurrentMember, useRegisterMember } from '@workspace/api-client-react';
import { storeToken } from '@/lib/auth';
import { AuthLayout } from '@/pages/login';

export default function Register() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const current = useGetCurrentMember();
  const register = useRegisterMember();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  useEffect(() => { if (current.data) setLocation('/'); }, [current.data, setLocation]);

  function update(field: keyof typeof form, value: string) { setForm((old) => ({ ...old, [field]: value })); }
  function submit(event: FormEvent) {
    event.preventDefault();
    register.mutate({ data: form }, { onSuccess: (response) => { storeToken(response.token); queryClient.setQueryData(getGetCurrentMemberQueryKey(), response.member); setLocation('/'); } });
  }

  return <AuthLayout eyebrow="Make room" title={<>A better board<br /><em>needs you.</em></>} aside="Bring a real need, lend your perspective, and help make the next decision legible to everyone around you.">
    <form onSubmit={submit} className="grid gap-5" data-testid="form-register">
      <Field icon={<UserRound />} id="username" label="Display name" placeholder="How neighbors know you" value={form.username} onChange={(value) => update('username', value)} minLength={2} />
      <Field icon={<AtSign />} id="register-email" label="Email address" type="email" placeholder="you@example.org" value={form.email} onChange={(value) => update('email', value)} />
      <Field icon={<LockKeyhole />} id="register-password" label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={(value) => update('password', value)} minLength={6} />
      {register.isError && <p className="rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive" data-testid="status-register-error">We couldn’t make that account. Check your details and try again.</p>}
      <button disabled={register.isPending} className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70" data-testid="button-register">{register.isPending ? 'Making your place…' : 'Create member account'} {!register.isPending && <ArrowRight className="h-4 w-4" />}</button>
      <p className="text-center text-sm text-muted-foreground">Already a member? <Link href="/login" className="font-bold text-secondary hover:text-accent" data-testid="link-login-from-register">Sign in</Link></p>
    </form>
  </AuthLayout>;
}

function Field({ icon, id, label, type = 'text', placeholder, value, onChange, minLength }: { icon: ReactNode; id: string; label: string; type?: string; placeholder: string; value: string; onChange: (value: string) => void; minLength?: number }) {
  return <div><label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">{label}</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">{icon}</span><input id={id} required minLength={minLength} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm outline-none focus:border-primary" placeholder={placeholder} data-testid={`input-${id}`} /></div></div>;
}