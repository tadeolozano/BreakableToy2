import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TrackCard from '../TrackCard';

describe('TrackCard', () => {
  const defaultProps = {
    title: 'Song Title',
    artist: 'Artist Name',
    imageUrl: 'https://example.com/image.jpg'
  };

  it('renders title and artist', () => {
    render(<TrackCard {...defaultProps} />);
    
    expect(screen.getByText('Song Title')).toBeInTheDocument();
    expect(screen.getByText('Artist Name')).toBeInTheDocument();
  });

  it('renders image with correct attributes', () => {
    render(<TrackCard {...defaultProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Song Title');
  });


  it('does not show audio player when no previewUrl', () => {
    render(<TrackCard {...defaultProps} />);
    
    expect(screen.queryByRole('application')).not.toBeInTheDocument();
  });

});