"use client";

import { ActivityLog } from "@/src/hooks/useLogs";
import LogItem from "./LogsItems";

interface LogGroupProps {
  date: string;
  items: ActivityLog[];
}

export default function LogGroup({
  date,
  items,
}: LogGroupProps) {
  return (
    <div>
      {/* Date Heading */}

      <div className="sticky top-0 z-20 bg-gray-50 border-b px-8 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          {date}
        </h2>
      </div>

      <div className="relative px-8">
        {/* Timeline */}

        <div className="absolute left-[40px] top-0 bottom-0 w-px bg-gray-200" />

        {items.map((log) => (
          <LogItem
            key={log.id}
            log={log}
          />
        ))}
      </div>
    </div>
  );
}