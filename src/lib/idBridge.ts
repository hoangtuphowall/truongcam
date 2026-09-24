// The existing UI/components key everything (Person, Post, Story, Reel) by
// small `number` ids, seeded from local mock data. Supabase rows use UUID
// primary keys. Rather than rewriting every component's prop types to
// `string | number`, we assign each real UUID a synthetic number the first
// time we see it, and remember the mapping both ways. Real ids live in a
// high range so they can never collide with the small (1–10ish) ids used by
// the seed/demo data still rendered alongside them.

const POST_ID_BASE = 500_000;
const PERSON_ID_BASE = 100_000;

function makeBridge(base: number) {
  const toNumeric = new Map<string, number>();
  const toUuid = new Map<number, string>();
  let next = base;

  return {
    numericFor(uuid: string): number {
      const existing = toNumeric.get(uuid);
      if (existing !== undefined) return existing;
      const id = next++;
      toNumeric.set(uuid, id);
      toUuid.set(id, uuid);
      return id;
    },
    uuidFor(numericId: number): string | undefined {
      return toUuid.get(numericId);
    },
    isBridged(numericId: number): boolean {
      return toUuid.has(numericId);
    }
  };
}

export const postIdBridge = makeBridge(POST_ID_BASE);
export const personIdBridge = makeBridge(PERSON_ID_BASE);
