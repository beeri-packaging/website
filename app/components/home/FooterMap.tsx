/**
 * The footer map — a plain Google Maps embed, small and always visible.
 *
 * Server-rendered: no state, no client bundle. `loading="lazy"` keeps Google's
 * iframe off the initial load, so it only fetches once a visitor scrolls the
 * footer into reach rather than on every page view.
 */
export function FooterMap({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-full w-full border border-rule"
    />
  );
}
