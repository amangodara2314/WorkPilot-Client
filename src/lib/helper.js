export const getStatusColor = (status) => {
  switch (status) {
    case "in-review":
      return "bg-slate-500";
    case "in-progress":
      return "bg-blue-500";
    case "pending":
      return "bg-yellow-500";
    case "completed":
      return "bg-green-500";
    case "canceled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export function getDueStatus(dueDateStr) {
  const dueDate = new Date(dueDateStr);
  const today = new Date();

  // Zero out time components for accurate day comparison
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInMs = dueDate - today;
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Due today";
  if (diffInDays === -1) return "Due yesterday";
  if (diffInDays === 1) return "Due tomorrow";

  if (diffInDays < -1 && diffInDays >= -7)
    return `Due ${Math.abs(diffInDays)} days ago`;
  if (diffInDays > 1 && diffInDays <= 7) return `Due in ${diffInDays} days`;

  if (diffInDays < -7) return "Due last week";
  if (diffInDays > 7) return "Due next week";

  return "Due at unknown time";
}
