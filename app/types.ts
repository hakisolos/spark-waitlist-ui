export interface DBInstance {
  id: string; typeId: string; typeLabel: string; color: string;
  connPrefix: string; name: string; status: "spinning" | "ready";
  region: string; createdAt: string;
}
