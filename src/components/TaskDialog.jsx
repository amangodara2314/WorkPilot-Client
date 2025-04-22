import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateEditTaskForm from "./CreateEditTask";
const TaskDialog = ({ refetch }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <DialogHeader>
            <DialogTitle>
              <Button>
                <Plus /> New Task
              </Button>
            </DialogTitle>
          </DialogHeader>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <CreateEditTaskForm
            onClose={() => setIsOpen(false)}
            callback={refetch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskDialog;
