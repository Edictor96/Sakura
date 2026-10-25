import type { UserSummary } from "@/lib/data/home/homeData";

export function YourSakura({ summary }: { summary: UserSummary }) {
  return (
    <section className="block" aria-labelledby="sakura-title">
      <h2 id="sakura-title" className="h-section">Your Sakura</h2>
      <div className="user-summary-card card c-mint wob1">
        <div className="summary-grid">
          <div className="summary-item"><span className="summary-val">{summary.communitiesJoined}</span><span className="summary-lbl">Communities</span></div>
          <div className="summary-item"><span className="summary-val">{summary.titlesSaved}</span><span className="summary-lbl">Titles Saved</span></div>
          <div className="summary-item"><span className="summary-val">{summary.eventsComingUp}</span><span className="summary-lbl">Events</span></div>
          <div className="summary-item"><span className="summary-val">{summary.interestsActive}</span><span className="summary-lbl">Interests</span></div>
        </div>
      </div>
    </section>
  );
}
