import {create} from 'zustand';
import {handledFetch} from '../shared/api.ts';

interface CurrentUserState {
  user: null | {
    username: string;
    access_token: string;
  };
  login: (data: { username: string; password: string }) => void;
}

export const useCurrentUser = create<CurrentUserState>((set) => ({
  user: null,
  login: async (user) => {
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('password', user.password);
    formData.append('grant_type', 'password');
    const resp = await handledFetch('/api/auth/login', {
      method: 'POST',
      body: formData,
    });
    const data = await resp.json();
    console.log(data)
    set({
      user: {
        username: user.username,
        access_token: data.access_token,
      },
    });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('username', user.username);
  }
}));
