import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();

  let message = '알 수 없는 오류가 발생했습니다.';
  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold text-destructive">오류가 발생했습니다</h1>
      <p className="mt-2 text-muted-foreground">{message}</p>
    </main>
  );
}
