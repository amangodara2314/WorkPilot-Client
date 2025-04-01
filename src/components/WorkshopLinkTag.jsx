import { useGlobalContext } from "@/context/GlobalContext";
import { Link } from "react-router-dom";

export default function WorkshopLinkTag({ children, path, ...props }) {
  const { currentWorkshop } = useGlobalContext();
  return (
    <Link {...props} to={`/workshop/${currentWorkshop}/${path || ""}`}>
      {children}
    </Link>
  );
}
