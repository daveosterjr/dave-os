import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/v1/health',
  '/llms.txt',
  '/.well-known(.*)'
]);

const hasClerkConfig = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

const clerkProxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!hasClerkConfig) {
    if (isPublicRoute(request)) {
      return NextResponse.next();
    }

    return NextResponse.json(
      {
        error: 'Clerk is not configured',
        message: 'Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to access protected routes.'
      },
      { status: 503 }
    );
  }

  return clerkProxy(request, event);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)']
};
