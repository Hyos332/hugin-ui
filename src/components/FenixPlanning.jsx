import React, { useState, useEffect } from 'react';
import { Calendar, Target, Clock, MapPin, Sparkles, CheckCircle2, Users, FileText } from 'lucide-react';
import BusTUSWidget from './BusTUSWidget';
import { INITIAL_REVIEW, INITIAL_SPRINT_GOAL } from '../data/initialData';

export default function FenixPlanning() {
  const [review] = useState(INITIAL_REVIEW);
  const [sprintGoal] = useState(INITIAL_SPRINT_GOAL);
  const [timeLeft, setTimeLeft] = useState({ days: 8, hours: 2, minutes: 53, seconds: 38 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(review.targetDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 8, hours: 2, minutes: 53, seconds: 38 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [review.targetDate]);

  return (
    <div className="fenix-grid">
      {/* COLUMN 1: Próximo Sprint Planning / Review */}
      <div className="dash-card dash-card-orange" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '18px 20px' }}>
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '14px' }}>
            <div style={{ background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '10px', borderRadius: '10px', color: 'var(--orange-primary)' }}>
              <Calendar size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--orange-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                REVISIÓN DE SPRINT
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                {review.title}
              </h3>
            </div>
          </div>

          <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={17} color="var(--orange-primary)" />
            <span>TIEMPO RESTANTE</span>
          </div>

          {/* Countdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--orange-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.days}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>Días</div>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.hours}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>Horas</div>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.minutes}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>Mins</div>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--orange-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.seconds}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--orange-primary)', textTransform: 'uppercase', marginTop: '4px' }}>Segs</div>
            </div>
          </div>

          {/* Details List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '12px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.02rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <Clock size={18} color="var(--orange-primary)" />
              <span><strong>Horario:</strong> {review.scheduleText}</span>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '12px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.02rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <MapPin size={18} color="var(--orange-primary)" />
              <span><strong>Ubicación:</strong> {review.location}</span>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '12px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.02rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <Users size={18} color="var(--orange-primary)" />
              <span><strong>Convocados:</strong> Equipo Fénix + Product Owner</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Estado del Sprint:</span>
          <span style={{ color: 'var(--orange-primary)', fontWeight: 800 }}>En Progreso (Semana 2)</span>
        </div>
      </div>

      {/* COLUMN 2: Objetivo del Sprint & Entregables Clave */}
      <div className="dash-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '18px 20px', borderLeft: '4px solid var(--orange-primary)' }}>
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '10px', borderRadius: '10px', color: 'var(--orange-primary)' }}>
                <Target size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--orange-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  INICIATIVA CLAVE
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  {sprintGoal.title}
                </h3>
              </div>
            </div>
            <span style={{ background: 'var(--orange-subtle)', color: 'var(--orange-primary)', border: '1px solid var(--orange-border)', fontWeight: 800, fontSize: '0.95rem', padding: '5px 12px', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}>
              {sprintGoal.code}
            </span>
          </div>

          {/* Quote Block */}
          <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--orange-primary)', padding: '16px 18px', borderRadius: '10px', marginBottom: '14px' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 600, margin: 0 }}>
              "{sprintGoal.description}"
            </p>
          </div>

          {/* Entregables List */}
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Entregables Clave del Sprint:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sprintGoal.deliverables && sprintGoal.deliverables.length > 0 ? (
              sprintGoal.deliverables.map((item) => (
                <div key={item.id} style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.02rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={18} color="#4ade80" />
                  <span><strong>{item.tag}:</strong> {item.title}</span>
                </div>
              ))
            ) : (
              <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.02rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <CheckCircle2 size={18} color="#4ade80" />
                <span>Sprint Goal actualizado</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.98rem' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Resp: Equipo Desarrollo Fénix</span>
          <span style={{ color: 'var(--orange-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Prioridad Alta
          </span>
        </div>
      </div>

      {/* COLUMN 3: Bus TUS Santander Paradas 488 y 487 */}
      <div style={{ height: '100%' }}>
        <BusTUSWidget />
      </div>
    </div>
  );
}

