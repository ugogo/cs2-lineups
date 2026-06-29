import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/15 text-sm font-bold text-orange-400 ring-1 ring-orange-500/30">
            CS
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-100 group-hover:text-white">
              CS2 Lineups
            </p>
            <p className="text-xs text-zinc-500">Personal nade library</p>
          </div>
        </Link>
        <Link
          href="/admin"
          className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
