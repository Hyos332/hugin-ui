export const VOICE_COMMANDS = [
  {
    id: 'wake',
    intent: 'wake',
    label: 'Hugin despierta',
    message: 'HUGIN ONLINE',
    phrase: 'hugin despierta',
    theme: 'cyan',
    replies: [
      'Ya estoy despierto, joder. A ver que inventamos ahora.',
      'Hugin online. Me han invocado y vengo con actitud.',
      'Sistema despierto. Esto empieza a ponerse guapo.'
    ],
    aliases: ['hugin despierta', 'ugin despierta', 'hey hugin', 'oye hugin', 'hugin online']
  },
  {
    id: 'fenix',
    intent: 'fenix',
    label: 'Alerta Fénix',
    message: 'EQUIPO FENIX EN PANTALLA',
    phrase: 'alerta fenix',
    theme: 'orange',
    replies: [
      'Fenix al frente. Que se aparten los bugs, carajo.',
      'Modo Fenix activado. Esto huele a sprint intenso.',
      'Equipo Fenix en pantalla. Vamos a prender esta mierda con estilo.'
    ],
    aliases: ['alerta fenix', 'modo fenix', 'equipo fenix', 'llama a fenix']
  },
  {
    id: 'party',
    intent: 'party',
    label: 'Modo fiesta',
    message: 'MODO CELEBRACION',
    phrase: 'modo fiesta',
    theme: 'green',
    replies: [
      'Modo fiesta activado. Productividad con flow, maldita sea.',
      'Celebracion lista. Alguien que traiga energia y cero dramas.',
      'Fiesta en el panel. Esto ya parece release sin incendios.'
    ],
    aliases: ['modo fiesta', 'celebracion', 'celebración', 'vamos equipo', 'fiesta']
  },
  {
    id: 'projects',
    intent: 'projects',
    label: 'Ver proyectos',
    message: 'PROYECTOS ACTIVOS',
    phrase: 'mostrar proyectos',
    theme: 'purple',
    replies: [
      'Proyectos activos en pantalla. Aqui esta el mapa del asunto.',
      'Abriendo proyectos. Spoiler: hay trabajo, como siempre.',
      'Lista de proyectos servida. Ordenadita, que no somos salvajes.'
    ],
    aliases: ['mostrar proyectos', 'ver proyectos', 'proyectos activos', 'abre proyectos']
  },
  {
    id: 'planning',
    intent: 'planning',
    label: 'Ver planificación',
    message: 'PLANIFICACION FENIX',
    phrase: 'mostrar planificacion',
    theme: 'cyan',
    replies: [
      'Planificacion abierta. La agenda manda, aunque duela.',
      'Volvemos a planificacion. Respira, que esto tiene estructura.',
      'Plan Fenix en pantalla. Vamos por partes, carajo.'
    ],
    aliases: ['mostrar planificacion', 'mostrar planificación', 'ver planificacion', 'ver planificación', 'abre planificacion', 'abre planificación']
  },
  {
    id: 'next',
    intent: 'next',
    label: 'Siguiente panel',
    message: 'CAMBIO DE PANEL',
    phrase: 'siguiente panel',
    theme: 'blue',
    replies: [
      'Cambio de panel. Rapido y sin llorar.',
      'Siguiente pantalla. Me muevo mas fino que un deploy bueno.',
      'Panel cambiado. Esto fluye, joder.'
    ],
    aliases: ['siguiente panel', 'cambia panel', 'cambiar panel', 'siguiente pantalla']
  },
  {
    id: 'clear',
    intent: 'clear',
    label: 'Limpiar pantalla',
    message: 'LIMPIAR PANTALLA',
    phrase: 'limpiar pantalla',
    theme: 'cyan',
    replies: [
      'Limpio. Como si aqui no hubiera pasado nada.',
      'Pantalla limpia. Elegante, sobria y sin tonterias.',
      'Efecto fuera. Volvemos al modo serio, mas o menos.'
    ],
    aliases: ['limpiar pantalla', 'quita efecto', 'cerrar efecto', 'normal']
  }
];

const fallbackReplies = [
  'Te he oido. No se si era una orden o poesia rara, pero lo pongo en pantalla.',
  'Recibido. Esto suena importante, o dramatico, que tambien vale.',
  'Vale, jefe. Lo mando a la pantalla y que el universo se apane.'
];

function pickOne(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function withAssistantReply(command) {
  return {
    ...command,
    reply: command.reply || pickOne(command.replies || fallbackReplies)
  };
}

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
    return withAssistantReply({
      ...command,
      phrase: rawPhrase || command.phrase
    });
  }

  return withAssistantReply({
    id: 'custom',
    intent: 'custom',
    label: 'Mensaje libre',
    message: normalizedPhrase ? rawPhrase.toUpperCase() : 'HUGIN ONLINE',
    phrase: rawPhrase,
    theme: 'cyan'
  });
}
