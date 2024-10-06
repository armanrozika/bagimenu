import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div>
      <button className="px-10 rounded text-sm py-2 bg-ungu text-white font-semibold">
        Button
      </button>
    </div>
  );
}
