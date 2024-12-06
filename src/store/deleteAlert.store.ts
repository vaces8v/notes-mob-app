import { create } from "zustand";

interface DeleteAlertState {
    isOpenAlert: boolean;
}

interface DeleteAlertActions {
    setIsOpenAlert: () => void;
    setIsCloseAlert: () => void;
}


export const useDeleteAlert = create<DeleteAlertState & DeleteAlertActions>((set) => ({
    isOpenAlert: false,
    setIsOpenAlert: () => set({ isOpenAlert: true }),
    setIsCloseAlert: () => set({ isOpenAlert: false }),
  }));