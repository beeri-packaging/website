import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { evaluate, parse } from "groq-js";
import { finishingQuery, toFinishingCopy } from "./queries";
import { finishing } from "./schemaTypes/finishing";
import { FinishingPageDesign } from "@/app/components/finishing/FinishingPageDesign";
import type { Lang } from "@/app/content/home";

vi.mock("@/app/components/contact/ContactTriggerButton", () => ({
  ContactTriggerButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

const asset = {
  _id: "image-2a9a4ff568e801db92d8dc0bd514cf48f95593eb-1456x1080-png",
  _type: "sanity.imageAsset",
  url: "https://cdn.sanity.io/images/4qkb39ql/production/2a9a4ff568e801db92d8dc0bd514cf48f95593eb-1456x1080.png",
};
const extraImage = {
  asset: { _type: "reference", _ref: asset._id },
  imageUrl: asset.url,
  alt: "Client-owned second image description",
};
function fixture(locale: Lang) {
  const item = (name: string) => ({
    eyebrow: `${locale} ${name} client eyebrow`, title: `${locale} ${name} client title`,
    body: `${locale} ${name} client body`, imageUrl: `/images/${name}.png`,
  });
  return {
    step: `${locale} client step`, title: [`${locale} client line 1`, `${locale} client line 2`],
    intro: `${locale} custom introduction with UV`, feature: { ...item("digital"), sample: "Custom", cta: "Client catalog" },
    deboss: item("emboss"), texture: item("foil"),
    standardsEyebrow: "Client standards eyebrow", standardsTitle: "Client standards title", standardsBody: "Client standards body",
    standards: [1, 2, 3, 4].map(n => ({ code: `CLIENT-${n}`, title: `Certificate ${n}`, body: `Client certificate text ${n}`, certificateLabel: `Open ${n}`, certificateUrl: `https://example.com/${n}.pdf`, imageUrl: `/images/certificate-${n}.png`, tone: "plain" })),
    ctaTitle: "Client CTA title", ctaPrimary: "Client primary", ctaSecondary: "Client secondary",
  };
}
function dom(copy: ReturnType<typeof toFinishingCopy>, lang: Lang) {
  return new DOMParser().parseFromString(renderToStaticMarkup(<FinishingPageDesign copy={copy} lang={lang} />), "text/html");
}
describe("optional finishing image: content preservation", () => {
  for (const lang of ["he", "en"] as const) {
    it(`keeps the old document, all client text and four certificates (${lang})`, () => {
      const input = fixture(lang);
      const copy = toFinishingCopy(input, lang);
      expect(copy.debossSecondaryImage).toBeUndefined();
      expect(copy.intro).toBe(input.intro);
      expect(copy.texture.image).toBe(input.texture.imageUrl);
      expect(copy.deboss.image).toBe(input.deboss.imageUrl);
      expect(copy.standards).toHaveLength(4);
      expect(copy.standards.map(s => s.certificateUrl)).toEqual(input.standards.map(s => s.certificateUrl));
      const oldDom = dom(copy, lang);
      expect(oldDom.querySelectorAll("#capabilities > article img")).toHaveLength(2);
      expect(oldDom.querySelector("#capabilities > article")?.className).toContain("lg:col-span-5");
      expect(oldDom.querySelectorAll("#standards li")).toHaveLength(4);
    });
    it(`adds only the second image, without changing existing content (${lang})`, () => {
      const input = fixture(lang);
      const original = structuredClone(input);
      const before = toFinishingCopy(input, lang);
      const after = toFinishingCopy({ ...input, debossSecondaryImage: extraImage }, lang);
      const { debossSecondaryImage, ...unchanged } = after;
      expect(unchanged).toEqual(before);
      expect(input).toEqual(original);
      expect(debossSecondaryImage?.alt).toBe(extraImage.alt);
      const a = dom(before, lang), b = dom(after, lang);
      expect(b.querySelectorAll("#capabilities > article img")).toHaveLength(3);
      expect(b.querySelector("#standards")?.outerHTML).toBe(a.querySelector("#standards")?.outerHTML);
      const text = (d: Document) => Array.from(d.querySelectorAll("h1,h2,h3,p,a,button")).map(n => n.textContent);
      expect(text(b)).toEqual(text(a));
    });
  }
  it("shows a subsequently uploaded foil image without changing either embossing image", () => {
    const initial = { ...fixture("he"), debossSecondaryImage: extraImage };
    const empty = toFinishingCopy({ ...initial, texture: { ...initial.texture, imageUrl: undefined } }, "he");
    expect(empty.texture.image).toBeUndefined();
    const next = toFinishingCopy({ ...initial, texture: { ...initial.texture, imageUrl: "https://cdn.sanity.io/images/4qkb39ql/production/client-new-foil.png" } }, "he");
    expect(next.texture.image).toContain("client-new-foil.png");
    expect(next.deboss).toEqual(empty.deboss);
    expect(next.debossSecondaryImage).toEqual(empty.debossSecondaryImage);
    expect(dom(empty, "he").querySelectorAll("#capabilities > article:last-child img")).toHaveLength(0);
    expect(dom(next, "he").querySelectorAll("#capabilities > article:last-child img")).toHaveLength(1);
  });
  it("never resurrects removed images, and does not block later client text edits", () => {
    const input = fixture("en");
    const copy = toFinishingCopy({ ...input, debossSecondaryImage: null, intro: "New client introduction", texture: { ...input.texture, imageUrl: null, imageLegacy: null, body: "New client foil wording" } }, "en");
    expect(copy.debossSecondaryImage).toBeUndefined();
    expect(copy.texture.image).toBeUndefined();
    expect(copy.texture.body).toBe("New client foil wording");
    expect(copy.intro).toBe("New client introduction");
    expect(copy.standards).toEqual(toFinishingCopy(input, "en").standards);
  });
  it("omits unresolved second assets and honors the CMS crop for a valid asset", () => {
    const input = fixture("he");
    expect(toFinishingCopy({ ...input, debossSecondaryImage: { ...extraImage, imageUrl: null } }, "he").debossSecondaryImage).toBeUndefined();
    const copy = toFinishingCopy({ ...input, debossSecondaryImage: { ...extraImage, crop: { left: 0.1, right: 0.1, top: 0.1, bottom: 0.1 } } }, "he");
    expect(copy.debossSecondaryImage?.image).toContain("rect=");
  });
  it("projects the existing foil field and the optional independent second image", async () => {
    const doc = { _id: "finishing-he", _type: "finishing", language: "he", debossSecondaryImage: { asset: extraImage.asset, alt: extraImage.alt }, texture: { image: { asset: extraImage.asset } } };
    const result = await (await evaluate(parse(finishingQuery), { dataset: [asset, doc], params: { locale: "he" } })).get();
    expect(result.texture.imageUrl).toBe(asset.url);
    expect(result.debossSecondaryImage.imageUrl).toBe(asset.url);
    expect(result.debossSecondaryImage.asset._ref).toBe(asset._id);
  });
  it("keeps existing schema field names and adds an optional image with no default", () => {
    const fields = finishing.fields;
    expect(fields.find(f => f.name === "texture")?.type).toBe("finishingItem");
    const extra = fields.find(f => f.name === "debossSecondaryImage");
    expect(extra?.type).toBe("image");
    expect(extra?.initialValue).toBeUndefined();
    expect(extra?.validation).toBeUndefined();
  });
});
