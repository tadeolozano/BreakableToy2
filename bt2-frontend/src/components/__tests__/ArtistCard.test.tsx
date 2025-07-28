import { render, screen } from '@testing-library/react';
import ArtistCard from '../ArtistCard';
import { describe, it, expect } from 'vitest';

describe('ArtistCard', () => {
    const mockProps = {
        name: 'Dua Lipa',
        imageUrl: 'https://example.com/dua-lipa.jpg',
    };
    
    it('renders artist name and image', () => {
        render(<ArtistCard {...mockProps} />);
    
        const image = screen.getByRole('img', { name: /dua lipa/i });
        const name = screen.getByText(/dua lipa/i);
    
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', mockProps.imageUrl);
        expect(image).toHaveAttribute('alt', mockProps.name);
    
        expect(name).toBeInTheDocument();
        expect(name).toHaveTextContent(mockProps.name);
    });
    }
);