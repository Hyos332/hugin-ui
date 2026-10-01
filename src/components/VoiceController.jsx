import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Eraser, Flame, LayoutGrid, Mic, Radio, Send, Sparkles, Zap } from 'lucide-react';
import { VOICE_COMMANDS, matchVoiceCommand } from '../lib/voiceCommands';

const iconMap = {
  wake: Zap,
  fenix: Flame,
  party: Sparkles,
  projects: LayoutGrid,
  planning: Flame,
  next: ChevronRight,
  clear: Eraser
};

export default function VoiceController() {
  const recognitionRef = useRef(null);
  const [phrase, setPhrase] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);
  const [status, setStatus] = useState('Listo');

  const SpeechRecognition = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }, []);

  useEffect(() => {
    if (!SpeechRecognition) return undefined;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setStatus('Escuchando');
    };

    recognition.onresult = (event) => {
      const nextTranscript = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ')
        .trim();
      setTranscript(nextTranscript);

      const latestResult = event.results[event.results.length - 1];
      if (latestResult?.isFinal && nextTranscript) {
        sendPhrase(nextTranscript);
      }
    };

    recognition.onerror = () => {
      setStatus('Micrófono no disponible');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus('Listo');
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [SpeechRecognition]);

  async function sendCommand(command) {
    const payload = {
      ...command,
      source: 'hugin-control'
    };

    setStatus('Enviando');
    const response = await fetch('/api/command', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setStatus('Sin conexión');
      return;
    }

    setLastCommand(payload);
    setStatus('Enviado');
    window.setTimeout(() => setStatus('Listo'), 1200);
  }

  function sendPhrase(rawPhrase) {
    const trimmedPhrase = rawPhrase.trim();
    if (!trimmedPhrase) return;
    const command = matchVoiceCommand(trimmedPhrase);
    sendCommand(command);
    setPhrase('');
    setTranscript('');
  }

  function toggleListening() {
    if (!recognitionRef.current) {
      setStatus('Micrófono no disponible');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    recognitionRef.current.start();
  }

  return (
    <div className="control-shell">
      <main className="control-panel">
        <header className="control-header">
          <div>
            <div className="control-eyebrow">
              <Radio size={17} />
              Canal local Hugin
            </div>
            <h1>Control de voz</h1>
          </div>
          <div className={`control-status ${isListening ? 'listening' : ''}`}>
            <span></span>
            {status}
          </div>
        </header>

        <section className="voice-pad">
          <button className={`mic-orb ${isListening ? 'active' : ''}`} type="button" onClick={toggleListening}>
            <Mic size={54} strokeWidth={2.2} />
          </button>

          <div className="transcript-box">
            <span>{transcript || lastCommand?.phrase || 'Hugin espera comando'}</span>
          </div>
        </section>

        <form
          className="command-form"
          onSubmit={(event) => {
            event.preventDefault();
            sendPhrase(phrase);
          }}
        >
          <input
            value={phrase}
            onChange={(event) => setPhrase(event.target.value)}
            placeholder="Escribe una frase"
            autoCapitalize="sentences"
          />
          <button type="submit" aria-label="Enviar comando">
            <Send size={22} />
          </button>
        </form>

        <section className="command-grid">
          {VOICE_COMMANDS.map((command) => {
            const Icon = iconMap[command.intent] || Sparkles;
            return (
              <button
                key={command.id}
                className={`command-tile theme-${command.theme}`}
                type="button"
                onClick={() => sendCommand(command)}
              >
                <Icon size={24} />
                <span>{command.label}</span>
              </button>
            );
          })}
        </section>
      </main>
    </div>
  );
}
