'use client';

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppButton } from "@/src/component/common/AppButton";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
          // ✅ FORCE LOGOUT HERE
  // signOut({ callbackUrl: "/login" });
  setTimeout(() => {
  signOut({ callbackUrl: "/login" });
}, 1500);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div className="p-6 flex justify-center">
  //     <Card className="w-full max-w-md shadow-xl">
  //       <CardHeader>
  //         <CardTitle className="text-xl text-center text-[#CE1B22]">
  //           Change Password
  //         </CardTitle>
  //       </CardHeader>

  //       <CardContent>
  //         <form onSubmit={handleChangePassword} className="space-y-4">

  //           {/* Current Password */}
  //           <div className="relative">
  //             <Input
  //               type={showCurrent ? "text" : "password"}
  //               placeholder="Current Password"
  //               value={currentPassword}
  //               onChange={(e) => setCurrentPassword(e.target.value)}
  //               required
  //             />
  //             <button
  //               type="button"
  //               onClick={() => setShowCurrent(!showCurrent)}
  //               className="absolute right-3 top-1/2 -translate-y-1/2"
  //             >
  //               {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
  //             </button>
  //           </div>

  //           {/* New Password */}
  //           <div className="relative">
  //             <Input
  //               type={showNew ? "text" : "password"}
  //               placeholder="New Password"
  //               value={newPassword}
  //               onChange={(e) => setNewPassword(e.target.value)}
  //               required
  //             />
  //             <button
  //               type="button"
  //               onClick={() => setShowNew(!showNew)}
  //               className="absolute right-3 top-1/2 -translate-y-1/2"
  //             >
  //               {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
  //             </button>
  //           </div>

  //           <AppButton
  //             type="submit"
  //             loading={loading}
  //             className="w-full bg-[#CE1B22] text-white"
  //           >
  //             {loading ? "Updating..." : "Update Password"}
  //           </AppButton>

  //         </form>
  //       </CardContent>
  //     </Card>
  //   </div>
  // );



return (
  <div className="p-6 space-y-6">

    {/* Page Header */}
    <div>
      <h1 className="text-2xl font-bold text-black">Settings</h1>
      <p className="text-[#7A7A7A] text-sm">
        Manage your account settings
      </p>
    </div>

    {/* Card */}
    <div className="max-w-md">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-[#CE1B22]">
            Change Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">

            {/* Current Password */}
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A] hover:text-black"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A] hover:text-black"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Button */}
            <AppButton
              type="submit"
              loading={loading}
              className="w-full bg-[#CE1B22] hover:bg-[#b1191d] text-white"
            >
              {loading ? "Updating..." : "Update Password"}
            </AppButton>

          </form>
        </CardContent>
      </Card>
    </div>

  </div>
);
}