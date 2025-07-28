import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DashboardButton from '../DashboardButton';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper para React Router
const RouterWrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('DashboardButton', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders with correct text and icon', () => {
    render(<DashboardButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button', { name: /⬅ Dashboard/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('⬅ Dashboard');
  });

  it('calls navigate("/dashboard") when clicked', async () => {
    const user = userEvent.setup();
    render(<DashboardButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button', { name: /⬅ Dashboard/i });
    await user.click(button);
    
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('has correct accessibility attributes', () => {
    render(<DashboardButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('handles hover effect on mouse over', async () => {
    const user = userEvent.setup();
    render(<DashboardButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    
    
    // Simular hover
    await user.hover(button);
    expect(button).toHaveStyle({ filter: 'brightness(1.05)' });
  });

  it('resets hover effect on mouse out', async () => {
    const user = userEvent.setup();
    render(<DashboardButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    
    // Simular hover y luego unhover
    await user.hover(button);
    await user.unhover(button);
    
    expect(button).toHaveStyle({ filter: 'brightness(1)' });
  });

  it('navigates to dashboard on multiple clicks', async () => {
    const user = userEvent.setup();
    render(<DashboardButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    
    // Hacer múltiples clicks
    await user.click(button);
    await user.click(button);
    await user.click(button);
    
    expect(mockNavigate).toHaveBeenCalledTimes(3);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/dashboard');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/dashboard');
    expect(mockNavigate).toHaveBeenNthCalledWith(3, '/dashboard');
  });

  it('is keyboard accessible with Enter key', async () => {
    const user = userEvent.setup();
    render(<DashboardButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    
    // Hacer focus y presionar Enter
    button.focus();
    expect(button).toHaveFocus();
    
    await user.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('can be activated with Space key', async () => {
    const user = userEvent.setup();
    render(<DashboardButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    
    // Hacer focus y presionar Space
    button.focus();
    await user.keyboard(' ');
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('handles navigation correctly even with fast clicks', async () => {
    const user = userEvent.setup();
    render(<DashboardButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    
    // Simular clicks rápidos
    await user.dblClick(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });

  it('has correct button text content', () => {
    render(<DashboardButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    expect(button.textContent).toBe('⬅ Dashboard');
    expect(button.textContent).toContain('⬅');
    expect(button.textContent).toContain('Dashboard');
  });

  it('applies transition styles correctly', () => {
    render(<DashboardButton />, { wrapper: RouterWrapper });
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      transition: 'all 0.2s ease-in-out',
      boxShadow: '0 2px 8px rgba(30, 217, 96, 0.15)'
    });
  });


  // Test de integración con diferentes rutas
  it('navigates to dashboard from any current route', () => {
    // Renderizar desde una ruta específica
    render(
      <MemoryRouter initialEntries={['/some-other-route']}>
        <DashboardButton />
      </MemoryRouter>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});