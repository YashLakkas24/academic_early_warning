import RoutePlaceholder from "../../components/RoutePlaceholder/RoutePlaceholder";

/**
 * Placeholder only. The real Parent Dashboard (Alerts, Progress) will be
 * built in a future task.
 */
function ParentDashboard() {
  return (
    <RoutePlaceholder
      eyebrow="Parent workspace"
      title="Parent Dashboard"
      description="This is a placeholder route. The full dashboard — alerts and progress awareness — will be built next."
    />
  );
}

export default ParentDashboard;
