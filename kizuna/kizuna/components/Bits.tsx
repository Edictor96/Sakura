import type { ReactNode } from "react";
import { usingSampleData } from "@/lib/data";

export function PageHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="page-head">
      <h1 className="h-page">{title}</h1>
      {children ? <p className="lede">{children}</p> : null}
    </header>
  );
}

/** Shown only while the app runs on built-in sample data. */
export function SampleNote({ what }: { what: string }) {
  if (!usingSampleData) return null;
  return (
    <p className="sample-note" role="note">
      Sample {what}. Real ones appear once the backend is connected.
    </p>
  );
}
