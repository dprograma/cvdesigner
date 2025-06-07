import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  async function middleware(request: NextRequest) {
    // This function will be called after the authentication check
    // If the user is authenticated, request.auth will contain the user's session
    // If the user is not authenticated, this function will not be called
    // and the user will be redirected to the login page

    // Example: Allow authenticated users to access the dashboard
    // If you need specific authorization logic based on user roles, etc.,
    // you can implement it here using request.auth.user

    return NextResponse.next();
  },
  {
    callbacks: {
      // This callback is called after the middleware function
      // It can be used to authorize access based on the token or session
      async authorized({ token }) {
        // Return true if the user is authorized, false otherwise
        // For now, just check if a token exists (user is authenticated)
        return !!token;
      },
    },
    // Specify the login page URL
    pages: {
      signIn: '/auth/login',
    },
  }
);

// Configure the paths the middleware applies to
export const config = {
  matcher: ['/dashboard/:path*'], // Apply middleware to /dashboard and its sub-routes
};
