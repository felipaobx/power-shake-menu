import { requireRole } from "../auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["admin"], "/dashboard");
  return children;
}
