

"use client";

import { useMemo, useState } from "react";


import {
  ClipboardList,
  UserPlus,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  Mail,
  RotateCw,
  Package,
  Gift,
  Shield,
  Search,
} from "lucide-react";

import { DashboardLayout } from "@/src/component/Layout/DashboardLayout";
import { EmptyState } from "@/src/component/common/EmptyState";
import { Loader } from "@/src/component/common/Loader";

import { useLogs, ActivityLog } from "@/src/hooks/useLogs";
import { useDebounce } from "@/src/hooks/useDebounce";
import {
  getActionIcon,
  getActionStyle,
  getModuleIcon,
  formatHeading,
  humanizeField,
} from "@/src/utils/activityLogs";
import { SearchInput } from "@/src/component/common/SearchInput";
import LogItem from "@/src/component/activityLogs/LogsItems";
import LogGroup from "@/src/component/activityLogs/LogGroups";


function formatChangeSummary(log: ActivityLog) {
  if (log.action !== "UPDATE" || !log.changes) return null;

  const fields = Object.keys(log.changes);
  if (!fields.length) return null;

  return (
    <p className="text-xs text-gray-500 mt-2">
      Updated fields:{" "}
      <span className="font-medium text-gray-700">{fields.map(humanizeField).join(", ")}</span>
    </p>
  );
}


export default function LogsPage() {

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useLogs(
    debouncedSearch,
    1,
    1000
  );

  const logs = data?.data ?? [];

  const groupedLogs = useMemo(
    () =>
      logs.reduce((groups: Record<string, ActivityLog[]>, log) => {
        const heading = formatHeading(new Date(log.createdAt));
        groups[heading] ||= [];
        groups[heading].push(log);
        return groups;
      }, {}),
    [logs]
  );


  //group logs



  return (

    <DashboardLayout>

      {/* <div className="min-h-screen bg-white"> */}
      <div className="min-h-screen bg-[#fafafa]">

        <div className="max-w-7xl mx-auto px-10 py-12">

          <div className="flex items-center justify-between mb-12">

            <div>

              <h1 className="text-4xl font-black text-gray-900">

                Activity Logs

              </h1>

              <p className="text-gray-500 mt-3 text-base">

                Audit trail of all administrative and spin events across the system.

              </p>

            </div>

            {/* <div className="relative w-80">

              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => {

                  setSearch(e.target.value);

                }}
                placeholder="Search logs..."
                className="w-full h-11 rounded-full border border-gray-300 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-red-500"
              />

            </div> */}

<SearchInput
    value={search}
    onChange={setSearch}
/>
          </div>


          {isLoading ? (

            <div className="flex justify-center py-32">
              <Loader />
            </div>

          ) : logs.length === 0 ? (

            <EmptyState
              icon={ClipboardList}
              title="No Activity Logs"
              description="No activity has been recorded yet."
            />

          ) : (
            <>
              <div className="rounded-[32px] border border-gray-200 bg-white shadow-xl overflow-hidden">

        {Object.entries(groupedLogs).map(([date, items]) => (
  <LogGroup
    key={date}
    date={date}
    items={items}
  />
))}

              </div>
            </>

          )}

        </div>

      </div>

    </DashboardLayout>

  );

}