import { ACTIVE_DUTY_MAPS } from "@/lib/constants";
import type { GrenadeType, Side, ThrowMethod } from "@/lib/types";

export interface ParsedTweetMetadata {
  title: string;
  map_slug: string | null;
  grenade_type: GrenadeType;
  side: Side;
  throw_method: ThrowMethod;
  site: string | null;
  notes: string | null;
}

const GRENADE_PATTERNS: { type: GrenadeType; pattern: RegExp }[] = [
  { type: "smoke", pattern: /\bsmokes?\b/i },
  { type: "flash", pattern: /\bflash(?:bang)?s?\b/i },
  { type: "molotov", pattern: /\b(?:molotov|molo|incendiary)\b/i },
  { type: "he", pattern: /\b(?:he|frag)\s*(?:nade|grenade)?\b/i },
];

const SITE_PATTERNS: { site: string; pattern: RegExp }[] = [
  { site: "Banana", pattern: /\bbanana\b/i },
  { site: "Mid", pattern: /\bmid(?:dle)?\b/i },
  { site: "A", pattern: /\b(?:a\s*site|site\s*a)\b/i },
  { site: "B", pattern: /\b(?:b\s*site|site\s*b)\b/i },
  { site: "Heaven", pattern: /\bheaven\b/i },
  { site: "Window", pattern: /\bwindow\b/i },
  { site: "CT", pattern: /\bct\s*(?:spawn|side)?\b/i },
  { site: "T Spawn", pattern: /\bt\s*spawn\b/i },
];

function cleanTitle(text: string): string {
  return text
    .replace(/https?:\/\/\S+/g, "")
    .replace(/#\w+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function parseMap(text: string): string | null {
  const lower = text.toLowerCase();
  for (const map of ACTIVE_DUTY_MAPS) {
    const nameLower = map.name.toLowerCase();
    const slugLower = map.slug.toLowerCase();
    if (lower.includes(nameLower) || lower.includes(slugLower.replace("dust2", "dust 2"))) {
      return map.slug;
    }
    if (map.slug === "dust2" && /\bdust\s*2\b/i.test(text)) {
      return map.slug;
    }
  }
  return null;
}

function parseGrenade(text: string): GrenadeType {
  for (const { type, pattern } of GRENADE_PATTERNS) {
    if (pattern.test(text)) return type;
  }
  return "smoke";
}

function parseSide(text: string): Side {
  if (/\bct[\s-]?side\b/i.test(text) || /\bon\s+ct\b/i.test(text)) return "CT";
  if (/\bt[\s-]?side\b/i.test(text) || /\bon\s+t\b/i.test(text)) return "T";
  if (/\bct\b/i.test(text) && !/\bt\b/i.test(text)) return "CT";
  return "T";
}

function parseThrowMethod(text: string): ThrowMethod {
  if (/\bjump[\s-]?throw\b/i.test(text)) return "jump_throw";
  if (/\brun[\s-]?throw\b/i.test(text)) return "run_throw";
  if (/\bstanding\b/i.test(text)) return "standing";
  if (/\blmb\s*\+\s*rmb\b/i.test(text) || /\bleft\s*\+\s*right\b/i.test(text)) {
    return "lmb_rmb";
  }
  if (/\bright\s*click\b/i.test(text) || /\brmb\b/i.test(text)) return "rmb";
  if (/\bleft\s*click\b/i.test(text) || /\blmb\b/i.test(text)) return "lmb";
  return "jump_throw";
}

function parseSite(text: string): string | null {
  for (const { site, pattern } of SITE_PATTERNS) {
    if (pattern.test(text)) return site;
  }
  return null;
}

export function parseTweetText(tweetText: string): ParsedTweetMetadata {
  const title = cleanTitle(tweetText) || "Imported lineup";

  return {
    title,
    map_slug: parseMap(tweetText),
    grenade_type: parseGrenade(tweetText),
    side: parseSide(tweetText),
    throw_method: parseThrowMethod(tweetText),
    site: parseSite(tweetText),
    notes: null,
  };
}
