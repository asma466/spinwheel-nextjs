import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard");
      return data;
    },
  });
};
