import React, { useState, useEffect } from 'react';
import { Flame, LayoutGrid, Activity, Monitor, Clock } from 'lucide-react';
import FenixPlanning from './components/FenixPlanning';
import ProjectsBoard from './components/ProjectsBoard';
import { INITIAL_PROJECTS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState('fenix');
  const [projects] = useState(INITIAL_PROJECTS);
  const [slideTimer, setSlideTimer] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (slideTimer <= 0) {
      setActiveTab(prev => (prev === 'fenix' ? 'projects' : 'fenix'));
      setSlideTimer(15);
    }
  }, [slideTimer]);

  const progressPercent = Math.min(100, Math.max(0, ((15 - slideTimer) / 15) * 100));

  return (
    <div className="dashboard-frame">
      <div className="dashboard-main">
        {/* Sleek Top Progress Line */}
        <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'var(--orange-primary)',
              transition: 'width 1s linear'
            }}
          ></div>
        </div>

        {/* Minimalist Executive Header */}
        <header className="dashboard-header">
          <div className="brand-badge">
            <div className="brand-icon-wrapper">
              <Activity size={20} />
            </div>
            <div>
              <div className="brand-title">
                HUGIN CONTROL CENTER
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', borderRadius: '6px', color: 'var(--orange-primary)', fontWeight: 700 }}>
                  EQUIPO FÉNIX
                </span>
              </div>
              <div className="brand-subtitle">
                Panel Operativo y de Proyectos
              </div>
            </div>
          </div>

          {/* Minimalist Nav Tabs */}
          <div className="nav-tabs">
            <button
              className={`tab-btn ${activeTab === 'fenix' ? 'active' : ''}`}
              onClick={() => { setActiveTab('fenix'); setSlideTimer(15); }}
            >
              <Flame size={18} /> Planificación Fénix
            </button>
            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => { setActiveTab('projects'); setSlideTimer(15); }}
            >
              <LayoutGrid size={18} /> Proyectos Activos ({projects.length})
            </button>
          </div>

          {/* Minimalist Projection Status Badge */}
          <div
            style={{
              background: 'var(--bg-inner)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Monitor size={18} color="var(--orange-primary)" />
              <span style={{ position: 'absolute', top: -1, right: -1, width: 6, height: 6, borderRadius: '50%', background: 'var(--orange-primary)' }}></span>
            </div>
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.1 }}>
                Proyección TV
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                <Clock size={12} color="var(--orange-primary)" /> Rotación: <strong style={{ color: 'var(--orange-primary)', fontFamily: 'var(--font-mono)' }}>{slideTimer}s</strong>
              </div>
            </div>
          </div>
        </header>

        {/* Board Body Content */}
        <main className="dashboard-content">
          {activeTab === 'fenix' ? (
            <FenixPlanning />
          ) : (
            <ProjectsBoard projects={projects} />
          )}
        </main>
      </div>
    </div>
  );
}



