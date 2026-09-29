import React from 'react';
import { Calendar, Clock, GitBranch } from 'lucide-react';

export default function ProjectCard({ project }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_desarrollo':
        return { label: 'En Desarrollo', className: 'badge-en_desarrollo', dotClass: 'dot-green' };
      case 'en_progreso':
        return { label: 'En Progreso', className: 'badge-en_progreso', dotClass: 'dot-purple' };
      case 'soporte':
        return { label: 'Soporte / Mant.', className: 'badge-soporte', dotClass: 'dot-amber' };
      case 'en_revision':
        return { label: 'En Revisión', className: 'badge-en_revision', dotClass: 'dot-amber' };

      case 'completado':
        return { label: 'Completado', className: 'badge-completado', dotClass: 'dot-blue' };
      case 'bloqueado':
        return { label: 'Bloqueado', className: 'badge-bloqueado', dotClass: 'dot-red' };
      case 'planificado':
        return { label: 'Planificado', className: 'badge-planificado', dotClass: 'dot-purple' };
      default:
        return { label: status, className: 'badge-en_progreso', dotClass: 'dot-green' };
    }
  };

  const statusInfo = getStatusBadge(project.status);

  return (
    <div
      className="dash-card"
      style={{
        padding: '16px 20px',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '4px solid var(--orange-primary)'
      }}
    >
      {/* Header: Code & Status */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--orange-bright)', background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '4px 14px', borderRadius: '6px', fontWeight: 800 }}>
            #{project.code}
          </span>
          <span className={`status-badge ${statusInfo.className}`} style={{ fontSize: '1.15rem', padding: '6px 16px' }}>
            <span className={`status-dot ${statusInfo.dotClass}`} style={{ width: 11, height: 11 }}></span>
            {statusInfo.label}
          </span>
        </div>

        {/* Project Title */}
        <h3 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '12px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
          {project.title}
        </h3>

        {/* Version Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: '8px', fontSize: '1.22rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          <GitBranch size={20} color="var(--orange-primary)" />
          <span>Versión {project.version}</span>
        </div>
      </div>

      {/* Dates Section */}
      <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '12px 16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.18rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Clock size={18} color="var(--orange-primary)" /> Úl. Actualización:
          </span>
          <strong style={{ fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '1.32rem' }}>{project.lastUpdate}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.18rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: 700 }}>
            <Calendar size={18} color="#4ade80" /> Sig. Despliegue:
          </span>
          <strong style={{ fontWeight: 800, color: '#4ade80', fontFamily: 'var(--font-mono)', fontSize: '1.32rem' }}>{project.nextDeploy}</strong>
        </div>
      </div>
    </div>
  );
}




