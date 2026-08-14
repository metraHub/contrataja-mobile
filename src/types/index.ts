// ==================== ENUMS ====================

export enum UserType {
  PF = 'PF',
  PJ_CONTRATANTE = 'PJ_CONTRATANTE',
  PJ_PRESTADOR = 'PJ_PRESTADOR',
  INSTITUICAO = 'INSTITUICAO',
}

export enum Gender {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  OUTRO = 'OUTRO',
}

export enum JobCallStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  HIRED = 'HIRED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum JobMatchStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  INTERVIEW = 'INTERVIEW',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}

export enum InterviewScheduleStatus {
  PROPOSED = 'PROPOSED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

export enum ServiceCallStatus {
  OPEN = 'OPEN',
  MATCHED = 'MATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SubscriptionPlan {
  BRONZE = 'BRONZE',
  PRATA = 'PRATA',
  OURO = 'OURO',
  PLATINA = 'PLATINA',
  AVULSO = 'AVULSO',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum WorkDisposition {
  REMOTO = 'REMOTO',
  PRESENCIAL = 'PRESENCIAL',
  AMBOS = 'AMBOS',
}

export enum JobWorkMode {
  REMOTO = 'REMOTO',
  PRESENCIAL = 'PRESENCIAL',
  HIBRIDO = 'HIBRIDO',
}

export enum ContractType {
  CLT = 'CLT',
  PJ = 'PJ',
  FREELANCE = 'FREELANCE',
  ESTAGIO = 'ESTAGIO',
  TEMPORARIO = 'TEMPORARIO',
}

export enum ExperienceLevel {
  ESTAGIARIO = 'ESTAGIARIO',
  JUNIOR = 'JUNIOR',
  PLENO = 'PLENO',
  SENIOR = 'SENIOR',
  ESPECIALISTA = 'ESPECIALISTA',
}

// ==================== MODELS ====================

export interface User {
  id: string;
  email: string;
  fullName?: string;
  type: UserType;
  disponivel: boolean;
  createdAt: string;
  updatedAt: string;
  profilePF?: ProfilePF;
  profileCompany?: ProfileCompany;
  profileServiceProvider?: ProfileServiceProvider;
  profileInstitution?: ProfileInstitution;
}

export interface Experience {
  id: string;
  profileId: string;
  title: string;
  company: string;
  years: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  field: string;
  startYear?: number;
  endYear?: number;
  createdAt: string;
}

export interface ProfilePF {
  id: string;
  userId: string;
  fullName: string;
  cpf: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  city?: string;
  address: string;
  lat: number;
  lng: number;
  driverLicense: boolean;
  resumeBoost: boolean;
  qualificationsSummary?: string;
  workDisposition?: WorkDisposition;
  skills: string[];
  disponivel: boolean;
  areaAtuacao?: string;
  experiences: Experience[];
  educations: Education[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfileCompany {
  id: string;
  userId: string;
  companyName: string;
  cnpj: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  subscriptionPlan: SubscriptionPlan;
  areaAtuacao?: string;
  description?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileServiceProvider {
  id: string;
  userId: string;
  companyName: string;
  cnpj: string;
  phone: string;
  serviceCategories: string[];
  address: string;
  lat: number;
  lng: number;
  rating: number;
  totalRatings: number;
  distance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileInstitution {
  id: string;
  userId: string;
  institutionName: string;
  cnpj: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface TalentResult {
  userId: string;
  fullName: string;
  skills: string[];
  summary?: string;
  experiences: Pick<Experience, 'id' | 'title' | 'company' | 'years' | 'description'>[];
  educations: Pick<Education, 'id' | 'institution' | 'degree' | 'field' | 'startYear' | 'endYear'>[];
  certificates?: { id: string; name: string; issuer: string }[];
}

export interface JobRequirements {
  gender?: Gender;
  minAge?: number;
  maxAge?: number;
  minExperience?: number;
  maxDistance?: number;
  driverLicense?: boolean;
  requiredSkills: string[];
  requiresDiploma?: boolean;
  requiredCertificates?: string[];
}

export interface JobCall {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: JobRequirements;
  status: JobCallStatus;
  category?: string;
  salary?: string;
  salaryMax?: string;
  contractType?: ContractType;
  jobWorkMode?: JobWorkMode;
  hoursPerWeek?: number;
  benefits: string[];
  location?: string;
  experienceLevel?: ExperienceLevel;
  applicationDeadline?: string;
  company?: ProfileCompany;
  matches?: JobMatch[];
  createdAt: string;
  updatedAt: string;
}

export interface JobMatch {
  id: string;
  jobCallId: string;
  candidateId: string;
  score: number;
  isYoungTalent: boolean;
  status: JobMatchStatus;
  jobCall?: JobCall;
  candidate?: User;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewSchedule {
  id: string;
  jobMatchId: string;
  scheduledAt: string;
  status: InterviewScheduleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewScheduleState {
  latest: InterviewSchedule | null;
  current: InterviewSchedule | null;
}

export interface ServiceCall {
  id: string;
  requesterId: string;
  providerId?: string;
  serviceType: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  status: ServiceCallStatus;
  budget?: number;
  rating?: number;
  requester?: User;
  provider?: ProfileServiceProvider;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  institutionId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  institution?: ProfileInstitution;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  content: string;
  type: MessageType;
  sender?: { id: string; email: string };
  createdAt: string;
}

export interface ChatRoom {
  roomId: string;
  lastMessage: string;
  lastMessageAt: string;
  otherUser: { id: string; email: string };
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

// ==================== AUTH ====================

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    type: UserType;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  type: UserType;
}

export interface LoginData {
  email: string;
  password: string;
}

// ==================== NAVIGATION ====================

export type AuthStackParamList = {
  UserType: undefined;
  Login: { userType: UserType };
  Register: { userType: UserType };
  VerifySMS: {
    phone: string;
    userId: string;
    formData?: {
      email: string;
      password: string;
      type: string;
      fullName: string;
      gender: string;
      phone: string;
      birthDate?: string;
    };
  };
};

export type PFTabParamList = {
  HomePF: undefined;
  RequestService: undefined;
  Notifications: undefined;
  ProfilePF: undefined;
};

export type CompanyTabParamList = {
  HomeCompany: undefined;
  CreateJobCall: undefined;
  Notifications: undefined;
  ProfileCompany: undefined;
};

export type ProviderTabParamList = {
  HomeProvider: undefined;
  Notifications: undefined;
  ProfileProvider: undefined;
};

export type InstitutionTabParamList = {
  HomeInstitution: undefined;
  Notifications: undefined;
  ProfileInstitution: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  PFTabs: undefined;
  CompanyTabs: undefined;
  ProviderTabs: undefined;
  InstitutionTabs: undefined;
  JobCallDetail: { jobCallId: string; matchId: string };
  ServiceDetail: { serviceCallId: string };
  Chat: { roomId: string; otherUserId: string; otherUserName: string; jobCallId?: string };
  JobCallStatus: { jobCallId: string };
  TalentProfile: { userId: string };
  CreateJobCall: undefined;
  InterviewSession: { jobCallId: string; candidateId: string; mode: 'start' | 'join' };
};
