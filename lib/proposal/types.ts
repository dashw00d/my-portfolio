export type FeedbackStatus = "interested" | "question" | "maybe_later";

export interface SectionFeedback {
  comment: string;
  status: FeedbackStatus | "";
}

export interface SharedSelections {
  baseSelected: boolean;
  oneTimeOptionIds: string[];
  recurringOptionIds: string[];
  sectionFeedback: Record<string, SectionFeedback>;
  displayName: string;
  updatedAt: string;
}

export interface Reply {
  author: "ryan";
  body: string;
  createdAt: string;
  resolved: boolean;
}

export interface CommentThread {
  id: string;
  subject: "section" | "preview";
  subjectId: string;
  author: "client" | "ryan";
  displayName: string;
  body: string;
  status: FeedbackStatus | "";
  createdAt: string;
  replies: Reply[];
  resolved: boolean;
}

export interface PreviewPin {
  id: string;
  number: number;
  x: number;
  y: number;
  createdAt: string;
}

export interface DoodleStroke {
  id: string;
  points: Array<{ x: number; y: number }>;
  createdAt: string;
}

export interface ProposalState {
  selections: SharedSelections;
  threads: CommentThread[];
  pins: PreviewPin[];
  doodles: DoodleStroke[];
}

export interface SubmittedResponseSnapshot {
  id: string;
  submittedAt: string;
  displayName: string;
  state: ProposalState;
  configVersion: number;
}
