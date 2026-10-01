// Calculate next Sprint Planning / Review (Thursdays every 2 weeks at 14:30:00, next on Oct 15 2026)
const getNextSprintReview = () => {
  const baseDate = new Date('2026-10-15T14:30:00');
  const now = new Date();
  if (now <= baseDate) {
    return baseDate.toISOString();
  }
  const msPerTwoWeeks = 14 * 24 * 60 * 60 * 1000;
  const elapsedMs = now.getTime() - baseDate.getTime();
  const intervalsPassed = Math.ceil(elapsedMs / msPerTwoWeeks);
  const nextDate = new Date(baseDate.getTime() + intervalsPassed * msPerTwoWeeks);
  return nextDate.toISOString();
};

export const INITIAL_REVIEW = {
  id: 'review-1',
  title: 'Próximo Sprint Planning / Review',
  targetDate: getNextSprintReview(),
  scheduleText: 'Los jueves cada 2 semanas a las 14:30',
  location: 'Sala de Reuniones Fénix / Pantalla Principal'
};

export const INITIAL_SPRINT_GOAL = {
  id: 'sprint-goal-1',
  code: 'SPRINT-ACTUAL',
  title: 'Objetivo del Sprint',
  description: 'Resolver incidencias de la plataforma MLS, levantar el nuevo módulo de historial dietético en el backend, diseñar los mockups de historial dietético y clínico, y avanzar con el Entregable #7 de Residencia Nuevo.',
  deliverables: [
    { id: 'del-1', tag: 'MLS', title: 'Resolución de incidencias de la plataforma' },
    { id: 'del-2', tag: 'NUTRIX Backend', title: 'Módulo de Historial Dietético' },
    { id: 'del-3', tag: 'Diseño / UI', title: 'Mockups de Historial Dietético y Clínico' },
    { id: 'del-4', tag: 'Residencia Nuevo', title: 'Entregable #7' },
  ]
};

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    code: 'NUTRIX',
    title: 'NUTRIX',
    version: 'v1.1.0',
    status: 'en_desarrollo',
    lastUpdate: '31/06/2026',
    nextDeploy: '02/10/2026',
    color: 'mint',
    rotation: -1.5,
  },
  {
    id: 'proj-2',
    code: 'MLS',
    title: 'MLS',
    version: 'OJS 3.4',
    status: 'soporte',
    lastUpdate: '06/2025',
    nextDeploy: '12/2026',
    color: 'blue',
    rotation: 1.2,
  },
  {
    id: 'proj-3',
    code: 'NUTRIX-LEG',
    title: 'Nutrix Legacy',
    version: 'BD Sync',
    status: 'soporte',
    lastUpdate: '03/09/2026 (BD)',
    nextDeploy: 'Por definir (BD)',
    color: 'amber',
    rotation: -2.0,
  },
  {
    id: 'proj-4',
    code: 'RESID-LEG',
    title: 'Residencia Legacy',
    version: 'v1.5.126',
    status: 'soporte',
    lastUpdate: 'Soporte activo',
    nextDeploy: 'Solamente soporte',
    color: 'yellow',
    rotation: 1.8,
  },
  {
    id: 'proj-5',
    code: 'RESID-NUEVO',
    title: 'Residencia Nuevo',
    version: 'Entregable 7',
    status: 'en_progreso',
    lastUpdate: 'Entregable 7',
    nextDeploy: '10/2026 (Tentativo)',
    color: 'pink',
    rotation: -1.0,
  },
  {
    id: 'proj-6',
    code: 'MAHINE',
    title: 'MAHINE',
    version: 'v0.1.0 (Dev)',
    status: 'en_desarrollo',
    lastUpdate: 'En desarrollo...',
    nextDeploy: '30/09/2026 (Tentativo)',
    color: 'mint',
    rotation: 2.2,
  }
];

export const TARGET_BUS_STOPS = [
  { id: '488', name: 'Pctcan (UNEATLANTICO)', linesHint: 'L1' },
  { id: '487', name: 'Pctcan 1', linesHint: 'L1, L13' }
];

