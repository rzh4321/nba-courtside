import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config";
import type { UserBetWithGameInfo } from "@/types";

async function fetchUserBets(): Promise<UserBetWithGameInfo[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_URL}/bets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user bets");
  }

  return res.json();
}

export default function useUserBets() {
  const {
    data: bets = [],
    isLoading,
    isError,
    error,
  } = useQuery<UserBetWithGameInfo[], Error>({
    queryKey: ["userBets"],
    queryFn: fetchUserBets,
  });

  const activeBets = bets.filter((bet) => bet.status === "PENDING");
  const settledBets = bets.filter((bet) => bet.status !== "PENDING");

  return {
    loading: isLoading,
    error: isError ? error : null,
    activeBets,
    settledBets,
  };
}
