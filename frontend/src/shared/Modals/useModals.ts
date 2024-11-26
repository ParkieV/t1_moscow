import {create} from "zustand";

type Type = "confirm" | "alert" | "prompt";

interface Modal {
  type: Type;
  message: string;
  resolve: (result: unknown) => void;
  close: () => void;
}

interface ModalsStore {
  modals: Modal[];
  openModal: (type: Type, message: string) => Promise<unknown>;
}


export const useModals = create<ModalsStore>((set) => ({
  modals: [],
  openModal: (type: Type, message: string) => {
    return new Promise((resolve) => {
      set((state) => ({
        modals: [
          ...state.modals,
          {
            type,
            message,
            resolve: (result: unknown) => {
              resolve(result);
              set((state) => ({
                modals: state.modals.filter((m) => m.message !== message),
              }));
            },
            close: () => {
              set((state) => ({
                modals: state.modals.filter((m) => m.message !== message),
              }));
            }
          }
        ]
      }));
    });
  }
}));

export const asyncConfirm = (message: string) => {
  return useModals.getState().openModal("confirm", message);
}

export const asyncAlert = (message: string) => {
  return useModals.getState().openModal("alert", message);
}

export const asyncPrompt = (message: string) => {
  return useModals.getState().openModal("prompt", message);
}

