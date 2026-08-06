"use client";

import { format } from "date-fns";
import { ActivityLog } from "@/src/hooks/useLogs";

import {
  getActionIcon,
  getActionStyle,
  getModuleIcon,
  humanizeField,
} from "@/src/utils/activityLogs";

interface LogItemProps {
  log: ActivityLog;
}

export default function LogItem({ log }: LogItemProps) {
  return (
    <div
      className="
      relative
      flex
      gap-5
      py-5
      group
      transition-all
      duration-300
      hover:bg-gray-50
      hover:px-4
      hover:rounded-2xl
      "
    >
      {/* Timeline Dot */}
      <div
        className="
        relative
        z-10
        flex
        h-6
        w-6
        items-center
        justify-center
        rounded-full
        border-[2.5px]
        border-gray-300
        bg-white
        transition-all
        duration-300
        group-hover:border-red-500
        group-hover:scale-110
        flex-shrink-0
      "
      >
        <div className="h-2 w-2 rounded-full bg-gray-700 group-hover:bg-red-500" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          {/* Left */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-bold text-sm text-gray-900">
                {log.userEmail}
              </h3>

              <span className="text-gray-500 text-xs">
                performed
              </span>

              <div
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase ${getActionStyle(
                  log.action
                )}`}
              >
                {getActionIcon(log.action)}
                {log.action}
              </div>

              <span className="text-gray-500 text-sm">
                on
              </span>

              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-bold uppercase text-gray-700">
                {getModuleIcon(log.module)}
                {log.module}
              </div>
            </div>

            <div className="mt-1.5 ml-2 border-l-2 border-gray-200 pl-3">
              <p className="italic text-xs text-gray-600 leading-4">
                {log.description}
              </p>

              {/* {log.action === "UPDATE" && log.changes && (
                <p className="text-xs text-gray-500 mt-2">
                  Updated fields:{" "}
                  <span className="font-medium text-gray-700">
                    {Object.keys(log.changes)
                      .map(humanizeField)
                      .join(", ")}
                  </span>
                </p>
              )} */}

{log.action === "UPDATE" &&
  log.changes &&
  Object.keys(log.changes).length > 0 && (
    <div className="mt-3 border-t border-gray-200 pt-3">
      <p className="text-xs font-semibold text-gray-700 mb-2">
        Changed Fields:
      </p>

      <div className="rounded-xl border border-yellow-300 bg-yellow-50 px-3 py-2">
        <div className="flex flex-wrap gap-2">
          {/* {Object.entries(log.changes).map(([field]) => (
            <span
              key={field}
              className="text-xs font-medium text-gray-700"
            >
              {humanizeField(field)}
            </span>
          ))} */}


          {Object.entries(log.changes).map(([field, change]: any) => (
  <div
    key={field}
    className="flex items-center gap-2 text-xs"
  >
    <span className="font-semibold">
      {humanizeField(field)}:
    </span>

    <span className="text-red-600">
      {change.before}
    </span>

    <span className="text-gray-500">→</span>

    <span className="text-green-600">
      {change.after}
    </span>
  </div>
))}
        </div>
      </div>
    </div>
)}
            </div>
          </div>

          {/* Right */}
          <div>
            <div
              className="
              rounded-full
              bg-gray-100
              border
              border-gray-200
              px-3.5
              py-1.5
              text-xs
              font-semibold
              text-gray-600
              shadow-sm
              min-w-40
              text-center
            "
            >
              {format(
                new Date(log.createdAt),
                "MMM dd, yyyy • hh:mm:ss a"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}