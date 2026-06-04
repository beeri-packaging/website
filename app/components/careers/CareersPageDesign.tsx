"use client";

import { useMemo, useState } from "react";
import type { CareersCopy, CareerRole } from "@/app/content/careers";
import type { Lang } from "@/app/content/home";
import { CareersBento } from "@/app/components/careers/CareersBento";
import { CareersHero } from "@/app/components/careers/CareersHero";
import { CareersNewsletter } from "@/app/components/careers/CareersNewsletter";
import { CareersRoles } from "@/app/components/careers/CareersRoles";

export function CareersPageDesign({ copy, lang }: { copy: CareersCopy; lang: Lang }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<CareerRole["department"]>("all");

  const visibleRoles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return copy.roles.filter((role) => {
      const matchesDepartment =
        department === "all" || role.department === department;
      const searchable = [
        role.code,
        role.status,
        role.title,
        role.scope,
        role.location,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return matchesDepartment && searchable.includes(normalizedQuery);
    });
  }, [copy.roles, department, query]);

  return (
    <div className="bg-bone">
      <CareersHero
        copy={copy}
        query={query}
        onQueryChange={setQuery}
      />
      <CareersBento articles={copy.articles} lang={lang} />
      <CareersRoles
        apply={copy.apply}
        department={department}
        filters={copy.filters}
        lang={lang}
        noRoles={copy.noRoles}
        onDepartmentChange={setDepartment}
        roles={visibleRoles}
        title={copy.rolesTitle}
      />
      <CareersNewsletter copy={copy} />
    </div>
  );
}
