import type { EventItem } from "./eventsData";

export type WatchAlongPhase = "Upcoming" | "Welcome" | "Watching" | "Discussion Break" | "Poll Live" | "Trivia" | "Closing" | "Ended";
export type WatchAlongFeedType = "announcement" | "poll" | "discussion" | "trivia" | "reaction" | "milestone";

export interface WatchAlongAgendaItem {
  time: string;
  label: string;
  phase: WatchAlongPhase;
}

export interface WatchAlongPoll {
  id: string;
  question: string;
  options: string[];
  participants: number;
  results: number[];
  agendaIndex: number;
}

export interface WatchAlongTrivia {
  id: string;
  question: string;
  options: string[];
  answer: string;
  agendaIndex: number;
}

export interface WatchAlongFeedEntry {
  id: string;
  type: WatchAlongFeedType;
  author?: string;
  body: string;
  agendaIndex: number;
}

export interface WatchAlongData {
  eventId: string;
  startTime: string;
  agenda: WatchAlongAgendaItem[];
  rules: string[];
  polls: WatchAlongPoll[];
  trivia: WatchAlongTrivia[];
  announcements: string[];
  discussionPrompts: string[];
  reactions: string[];
  participationBadges: string[];
  recap: {
    attendance: number;
    highlights: string[];
    hostSummary: string;
    nextEventId?: string;
  };
}

const sharedAgenda: WatchAlongAgendaItem[] = [
  { time: "19:00", label: "Doors open", phase: "Upcoming" },
  { time: "19:05", label: "Host welcome", phase: "Welcome" },
  { time: "19:10", label: "Everyone starts", phase: "Watching" },
  { time: "19:25", label: "Poll: favourite character", phase: "Poll Live" },
  { time: "19:40", label: "Discussion break", phase: "Discussion Break" },
  { time: "19:50", label: "Trivia round", phase: "Trivia" },
  { time: "20:05", label: "Final discussion", phase: "Closing" },
  { time: "20:15", label: "Event ends", phase: "Ended" },
];

export const watchAlongData: Record<string, WatchAlongData> = {
  "online-yoasobi-listen": {
    eventId: "online-yoasobi-listen",
    startTime: "2026-11-03T19:00:00+05:30",
    agenda: sharedAgenda,
    rules: ["Keep spoilers inside the current moment.", "Sakura coordinates the experience, not the content.", "Be kind when interpretations differ."],
    polls: [{ id: "yoasobi-poll-1", question: "Which moment stayed with you most?", options: ["The opening", "The bridge", "The final chorus", "The quiet pause"], participants: 18, results: [28, 22, 38, 12], agendaIndex: 3 }],
    trivia: [{ id: "yoasobi-trivia-1", question: "30-second Sakura Trivia: what does YOASOBI turn into songs?", options: ["Short stories", "Manga panels", "Game quests", "Fan polls"], answer: "Short stories", agendaIndex: 5 }],
    announcements: ["Doors are open — settle in with your own subscription ready.", "Everyone ready? Start listening now.", "Poll closes in 30 seconds.", "Pause here — discussion break.", "Final round. Thanks for joining."],
    discussionPrompts: ["What did the final chorus make you feel?", "Which story detail would you carry into a sequel?"],
    reactions: ["❤️", "🔥", "😂", "😭", "👀"],
    participationBadges: ["Joined early", "Participated in first poll", "Completed trivia", "Stayed until the end"],
    recap: { attendance: 21, highlights: ["A close vote for the final chorus", "The bridge inspired the longest discussion", "18 people joined the first poll"], hostSummary: "Meera says the best part was hearing how one song landed differently in every city.", nextEventId: "online-frieren-watch" },
  },
  "online-frieren-watch": {
    eventId: "online-frieren-watch",
    startTime: "2026-11-12T19:00:00+05:30",
    agenda: sharedAgenda,
    rules: ["Use your own legal subscription.", "No plot details ahead of the scheduled moment.", "Leave room for quieter voices."],
    polls: [{ id: "frieren-poll-1", question: "Who had the best moment in this chapter?", options: ["Frieren", "Fern", "Stark", "The small village"], participants: 12, results: [42, 24, 18, 16], agendaIndex: 3 }],
    trivia: [{ id: "frieren-trivia-1", question: "30-second Sakura Trivia: what does Frieren collect?", options: ["Grimoire spells", "First-class stamps", "Hero statues", "Tea cups"], answer: "Grimoire spells", agendaIndex: 5 }],
    announcements: ["The lobby is open. Your chapter and episode are yours to start.", "Start watching now.", "Poll closes in 30 seconds.", "Take five minutes to discuss the final scene.", "Thanks for joining this little journey."],
    discussionPrompts: ["What did the final scene change for you?", "Which small detail deserves a rewatch?"],
    reactions: ["❤️", "🔥", "😂", "😭", "👀"],
    participationBadges: ["Joined early", "Completed trivia", "Stayed until the end"],
    recap: { attendance: 16, highlights: ["Fern led the favourite character poll", "A detail-hunting discussion filled the break"], hostSummary: "Tara says the quietest observations made the strongest conversation.", nextEventId: "online-yoasobi-listen" },
  },
};

export const getWatchAlong = (event: EventItem) => event.type === "Watch-along" ? watchAlongData[event.id] : undefined;
