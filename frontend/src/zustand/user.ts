import {create} from 'zustand';

interface CurrentUserState {
  user: null | {
    username: string;
    email: string;
  };
  setUser: (user: CurrentUserState['user']) => void;
}

export const useCurrentUser = create<CurrentUserState>((set) => ({
  user: {
    username: 'admin',
    email: 'mail'
  },
  setUser: (user) => set({user}),
}));
