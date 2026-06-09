"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/app/content/home";
import type { BlogIndexCopy, InsightsChrome, BlogCategory } from "@/app/content/blog";
import type { LocalizedPost } from "@/sanity/queries";
import type { CareerRole } from "@/app/content/careers";
import { InsightsHero } from "@/app/components/blog/InsightsHero";
import { InsightsBento } from "@/app/components/blog/InsightsBento";
import { InsightsNewsletter } from "@/app/components/blog/InsightsNewsletter";
import { CareersRoles } from "@/app/components/careers/CareersRoles";

export function InsightsPageDesign({
  posts,
  copy,
  chrome,
  labels,
  lang,
  roles,
  roleFilters,
  rolesTitle,
  apply,
  noRoles,
}: {
  posts: readonly LocalizedPost[];
  copy: BlogIndexCopy;
  chrome: InsightsChrome;
  labels: Record<BlogCategory, string>;
  lang: Lang;
  roles: readonly CareerRole[];
  roleFilters: readonly { key: CareerRole["department"]; label: string }[];
  rolesTitle: string;
  apply: string;
  noRoles: string;
}) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<CareerRole["department"]>("all");

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
      [p.title, p.excerpt, labels[p.category]].join(" ").toLocaleLowerCase().includes(q),
    );
  }, [posts, labels, query]);

  const visibleRoles = useMemo(
    () => roles.filter((role) => department === "all" || role.department === department),
    [roles, department],
  );

  return (
    <div className="bg-bone">
      <InsightsHero copy={copy} chrome={chrome} query={query} onQueryChange={setQuery} />
      <InsightsBento posts={visible} lang={lang} labels={labels} readLabel={copy.readMore} />
      <CareersRoles
        apply={apply}
        department={department}
        filters={roleFilters}
        lang={lang}
        noRoles={noRoles}
        onDepartmentChange={setDepartment}
        roles={visibleRoles}
        title={rolesTitle}
      />
      <InsightsNewsletter chrome={chrome} />
    </div>
  );
}
