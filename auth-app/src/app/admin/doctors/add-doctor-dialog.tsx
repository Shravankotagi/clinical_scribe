'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createDoctor, type CreateDoctorState } from './actions';

const initialState: CreateDoctorState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating…' : 'Create Doctor Account'}
    </Button>
  );
}

export function AddDoctorDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createDoctor, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // On success: clear the form and close the dialog.
  // On error: state.error stays set, dialog stays open, message renders inline below.
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-[#1a33cc] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1428a0] hover:shadow-md active:scale-95 transition-all duration-100">
          <span className="text-base">+</span>
          Add Doctor
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Doctor</DialogTitle>
          <DialogDescription>Create a new doctor account</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="Dr. John Smith" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="doctor@clinic.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Temporary Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>

          {state?.error && (
            <p className="text-sm font-medium text-[#ba1a1a] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}