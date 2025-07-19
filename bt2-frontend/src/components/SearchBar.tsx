import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search for artists, albums, tracks..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          padding: '10px',
          width: '50%',
          fontSize: '16px',
          borderRadius: '10px',
          border: '1px solid #ccc'
        }}
      />
    </form>
  );
};

export default SearchBar;
