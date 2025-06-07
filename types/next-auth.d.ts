import NextAuth from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    /**
     * The shape of the user object returned and stored in the session
     */
    interface User {
        id: string;
        // Add any other properties from your Prisma User model you want to expose in the session
        // e.g., role: string;
    }
}

// If you use custom providers, you might need to extend the JWT type as well
/*
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  *//**
* Returned by the `jwt` callback and stored in the `JWT` session
*//*
interface JWT {
id: string; // Add id here if you pass it to the token
}
}
*/ 