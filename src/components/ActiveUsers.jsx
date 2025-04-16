import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useGlobalContext } from "@/context/GlobalContext";

const MAX_VISIBLE_USERS = 5;

export function ActiveUsers() {
  const { activeUsers } = useGlobalContext();

  const visibleUsers = activeUsers.slice(0, MAX_VISIBLE_USERS);
  const remainingCount = Math.max(0, activeUsers.length - MAX_VISIBLE_USERS);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors sm:gap-2">
          <div className="flex -space-x-3">
            {visibleUsers.map((user, index) => (
              <div key={user.id} className="relative">
                <Avatar
                  className="h-7 w-7 border-2 border-white ring-2 ring-gray-100"
                  style={{ zIndex: visibleUsers.length - index }}
                >
                  <AvatarImage
                    src={user.profileImage || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
          {remainingCount > 0 && (
            <span className="text-xs font-medium text-gray-600">
              +{remainingCount}
            </span>
          )}
        </div>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:w-[325px] bg-white border-l border-gray-200 px-3"
      >
        <SheetHeader className="border-b border-gray-200 pb-4 pt-0">
          <div className="flex items-center justify-between px-1">
            <SheetTitle className="text-gray-800 text-sm flex items-center gap-2">
              <Badge variant="secondary" className="bg-gray-100">
                {activeUsers.length}
              </Badge>
              <span className="text-sm font-semibold">Online Users</span>
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-5rem)] pt-4">
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3 w-[70%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.profileImage || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col min-w-0">
                  <span className="text-sm text-gray-800 font-medium truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground truncate max-w-[30%] text-right">
                {user.role}
              </div>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
