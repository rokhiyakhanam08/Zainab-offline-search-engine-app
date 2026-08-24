import React from 'react';
import { ShoppingBag, Search, Heart, Grid, Home, Info } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, favoritesCount, query, setQuery }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => setActiveTab('home')}>
          <div className="brand-icon-box">
            <ShoppingBag size={22} />
          </div>
          <span>Zainab Online Shopping</span>
        </div>

        {/* Global Quick Search */}
        <div className="search-wrapper" style={{ maxWidth: '380px', margin: 0 }}>
          <div className="search-input-container" style={{ padding: '0.2rem 0.6rem' }}>
            <Search size={16} style={{ color: 'var(--text-light)', marginRight: '0.4rem' }} />
            <input
              type="text"
              className="search-input"
              style={{ fontSize: '0.88rem', padding: '0.4rem 0' }}
              placeholder="Search products, brands, categories..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (activeTab !== 'search') setActiveTab('search');
              }}
              onFocus={() => {
                if (activeTab !== 'search') setActiveTab('search');
              }}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <Home size={16} /> Home
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <Grid size={16} /> Categories
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'search' ? 'active' : ''}`}
                onClick={() => setActiveTab('search')}
              >
                <Search size={16} /> Search
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                <Heart size={16} /> Wishlist
                {favoritesCount > 0 && <span className="badge-count">{favoritesCount}</span>}
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                <Info size={16} /> About
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
