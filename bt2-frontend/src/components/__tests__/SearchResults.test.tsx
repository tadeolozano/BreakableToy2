import { render, screen } from '@testing-library/react';
import SearchResults from '../SearchResults';
import { vi } from 'vitest';
import { describe, it, expect } from 'vitest';

// Mock del componente ArtistCard para no depender de su implementación
vi.mock('../ArtistCard', () => ({
  default: ({ name }: { name: string }) => <div>{name}</div>,
}));

describe('SearchResults', () => {
  it('does not render anything if results is empty', () => {
    const { container } = render(<SearchResults results={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the title and artist cards when results are present', () => {
    const mockResults = [
      {
        id: '1',
        name: 'Dua Lipa',
        images: [{ url: 'https://example.com/dua.jpg' }],
        genres: ['pop'],
        popularity: 95,
        external_urls: { spotify: 'https://spotify.com/dua' },
      },
      {
        id: '2',
        name: 'The Weeknd',
        images: [{ url: 'https://example.com/weeknd.jpg' }],
        genres: ['r&b'],
        popularity: 98,
        external_urls: { spotify: 'https://spotify.com/weeknd' },
      },
    ];

    render(<SearchResults results={mockResults} />);

    expect(screen.getByText(/search results/i)).toBeInTheDocument();
    expect(screen.getByText(/dua lipa/i)).toBeInTheDocument();
    expect(screen.getByText(/the weeknd/i)).toBeInTheDocument();
  });

  it('renders the correct number of artist cards', () => {
  const mockResults = [
    { id: '1', name: 'Artist 1', images: [{}], genres: [], popularity: 80, external_urls: { spotify: '' } },
    { id: '2', name: 'Artist 2', images: [{}], genres: [], popularity: 70, external_urls: { spotify: '' } },
    { id: '3', name: 'Artist 3', images: [{}], genres: [], popularity: 90, external_urls: { spotify: '' } },
  ];

  render(<SearchResults results={mockResults} />);

  expect(screen.getAllByText(/artist/i)).toHaveLength(3);
});

});
