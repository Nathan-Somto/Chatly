import {create} from 'zustand'
type Profile = {
    username : string;
    bio: string;
    avatar: string;
    id: string;
    clerkId: string;
    isOnboarded: boolean;
} | null
const initialProfile: Profile = null

const useProfileStore = create((set)=> ({
profile: initialProfile,
setProfile: (data: Omit<Profile, 'wallpaper'>) => set(() => ({
    ...data
})),
updateProfile :(data: Partial<Profile>) => set (() => ({
    ...data
})),
removeProfile: () => set (() => null, true)
}))

export {useProfileStore};