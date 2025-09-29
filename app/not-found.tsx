import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2>Page Not Found</h2>
      <Link
        className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all px-4 py-2 hover:bg-accent hover:text-accent-foreground border-1 border-primary/50"
        href="/dashboard"
      >
        Return Home
      </Link>
    </div>
  );
}
