import { useQuery } from "@tanstack/react-query";
import { useStore } from "./use-store";

export function useTasks() {
  const { taskStore } = useStore();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const result = await taskStore.getTasks();
      return result;
    },
  });
}
