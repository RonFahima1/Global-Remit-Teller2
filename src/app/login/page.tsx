'use client';
import { useRouter } from "next/navigation";
import { Banknote } from "lucide-react";
import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex items-center mb-8">
        <Banknote className="h-8 w-8 text-primary mr-2" />
        <h1 className="text-2xl font-bold">Global Remit Teller</h1>
      </div>
      <LoginForm />
    </div>
  );
} 