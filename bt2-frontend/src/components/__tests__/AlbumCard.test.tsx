import { render, screen } from '@testing-library/react';
import AlbumCard from '../AlbumCard';
import { describe, it, expect } from 'vitest';

describe('AlbumCard', () => {
  const mockProps = {
    title: 'Future Nostalgia',
    imageUrl: 'https://example.com/future-nostalgia.jpg',
  };

  it('renders album title and image', () => {
    render(<AlbumCard {...mockProps} />);

    const image = screen.getByRole('img', { name: /future nostalgia/i });
    const title = screen.getByText(/future nostalgia/i);

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProps.imageUrl);
    expect(image).toHaveAttribute('alt', mockProps.title);

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(mockProps.title);
  });
});
