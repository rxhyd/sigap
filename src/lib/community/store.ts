"use client";

import { useMemo } from "react";
import { communityThreads as dummyThreads } from "@/lib/content/communityThreads";
import { useLocalStorageRaw, setLocalStorageItem } from "@/lib/storage/useLocalStorage";
import type { CommunityComment, CommunityThread } from "@/lib/types/community";

const MY_THREADS_KEY = "sigap:community:my-threads";
const EXTRA_COMMENTS_KEY = "sigap:community:extra-comments";

type ExtraCommentsMap = Record<string, CommunityComment[]>;

function parseMyThreads(raw: string | null): CommunityThread[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CommunityThread[];
  } catch {
    return [];
  }
}

function parseExtraComments(raw: string | null): ExtraCommentsMap {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ExtraCommentsMap;
  } catch {
    return {};
  }
}

function readMyThreads(): CommunityThread[] {
  return parseMyThreads(localStorage.getItem(MY_THREADS_KEY));
}

function writeMyThreads(threads: CommunityThread[]) {
  setLocalStorageItem(MY_THREADS_KEY, JSON.stringify(threads));
}

function readExtraComments(): ExtraCommentsMap {
  return parseExtraComments(localStorage.getItem(EXTRA_COMMENTS_KEY));
}

function writeExtraComments(map: ExtraCommentsMap) {
  setLocalStorageItem(EXTRA_COMMENTS_KEY, JSON.stringify(map));
}

/** All threads (dummy + locally-created), newest first, with locally-added comments merged in. */
export function useCommunityThreads(): CommunityThread[] {
  const myThreadsRaw = useLocalStorageRaw(MY_THREADS_KEY);
  const extraCommentsRaw = useLocalStorageRaw(EXTRA_COMMENTS_KEY);

  return useMemo(() => {
    const myThreads = parseMyThreads(myThreadsRaw);
    const extraComments = parseExtraComments(extraCommentsRaw);

    const mergedDummy = dummyThreads.map((thread) => ({
      ...thread,
      comments: [...thread.comments, ...(extraComments[thread.id] ?? [])],
    }));

    return [...myThreads, ...mergedDummy].sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
  }, [myThreadsRaw, extraCommentsRaw]);
}

export function useCommunityThread(id: string): CommunityThread | undefined {
  const threads = useCommunityThreads();
  return threads.find((thread) => thread.id === id);
}

export function createThread(input: { author: string; region: string; message: string }): string {
  const id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const thread: CommunityThread = {
    id,
    author: input.author,
    region: input.region,
    message: input.message,
    postedAt: new Date().toISOString(),
    viewCount: 1,
    comments: [],
    isOwn: true,
  };
  writeMyThreads([thread, ...readMyThreads()]);
  return id;
}

export function updateOwnThread(id: string, updates: { message: string; region: string }) {
  writeMyThreads(readMyThreads().map((thread) => (thread.id === id ? { ...thread, ...updates } : thread)));
}

export function deleteOwnThread(id: string) {
  writeMyThreads(readMyThreads().filter((thread) => thread.id !== id));
}

export function bumpOwnThreadViews(id: string, amount: number) {
  writeMyThreads(
    readMyThreads().map((thread) => (thread.id === id ? { ...thread, viewCount: thread.viewCount + amount } : thread))
  );
}

export function addComment(threadId: string, isOwnThread: boolean, comment: CommunityComment) {
  if (isOwnThread) {
    writeMyThreads(
      readMyThreads().map((thread) =>
        thread.id === threadId ? { ...thread, comments: [...thread.comments, comment] } : thread
      )
    );
    return;
  }

  const map = readExtraComments();
  map[threadId] = [...(map[threadId] ?? []), comment];
  writeExtraComments(map);
}
