"use client";

import { useState } from "react";
import Link from "next/link";
import { getJoinedMerchGroups, useMerchGroupShare } from "@/lib/data/merch/merchSocial";
import { recordClientActivity } from "@/lib/activityClient";

export default function ShareToGroup() {
  const [open, setOpen] = useState(false);
  const { sharedTo, share } = useMerchGroupShare();
  const groups = getJoinedMerchGroups();
  const sharedName = groups.find((group) => group.slug === sharedTo)?.name;
  return <div className="merch-share"><button type="button" className="btn btn-ghost" onClick={() => setOpen((value) => !value)} aria-expanded={open}>Share to Group</button>{sharedName ? <span className="small" role="status">Shared to {sharedName}</span> : null}{open ? <div className="merch-share-panel card c-cream" role="dialog" aria-label="Share to a group"><strong>Choose a joined group</strong>{groups.map((group) => <button type="button" className="text-button merch-share-choice" key={group.slug} onClick={() => { share(group.slug); recordClientActivity("SHARE", "GROUP", group.slug); setOpen(false); }}>Share to {group.name}</button>)}<Link href="/community" className="small back-link">Find more communities →</Link></div> : null}</div>;
}
