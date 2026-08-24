import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, Trash2 } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  suggestions,
  onSelectSuggestion,
  recentSearches = [],
  onClearRecent
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 >= suggestions.length ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 < 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        onSelectSuggestion(suggestions[activeIndex]);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const showRecent = !value.trim() && recentSearches.length > 0;
  const showSuggestions = value.trim() && suggestions.length > 0;

  return (
    <div className="search-wrapper">
      <div className="search-input-container">
        <Search size={18} style={{ color: 'var(--text-light)', marginRight: '0.4rem' }} />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search products by title, sku, brand, category, tags..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {value && (
          <button className="clear-btn" onClick={handleClear} aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown list */}
      {isOpen && (showSuggestions || showRecent) && (
        <div ref={dropdownRef} className="autocomplete-dropdown">
          {showSuggestions && (
            <>
              <div className="dropdown-section-title">Matching Products</div>
              {suggestions.slice(0, 6).map((item, idx) => (
                <div
                  key={item.id}
                  className={`dropdown-item ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => {
                    onSelectSuggestion(item);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <div>
                    <div className="dropdown-title">{item.title}</div>
                    <div className="dropdown-meta">{item.brand} &bull; {item.category}</div>
                  </div>
                  {item.score !== undefined && (
                    <span className="dropdown-score">
                      Match: {Math.round(item.score * 100)}%
                    </span>
                  )}
                </div>
              ))}
            </>
          )}

          {showRecent && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="dropdown-section-title">Recent Searches</div>
                {onClearRecent && (
                  <button
                    onClick={onClearRecent}
                    style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', paddingRight: '0.75rem' }}
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                )}
              </div>
              {recentSearches.map((term, idx) => (
                <div
                  key={idx}
                  className="dropdown-item"
                  onClick={() => {
                    onChange(term);
                    setIsOpen(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{term}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
