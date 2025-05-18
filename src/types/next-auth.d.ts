import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      image: string;
      role: string;
    } & DefaultSession['user'];
    accessToken: string;
  }

  interface User {
    id: number;
    email: string;
    name: string;
    image?: string;
    role: string;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    email: string;
    name: string;
    picture?: string;
    role: string;
    accessToken: string;
  }
}