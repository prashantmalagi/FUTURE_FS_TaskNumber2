import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import { format } from 'date-fns';
import LeadModal from '../components/LeadModal';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'converted', 'lost'];
const STATUS_COLORS = { new: 'var(--blue)', contacted: 'var(--orange)', qualified: 'var(--purple)', converted: 'var(--green)', lost: 'var(--red)' };
const STATUS_BG = { new: 'var(--blue-dim)', contacted: 'var(--orange-dim)', qualified: 'var(--purple-dim)', converted: 'var(--green-dim)', lost: 'var(--red-dim)' };

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({ date: '', description: '' });

  const fetchLead = async () => {
    try {
      const res = await leadsAPI.getOne(id);
      setLead(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLead(); }, [id]);

  const updateStatus = async (status) => {
    await leadsAPI.update(id, { status });
    setLead(l => ({ ...l, status }));
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    setNoteLoading(true);
    const res = await leadsAPI.addNote(id, newNote);
    setLead(res.data);
    setNewNote('');
    setNoteLoading(false);
  };

  const deleteNote = async (noteId) => {
    const res = await leadsAPI.deleteNote(id, noteId);
    setLead(res.data);
  };

  const addFollowUp = async () => {
    if (!followUpForm.date || !followUpForm.description) return;
    const res = await leadsAPI.addFollowUp(id, followUpForm);
    setLead(res.data);
    setFollowUpForm({ date: '', description: '' });
    setShowFollowUpForm(false);
  };

  const toggleFollowUp = async (followUpId, completed) => {
    const res = await leadsAPI.updateFollowUp(id, followUpId, { completed: !completed });
    setLead(res.data);
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!lead) return <div className="page"><p>Lead not found</p></div>;

  const pendingFollowUps = lead.followUps?.filter(f => !f.completed) || [];
  const completedFollowUps = lead.followUps?.filter(f => f.completed) || [];

  return (
    <div className="lead-detail">
      <button className="back-btn" onClick={() => navigate('/leads')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Back to Leads
      </button>

      <div style={{marginTop:20,marginBottom:24,display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
            <h1 className="detail-name">{lead.name}</h1>
            {lead.company && <span className="tag">{lead.company}</span>}
          </div>
          <div className="detail-email">{lead.email}{lead.phone && ` · ${lead.phone}`}</div>
          <div className="detail-badges">
            <span className={`badge badge-${lead.status}`}>{lead.status}</span>
            <span className={`badge badge-${lead.priority}`}>{lead.priority} priority</span>
            <span className="tag">{lead.source?.replace('_',' ')}</span>
            {lead.value > 0 && <span className="tag" style={{color:'var(--accent)'}}>💰 ${lead.value.toLocaleString()}</span>}
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => setShowEdit(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit Lead
        </button>
      </div>

      {/* Status Updater */}
      <div className="card" style={{marginBottom:24}}>
        <div className="card-header"><div className="card-title">Update Status</div></div>
        <div className="card-body">
          <div className="status-selector">
            {STATUS_OPTIONS.map(s => (
              <button key={s} className="status-btn"
                style={{background: lead.status === s ? STATUS_COLORS[s] : STATUS_BG[s], color: lead.status === s ? '#000' : STATUS_COLORS[s], borderColor: STATUS_COLORS[s]}}
                onClick={() => updateStatus(s)}>
                {lead.status === s && '✓ '}{s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Left column */}
        <div>
          {/* Lead info */}
          {lead.message && (
            <div className="card" style={{marginBottom:24}}>
              <div className="card-header"><div className="card-title">Initial Message</div></div>
              <div className="card-body" style={{color:'var(--text-dim)',lineHeight:1.6}}>{lead.message}</div>
            </div>
          )}

          {/* Notes */}
          <div className="card" style={{marginBottom:24}}>
            <div className="card-header">
              <div className="card-title">Notes ({lead.notes?.length || 0})</div>
            </div>
            <div className="card-body">
              {(lead.notes || []).length === 0 ? (
                <div className="empty-state">No notes yet. Add your first note below.</div>
              ) : (
                (lead.notes || []).slice().reverse().map(note => (
                  <div className="note-item" key={note._id}>
                    <div className="note-meta">
                      <span className="note-author">{note.createdByName || 'Unknown'}</span>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <span className="note-date">{format(new Date(note.createdAt), 'MMM d, yyyy HH:mm')}</span>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => deleteNote(note._id)} style={{color:'var(--text-muted)'}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    </div>
                    <div className="note-content">{note.content}</div>
                  </div>
                ))
              )}
              <div className="note-add">
                <textarea className="form-textarea" placeholder="Add a note..." value={newNote} onChange={e => setNewNote(e.target.value)}
                  style={{flex:1,minHeight:60}} />
                <button className="btn btn-primary btn-sm" onClick={addNote} disabled={noteLoading || !newNote.trim()}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Lead details */}
          <div className="card" style={{marginBottom:24}}>
            <div className="card-header"><div className="card-title">Lead Details</div></div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Added</div>
                  <div className="info-value" style={{fontFamily:'var(--mono)',fontSize:12}}>{format(new Date(lead.createdAt), 'MMM d, yyyy')}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Updated</div>
                  <div className="info-value" style={{fontFamily:'var(--mono)',fontSize:12}}>{format(new Date(lead.updatedAt), 'MMM d, yyyy')}</div>
                </div>
                {lead.company && (
                  <div className="info-item">
                    <div className="info-label">Company</div>
                    <div className="info-value">{lead.company}</div>
                  </div>
                )}
                {lead.phone && (
                  <div className="info-item">
                    <div className="info-label">Phone</div>
                    <div className="info-value" style={{fontFamily:'var(--mono)',fontSize:12}}>{lead.phone}</div>
                  </div>
                )}
                <div className="info-item">
                  <div className="info-label">Source</div>
                  <div className="info-value">{lead.source?.replace('_',' ')}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Deal Value</div>
                  <div className="info-value" style={{color:'var(--accent)'}}>${(lead.value || 0).toLocaleString()}</div>
                </div>
              </div>
              {lead.tags?.length > 0 && (
                <div style={{marginTop:16}}>
                  <div className="info-label">Tags</div>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap',marginTop:6}}>
                    {lead.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Follow-ups */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Follow-ups ({pendingFollowUps.length} pending)</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowFollowUpForm(f => !f)}>
                {showFollowUpForm ? 'Cancel' : '+ Add'}
              </button>
            </div>
            <div className="card-body">
              {showFollowUpForm && (
                <div style={{marginBottom:16,padding:16,background:'var(--bg-3)',borderRadius:'var(--radius)',border:'1px solid var(--border)'}}>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="datetime-local" className="form-input" value={followUpForm.date} onChange={e => setFollowUpForm(f => ({...f, date: e.target.value}))} />
                  </div>
                  <div className="form-group" style={{marginBottom:12}}>
                    <label className="form-label">Description</label>
                    <input className="form-input" placeholder="What needs to be done?" value={followUpForm.description} onChange={e => setFollowUpForm(f => ({...f, description: e.target.value}))} />
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={addFollowUp}>Schedule Follow-up</button>
                </div>
              )}

              {pendingFollowUps.length === 0 && completedFollowUps.length === 0 ? (
                <div className="empty-state">No follow-ups scheduled yet.</div>
              ) : (
                <>
                  {pendingFollowUps.map(f => (
                    <div key={f._id} className="followup-item">
                      <div className="followup-check" onClick={() => toggleFollowUp(f._id, f.completed)} />
                      <div>
                        <div className="followup-date">{format(new Date(f.date), 'MMM d, yyyy HH:mm')}</div>
                        <div className="followup-desc">{f.description}</div>
                      </div>
                    </div>
                  ))}
                  {completedFollowUps.map(f => (
                    <div key={f._id} className="followup-item completed">
                      <div className="followup-check done" onClick={() => toggleFollowUp(f._id, f.completed)}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <div>
                        <div className="followup-date">{format(new Date(f.date), 'MMM d, yyyy HH:mm')}</div>
                        <div className="followup-desc" style={{textDecoration:'line-through'}}>{f.description}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEdit && <LeadModal lead={lead} onClose={() => setShowEdit(false)} onSave={(updated) => { setLead(updated); setShowEdit(false); }} />}
    </div>
  );
}
