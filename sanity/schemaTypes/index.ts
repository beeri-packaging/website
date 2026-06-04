import type { SchemaTypeDefinition } from "sanity";

import { capability } from "./capability";
import { faqItem } from "./faqItem";
import { home } from "./home";
import { journeyPanel } from "./journeyPanel";
import { navLink } from "./navLink";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  home,
  siteSettings,
  // Objects
  capability,
  faqItem,
  journeyPanel,
  navLink,
];
