export interface AppEntry {
  id: number;
  name: string;
  owner: string;
  description: string;
  url: string;
  comment: string;
  status: string;
  created_by_user_id?: number;
}

export type AppEntryInput = Omit<AppEntry, "id" | "created_by_user_id">;
