import { render, screen } from '@testing-library/react';
import TopArtists from '../TopArtists';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, expect, it } from 'vitest';

// Mock del componente ArtistCard
vi.mock('../ArtistCard', () => ({
  default: ({ name }: { name: string }) => <div>{name}</div>,
}));

describe('TopArtists', () => {
  const mockArtists = [
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
      name: 'Bad Bunny',
      images: [{ url: 'https://example.com/bad.jpg' }],
      genres: ['reggaeton'],
      popularity: 98,
      external_urls: { spotify: 'https://spotify.com/bad' },
    },
  ];

  it('renders all artist cards with correct links', () => {
    render(<TopArtists artists={mockArtists} />, { wrapper: MemoryRouter });

    // Verifica que los nombres estén presentes (por el mock de ArtistCard)
    expect(screen.getByText('Dua Lipa')).toBeInTheDocument();
    expect(screen.getByText('Bad Bunny')).toBeInTheDocument();

    // Verifica los enlaces
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/artist/1');
    expect(links[1]).toHaveAttribute('href', '/artist/2');
  });

  it('does not crash if image or genre is missing', () => {
    const incompleteData = [
      {
        id: '3',
        name: 'Unknown Artist',
        images: [],
        genres: [],
        popularity: 0,
        external_urls: { spotify: '' },
      },
    ];

    render(<TopArtists artists={incompleteData} />, { wrapper: MemoryRouter });

    expect(screen.getByText('Unknown Artist')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/artist/3');
  });

  
});
