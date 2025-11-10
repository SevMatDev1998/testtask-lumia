import { useEffect } from "react";
import { useLumiaPassportSession } from "@lumiapassport/ui-kit";

export function useAuth() {
  const { session } = useLumiaPassportSession();

  useEffect(() => {
    const storeSession = async () => {
      if (session) {
        try {
          const allKeys = Object.keys(localStorage);
          const lumiaKeys = allKeys.filter(key => key.includes('lumia'));
          
          for (const key of lumiaKeys) {
            try {
              const data = JSON.parse(localStorage.getItem(key) || "{}");
              if (data.accessToken) {
                localStorage.setItem("sessionToken", data.accessToken);
                console.log("Session token saved");
                return;
              }
              if (data.sessionToken) {
                localStorage.setItem("sessionToken", data.sessionToken);
                console.log("Session token saved");
                return;
              }
            } catch {}
          }
        } catch {
          console.error("Failed to parse session");
        }
      } else {
        localStorage.removeItem("sessionToken");
      }
    };

    storeSession();
  }, [session]);

  return { session };
}
