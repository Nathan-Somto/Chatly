export type GetUserResponse = {
    user: {
      id: string;
      username: string;
      email: string;
      clerkId: string;
      isOnboarded: boolean;
      avatar: string;
      bio: string;
    };
};