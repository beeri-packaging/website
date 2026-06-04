import type { SchemaTypeDefinition } from "sanity";

import { blogSettings } from "./blogSettings";
import { capability } from "./capability";
import { careerRole } from "./careerRole";
import { careers } from "./careers";
import { careersArticle } from "./careersArticle";
import { catalog } from "./catalog";
import { catalogCategory } from "./catalogCategory";
import { catalogItem } from "./catalogItem";
import { faqItem } from "./faqItem";
import { finishing } from "./finishing";
import { finishingItem } from "./finishingItem";
import { finishingMetric } from "./finishingMetric";
import { home } from "./home";
import { journeyPanel } from "./journeyPanel";
import { navLink } from "./navLink";
import { placeholderPage } from "./placeholderPage";
import { post } from "./post";
import { siteSettings } from "./siteSettings";
import { socialLink } from "./socialLink";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  home,
  careers,
  catalog,
  finishing,
  post,
  placeholderPage,
  siteSettings,
  blogSettings,
  // Objects
  capability,
  faqItem,
  journeyPanel,
  navLink,
  careersArticle,
  careerRole,
  catalogCategory,
  catalogItem,
  finishingItem,
  finishingMetric,
  socialLink,
];
