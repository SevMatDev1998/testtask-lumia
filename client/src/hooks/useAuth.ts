import { useEffect, useState } from "react";
import { useLumiaPassportSession } from "@lumiapassport/ui-kit";

export function useAuth() {
  const { session } = useLumiaPassportSession();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const storeSession = async () => {
      if (session) {
        try {
          const sessionData = session as any;
          let address = null;
          
          if (sessionData.accounts?.[0]?.address) {
            address = sessionData.accounts[0].address;
          } else if (sessionData.address) {
            address = sessionData.address;
          } else if (sessionData.user?.address) {
            address = sessionData.user.address;
          }
          
          if (address) {
            setWalletAddress(address);
          }

          const allKeys = Object.keys(localStorage);
          const lumiaKeys = allKeys.filter(key => key.includes('lumia'));
          
          for (const key of lumiaKeys) {
            try {
              const data = JSON.parse(localStorage.getItem(key) || "{}");
              if (data.accessToken) {
                localStorage.setItem("sessionToken", data.accessToken);
                setSessionToken(data.accessToken);
                return;
              }
              if (data.sessionToken) {
                localStorage.setItem("sessionToken", data.sessionToken);
                setSessionToken(data.sessionToken);
                return;
              }
            } catch {
              continue;
            }
          }
        } catch {
          
        }
      } else {
        localStorage.removeItem("sessionToken");
        setSessionToken(null);
        setWalletAddress(null);
      }
    };

    storeSession();
  }, [session]);

  return { session, sessionToken, walletAddress };
}
