import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Eraser, Flame, LayoutGrid, Mic, MicOff, Radio, Send, Sparkles, Volume2, Zap } from 'lucide-react';
import { VOICE_COMMANDS, matchVoiceCommand, withAssistantReply } from '../lib/voiceCommands';

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
  const [micPermission, setMicPermission] = useState('unknown');
  const [diagnostic, setDiagnostic] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [status, setStatus] = useState('Listo');

  const SpeechRecognition = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }, []);

  const hasMicrophoneApi = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return Boolean(navigator.mediaDevices?.getUserMedia);
  }, []);

  const isSecureControl = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.isSecureContext || ['localhost', '127.0.0.1'].includes(window.location.hostname);
  }, []);

  const supportDiagnostic = SpeechRecognition
    ? ''
    : 'Este navegador no trae reconocimiento de voz. Prueba Chrome en Android o Chrome/Edge en PC.';

  const speakReply = useCallback((reply) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis || !reply) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = 'es-ES';
    utterance.rate = 1.04;
    utterance.pitch = 0.92;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  async function unlockMicrophone() {
    setDiagnostic('');

    if (!isSecureControl) {
      setMicPermission('blocked');
      setStatus('Necesita HTTPS');
      setDiagnostic('En movil, el micro solo funciona en HTTPS. En PC tambien funciona si abres /control desde localhost.');
      return false;
    }

    if (!hasMicrophoneApi) {
      setMicPermission('blocked');
      setStatus('Micro no disponible');
      setDiagnostic('Este navegador no expone acceso al microfono. Prueba Chrome o Edge.');
      return false;
    }

    try {
      setStatus('Pidiendo permiso');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicPermission('granted');
      setStatus('Micro listo');
      return true;
    } catch (error) {
      setMicPermission('blocked');
      setStatus('Permiso denegado');
      setDiagnostic(error?.name === 'NotAllowedError'
        ? 'Has denegado el micro. Activalo en permisos del navegador para este sitio.'
        : 'No pude abrir el microfono del dispositivo.');
      return false;
    }
  }

  const sendCommand = useCallback(async (command) => {
    const commandWithReply = withAssistantReply(command);
    const payload = {
      ...commandWithReply,
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
    speakReply(payload.reply);
    setStatus('Enviado');
    window.setTimeout(() => setStatus('Listo'), 1200);
  }, [speakReply]);

  const sendPhrase = useCallback((rawPhrase) => {
    const trimmedPhrase = rawPhrase.trim();
    if (!trimmedPhrase) return;
    const command = matchVoiceCommand(trimmedPhrase);
    sendCommand(command);
    setPhrase('');
    setTranscript('');
  }, [sendCommand]);

  useEffect(() => {
    if (!SpeechRecognition) {
      return undefined;
    }

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

    recognition.onerror = (event) => {
      const errorMessages = {
        'not-allowed': 'El navegador bloqueo el micro. Revisa permisos del sitio.',
        'audio-capture': 'No encuentro ningun microfono activo.',
        network: 'El reconocimiento de voz necesita conexion del navegador.',
        'no-speech': 'No escuche nada. Dale otra vez y habla cerquita.'
      };

      setStatus('Micro bloqueado');
      setDiagnostic(errorMessages[event.error] || 'No pude arrancar el reconocimiento de voz.');
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
  }, [SpeechRecognition, sendPhrase]);

  async function toggleListening() {
    if (!recognitionRef.current) {
      setStatus('Micrófono no disponible');
      if (!SpeechRecognition) {
        setDiagnostic('Tu navegador no soporta SpeechRecognition. Usa Chrome/Edge o escribe la frase abajo.');
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    if (micPermission !== 'granted') {
      const unlocked = await unlockMicrophone();
      if (!unlocked) return;
    }

    try {
      recognitionRef.current.start();
    } catch {
      setStatus('Ya estaba escuchando');
    }
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
          <button className={`mic-orb ${isListening ? 'active' : ''} ${micPermission === 'blocked' ? 'blocked' : ''}`} type="button" onClick={toggleListening}>
            {micPermission === 'blocked' ? <MicOff size={54} strokeWidth={2.2} /> : <Mic size={54} strokeWidth={2.2} />}
          </button>

          <div className="transcript-box">
            <span>{transcript || lastCommand?.reply || lastCommand?.phrase || 'Toca el micro y acepta el permiso'}</span>
          </div>

          {diagnostic || supportDiagnostic ? (
            <div className="mic-diagnostic">{diagnostic || supportDiagnostic}</div>
          ) : null}

          <div className="control-actions">
            <button type="button" onClick={unlockMicrophone}>
              <Mic size={18} />
              Activar micro
            </button>
            <button
              className={voiceEnabled ? 'active' : ''}
              type="button"
              onClick={() => setVoiceEnabled(prev => !prev)}
            >
              <Volume2 size={18} />
              Voz Hugin
            </button>
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
