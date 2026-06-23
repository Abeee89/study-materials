import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const role = token?.role;
    const path = req.nextUrl.pathname;

    // Direct access to /dashboard -> redirect based on role
    if (path === "/dashboard") {
      if (role === "TEACHER") {
        return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard/student", req.url));
    }

    // Protect /dashboard/student
    if (path.startsWith("/dashboard/student") && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/login?error=UnauthorizedStudent", req.url));
    }

    // Protect /dashboard/teacher
    if (path.startsWith("/dashboard/teacher") && role !== "TEACHER") {
      return NextResponse.redirect(new URL("/login?error=UnauthorizedTeacher", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
