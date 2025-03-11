import { Settings } from "lucide-react";

export default function CurrentWorkshop({ size = 8 }) {
  return (
    <div className="flex gap-4 items-center">
      <div
        className={`flex aspect-square w-${size} h-${size} items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground`}
      >
        <Settings size={size * 2} />
      </div>
      <div className="">
        <div className="font-bold text-primary text-md">My Workshop</div>
        <span className="text-muted-foreground text-sm">Free</span>
      </div>
    </div>
  );
}
