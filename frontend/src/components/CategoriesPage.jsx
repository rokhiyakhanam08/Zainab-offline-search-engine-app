import React from 'react';

export default function CategoriesPage({ categoriesList, onSelectCategory }) {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          Explore Product Categories
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
          Browse our curated departments to find exactly what you need at Zainab Online Shopping.
        </p>
      </div>

      <div className="categories-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {categoriesList.map((cat) => (
          <div
            key={cat.id || cat.name}
            className="category-card"
            style={{ padding: '1.75rem 1.25rem' }}
            onClick={() => onSelectCategory(cat.name)}
          >
            <div className="category-img-box" style={{ width: '84px', height: '84px' }}>
              <img
                src={cat.image_path || '/images/placeholder.svg'}
                alt={cat.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder.svg';
                }}
              />
            </div>
            <div className="category-card-name" style={{ fontSize: '1.1rem' }}>{cat.name}</div>
            <div className="category-card-count" style={{ fontSize: '0.88rem', marginTop: '0.2rem' }}>
              {cat.product_count} Items Available
            </div>
            <button
              className="btn-secondary"
              style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center', fontSize: '0.84rem' }}
            >
              Browse Category
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
