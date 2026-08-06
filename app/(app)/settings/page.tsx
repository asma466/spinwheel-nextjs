'use client';

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppButton } from "@/src/component/common/AppButton";
import { toast } from "sonner";
import { Eye, EyeOff, Lock } from "lucide-react";
import { signOut } from "next-auth/react";
import { DashboardLayout } from "@/src/component/Layout/DashboardLayout";
import axios from "axios";
import { PageHeader } from "@/src/component/common/PageHeader";
import { PasswordField } from "@/src/component/common/Password";

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
  const { data } = await axios.post("/api/change-password", {
    currentPassword,
    newPassword,
  });

  toast.success(data.message); // Axios already parses JSON

  setCurrentPassword("");
  setNewPassword("");

  // Sign out after update
  signOut({ callbackUrl: "/login" });

  } catch (error: any) {
    if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Something went wrong");
    }
  } finally {
    setLoading(false);
  }
}; // ✅ YOU MISSED THIS

const getPasswordStrength = (password: string) => {
  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
  if (score <= 4) return { label: "Medium", color: "bg-yellow-500", width: "66%" };

  return { label: "Strong", color: "bg-green-500", width: "100%" };
};

const strength = getPasswordStrength(newPassword);

//   return (
//     <DashboardLayout>
//       <div className="p-6 space-y-1">

//         {/* 🔥 Header */}
//         <div className="flex items-center justify-between">
//           <div>
//         <PageHeader
//   title="Settings" 

// />
          
//           </div>
//         </div>

//         {/* 🔥 Card */}
//       <div className="flex justify-start pt-1">
//           <div className=" w-full max-w-lg ">
//           <Card className="shadow-md   flex justify-center align-center ">
            
//             {/* Card Header */}
//             <CardHeader className="flex flex-row  gap-3">
//               <div className="p-2 rounded-xl bg-[#CE1B22]/10">
//                 <Lock className="w-5 h-5 text-[#CE1B22]"  />


//               </div>
//               <div>
//                 <CardTitle className="text-lg  text-[#CE1B22]">
//                   Change Password
//                 </CardTitle>
              
//               </div>
//             </CardHeader>

//             {/* Card Content */}
//             <CardContent>
//               <form
//                 onSubmit={handleChangePassword}
//                 className="space-y-5"
//               >

//                 {/* Current Password
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">
//                     Current Password
//                   </label>

//                   <div className="relative">
//                     <Input
//                       type={showCurrent ? "text" : "password"}
//                       placeholder="Enter current password"
//                       value={currentPassword}
//                       onChange={(e) =>
//                         setCurrentPassword(e.target.value)
//                       }
//                       required
//                       className="pr-10 h-11 rounded-xl"
//                     />

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowCurrent(!showCurrent)
//                       }
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black transition"
//                     >
//                       {showCurrent ? (
//                         <EyeOff size={18} />
//                       ) : (
//                         <Eye size={18} />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* New Password */}
//                 {/* <div className="space-y-2">
//                   <label className="text-sm font-medium">
//                     New Password
//                   </label>

//                   <div className="relative">
//                     <Input
//                       type={showNew ? "text" : "password"}
//                       placeholder="Enter new password"
//                       value={newPassword}
//                       onChange={(e) =>
//                         setNewPassword(e.target.value)
//                       }
//                       required
//                       className="pr-10 h-11 rounded-xl"
//                     />

//                     <button
//                       type="button"
//                       onClick={() => setShowNew(!showNew)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black transition"
//                     >
//                       {showNew ? (
//                         <EyeOff size={18} />
//                       ) : (
//                         <Eye size={18} />
//                       )}
//                     </button>
//                   </div> */}

//                     {/* Current Password */}
//                 <PasswordField
//                   label="Current Password"
//                   value={currentPassword}
//                   onChange={setCurrentPassword}
//                   placeholder="Enter current password"
//                   showPassword={showCurrent}
//                   toggleShow={() => setShowCurrent(!showCurrent)}
//                   required
//                 />

//                 {/* New Password */}
//                 <PasswordField
//                   label="New Password"
//                   value={newPassword}
//                   onChange={setNewPassword}
//                   placeholder="Enter new password"
//                   showPassword={showNew}
//                   toggleShow={() => setShowNew(!showNew)}
//                   required
//                 />

//                   {/* 🔥 Password Hint */}
//                   <p className="text-xs text-muted-foreground">
//                     Use at least 6–8 characters for better security
//                   </p>
//                   {/* 🔥 Password Strength Meter */}
// {newPassword && (
//   <div className="space-y-2">
    
//     {/* Bar */}
//     <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//       <div
//         className={`h-full transition-all duration-300 ${strength.color}`}
//         style={{ width: strength.width }}
//       />
//     </div>

//     {/* Label */}
//     <div className="flex justify-between text-xs">
//       <span className="text-muted-foreground">
//         Password strength
//       </span>
//       <span
//         className={`font-medium ${
//           strength.label === "Weak"
//             ? "text-red-500"
//             : strength.label === "Medium"
//             ? "text-yellow-500"
//             : "text-green-600"
//         }`}
//       >
//         {strength.label}
//       </span>
//     </div>
//   </div>
// )}
//                 </div> */}

//                 {/* Button */}
//                 <AppButton
//                   type="submit"
//                   loading={loading}
//                   className="w-full h-11 rounded-xl bg-[#CE1B22] hover:bg-[#b1191d] text-white font-medium transition"
//                 >
//                   {loading ? "Updating..." : "Update Password"}
//                 </AppButton>

//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       </div>
//     </DashboardLayout>
//   );


 return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        <PageHeader title="Settings" />

        <div className="w-full max-w-lg">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row gap-3 items-center">
              <div className="p-2 rounded-xl bg-[#CE1B22]/10">
                <Lock className="w-5 h-5 text-[#CE1B22]" />
              </div>
              <CardTitle className="text-lg text-[#CE1B22]">
                Change Password
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-5">

                {/* Current Password */}
                <PasswordField
                  label="Current Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  placeholder="Enter current password"
                  showPassword={showCurrent}
                  toggleShow={() => setShowCurrent(!showCurrent)}
                  required
                />

                {/* New Password */}
                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Enter new password"
                  showPassword={showNew}
                  toggleShow={() => setShowNew(!showNew)}
                  required
                />

                {/* Strength Meter */}
                {newPassword && (
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Password strength
                      </span>
                      <span
                        className={`font-medium ${
                          strength.label === "Weak"
                            ? "text-red-500"
                            : strength.label === "Medium"
                            ? "text-yellow-500"
                            : "text-green-600"
                        }`}
                      >
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}

                {/* Button */}
                <AppButton
                  type="submit"
                  loading={loading}
                  className="w-full h-11 rounded-xl bg-[#CE1B22] hover:bg-[#b1191d] text-white"
                >
                  {loading ? "Updating..." : "Update Password"}
                </AppButton>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );}

