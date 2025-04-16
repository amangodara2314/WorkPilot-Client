import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "./ui/separator";
import { Link, useLocation } from "react-router-dom";
import WorkshopLinkTag from "./WorkshopLinkTag";
import { ActiveUsers } from "./ActiveUsers";
import { useGlobalContext } from "@/context/GlobalContext";

const Header = () => {
  const location = useLocation();
  const { activeUsers } = useGlobalContext();

  const pathname = location.pathname;

  const getPageLabel = (pathname) => {
    if (pathname.includes("/project/")) return "Project";
    if (pathname.includes("/settings")) return "Settings";
    if (pathname.includes("/tasks")) return "Tasks";
    if (pathname.includes("/members")) return "Members";
    return null;
  };

  const pageHeading = getPageLabel(pathname);
  return (
    <header className="flex sticky top-0 z-50 bg-white h-12 shrink-0 items-center border-b">
      <div className="flex items-center justify-between w-full px-3">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block text-[15px]">
                {pageHeading ? (
                  <BreadcrumbLink asChild>
                    <WorkshopLinkTag>Dashboard</WorkshopLinkTag>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="line-clamp-1 ">
                    Dashboard
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {pageHeading && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem className="text-[15px]">
                    <BreadcrumbPage className="line-clamp-1">
                      {pageHeading}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ActiveUsers />
      </div>
    </header>
  );
};

export default Header;
