import Link from "next/link";
import { CatFace } from "@/components/Doodles";

export default function NotFound() {
  return (
    <div className="empty">
      <CatFace size={56} />
      <h1 className="h-page">That page isn't here</h1>
      <p>The link may be old. Head back to <Link href="/">the home page</Link> or <Link href="/rooms">pick a room</Link>.</p>
    </div>
  );
}
