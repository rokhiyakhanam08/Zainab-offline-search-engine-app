import React from 'react';
import { ShoppingBag, Cpu, Database, ShieldCheck } from 'lucide-react';

export default function Footer({ setActiveTab, setCategoryFilter }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div className="footer-brand">
            <ShoppingBag size={20} style={{ color: 'var(--primary)' }} />
            <span>Zainab Online Shopping</span>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: '1.6', maxWidth: '360px', color: '#94a3b8' }}>
            Your trusted destination for quality products. Powered by CPU-only offline intelligent hybrid vector &amp; fuzzy search.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Cpu size={14} /> ONNX Offline</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Database size={14} /> pgvector</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ShieldCheck size={14} /> Private</span>
          </div>
        </div>

        <div>
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><button onClick={() => setActiveTab('home')}>Home</button></li>
            <li><button onClick={() => setActiveTab('categories')}>Categories</button></li>
            <li><button onClick={() => setActiveTab('search')}>Product Search</button></li>
            <li><button onClick={() => setActiveTab('favorites')}>Saved Wishlist</button></li>
            <li><button onClick={() => setActiveTab('about')}>About Hybrid Search</button></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Popular Categories</h4>
          <ul className="footer-links">
            <li><button onClick={() => { setCategoryFilter('Electronics'); setActiveTab('search'); }}>Electronics</button></li>
            <li><button onClick={() => { setCategoryFilter('Home & Kitchen'); setActiveTab('search'); }}>Home &amp; Kitchen</button></li>
            <li><button onClick={() => { setCategoryFilter('Apparel & Clothing'); setActiveTab('search'); }}>Apparel &amp; Clothing</button></li>
            <li><button onClick={() => { setCategoryFilter('Books & Stationery'); setActiveTab('search'); }}>Books &amp; Stationery</button></li>
            <li><button onClick={() => { setCategoryFilter('Beauty & Personal Care'); setActiveTab('search'); }}>Beauty &amp; Personal Care</button></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Zainab Online Shopping. All rights reserved.</span>
        <span>CPU-Only Intelligent Product Discovery</span>
      </div>
    </footer>
  );
}
