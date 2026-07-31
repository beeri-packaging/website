"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/app/content/home";
import type { BlogIndexCopy, InsightsChrome, BlogCategory } from "@/app/content/blog";
import type { LocalizedPost } from "@/sanity/queries";
import type { CareerRole, CareersCopy } from "@/app/content/careers";
import { InsightsHero, type CategoryFilter } from "@/app/components/blog/InsightsHero";
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
  noOpenRoles,
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
  noOpenRoles: CareersCopy["noOpenRoles"];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [department, setDepartment] = useState<CareerRole["department"]>("all");

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return posts.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (!q ||
          [p.title, p.excerpt, labels[p.category]].join(" ").toLocaleLowerCase().includes(q)),
    );
  }, [posts, labels, query, category]);

  const visibleRoles = useMemo(
    () => roles.filter((role) => department === "all" || role.department === department),
    [roles, department],
  );

  return (
    <div className="bg-bone">
      <InsightsHero
        copy={copy}
        chrome={chrome}
        labels={labels}
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
      />
      <InsightsBento posts={visible} lang={lang} labels={labels} readLabel={copy.readMore} />
      <CareersRoles
        apply={apply}
        department={department}
        filters={roleFilters}
        hasOpenRoles={roles.length > 0}
        lang={lang}
        noOpenRoles={noOpenRoles}
        noRoles={noRoles}
        onDepartmentChange={setDepartment}
        roles={visibleRoles}
        title={rolesTitle}
      />
      <InsightsNewsletter chrome={chrome} />
    </div>
  );
}
