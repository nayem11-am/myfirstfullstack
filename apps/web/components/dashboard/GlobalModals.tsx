"use client";

import { useModalStore } from "@/store/useModalStore";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/Dialog";
import { TaskForm } from "@/components/dashboard/tasks/TaskForm";
import { GoalForm } from "@/components/dashboard/goals/GoalForm";
import { TeamModal } from "@/components/dashboard/TeamModal";

export function GlobalModals() {
  const { activeModal, modalData, closeModal } = useModalStore();

  return (
    <>
      <Dialog open={activeModal === 'task'} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-xl md:max-w-2xl rounded-[32px]">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-black">
              {modalData?.task ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            <TaskForm 
              onSuccess={closeModal} 
              defaultStatus={modalData?.defaultStatus} 
              task={modalData?.task}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === 'goal'} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-xl md:max-w-2xl rounded-[32px]">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-black">Set a New Goal</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            <GoalForm onSuccess={closeModal} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === 'team'} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-md rounded-[32px]">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-black">Workspace Team</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            <TeamModal />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
