import { useEffect, useState } from "react";
import { getTask, type TaskDetailsData } from "../dal/api.ts";

export function useTaskDetails(taskId: string | null, boardId: string | null) {
  const [taskDetails, setTaskDetails] = useState<TaskDetailsData | null>(null);

  useEffect(() => {
    if (!taskId || !boardId) {
      return;
    }

    let cancelled = false;

    getTask(taskId, boardId)
      .then((json) => {
        if (!cancelled) {
          setTaskDetails(json.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [boardId, taskId]);

  const visibleTaskDetails =
    taskId && boardId && taskDetails?.id === taskId ? taskDetails : null;

  return {
    taskDetails: visibleTaskDetails,
  };
}