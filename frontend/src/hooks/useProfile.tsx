import { GetUserResponse } from "@/api-types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Profile = GetUserResponse['user'] | null;

const initialProfile: Profile = null;

type ProfileStore = {
  profile: Profile;
  setProfile: (data: Profile) => void;
  updateProfile: (data: Partial<Profile>) => void;
  removeProfile: () => void;
};

const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: initialProfile,
      setProfile: (data: Profile) => set(() => ({ profile: data })),
      updateProfile: (data: Partial<Profile>) =>
        set((state) => ({
          profile:
            state.profile === null
              ? null
              : {
                  ...state.profile,
                  ...data,
                },
        })),
      removeProfile: () => set({ profile: null }),
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export { useProfileStore };

