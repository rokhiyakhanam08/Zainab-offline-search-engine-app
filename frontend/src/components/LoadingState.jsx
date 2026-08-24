
import React from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

export default function LoadingState({ loading, error, isEmpty, query }) {
  if (loading) {
    return (
      <div className="loading-indicator">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Searching offline database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state glass-panel" style={{ borderLeft: '4px solid #ef4444' }}>
        <AlertCircle size={40} color="#ef4444" />
        <h3 className="empty-state-title" style={{ color: '#ef4444' }}>Search Error</h3>
        <p className="empty-state-subtitle">{error}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="empty-state glass-panel">
        <HelpCircle size={40} color="var(--text-muted)" />
        <h3 className="empty-state-title">No matches found</h3>
        <p className="empty-state-subtitle">
          We couldn't find any results for "{query}". Try checking your spelling or adjusting filters.
        </p>
      </div>
    );
  }

  return null;
}
