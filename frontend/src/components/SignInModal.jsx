import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from '../hooks/use-toast';
import { Mail, Lock } from 'lucide-react';

export default function SignInModal({ open, onClose }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Please fill both fields' });
      return;
    }
    localStorage.setItem('pp_user', JSON.stringify({ email }));
    toast({ title: mode === 'signin' ? 'Welcome back!' : 'Account created!', description: email });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl border-neutral-200">
        <DialogTitle className="display text-[26px]">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </DialogTitle>
        <DialogDescription className="text-neutral-500 text-[14px]">
          {mode === 'signin' ? 'Sign in to access your templates and library.' : 'Start organizing your life with Notion templates.'}
        </DialogDescription>

        <form onSubmit={submit} className="mt-2 space-y-4">
          <div>
            <Label htmlFor="email" className="text-[13px]">Email</Label>
            <div className="relative mt-1.5">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11 rounded-lg" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="password" className="text-[13px]">Password</Label>
            <div className="relative mt-1.5">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 h-11 rounded-lg" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" className="pp-btn-dark w-full py-3">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-[13px] text-neutral-500 mt-2">
          {mode === 'signin' ? (
            <>Don't have an account?{' '}<button onClick={() => setMode('signup')} className="underline text-neutral-800">Sign up</button></>
          ) : (
            <>Already have an account?{' '}<button onClick={() => setMode('signin')} className="underline text-neutral-800">Sign in</button></>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
