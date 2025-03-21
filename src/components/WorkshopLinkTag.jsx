import { useGlobalContext } from "@/context/GlobalContext";
import { Link } from "react-router-dom";

export default function WorkshopLinkTag({ children, path = "/" }) {
  const { currentWorkshop } = useGlobalContext();
  return <Link to={`/workshop/${currentWorkshop}/${path}`}>{children}</Link>;
}
