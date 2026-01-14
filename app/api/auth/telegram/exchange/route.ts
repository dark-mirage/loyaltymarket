import { NextResponse } from "next/server";

import { handoffStore } from "../_handoffStore";
import {
  randomHandoffCode,
  validateTelegramInitDataOrThrow,
} from "@/app/shared/lib/telegramAuthServer";

type ExchangeBody = {
  initData?: unknown;
};

export async function POST(req: Request) {
  const botToken = process.env.TG_BOT_TOKEN;
  const externalAppUrl = process.env.EXTERNAL_APP_URL;

  if (!botToken) {
    return NextResponse.json(
      { error: "Missing TG_BOT_TOKEN" },
      { status: 500 }
    );
  }
  if (!externalAppUrl) {
    return NextResponse.json(
      { error: "Missing EXTERNAL_APP_URL" },
      { status: 500 }
    );
  }

  let body: ExchangeBody;
  try {
    body = (await req.json()) as ExchangeBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.initData !== "string" || !body.initData) {
    return NextResponse.json(
      { error: "initData must be a string" },
      { status: 400 }
    );
  }

  let parsed;
  try {
    parsed = validateTelegramInitDataOrThrow({
      initData: body.initData,
      botToken,
      maxAgeSeconds: 300,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid initData" },
      { status: 401 }
    );
  }

  const handoff = randomHandoffCode();
  const now = Date.now();
  handoffStore.set(handoff, {
    user: parsed.user,
    createdAtMs: now,
    expiresAtMs: now + 60_000,
  });

  const url = new URL(externalAppUrl);
  url.searchParams.set("handoff", handoff);

  return NextResponse.json({ launchUrl: url.toString() }, { status: 200 });
}
