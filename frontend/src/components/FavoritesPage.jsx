import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductCard from './ProductCard';

export default function FavoritesPage({
  favorites,
  onSelectProduct,
  isFavorite,
  onToggleFavorite,
  setActiveTab
}) {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={24} fill="#ef4444" color="#ef4444" /> Saved Wishlist
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
          Products you've bookmarked for later at Zainab Online Shopping.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="state-box">
          <div className="state-icon">
            <Heart size={44} color="var(--text-light)" />
          </div>
          <h3 className="state-title">Your wishlist is empty</h3>
          <p className="state-subtitle">
            You haven't saved any items yet. Click the heart icon on any product card to add it to your saved list.
          </p>
          <button className="btn-primary" onClick={() => setActiveTab('search')}>
            <ShoppingBag size={16} /> Explore Products
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {favorites.map((product) => (
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
    </div>
  );
}
