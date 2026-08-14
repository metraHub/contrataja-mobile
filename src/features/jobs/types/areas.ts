export const AREAS_ATUACAO = [
  'Tecnologia',
  'Comercial',
  'Saude',
  'Educacao',
  'Engenharia',
  'Logistica',
  'Construcao Civil',
  'Administrativo',
  'Financeiro',
  'Marketing',
  'Juridico',
  'Recursos Humanos',
  'Gastronomia',
  'Limpeza e Conservacao',
  'Seguranca',
  'Transporte',
  'Industria',
  'Varejo',
  'Eventos',
  'Outros',
] as const;

export type AreaAtuacao = (typeof AREAS_ATUACAO)[number];
