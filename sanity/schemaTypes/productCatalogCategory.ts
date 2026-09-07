import { defineArrayMember, defineField, defineType } from "sanity";

const text = (name: string, title: string) => defineField({ name, title, type: "string", validation: (rule) => rule.required() });

export const productCatalogCategory = defineType({
  name: "productCatalogCategory",
  title: "Product category",
  type: "object",
  fields: [
    text("key", "Key"), text("number", "Number"), text("name", "Name"),
    defineField({ name: "intro", title: "Introduction", type: "text" }),
    defineField({ name: "products", title: "Packaging types", type: "array", of: [defineArrayMember({
      name: "packagingType", type: "object", fields: [
        text("key", "Key"), text("name", "Name"),
        defineField({ name: "shortDescription", title: "Short description", type: "text" }),
        defineField({ name: "details", title: "Details", type: "text" }),
        defineField({ name: "characteristics", title: "Characteristics", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "examples", title: "Examples", type: "array", of: [defineArrayMember({
          name: "packagingExample", type: "object", fields: [
            text("key", "Key"), text("name", "Name"),
            defineField({ name: "description", title: "Description", type: "text" }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
          ], preview: { select: { title: "name", media: "image" } },
        })] }),
      ], preview: { select: { title: "name" } },
    })] }),
  ],
  preview: { select: { title: "name", subtitle: "number" } },
});
