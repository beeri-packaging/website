import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Route every public request through the same bilingual locale handling.
 * Production domains now serve the complete site instead of the launch page.
 */
export default intlMiddleware;

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|studio|review|.*\\..*).*)",
};
