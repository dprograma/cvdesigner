import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from 'bcryptjs';

const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        // Add your authentication providers here
        // For example, CredentialsProvider:
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null; // No credentials provided
                }

                // Find user by email
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                // If user not found or password doesn't match
                if (!user || !(await bcryptjs.compare(credentials.password, user.password))) {
                    return null;
                }

                // Return user object (excluding password)
                return {
                    id: user.id,
                    name: user.name, // Assuming user has a name field
                    email: user.email,
                    // Add other user properties you want in the session
                };
            }
        })
    ],
    // Add other NextAuth.js options here as needed
    // For example, session management, pages, callbacks, etc.
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 