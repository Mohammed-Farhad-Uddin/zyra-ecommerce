import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="heading-display mt-4 text-5xl sm:text-6xl">This page slipped away</h1>
      <p className="mt-4 max-w-sm text-sm text-charcoal-400">
        The page or piece you are looking for is no longer available. Let us help you find
        something just as lovely.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
        <Link href="/shop" className="btn-outline">
          Shop the collection
        </Link>
      </div>
    </div>
  );
}
