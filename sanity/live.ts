import { defineLive } from "next-sanity/live";

import { client } from "./client";

// Editor token from the environment, used to fetch draft content while in
// preview. Reads stay on the published perspective when draft mode is off.
const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: token,
  serverToken: token,
});
