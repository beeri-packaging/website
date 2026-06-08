/**
 * Shared "reveal once on scroll-in" IntersectionObserver factory.
 *
 * Both the global section reveal (RevealOnScroll, `.reveal`) and the home
 * dual-journey fallback (`.journey-card-reveal`) need the same core behaviour:
 * when an observed element first intersects the viewport, add `.is-visible`
 * and stop observing it. They differ only in selector, threshold/rootMargin,
 * scope, and reduced-motion policy — so this factory owns just the add-once
 * callback, and callers supply their own options and decide what to observe.
 *
 * The journey deliberately keeps its richer, conditional reveal (it's a
 * fallback for browsers without `animation-timeline`, behind a separate CSS
 * class) rather than adopting the generic `.reveal`, so the two presentations
 * stay distinct while the observer mechanism is shared.
 */
export function createRevealObserver(
  options?: IntersectionObserverInit,
): IntersectionObserver {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, options);
  return observer;
}
