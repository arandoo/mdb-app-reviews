"use client";

import { signOut, useSession } from "next-auth/react";

export function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        {session?.user && (
          <span className="text-sm text-gray-600">{session.user.email}</span>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
