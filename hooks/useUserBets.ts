import { API_URL } from "@/config";
import { useState, useEffect } from "react";
import type { UserBetWithGameInfo } from "@/types";

// TODO: use usequery
export default function useUserBets() {
  const [activeBets, setActiveBets] = useState<UserBetWithGameInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getBets = async () => {
      try {
        const res = await fetch(`${API_URL}/bets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const bets: UserBetWithGameInfo[] = await res.json();
        console.log(bets);
        const pendingBets = bets.filter((bet) => bet.status === "PENDING");
        setActiveBets(pendingBets);
      } catch (e) {
        setError(e as any);
      }
      setLoading(false);
    };
    if (token) getBets();
  }, []);

  return { loading, activeBets, error };
}
