import getGameIds from "@/actions/getGameIds";
import useSWR from "swr";

export default function useGameIds(date: string) {
  const { data, isValidating, error } = useSWR(
    `/api/gameIds/${date}`,
    async (url) => {
      return await getGameIds();
    },
  );
  return { data, isLoading: isValidating, error };
}
