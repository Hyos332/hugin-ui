// Calculate next Sprint Planning / Review (Wednesday, Sept 30 2026 at 16:00:00)
const getNextSprintReview = () => {
  const target = new Date('2026-09-30T16:00:00');
  return target.toISOString();
};

export const INITIAL_REVIEW = {
  id: 'review-1',
  title: 'Próximo Sprint Planning / Review',
  targetDate: getNextSprintReview(),
  scheduleText: 'Los miércoles cada 2 semanas a las 16:00',
  location: 'Sala de Reuniones Fénix / Pantalla Principal'
};

export const INITIAL_SPRINT_GOAL = {
  id: 'sprint-goal-1',
  code: 'SPRINT-ACTUAL',
  title: 'Objetivo del Sprint',
  description: 'Lanzar una primera aproximación del proyecto MAHINE y actualizar la base de datos de NUTRIX nuevo para incluir diferentes fuentes de alimentos.',
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
    version: 'Entregable 5',
    status: 'en_progreso',
    lastUpdate: 'Entregable 5',
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

