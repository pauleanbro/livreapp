import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";

import { useAuthStore } from "@/stores/authStore";

export default function DashboardLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/auth");
    }
  }, [accessToken, router]);

  return <Slot />;
}
