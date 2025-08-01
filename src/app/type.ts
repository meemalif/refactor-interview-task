// src/app/types.ts

export type IssueStatus = "open" | "resolved";

export interface Issue {
  id: string;
  name: string;
  message: string;
  status: IssueStatus;
  numEvents: number;
  numUsers: number;
  value: number;
}
