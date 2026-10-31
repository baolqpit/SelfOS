'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { registerSchema, type RegisterInput } from '@/lib/validators/auth';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterInput) => {
    setServerError(null);
    try {
      await api
        .post('auth/register', {
          json: {
            email: values.email,
            username: values.username,
            password: values.password,
          },
        })
        .json();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Đăng ký thất bại');
      return;
    }
    const signInRes = await signIn('credentials', {
      emailOrUsername: values.email,
      password: values.password,
      redirect: false,
    });
    if (signInRes?.error) {
      router.push('/login');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
      <Card className="w-full">
        <CardTitle>Tạo tài khoản</CardTitle>
        <CardDescription className="mb-4">
          Dùng username làm URL public của bạn: <code>/u/username</code>
        </CardDescription>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Field
            label="Email"
            hint="Dùng để đăng nhập và nhận thông báo. Không hiển thị public."
            error={errors.email?.message}
          >
            <Input type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
          </Field>
          <Field
            label="Username"
            hint="3–32 ký tự, chỉ chữ/số/dấu gạch. Đây sẽ là URL public /u/username."
            error={errors.username?.message}
          >
            <Input placeholder="VD: alice (không khoảng trắng)" autoComplete="username" {...register('username')} />
          </Field>
          <Field
            label="Mật khẩu"
            hint="Tối thiểu 8 ký tự. Nên kết hợp chữ + số + ký tự đặc biệt."
            error={errors.password?.message}
          >
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('password')}
            />
          </Field>
          <Field
            label="Xác nhận mật khẩu"
            hint="Nhập lại mật khẩu để tránh gõ sai."
            error={errors.confirm?.message}
          >
            <Input type="password" placeholder="••••••••" {...register('confirm')} />
          </Field>
          {serverError && (
            <p className="text-sm text-[var(--color-destructive)]">{serverError}</p>
          )}
          <Button type="submit" loading={isSubmitting}>
            Đăng ký
          </Button>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Đã có tài khoản?{' '}
            <Link href="/login" className="underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
