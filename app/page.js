'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Monitor,
  CheckCircle2,
  PlusCircle,
  Clock,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Simulate 48-hour automation check
    const interval = setInterval(() => {
      refreshData();
    }, 172800000); // 48 hours (48 * 60 * 60 * 1000)

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    try {
      await fetch('/api/events', { method: 'PATCH' });
      await fetchEvents();
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date.split(' – ')[0].split(' – ')[0]);
      const dateB = new Date(b.date.split(' – ')[0].split(' – ')[0]);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (sortConfig.key === 'status') {
      const statusWeight = {
        'to_be_applied': 1,
        'not_applied': 2,
        'applied': 3
      };
      const weightA = statusWeight[a.status] || 99;
      const weightB = statusWeight[b.status] || 99;
      return sortConfig.direction === 'asc' ? weightA - weightB : weightB - weightA;
    }

    const valA = a[sortConfig.key] || '';
    const valB = b[sortConfig.key] || '';

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredEvents = sortedEvents.filter(event => {
    const matchesTab = activeTab === 'All' || event.type === activeTab;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toBeAppliedEvents = events.filter(e => e.status === 'to_be_applied');

  const stats = {
    total: events.length,
    upcoming: events.filter(e => new Date(e.date) > new Date()).length,
    virtual: events.filter(e => e.type === 'Virtual').length,
    applied: events.filter(e => e.status === 'applied').length
  };

  if (loading) return <div className="loading-screen">Loading SAP Events...</div>;

  return (
    <main className="dashboard">
      {/* Header */}
      <header className="header glass-panel">
        <div className="header-left">
          <h1 className="gradient-text">SAP Events</h1>
          <div className="last-updated">
            <Clock size={14} />
            <span>Last synced: {lastRefreshed} (Auto-syncs every 48 hours)</span>
          </div>
        </div>
        <div className="header-actions">
          <div className="search-box glass-panel">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search events or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={refreshData} className="refresh-btn glass-panel">
            Refresh Now
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-grid">
        <StatCard label="Total Events" value={stats.total} icon={<Calendar className="text-blue" />} />
        <StatCard label="Upcoming" value={stats.upcoming} icon={<Clock className="text-purple" />} />
        <StatCard label="Virtual" value={stats.virtual} icon={<Monitor className="text-green" />} />
        <StatCard label="Applied" value={stats.applied} icon={<CheckCircle2 className="text-blue" />} />
      </section>

      <div className="main-content">
        {/* Explore Section */}
        <section className="explore-section">
          <div className="section-header">
            <h2>Explore Events <span className="results-count">({filteredEvents.length} results)</span></h2>
            <div className="tabs">
              {['All', 'In-Person', 'Virtual', 'Hybrid'].map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="events-table glass-panel">
            <div className="table-header">
              <div className="col sortable" onClick={() => requestSort('date')}>
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </div>
              <div className="col sortable" onClick={() => requestSort('title')}>
                Event Name {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </div>
              <div className="col sortable" onClick={() => requestSort('location')}>
                Location {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </div>
              <div className="col sortable" onClick={() => requestSort('status')}>
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </div>
              <div className="col">Link</div>
            </div>
            <div className="table-body">
              {filteredEvents.map((event) => (
                <div key={event.id} className="table-row">
                  <div className="col date">{event.date}</div>
                  <div className="col title">
                    <span className="event-title-text">{event.title}</span>
                  </div>
                  <div className="col location">
                    <span className="badge">{event.type}</span>
                    <MapPin size={12} className="loc-pin" />
                    <span className="loc-text">{event.location}</span>
                  </div>
                  <div className="col status">
                    <select
                      value={event.status}
                      onChange={(e) => updateStatus(event.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="not_applied">Not Applied</option>
                      <option value="applied">Applied</option>
                      <option value="to_be_applied">To be Applied</option>
                    </select>
                  </div>
                  <div className="col action">
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className="apply-link">
                      Apply <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* To Be Applied Section - Moves here */}
        <aside className="watchlist-section">
          <div className="section-header">
            <h2>Tracked (To Be Applied)</h2>
            <span className="count-badge">{toBeAppliedEvents.length}</span>
          </div>
          <div className="watchlist-scroll">
            {toBeAppliedEvents.length === 0 ? (
              <div className="empty-state glass-panel">
                <PlusCircle size={32} />
                <p>No events in watchlist. Mark some as "To be Applied".</p>
              </div>
            ) : (
              toBeAppliedEvents.map(event => (
                <div key={event.id} className="event-card glass-panel">
                  <div className="card-top">
                    <span className="card-badge">{event.type}</span>
                    <button className="remove-btn" onClick={() => updateStatus(event.id, 'not_applied')}>×</button>
                  </div>
                  <h3>{event.title}</h3>
                  <div className="card-meta">
                    <div className="meta-item"><Calendar size={14} /> {event.date}</div>
                    <div className="meta-item"><MapPin size={14} /> {event.location}</div>
                  </div>
                  <div className="card-spacer"></div>
                  <div className="card-actions">
                    <button
                      className="mark-applied-btn"
                      onClick={() => updateStatus(event.id, 'applied')}
                    >
                      Mark as Applied
                    </button>
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className="details-link">
                      Details <ChevronRight size={16} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      <style jsx>{`
        .dashboard {
          padding: 2rem;
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
        }

        .header-left h1 {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .last-updated {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.6rem 1rem;
          width: 300px;
        }

        .search-box input {
          background: none;
          border: none;
          color: white;
          width: 100%;
          outline: none;
        }

        .refresh-btn {
          padding: 0.6rem 1.2rem;
          font-weight: 600;
          color: var(--primary);
          transition: all 0.2s;
        }

        .refresh-btn:hover {
          background: rgba(59, 130, 246, 0.1);
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .main-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          align-items: start;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.4rem;
          font-weight: 700;
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.3rem;
          border-radius: 8px;
        }

        .tab-btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: var(--primary);
          color: white;
        }

        .events-table {
          overflow: hidden;
          max-height: 800px;
          display: flex;
          flex-direction: column;
        }

        .table-body {
          overflow-y: auto;
          flex: 1;
        }

        .results-count {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 400;
          margin-left: 0.5rem;
        }

        .table-row {
          display: grid;
          grid-template-columns: 180px 1fr 300px 220px 120px;
          padding: 1.2rem;
          align-items: center;
          border-bottom: 1px solid var(--card-border);
          transition: background 0.2s;
        }

        .table-header {
          display: grid;
          grid-template-columns: 180px 1fr 300px 220px 120px;
          padding: 1.2rem;
          background: rgba(255, 255, 255, 0.02);
          font-weight: 500;
          color: var(--text-muted);
          font-size: 0.9rem;
          border-bottom: 1px solid var(--card-border);
        }

        .col.status {
          padding-right: 2rem;
        }

        .col.location {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .loc-pin {
          color: var(--text-muted);
          min-width: 12px;
        }

        .loc-text {
          color: var(--text-muted);
          font-size: 0.9rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .col.index {
          color: var(--text-muted);
          font-size: 0.8rem;
          font-family: monospace;
        }

        .event-title-text {
          line-height: 1.4;
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-header .col {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .col.sortable {
          cursor: pointer;
          user-select: none;
          transition: color 0.2s;
        }

        .col.sortable:hover {
          color: var(--primary);
        }

        .date {
          font-weight: 700;
          color: #3b82f6;
          font-size: 1rem;
        }

        .title {
          font-weight: 700;
          color: white;
          padding-right: 1rem;
        }

        .badge {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: #a1a1aa;
          white-space: nowrap;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .status-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--card-border);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          outline: none;
          width: 100%;
        }

        .apply-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #3b82f6;
          font-weight: 700;
          font-size: 1rem;
          transition: opacity 0.2s;
        }

        .apply-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .watchlist-section {
          position: sticky;
          top: 2rem;
        }

        .count-badge {
          background: var(--secondary);
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .watchlist-scroll {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: calc(100vh - 250px);
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .event-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform 0.2s;
        }

        .event-card:hover {
          transform: translateX(-5px);
          border-color: var(--secondary);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--secondary);
        }

        .remove-btn {
          font-size: 1.5rem;
          color: var(--text-muted);
          transition: color 0.2s;
        }

        .remove-btn:hover {
          color: #ef4444;
        }

        .event-card h3 {
          font-size: 1.1rem;
          line-height: 1.4;
        }

        .card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }

        .mark-applied-btn {
          background: var(--primary);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .details-link {
          display: flex;
          align-items: center;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .empty-state {
          padding: 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--text-muted);
        }

        .loading-screen {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 700;
          background: var(--background);
        }

        @media (max-width: 1200px) {
          .main-content {
            grid-template-columns: 1fr;
          }
          .watchlist-section {
            position: static;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </main>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card glass-panel">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <style jsx>{`
        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.2s;
        }
        .stat-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .stat-icon {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          margin-top: 0.2rem;
        }
      `}</style>
    </div>
  );
}
