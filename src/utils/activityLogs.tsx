import {
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
} from "lucide-react";

import {
  format,
  isToday,
  isYesterday,
} from "date-fns";



export function getActionIcon(action: string) {
  switch (action) {
    case "CREATE":
      return <UserPlus size={15} />;

    case "UPDATE":
      return <Pencil size={15} />;

    case "DELETE":
      return <Trash2 size={15} />;

    case "LOGIN":
      return <LogIn size={15} />;

    case "LOGOUT":
      return <LogOut size={15} />;

    case "EMAIL":
      return <Mail size={15} />;

    case "SPIN":
      return <RotateCw size={15} />;

    case "ASSIGN":
      return <Package size={15} />;

    default:
      return <Gift size={15} />;
  }
}

export function getActionStyle(action: string) {

  switch (action) {

    case "CREATE":
      return "bg-green-50 text-green-700 border-green-200";

    case "UPDATE":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "DELETE":
      return "bg-red-50 text-red-700 border-red-200";

    case "EMAIL":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "LOGIN":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "SPIN":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";

    case "ASSIGN":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";

    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }

}

export function getModuleIcon(module: string) {

  switch (module) {

    case "EMPLOYEES":
      return <UserPlus size={14} />;

    case "GIFTS":
      return <Gift size={14} />;

    case "BIRTHDAYS":
      return <Mail size={14} />;

    case "AUTHENTICATION":
      return <Shield size={14} />;

    case "SPINWHEEL":
      return <RotateCw size={14} />;

    default:
      return <Package size={14} />;
  }

}


export function formatHeading(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "dd MMMM yyyy");
}

export function humanizeField(field: string) {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
