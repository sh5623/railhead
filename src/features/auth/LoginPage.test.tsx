import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LoginPage } from '@/features/auth/LoginPage';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('LoginPage', () => {
  it('shows Zod validation errors on empty submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText('유효한 이메일을 입력하세요.')).toBeInTheDocument();
    expect(screen.getByText('비밀번호는 8자 이상이어야 합니다.')).toBeInTheDocument();
  });

  it('clears errors once input is valid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText('이메일'), 'user@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(screen.queryByText('유효한 이메일을 입력하세요.')).not.toBeInTheDocument();
    expect(screen.queryByText('비밀번호는 8자 이상이어야 합니다.')).not.toBeInTheDocument();
  });
});
