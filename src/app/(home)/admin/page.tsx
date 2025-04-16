// "use client";
// import React from "react";
// import {
//   Home,
//   ClipboardList,
//   Users,
//   Building2,
//   Settings,
//   BellDot,
//   User,
//   UserCog,
// } from "lucide-react";
// import LogoutButton from "@/app/(home)/_components/LogoutButton";
// import { Button } from "@/components/ui/button";
// import PendingApprovals from "./_components/pendingApprovals";
// import { RoleChangeRequests } from "./_components/RoleChangeRequests";

// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import { api } from "@/trpc/react";
// import { Card, CardDescription } from "@/components/ui/card";

// const Dashboard = () => 
//   const { data: getDashboardCount } = api.admin.getDashboardCount.useQuery();
//   console.log(getDashboardCount);

//   return (
//     <div className="flex h-screen w-full bg-gray-100">
//       <main className="relative flex flex-1 flex-col">
//         {/* Header */}

//         <div className="overflow-scroll">
//           <div className="relative mb-12 flex h-28 w-full items-center justify-between bg-gradient-to-r from-[#62CFF5] from-10% via-[#6296E7] via-100% px-6 md:px-12"></div>

//           <div className="relative -mt-16 flex space-x-6 px-6">
//             <DashboardCard
//               title="Pending Approvals"
//               count={getDashboardCount?.pendingApprovals ?? 0}
//               icon="/assets/images/pendingApproval.png"
//             />
//             <DashboardCard
//               title="Pending Role Change Requests"
//               count={getDashboardCount?.pendingRoleChanges ?? 0}
//               icon="/assets/images/pendingChange.png"
//             />
//           </div>

//           <div className="flex w-full gap-6 px-6 py-8">
//             <div className="w-[65%]">
//               <PendingApprovals />
//             </div>

//             <RoleChangeRequests />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// const DashboardCard = ({
//   title,
//   count,
//   icon,
// }: {
//   title: string;
//   count: number;
//   icon: string;
// }) => (
//   <Card className="flex px-40 items-center space-x-4 rounded-lg bg-white p-2 shadow-md">
//     <CardDescription>
//       <div className="flex flex-row gap-6 px-4 py-2">
//         <span className=""><img src={icon} className="h-10 w-10" /></span>
//         <div>
//           <h3 className="text-sm font-medium text-gray-600">{title}</h3>
//           <span className="text-3xl font-bold text-blue-600">{count}</span>
//         </div>
//       </div>
//     </CardDescription>

//   </Card>
// );

// export default Dashboard;




"use client";
import React from "react";
import {
  Home,
  ClipboardList,
  Users,
  Building2,
  Settings,
  BellDot,
  User,
  UserCog,
} from "lucide-react";
import LogoutButton from "@/app/(home)/_components/LogoutButton";
import { Button } from "@/components/ui/button";
import PendingApprovals from "./_components/pendingApprovals";
import { RoleChangeRequests } from "./_components/RoleChangeRequests";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { api } from "@/trpc/react";
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { data: getDashboardCount } = api.admin.getDashboardCount.useQuery();
  console.log(getDashboardCount);

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <main className="relative flex flex-1 flex-col">
        {/* Header */}
        <div className=" h-full pb-16 md:pb-0">
          <div className="relative mb-12 flex h-28 w-full items-center justify-between bg-gradient-to-r from-[#62CFF5] from-10% via-[#6296E7] via-100% px-4 md:px-6 lg:px-12"></div>

          <div className="relative -mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-6">
            <DashboardCard
              title="Pending Approvals"
              count={getDashboardCount?.pendingApprovals ?? 0}
              icon="/assets/images/pendingApproval.png"
            />
            <DashboardCard
              title="Pending Role Change Requests"
              count={getDashboardCount?.pendingRoleChanges ?? 0}
              icon="/assets/images/pendingChange.png"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-6 py-8">
            <div className="lg:col-span-2">
              <PendingApprovals />
            </div>
            <div className="lg:col-span-1">
              <RoleChangeRequests />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardCard = ({
  title,
  count,
  icon,
}: {
  title: string;
  count: number;
  icon: string;
}) => (
  <Card className="bg-white shadow-md">
    <CardContent className="p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          <img src={icon} className="h-10 w-10" alt={title} />
        </div>
        <div className="flex-grow">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <span className="text-3xl font-bold text-blue-600">{count}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;