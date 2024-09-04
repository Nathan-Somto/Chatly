interface User 
    {
        id: string;
        username: string;
        avatar: string;
        lastSeen: Date;
    }
interface UserResponse extends Omit<User, 'avatar'> {
    avatarUrl: string;
}
export const formatUsersResponse = (users: User[]): UserResponse[] => {
    return users.map((user) => ({
        ...user,
        avatar: undefined,
        avatarUrl: user.avatar,
    }));
}