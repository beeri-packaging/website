import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import {
  isPublicProductionHost,
  maintenanceLocale,
  PUBLIC_MAINTENANCE_ROUTE,
  requestHostname,
} from "./lib/production-gate";

const intlMiddleware = createMiddleware(routing);

/**
 * Keep the unfinished site available on local and Vercel preview URLs, while
 * the public production domains serve the launch holding page. This is an
 * internal rewrite, so visitors keep the requested URL in their address bar.
 */
export default function proxy(request: NextRequest) {
  const hostname = requestHostname(
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
    request.nextUrl.hostname,
  );
  const { pathname } = request.nextUrl;

  if (isPublicProductionHost(hostname) && pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  if (isPublicProductionHost(hostname) && pathname !== PUBLIC_MAINTENANCE_ROUTE) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = PUBLIC_MAINTENANCE_ROUTE;
    maintenanceUrl.search = "";
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-maintenance-locale", maintenanceLocale(pathname));

    return NextResponse.rewrite(maintenanceUrl, {
      request: { headers: requestHeaders },
    });
  }

  // The holding page is an internal route, not a public destination.
  if (pathname === PUBLIC_MAINTENANCE_ROUTE) {
    const locale = request.headers.get("accept-language")?.toLowerCase().startsWith("en")
      ? "en"
      : "he";
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/robots.txt",
    "/((?!api|trpc|_next|_vercel|studio|review|.*\\..*).*)",
  ],
};
