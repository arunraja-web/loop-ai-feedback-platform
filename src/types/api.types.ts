import { FeedbackChannel, FeedbackStatus, Role, Sentiment } from '@prisma/client';

// ---------------------------------------------------------------------------
// Generic API envelope types
// ---------------------------------------------------------------------------

/** Standard success response wrapper used by every API route. */
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/** Standard error response wrapper used by every API route. */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

/** Union of success and error responses. */
export type ApiResult<T = unknown> = ApiResponse<T> | ApiErrorResponse;

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ---------------------------------------------------------------------------
// Workspace types
// ---------------------------------------------------------------------------

export interface WorkspaceDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    feedbacks: number;
  };
}

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
}

// ---------------------------------------------------------------------------
// User types
// ---------------------------------------------------------------------------

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: Role;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

/** Safe user — password excluded */
export type SafeUser = Omit<UserDto, 'password'>;

export interface InviteUserInput {
  name: string;
  email: string;
  role: Role;
  password: string;
}

export interface UpdateUserRoleInput {
  role: Role;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

// ---------------------------------------------------------------------------
// Feedback types
// ---------------------------------------------------------------------------

export interface FeedbackDto {
  id: string;
  title: string;
  content: string;
  channel: FeedbackChannel;
  sentiment: Sentiment | null;
  status: FeedbackStatus;
  customerName: string | null;
  customerEmail: string | null;
  workspaceId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  themes?: ThemeDto[];
  user?: Pick<UserDto, 'id' | 'name' | 'email'>;
}

export interface CreateFeedbackInput {
  title: string;
  content: string;
  channel: FeedbackChannel;
  customerName?: string;
  customerEmail?: string;
}

export interface UpdateFeedbackInput {
  title?: string;
  content?: string;
  channel?: FeedbackChannel;
  status?: FeedbackStatus;
  sentiment?: Sentiment;
  customerName?: string;
  customerEmail?: string;
}

export interface FeedbackFilters extends PaginationParams {
  search?: string;
  channel?: FeedbackChannel;
  sentiment?: Sentiment;
  status?: FeedbackStatus;
  themeId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CsvImportResult {
  imported: number;
  failed: number;
  errors: Array<{ row: number; reason: string }>;
}

// ---------------------------------------------------------------------------
// Theme types
// ---------------------------------------------------------------------------

export interface ThemeDto {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    feedbacks: number;
  };
}

export interface CreateThemeInput {
  name: string;
  description?: string;
}

export interface UpdateThemeInput {
  name?: string;
  description?: string;
}

export interface ThemeTrend {
  theme: ThemeDto;
  currentCount: number;
  previousCount: number;
  changePercent: number;
  isSpiking: boolean;
}

// ---------------------------------------------------------------------------
// Report types
// ---------------------------------------------------------------------------

export interface ReportDto {
  id: string;
  title: string;
  summary: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateReportInput {
  title: string;
  periodStart: string;
  periodEnd: string;
}

// ---------------------------------------------------------------------------
// Ask LOOP / Chat types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AskLoopRequest {
  question: string;
  conversationHistory?: ChatMessage[];
}

export interface AskLoopResponse {
  answer: string;
  sources: FeedbackDto[];
}

export interface SemanticSearchRequest {
  query: string;
  topK?: number;
}

export interface SemanticSearchResult {
  feedback: FeedbackDto;
  score: number;
}

// ---------------------------------------------------------------------------
// Dashboard / Analytics types
// ---------------------------------------------------------------------------

export interface DashboardStats {
  totalFeedback: number;
  newThisWeek: number;
  percentNegative: number;
  percentPositive: number;
  percentNeutral: number;
  totalThemes: number;
}

export interface VolumeDataPoint {
  date: string;
  count: number;
}

export interface SentimentDataPoint {
  sentiment: Sentiment;
  count: number;
  percent: number;
}

export interface ThemeDataPoint {
  name: string;
  count: number;
}

export interface DashboardChartData {
  volume: VolumeDataPoint[];
  sentiment: SentimentDataPoint[];
  topThemes: ThemeDataPoint[];
}
