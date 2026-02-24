import React, { useState } from 'react';
import { leadsAPI } from '../services/api';

const INITIAL = { name: '', email: '', phone: '', company: '', source: 'website', status: 'new', priority: 'medium', message: '', value: '', tags: '' };

export default function LeadModal({ lead, onClose, onSave }) {
  const [form, setForm] = useState(lead ? {
    ...INITIAL, ...lead, value: lead.value || '', tags: lead.tags?.join(', ') || ''
  } : INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        value: form.value ? Number(form.value) : 0,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      let res;
      if (lead?._id) {
        res = await leadsAPI.update(lead._id, payload);
      } else {
        res = await leadsAPI.create(payload);
      }
      onSave(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Error saving lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{lead ? 'Edit Lead' : 'New Lead'}</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="login-error" style={{marginBottom:16}}>{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" value={form.name} onChange={e => update('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={e => update('email', e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => update('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Company</label>
                <input className="form-input" value={form.company} onChange={e => update('company', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Source</label>
                <select className="form-select" value={form.source} onChange={e => update('source', e.target.value)}>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="email_campaign">Email Campaign</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => update('status', e.target.value)}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority} onChange={e => update('priority', e.target.value)}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deal Value ($)</label>
                <input className="form-input" type="number" min="0" value={form.value} onChange={e => update('value', e.target.value)} placeholder="0" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input className="form-input" value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="enterprise, saas, urgent" />
            </div>
            <div className="form-group">
              <label className="form-label">Message / Notes</label>
              <textarea className="form-textarea" value={form.message} onChange={e => update('message', e.target.value)} placeholder="Initial message or context..." />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (lead ? 'Save Changes' : 'Create Lead')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
