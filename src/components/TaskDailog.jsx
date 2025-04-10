import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateEditTaskForm from "./CreateEditTask";
const TaskDialog = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button>
            <Plus />
            New Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <CreateEditTaskForm onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskDialog;
