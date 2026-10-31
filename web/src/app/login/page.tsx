'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') ?? '/dashboard';
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    const res = await signIn('credentials', {
      ...values,
      redirect: false,
    });
    if (res?.error) {
      setServerError('Sai thông tin đăng nhập');
      return;
    }
    router.push(next);
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
      <Card className="w-full">
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription className="mb-4">
          Nhập email hoặc username để truy cập dashboard.
        </CardDescription>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Field
            label="Email hoặc username"
            hint="Dùng email đã đăng ký, hoặc username (VD: alice)."
            error={errors.emailOrUsername?.message}
          >
            <Input
              placeholder="you@example.com hoặc username"
              {...register('emailOrUsername')}
              autoComplete="username"
            />
          </Field>
          <Field
            label="Mật khẩu"
            hint="Tối thiểu 8 ký tự."
            error={errors.password?.message}
          >
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              autoComplete="current-password"
            />
          </Field>
          {serverError && (
            <p className="text-sm text-[var(--color-destructive)]">{serverError}</p>
          )}
          <Button type="submit" loading={isSubmitting}>
            Đăng nhập
          </Button>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="underline">
              Đăng ký
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
