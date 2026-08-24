import React from 'react';
import { ShoppingBag, Cpu, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ textAlignment: 'center', marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '0.6rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '16px', marginBottom: '1rem' }}>
          <ShoppingBag size={32} />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          Zainab Online Shopping
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Quality Products &amp; CPU-Only Offline Intelligent Search
        </p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '2.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
          About Our Store
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '1.25rem' }}>
          Zainab Online Shopping is designed to make product discovery fast, effortless, and accessible. Whether you are searching for precise brand SKUs, general categories, or describing what you need in plain English, our intelligent search engine brings the right items to your screen instantly.
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.98rem' }}>
          Our store operates with complete privacy and zero external cloud reliance. All query processing, vector embeddings, and database scans happen locally on the server CPU.
        </p>
      </div>

      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
        How Our Hybrid Search Engine Works
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={18} /> 1. Exact Matching (30%)
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Checks for exact text equality across product titles, brand names, and SKUs to prioritize specific item requests.
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={18} /> 2. Partial Prefix (20%)
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Matches word boundaries and prefix terms as you type, providing instant autocomplete suggestions.
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={18} /> 3. Trigram Fuzzy (20%)
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Forgives spelling mistakes and typos using PostgreSQL pg_trgm similarity calculations.
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={18} /> 4. ONNX Vector Embeddings (30%)
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Uses a local MiniLM neural network model to compute 384-dimensional cosine vector similarity via pgvector.
          </p>
        </div>
      </div>
    </div>
  );
}
