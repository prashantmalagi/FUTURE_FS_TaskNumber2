import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import { format } from 'date-fns';
import LeadModal from '../components/LeadModal';

const SOURCE_ICONS = { website: '🌐', referral: '🤝', social_media: '📱', email_campaign: '📧', cold_call: '📞', other: '📌' };

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ status: '', source: '', priority: '', search: '', page: 1, limit: 20 });
  const navigate = useNavigate();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([,v]) => v));
      const res = await leadsAPI.getAll(params);
      setLeads(res.data.leads);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleFilter = (key, value) => setFilters(f => ({ ...f, [key]: value, page: 1 }));
  const handlePage = (p) => setFilters(f => ({ ...f, page: p }));

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this lead?')) return;
    await leadsAPI.delete(id);
    fetchLeads();
  };

  const handleCreated = () => { setShowModal(false); fetchLeads(); };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">{pagination.total || 0} total leads in pipeline</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Lead
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="form-input search-input" placeholder="Search leads..." value={filters.search}
            onChange={e => handleFilter('search', e.target.value)} />
        </div>
        <select className="filter-select" value={filters.status} onChange={e => handleFilter('status', e.target.value)}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
        <select className="filter-select" value={filters.source} onChange={e => handleFilter('source', e.target.value)}>
          <option value="">All Sources</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="social_media">Social Media</option>
          <option value="email_campaign">Email Campaign</option>
          <option value="cold_call">Cold Call</option>
          <option value="other">Other</option>
        </select>
        <select className="filter-select" value={filters.priority} onChange={e => handleFilter('priority', e.target.value)}>
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          {loading ? (
            <div style={{padding:40,textAlign:'center'}}><div className="spinner" style={{margin:'0 auto'}} /></div>
          ) : leads.length === 0 ? (
            <div className="empty-state" style={{padding:48}}>No leads found. Add your first lead!</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Source</th><th>Status</th><th>Priority</th><th>Value</th><th>Added</th><th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead._id} className="clickable-row" onClick={() => navigate(`/leads/${lead._id}`)}>
                    <td>
                      <div className="lead-name">{lead.name}</div>
                      {lead.company && <div className="lead-company">{lead.company}</div>}
                    </td>
                    <td style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text-muted)'}}>{lead.email}</td>
                    <td>
                      <span>{SOURCE_ICONS[lead.source] || '📌'} </span>
                      <span style={{fontSize:12,color:'var(--text-muted)'}}>{lead.source?.replace('_',' ')}</span>
                    </td>
                    <td><span className={`badge badge-${lead.status}`}>{lead.status}</span></td>
                    <td><span className={`badge badge-${lead.priority}`}>{lead.priority}</span></td>
                    <td style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text-muted)'}}>
                      {lead.value ? `$${lead.value.toLocaleString()}` : '—'}
                    </td>
                    <td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-muted)'}}>
                      {format(new Date(lead.createdAt), 'MMM d, yy')}
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={(e) => handleDelete(e, lead._id)} title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pagination.pages > 1 && (
          <div style={{padding:'12px 24px',borderTop:'1px solid var(--border)'}}>
            <div className="pagination">
              <button className="page-btn" disabled={filters.page <= 1} onClick={() => handlePage(filters.page - 1)}>←</button>
              {Array.from({length: Math.min(pagination.pages, 7)}, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn ${filters.page === p ? 'active' : ''}`} onClick={() => handlePage(p)}>{p}</button>
              ))}
              <button className="page-btn" disabled={filters.page >= pagination.pages} onClick={() => handlePage(filters.page + 1)}>→</button>
            </div>
          </div>
        )}
      </div>

      {showModal && <LeadModal onClose={() => setShowModal(false)} onSave={handleCreated} />}
    </div>
  );
}
