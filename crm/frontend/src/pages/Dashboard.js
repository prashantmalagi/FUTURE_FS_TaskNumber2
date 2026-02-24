import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { dashboardAPI } from '../services/api';
import { format } from 'date-fns';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const STATUS_COLORS = {
  new: '#4d9fff', contacted: '#ff8c4d', qualified: '#c084fc', converted: '#4dff91', lost: '#ff4d4d'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:6,padding:'8px 12px',fontFamily:'var(--mono)',fontSize:12}}>
        <p style={{color:'var(--text-muted)',marginBottom:4}}>{label}</p>
        <p style={{color:'var(--accent)',fontWeight:700}}>{payload[0].value} leads</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardAPI.getStats()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!stats) return null;

  const statusData = Object.entries(stats.totals)
    .filter(([k]) => k !== 'all')
    .map(([name, value]) => ({ name, value }));

  const monthlyData = (stats.monthlyTrend || []).map(m => ({
    name: `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`,
    leads: m.count
  }));

  const conversionRate = stats.totals.all > 0
    ? ((stats.totals.converted || 0) / stats.totals.all * 100).toFixed(1)
    : 0;

  const statCards = [
    { label: 'Total Leads', value: stats.totals.all || 0, color: 'var(--accent)' },
    { label: 'New', value: stats.totals.new || 0, color: 'var(--blue)' },
    { label: 'Contacted', value: stats.totals.contacted || 0, color: 'var(--orange)' },
    { label: 'Qualified', value: stats.totals.qualified || 0, color: 'var(--purple)' },
    { label: 'Converted', value: stats.totals.converted || 0, color: 'var(--green)' },
    { label: 'Conversion %', value: `${conversionRate}%`, color: 'var(--green)' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your lead pipeline</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/leads')}>View All Leads →</button>
      </div>

      <div className="stats-grid">
        {statCards.map(s => (
          <div className="stat-card" key={s.label} style={{'--card-color': s.color}}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{color: s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-header"><div className="card-title">Lead Status Breakdown</div></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name, value}) => `${name}: ${value}`} labelLine={false}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#888'} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:6,fontFamily:'var(--mono)',fontSize:12}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Monthly Lead Trend</div></div>
          <div className="card-body">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" tick={{fontSize:11,fontFamily:'var(--mono)',fill:'var(--text-muted)'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize:11,fontFamily:'var(--mono)',fill:'var(--text-muted)'}} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="leads" fill="var(--accent)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">No trend data yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Leads</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/leads')}>View all</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Status</th><th>Added</th></tr>
            </thead>
            <tbody>
              {(stats.recentLeads || []).map(lead => (
                <tr key={lead._id} className="clickable-row" onClick={() => navigate(`/leads/${lead._id}`)}>
                  <td><div className="lead-name">{lead.name}</div></td>
                  <td style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text-muted)'}}>{lead.email}</td>
                  <td><span className={`badge badge-${lead.status}`}>{lead.status}</span></td>
                  <td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-muted)'}}>{format(new Date(lead.createdAt), 'MMM d, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
