import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

/**
 * Login route — destination of the 401 redirect in `src/lib/api/client.ts`,
 * and the canonical React Hook Form + Zod example. The schema is colocated,
 * `zodResolver` wires validation into RHF, and errors render inline with a11y
 * links (`aria-invalid` + `aria-describedby`).
 *
 * Scaffold: the backend spec exposes no auth endpoint yet and we never invent
 * endpoints (AGENTS.md — single API pattern), so `onSubmit` is a documented
 * TODO. Everything up to the network call is the real, reusable pattern.
 */
const loginSchema = z.object({
  email: z.email('유효한 이메일을 입력하세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
});
type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  function onSubmit() {
    // handleSubmit only fires when the form is valid. Wire the validated
    // payload to the auth endpoint once the spec exposes one, e.g.:
    //   const { data } = await api.POST('/auth/login', { body: { email, password } })
    //   if (data) { setToken(data.token); navigate('/') }   // from '@/lib/auth/token'
    // Do NOT hand-write fetch or invent the endpoint path/shape.
  }

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-sm flex-col justify-center px-6 py-16">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold tracking-tight">로그인</h1>
          <CardDescription>
            React Hook Form + Zod 폼 패턴 예시입니다. 스펙에 인증 엔드포인트가 추가되면 제출을 실제
            호출로 연결하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email ? (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
              />
              {errors.password ? (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
              로그인
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
