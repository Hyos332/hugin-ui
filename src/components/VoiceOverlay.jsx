import React, { useEffect } from 'react';
import { Activity, Sparkles, Zap } from 'lucide-react';

const themeIcons = {
  fenix: Activity,
  party: Sparkles,
  wake: Zap
};

export default function VoiceOverlay({ command, onDone }) {
  useEffect(() => {
    const timeout = setTimeout(onDone, 8500);
    return () => clearTimeout(timeout);
  }, [command.id, onDone]);

  const Icon = themeIcons[command.intent] || Sparkles;
  const particles = Array.from({ length: 22 }, (_, index) => index);

  return (
    <div className={`voice-overlay voice-theme-${command.theme || 'cyan'}`} aria-live="polite">
      <div className="voice-vignette"></div>
      <div className="voice-rings">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="voice-particles" aria-hidden="true">
        {particles.map((particle) => (
          <i key={particle} style={{ '--particle-index': particle }}></i>
        ))}
      </div>

      <div className="voice-command-card">
        <div className="voice-command-icon">
          <Icon size={54} strokeWidth={2.4} />
        </div>
        <div className="voice-command-kicker">Comando recibido</div>
        <div className="voice-command-title">{command.message}</div>
        {command.phrase ? (
          <div className="voice-command-phrase">"{command.phrase}"</div>
        ) : null}
      </div>
    </div>
  );
}
