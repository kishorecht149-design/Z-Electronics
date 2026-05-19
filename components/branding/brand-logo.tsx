import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: Route;
  showText?: boolean;
  compact?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
  imageClassName?: string;
  wrapperClassName?: string;
};

export function BrandLogo({
  href = "/",
  showText = true,
  compact = false,
  titleClassName = "text-base font-semibold text-white",
  subtitleClassName = "text-xs text-white/50",
  imageClassName = "h-11 w-11 rounded-2xl object-cover",
  wrapperClassName = "flex items-center gap-3"
}: BrandLogoProps) {
  const content = (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(34,211,238,0.14)]">
        <Image
          src="/z-electronics-logo.jpg"
          alt="Z Electronics logo"
          width={compact ? 40 : 44}
          height={compact ? 40 : 44}
          className={imageClassName}
          priority
        />
      </div>
      {showText ? (
        <div>
          <p className={titleClassName}>Z Electronics</p>
          <p className={subtitleClassName}>Powered by Young Minds</p>
        </div>
      ) : null}
    </>
  );

  return (
    <Link href={href} className={wrapperClassName}>
      {content}
    </Link>
  );
}
