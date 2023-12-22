import {create} from 'zustand'
const wallpaper = localStorage.getItem("wallpaper");
type Profile = {
    username : string;
    bio: string;
    avatar: string;
    id: string;
    clerkId: string;
    isOnboarded: boolean;
    wallpaper?: string;
} | null
const initialProfile: Profile = null

const useProfileStore = create((set)=> ({
profile: initialProfile,
setProfile: (data: Omit<Profile, 'wallpaper'>) => set(() => ({
    ...data,
    wallpaper: wallpaper ?? ""
})),
updateProfile :(data: Partial<Profile>) => set (() => ({
    ...data
})),
removeProfile: () => set (() => null, true)
}))

export {useProfileStore};