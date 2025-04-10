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
