import { requireRole } from "../auth";

export const dynamic = "force-dynamic";

export default async function KitchenLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["admin", "kitchen"], "/cozinha");
  return children;
}
