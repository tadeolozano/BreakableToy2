import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import PlaylistCard from '../PlaylistCard';

describe('PlaylistCard', () => {
  const defaultProps = {
    id: '1',
    name: 'My Playlist',
    imageUrl: 'https://example.com/image.jpg'
  };

  it('renders playlist name', () => {
    render(<PlaylistCard {...defaultProps} />);
    
    expect(screen.getByText('My Playlist')).toBeInTheDocument();
  });

  it('renders image with correct src', () => {
    render(<PlaylistCard {...defaultProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'My Playlist');
  });

  it('shows placeholder image when no imageUrl provided', () => {
    render(<PlaylistCard id="1" name="Test Playlist" />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/placeholder.png');
  });

  it('applies hover effect on mouse over', async () => {
    const user = userEvent.setup();
    render(<PlaylistCard {...defaultProps} />);
    
    const card = screen.getByText('My Playlist').parentElement;
    if (!card) throw new Error('Card element not found');
    
    await user.hover(card);
    expect(card).toHaveStyle({ transform: 'scale(1.03)' });
  });

  it('resets hover effect on mouse out', async () => {
    const user = userEvent.setup();
    render(<PlaylistCard {...defaultProps} />);
    const card = screen.getByText('My Playlist').parentElement;
    if (!card) throw new Error('Card element not found');
    
    await user.hover(card);
    await user.unhover(card);
    expect(card).toHaveStyle({ transform: 'scale(1)' });
    expect(card).toHaveStyle({ transform: 'scale(1)' });
  });
});