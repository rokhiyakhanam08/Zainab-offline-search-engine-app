import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw, AlertCircle, Search } from 'lucide-react';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';

const BRANDS = [
  "Samsung", "Sony", "Apple", "Dell", "HP", "Lenovo", "Logitech", "Anker", "Bose",
  "Ninja", "Keurig", "KitchenAid", "Breville", "Dyson", "Cuisinart", "Instant Pot",
  "Nike", "Adidas", "Puma", "Patagonia", "Columbia", "Levi's",
  "Moleskine", "Parker", "Pilot", "Lamy", "O'Reilly",
  "L'Oreal", "Neutrogena", "CeraVe", "Braun", "Oral-B"
];

export default function SearchResults({
  query,
  results,
  loading,
  error,
  brandFilter,
  setBrandFilter,
  categoryFilter,
  setCategoryFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  categoriesList,
  onSelectProduct,
  isFavorite,
  onToggleFavorite,
  onResetFilters
}) {
  const hasActiveFilters = brandFilter || categoryFilter || minPrice || maxPrice;

  return (
    <div className="search-page-grid">
      {/* Sidebar Filters */}
      <aside className="filter-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <SlidersHorizontal size={18} /> Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <RotateCcw size={12} /> Clear All
            </button>
          )}
        </div>

        {/* Categories Facet */}
        <div className="filter-group">
          <div className="filter-group-title">Category</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <button
              className={`filter-btn-item ${!categoryFilter ? 'active' : ''}`}
              onClick={() => setCategoryFilter('')}
            >
              <span>All Categories</span>
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat.id || cat.name}
                className={`filter-btn-item ${categoryFilter === cat.name ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat.name)}
              >
                <span>{cat.name}</span>
                <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>{cat.product_count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Brand Facet */}
        <div className="filter-group">
          <div className="filter-group-title">Brand</div>
          <select
            className="select-input"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="">All Brands</option>
            {BRANDS.map((brd) => (
              <option key={brd} value={brd}>{brd}</option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="filter-group">
          <div className="filter-group-title">Price Range ($)</div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="number"
              className="select-input"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
            />
            <span style={{ color: 'var(--text-light)' }}>-</span>
            <input
              type="number"
              className="select-input"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
            />
          </div>
        </div>
      </aside>

      {/* Main Results Container */}
      <main>
        {/* Top Controls Bar */}
        <div className="results-controls">
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {query.trim() ? `Search results for "${query}"` : 'Product Catalog'}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              ({loading ? '...' : `${results.length} items found`})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
            <select
              className="select-input"
              style={{ width: 'auto', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance &amp; Match Score</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="products-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="state-box">
            <div className="state-icon" style={{ color: '#ef4444' }}>
              <AlertCircle size={44} />
            </div>
            <h3 className="state-title">Search Couldn't Be Completed</h3>
            <p className="state-subtitle">{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Retry Request
            </button>
          </div>
        )}

        {/* Empty Results State */}
        {!loading && !error && results.length === 0 && (
          <div className="state-box">
            <div className="state-icon">
              <Search size={44} />
            </div>
            <h3 className="state-title">No products found</h3>
            <p className="state-subtitle">
              {query.trim()
                ? `We couldn't find any products matching "${query}". Try adjusting your keywords or clearing active filters.`
                : 'Start typing in the search bar above to explore our catalog.'}
            </p>
            {hasActiveFilters && (
              <button className="btn-secondary" onClick={onResetFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Product Results Grid */}
        {!loading && !error && results.length > 0 && (
          <div className="products-grid">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
