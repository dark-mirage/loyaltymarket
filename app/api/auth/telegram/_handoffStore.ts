import "server-only";

type HandoffPayload = {
  user: unknown | null;
  createdAtMs: number;
  expiresAtMs: number;
};

type Store = {
  set: (code: string, payload: HandoffPayload) => void;
  consume: (code: string) => HandoffPayload | null;
};

function getGlobalStore(): Map<string, HandoffPayload> {
  const g = globalThis as unknown as {
    __tg_handoff_store?: Map<string, HandoffPayload>;
  };
  if (!g.__tg_handoff_store) g.__tg_handoff_store = new Map();
  return g.__tg_handoff_store;
}

function cleanupExpired(store: Map<string, HandoffPayload>, now: number) {
  for (const [k, v] of store.entries()) {
    if (v.expiresAtMs <= now) store.delete(k);
  }
}

export const handoffStore: Store = {
  set(code, payload) {
    const store = getGlobalStore();
    cleanupExpired(store, Date.now());
    store.set(code, payload);
  },
  consume(code) {
    const store = getGlobalStore();
    cleanupExpired(store, Date.now());
    const payload = store.get(code) ?? null;
    if (payload) store.delete(code);
    return payload;
  },
};
