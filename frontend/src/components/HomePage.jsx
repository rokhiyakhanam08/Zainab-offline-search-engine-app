import React from 'react';
import { Search, Sparkles, ShieldCheck, Cpu, ArrowRight, RefreshCw } from 'lucide-react';
import ProductCard from './ProductCard';

const POPULAR_PILLS = [
  "Phone",
  "Wireless Headphones",
  "Toaster Oven",
  "Running Shoes",
  "Moisturizer",
  "Fountain Pen",
  "Smartwatch",
  "Laptop"
];

export default function HomePage({
  query,
  setQuery,
  setActiveTab,
  categoriesList,
  featuredProducts,
  onSelectCategory,
  onSelectProduct,
  isFavorite,
  onToggleFavorite,
  systemStats,
  triggerImport,
  loading
}) {
  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} /> Intelligent Product Search Engine
          </div>
          <h1 className="hero-title">Find what you're looking for, effortlessly.</h1>
          <p className="hero-subtitle">
            Explore thousands of products at Zainab Online Shopping. Powered by instant hybrid exact, trigram fuzzy, and ONNX vector search.
          </p>

          <div style={{ background: '#ffffff', padding: '0.4rem', borderRadius: '14px', maxWidth: '580px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.6rem' }}>
              <Search size={20} style={{ color: 'var(--text-light)' }} />
              <input
                type="text"
                placeholder="Search products by title, sku, brand, category, tags..."
                style={{ flex: 1, border: 'none', outline: 'none', padding: '0.7rem 0', fontSize: '1rem', color: '#0f172a' }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setActiveTab('search');
                }}
              />
              <button
                className="btn-primary"
                style={{ padding: '0.7rem 1.25rem', borderRadius: '10px' }}
                onClick={() => setActiveTab('search')}
              >
                Search
              </button>
            </div>
          </div>

          <div className="search-pills">
            <span className="pill-title">Try searching:</span>
            {POPULAR_PILLS.map((pill) => (
              <button
                key={pill}
                className="search-pill"
                onClick={() => {
                  setQuery(pill);
                  setActiveTab('search');
                }}
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Database Seeding Status Alert if DB is empty */}
      {systemStats?.product_count === 0 && (
        <div className="state-box" style={{ marginBottom: '2rem', padding: '2rem', borderColor: '#f59e0b', background: '#fffbeb' }}>
          <h3 className="state-title" style={{ color: '#b45309' }}>Database Seed Required</h3>
          <p className="state-subtitle" style={{ color: '#92400e' }}>
            The database currently contains 0 items. Click below to load 5,200 pre-embedded products into PostgreSQL.
          </p>
          <button className="btn-primary" onClick={triggerImport} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spinner' : ''} /> Seed 5,200 Products
          </button>
        </div>
      )}

      {/* Browse by Category */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Shop by Category</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Explore our primary product collections</p>
        </div>
        <button className="section-link" onClick={() => setActiveTab('categories')}>
          View All Categories &rarr;
        </button>
      </div>

      <div className="categories-grid">
        {categoriesList.map((cat) => (
          <div
            key={cat.id || cat.name}
            className="category-card"
            onClick={() => onSelectCategory(cat.name)}
          >
            <div className="category-img-box">
              <img
                src={cat.image_path || '/images/placeholder.svg'}
                alt={cat.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder.svg';
                }}
              />
            </div>
            <div className="category-card-name">{cat.name}</div>
            <div className="category-card-count">{cat.product_count} items</div>
          </div>
        ))}
      </div>

      {/* Featured Products Grid */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Featured Products</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Top rated items available for immediate order</p>
        </div>
        <button className="section-link" onClick={() => { setQuery('a'); setActiveTab('search'); }}>
          Browse Catalog &rarr;
        </button>
      </div>

      <div className="products-grid" style={{ marginBottom: '3.5rem' }}>
        {featuredProducts.slice(0, 8).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
            isFavorite={isFavorite(product.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {/* Trust & Architecture Section */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '2.5rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)' }}>
          Why Zainab Online Shopping Search is Faster &amp; Accurate
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} /> Exact SKU &amp; Brand Matching
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Case-insensitive direct equality scan checks product titles, brands, and unique SKUs first.
            </p>
          </div>
          <div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} /> Trigram Fuzzy Similarity
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Handles typos and partial queries instantly using PostgreSQL pg_trgm trigram similarity scoring.
            </p>
          </div>
          <div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={18} /> CPU ONNX Vector Embeddings
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Translates search queries into 384-dimensional vectors for semantic matching with pgvector.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
