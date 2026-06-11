import { ReviewBoard } from "./ReviewBoard";
import { reviewPages } from "./reviewContent";

// Internal tool — render fully on the client side for the interactive board,
// but keep the route itself static (the content model is build-time data).
export const dynamic = "force-static";

export default function ReviewPage() {
  return <ReviewBoard pages={reviewPages} />;
}
