import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold">CoachFlow</h1>
      <p className="text-gray-500 mt-2 mb-6">Operating system for fitness coaches</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Sign up
        </Link>
      </div>
    </main>
  );
}
