export const VOICE_COMMANDS = [
  {
    id: 'wake',
    intent: 'wake',
    label: 'Hugin despierta',
    message: 'HUGIN ONLINE',
    phrase: 'hugin despierta',
    theme: 'cyan',
    aliases: ['hugin despierta', 'ugin despierta', 'hey hugin', 'oye hugin', 'hugin online']
  },
  {
    id: 'fenix',
    intent: 'fenix',
    label: 'Alerta Fénix',
    message: 'EQUIPO FENIX EN PANTALLA',
    phrase: 'alerta fenix',
    theme: 'orange',
    aliases: ['alerta fenix', 'modo fenix', 'equipo fenix', 'llama a fenix']
  },
  {
    id: 'party',
    intent: 'party',
    label: 'Modo fiesta',
    message: 'MODO CELEBRACION',
    phrase: 'modo fiesta',
    theme: 'green',
    aliases: ['modo fiesta', 'celebracion', 'celebración', 'vamos equipo', 'fiesta']
  },
  {
    id: 'projects',
    intent: 'projects',
    label: 'Ver proyectos',
    message: 'PROYECTOS ACTIVOS',
    phrase: 'mostrar proyectos',
    theme: 'purple',
    aliases: ['mostrar proyectos', 'ver proyectos', 'proyectos activos', 'abre proyectos']
  },
  {
    id: 'planning',
    intent: 'planning',
    label: 'Ver planificación',
    message: 'PLANIFICACION FENIX',
    phrase: 'mostrar planificacion',
    theme: 'cyan',
    aliases: ['mostrar planificacion', 'mostrar planificación', 'ver planificacion', 'ver planificación', 'abre planificacion', 'abre planificación']
  },
  {
    id: 'next',
    intent: 'next',
    label: 'Siguiente panel',
    message: 'CAMBIO DE PANEL',
    phrase: 'siguiente panel',
    theme: 'blue',
    aliases: ['siguiente panel', 'cambia panel', 'cambiar panel', 'siguiente pantalla']
  },
  {
    id: 'clear',
    intent: 'clear',
    label: 'Limpiar pantalla',
    message: 'LIMPIAR PANTALLA',
    phrase: 'limpiar pantalla',
    theme: 'cyan',
    aliases: ['limpiar pantalla', 'quita efecto', 'cerrar efecto', 'normal']
  }
];

export function normalizeVoiceText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchVoiceCommand(rawPhrase) {
  const normalizedPhrase = normalizeVoiceText(rawPhrase);

  const command = VOICE_COMMANDS.find((item) =>
    item.aliases.some((alias) => normalizedPhrase.includes(normalizeVoiceText(alias)))
  );

  if (command) {
    return {
      ...command,
      phrase: rawPhrase || command.phrase
    };
  }

  return {
    id: 'custom',
    intent: 'custom',
    label: 'Mensaje libre',
    message: normalizedPhrase ? rawPhrase.toUpperCase() : 'HUGIN ONLINE',
    phrase: rawPhrase,
    theme: 'cyan'
  };
}
