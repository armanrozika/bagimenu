import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div>
      <button className="px-8 py-2 text-sm font-semibold text-white rounded-lg bg-ungu">
        Simpan
      </button>
    </div>
  );
}
