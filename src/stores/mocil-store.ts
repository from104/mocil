import { defineStore } from 'pinia';
import { User, signOut } from 'firebase/auth';
import { auth } from 'src/firebase';

export const useLoginStore = defineStore('login', {
  state: () => ({
    loggedInUser: null as User | null,
    role: null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.loggedInUser,
    isEmailVerified: (state) => state.loggedInUser?.emailVerified,
    uid: (state) => state.loggedInUser?.uid,
    userName: (state) => state.loggedInUser?.displayName,
    email: (state) => state.loggedInUser?.email,
    photoURL: (state) => state.loggedInUser?.photoURL,
    phoneNumber: (state) => state.loggedInUser?.phoneNumber,
  },
  actions: {
    signOut() {
      signOut(auth);
      location.href = '/login';
    },
  },
});
