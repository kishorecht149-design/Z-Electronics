import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="page-shell py-24">
      <GlassCard className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">This route could not be found.</h1>
        <p className="mt-4 text-sm leading-7 text-white/60">
          The requested catalog or dashboard page is unavailable right now.
        </p>
        <Link href="/" className="mt-8 inline-block">
          <Button>Back to home</Button>
        </Link>
      </GlassCard>
    </div>
  );
}
