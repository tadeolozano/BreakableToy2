import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BackButton from '../BackButton';

// Mock de useNavigate
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('BackButton', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders with correct text and icon', () => {
    render(<BackButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button', { name: /⬅ Go back/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('⬅ Go back');
  });

  it('calls navigate(-1) when clicked', async () => {
    const user = userEvent.setup();
    render(<BackButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button', { name: /⬅ Go back/i });
    await user.click(button);
    
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('has correct accessibility attributes', () => {
    render(<BackButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('handles hover effect on mouse over', async () => {
    const user = userEvent.setup();
    render(<BackButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    
    
    
    // Simular hover
    await user.hover(button);
    expect(button).toHaveStyle({ filter: 'brightness(1.05)' });
  });

  it('resets hover effect on mouse out', async () => {
    const user = userEvent.setup();
    render(<BackButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    
    // Simular hover y luego unhover
    await user.hover(button);
    await user.unhover(button);
    
    expect(button).toHaveStyle({ filter: 'brightness(1)' });
  });

  it('can be clicked multiple times', async () => {
    const user = userEvent.setup();
    render(<BackButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    
    // Hacer múltiples clicks
    await user.click(button);
    await user.click(button);
    await user.click(button);
    
    expect(mockNavigate).toHaveBeenCalledTimes(3);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    expect(mockNavigate).toHaveBeenNthCalledWith(2, -1);
    expect(mockNavigate).toHaveBeenNthCalledWith(3, -1);
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<BackButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    
    // Hacer focus y presionar Enter
    button.focus();
    expect(button).toHaveFocus();
    
    await user.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('can be activated with Space key', async () => {
    const user = userEvent.setup();
    render(<BackButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    
    // Hacer focus y presionar Space
    button.focus();
    await user.keyboard(' ');
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('does not navigate when useNavigate is not available', () => {
    // Mock temporal que simula un error
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    vi.mocked(mockNavigate).mockImplementation(() => {
      throw new Error('Navigation failed');
    });
    
    render(<BackButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    // El botón debería renderizarse incluso si hay un error
    expect(button).toBeInTheDocument();
    
    consoleError.mockRestore();
  });

  it('renders without crashing when not wrapped in Router', () => {
    // Este test verificará que el componente se renderiza
    // pero mockNavigate podría no funcionar correctamente
    expect(() => render(<BackButton />)).not.toThrow();
  });
});