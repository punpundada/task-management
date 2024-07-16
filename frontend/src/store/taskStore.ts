import TaskService from "@/services/taskService";
import { TaskTableList } from "@/types/task";
import { create } from "zustand";

interface TaskStore {
  taskList: TaskTableList[];
  setTaskList: (tasks: TaskTableList[]) => void;
  addNewTask: (task: TaskTableList) => void;
  removeTaskById: (taskId: number) => void;
  updateTask: (taskId: number, task: TaskTableList) => void;
  getTaskList: () => Promise<TaskTableList[]>;
}

const useTaskStore = create<TaskStore>()((set) => ({
  taskList: [],
  setTaskList: (tasks) => {
    set(() => ({ taskList: tasks }));
  },
  addNewTask: (task) => {
    set((state) => {
      state.taskList.unshift(task);
      return { taskList: state.taskList };
    });
  },
  removeTaskById: (taskId) => {
    set((state) => {
      const index = state.taskList.findIndex((x) => x.id === taskId);
      if (index === -1) return state;
      const firstTasks = state.taskList.slice(0, index);
      const secondTasks = state.taskList.slice(index + 1);
      return { taskList: [...firstTasks, ...secondTasks] };
    });
  },
  updateTask: (taskId, task) => {
    set((state) => {
      const updatedState = state.taskList.map((item) => {
        if (item.id === taskId) {
          return task;
        }
        return item;
      });
      return { taskList: updatedState };
    });
  },
  getTaskList: async () => {
    const data = await TaskService.getTableList();
    if (data.isSuccess) {
      set({ taskList: data.result });
      return data.result;
    }
    return [];
  },
}));

export default useTaskStore;
