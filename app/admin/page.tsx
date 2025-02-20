// // app/admin/page.tsx
// "use client";

// import { useEffect } from "react";
// import { createClient } from "@/utils/supabase/client";
// import AdminPanel from "@/components/danish/AdminPanel";
// export default function AdminPage() {
//   const supabase = createClient();

//   useEffect(() => {
//     const checkAdmin = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user?.email?.endsWith("@gmail.com")) {
//         window.location.href = "/";
//       }
//     };
//     checkAdmin();
//   }, []);

//   return <AdminPanel />;
// }



// app/admin/page.tsx
"use client";

import AdminPanel from "@/components/danish/AdminPanel";

export default function AdminPage() {
  return <AdminPanel />;
}
