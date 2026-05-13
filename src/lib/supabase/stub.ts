/**
 * Sunset stub: Supabase 雲端已停用。所有 .from() / .rpc() / auth 呼叫
 * 解析成空集合或可預期的 disabled error,讓現存 50+ 處呼叫站點不需逐一改寫。
 *
 * 真實資料以 public/data/*.json 提供;需要實際資料的頁面應改成直接讀檔。
 */

const DISABLED_ERROR = {
  message: "Supabase has been sunset; data is read-only via JSON snapshot.",
  code: "DISABLED",
  details: "",
  hint: "",
};

const READ_RESULT = { data: [], error: null, count: 0, status: 200, statusText: "OK" };
const SINGLE_RESULT = { data: null, error: null, count: null, status: 200, statusText: "OK" };
const WRITE_RESULT = {
  data: null,
  error: DISABLED_ERROR,
  count: null,
  status: 503,
  statusText: "Service Unavailable",
};

type Mode = "read" | "single" | "write";

class StubQueryBuilder implements PromiseLike<unknown> {
  constructor(private mode: Mode = "read") {}

  // mutating ops bump us into "write" mode
  insert() { return new StubQueryBuilder("write"); }
  upsert() { return new StubQueryBuilder("write"); }
  update() { return new StubQueryBuilder("write"); }
  delete() { return new StubQueryBuilder("write"); }

  // single() / maybeSingle() switch to single-result shape
  single() { return new StubQueryBuilder("single"); }
  maybeSingle() { return new StubQueryBuilder("single"); }

  // every other chainable method just returns the same builder
  select() { return this; }
  eq() { return this; }
  neq() { return this; }
  gt() { return this; }
  gte() { return this; }
  lt() { return this; }
  lte() { return this; }
  in() { return this; }
  not() { return this; }
  is() { return this; }
  ilike() { return this; }
  like() { return this; }
  match() { return this; }
  contains() { return this; }
  containedBy() { return this; }
  range() { return this; }
  limit() { return this; }
  order() { return this; }
  filter() { return this; }
  or() { return this; }
  and() { return this; }
  textSearch() { return this; }
  rangeGt() { return this; }
  rangeGte() { return this; }
  rangeLt() { return this; }
  rangeLte() { return this; }
  rangeAdjacent() { return this; }
  overlaps() { return this; }
  csv() { return this; }
  abortSignal() { return this; }
  returns<T>() { return this as unknown as StubQueryBuilder & T; }
  throwOnError() { return this; }

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    const result =
      this.mode === "write"
        ? WRITE_RESULT
        : this.mode === "single"
          ? SINGLE_RESULT
          : READ_RESULT;
    return Promise.resolve(result).then(onfulfilled, onrejected);
  }
}

class StubAuth {
  async getUser() {
    return { data: { user: null }, error: null };
  }
  async getSession() {
    return { data: { session: null }, error: null };
  }
  async signOut() {
    return { error: null };
  }
  onAuthStateChange() {
    return { data: { subscription: { unsubscribe() {} } } };
  }
  async signInWithPassword() {
    return { data: { user: null, session: null }, error: DISABLED_ERROR };
  }
  async signInWithOAuth() {
    return { data: { url: null, provider: "" }, error: DISABLED_ERROR };
  }
  async signUp() {
    return { data: { user: null, session: null }, error: DISABLED_ERROR };
  }
}

class StubSupabaseClient {
  auth = new StubAuth();

  from(_table: string) {
    return new StubQueryBuilder("read");
  }

  rpc(_fn: string, _args?: unknown) {
    return new StubQueryBuilder("read");
  }

  storage = {
    from: (_bucket: string) => ({
      upload: async () => ({ data: null, error: DISABLED_ERROR }),
      download: async () => ({ data: null, error: DISABLED_ERROR }),
      list: async () => ({ data: [], error: null }),
      remove: async () => ({ data: null, error: DISABLED_ERROR }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
    }),
  };

  channel(_name: string) {
    const ch: { on: () => typeof ch; subscribe: () => typeof ch } = {
      on() {
        return ch;
      },
      subscribe() {
        return ch;
      },
    };
    return ch;
  }

  removeChannel() {}
  removeAllChannels() {}
}

// Cast to `any` so the existing 50+ call sites (incl. scripts/) keep type-
// checking. The stub silently returns empty data / disabled errors, so
// strict typing of returned shapes adds no safety here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createStubClient(): any {
  return new StubSupabaseClient();
}
