import { expect, test, mock, describe, beforeEach } from "bun:test";
import TasksService from "../../service/taskService";
import type {
  TaskCalanderDataType,
  TaskInsert,
  TaskPieChartDataType,
  TaskSelect,
} from "../../types/task";
import { CustomError, STATUS_CODES } from "../../utils/lib";
import { ZodError } from "zod";
import { getUnixTime } from "date-fns";

const mockDb = {
  insert: mock(),
  select: mock(),
  update: mock(),
  delete: mock(),
  query: {
    task: {
      findFirst: mock(),
      findMany: mock(),
    },
  },
};
const taskService = new TasksService(mockDb as any);

describe("TaskService/saveTasks", () => {
  test("SaveTask should save task and return value", async () => {
    const mockTask = {
      title: "Test Task",
      status: "TODO",
      description: "this is mock rescription",
      label: "FEATURE",
      projectId: 1,
      userId: "1",
      todoDate: new Date(),
      createdDate: new Date(),
      priority: "HIGH",
      backlogDate: null,
      cancledDate: null,
      doneDate: null,
      inprogressDate: null,
      id: undefined,
    } satisfies TaskInsert;

    const mockSavedTask = { ...mockTask, id: 2, createdDate: new Date() };
    mockDb.insert.mockReturnValueOnce({
      values: mock().mockReturnValueOnce({
        returning: mock().mockResolvedValueOnce([mockSavedTask]),
      }),
    });

    const result = await taskService.saveTasks(mockTask);

    expect(mockDb.insert).toHaveBeenCalledWith(expect.anything());
    expect(result).toEqual([mockSavedTask]);
  });

  test("should throw when invalid data is passed", async () => {
    const mockTask = {
      title: "Test Task",
      status: "TODdO",
      description: "cription",
      label: "FEATUREasd",
      projectId: 1,
      userId: 123,
      todoDate: new Date(),
      createdDate: new Date(),
      priority: "ll",
      backlogDate: null,
      cancledDate: null,
      doneDate: null,
      inprogressDate: null,
    } as any;

    const mockSavedTask = { ...mockTask, id: 1, createdDate: new Date() };
    mockDb.insert.mockReturnValueOnce({
      values: mock().mockReturnValueOnce({
        returning: mock().mockResolvedValueOnce([mockSavedTask]),
      }),
    });
    await expect(taskService.saveTasks(mockSavedTask)).rejects.toThrow();
  });
});

describe("TaskService/getTasks", () => {
  test("shoud be called with userId(string)", async () => {
    const mockTask = {
      title: "Test Task",
      status: "TODO",
      description: "this is mock rescription",
      label: "FEATURE",
      projectId: 1,
      userId: "1",
      todoDate: new Date(),
      createdDate: new Date(),
      priority: "HIGH",
      backlogDate: null,
      cancledDate: null,
      doneDate: null,
      inprogressDate: null,
      id: 1,
    } satisfies TaskSelect;

    mockDb.select.mockReturnValueOnce({
      from: mock().mockReturnValueOnce({
        where: mock().mockReturnValueOnce({
          orderBy: mock().mockResolvedValueOnce([mockTask]),
        }),
      }),
    });
    const result = await taskService.getTasks("2");
    expect(result).toBeArray();
    expect(result).toEqual([mockTask]);
  });
});

describe("TaskService/updateTaskById", () => {
  const mockTask = {
    title: "Test Task",
    status: "TODO",
    description: "this is mock rescription",
    label: "FEATURE",
    projectId: 1,
    userId: "1",
    todoDate: new Date(),
    createdDate: new Date(),
    priority: "HIGH",
    backlogDate: null,
    cancledDate: null,
    doneDate: null,
    inprogressDate: null,
    id: 1,
  } satisfies TaskSelect;

  test("should throw CustomError if task not found by id", async () => {
    mockDb.query.task.findFirst = mock().mockReturnValueOnce(undefined);
    try {
      await taskService.updateTaskById(mockTask);
    } catch (error) {
      if (error instanceof Error) {
        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toBe("Task not found");
        if (error instanceof CustomError)
          expect(error.code).toBe(STATUS_CODES.BAD_REQUEST);
      }
    }
  });

  test("should throw if passed invalid params", async () => {
    mockDb.query.task.findFirst = mock().mockReturnValueOnce([mockTask]);
    mockTask.title = undefined as any;
    try {
      await taskService.updateTaskById(mockTask);
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }
  });

  test("Shoud not update status dates if sataus remains same", async () => {
    mockTask.todoDate = new Date(2023, 8, 8);
    mockTask.status = "TODO";
    mockTask.cancledDate = new Date(2022, 6, 4) as any;
    mockDb.query.task.findFirst = mock().mockReturnValueOnce([mockTask]);
    mockTask.title = "test test";

    mockDb.update.mockReturnValueOnce({
      set: mock().mockReturnValueOnce({
        where: mock().mockReturnValueOnce({
          returning: mock().mockResolvedValueOnce([mockTask]),
        }),
      }),
    });

    try {
      const result = await taskService.updateTaskById(mockTask);
      expect(result[0]?.todoDate?.toDateString()).not.toEqual(new Date());
      expect(result[0]?.cancledDate?.toDateString()).not.toEqual(new Date());
      expect(result[0].status).not.toEqual("CANCLED");
    } catch (error) {
      expect(error).toBeNil();
    }
  });

  test("shoud only update if task status is diffrent", async () => {
    mockTask.status = "DONE" as any;
    const currentDate = new Date();
    const doneDate = new Date(2022, 5, 5);
    mockTask.doneDate = currentDate as any;
    mockDb.query.task.findFirst = mock().mockReturnValueOnce([mockTask]);

    mockDb.update.mockReturnValueOnce({
      set: mock().mockReturnValueOnce({
        where: mock().mockReturnValueOnce({
          returning: mock().mockResolvedValueOnce([mockTask]),
        }),
      }),
    });

    const mockResult = { ...mockTask, doneDate: doneDate };

    const result = await taskService.updateTaskById(mockResult);

    expect(result[0]?.doneDate?.toDateString()).toEqual(
      currentDate.toDateString()
    );

    expect(result[0]?.doneDate?.toDateString()).not.toEqual(
      doneDate.toDateString()
    );
  });
});

describe("TaskService/getPieChartData", () => {
  test("should return data as list", async () => {
    const dataList = [
      {
        count: 10,
        status: "BACKLOG",
      },
    ] satisfies TaskPieChartDataType;

    mockDb.select.mockReturnValueOnce({
      from: mock().mockReturnValueOnce({
        groupBy: mock().mockReturnValueOnce({
          where: mock().mockResolvedValueOnce(dataList),
        }),
      }),
    });
    const result = await taskService.getPieChartData(new Date(), new Date());
    expect(result).toEqual(dataList);
  });
});

describe("TaskService/getCalanderData", () => {
  test("should return data list", async () => {
    const backLogDate = new Date(2000, 2, 5);

    const data = {
      backlogDate: backLogDate,
      cancledDate: null,
      createdDate: null,
      description: "",
      doneDate: null,
      id: 1,
      inprogressDate: null,
      label: "BUG",
      priority: "HIGH",
      projectId: 1,
      status: "BACKLOG",
      title: "awdawdwadawd",
      todoDate: null,
      userId: "1",
    } satisfies TaskSelect;

    mockDb.query.task.findMany.mockReturnValueOnce([data]);

    const expectedData = {
      "5": [
        {
          date: backLogDate,
          id: 1,
          status: "BACKLOG",
          title: "awdawdwadawd",
        },
      ],
    } satisfies Record<string, [TaskCalanderDataType]>;

    const result = await taskService.getCalanderData(new Date());

    expect(result).toEqual(expectedData);
  });
});

describe("TaskService/getBarChartData", () => {
  test("should return valid data", async () => {
    mockDb.select.mockReturnValueOnce({
      from: mock().mockReturnValueOnce({
        where: mock().mockResolvedValueOnce([
          {
            id: 39,
            doneDate: "2024-10-31T06:18:53.000Z",
          },
          {
            id: 25,
            doneDate: "2024-10-31T06:18:53.000Z",
          },
          {
            id: 25,
            doneDate: "2024-06-31T06:18:53.000Z",
          },
          {
            id: 14,
            doneDate: "2024-10-31T06:18:53.000Z",
          },
          {
            id: 11,
            doneDate: "2024-11-31T06:18:53.000Z",
          },
          {
            id: 11,
            doneDate: "2024-01-31T06:18:53.000Z",
          },
        ]),
      }),
    });
    try {
      const result = (await taskService.getBarChartData(1, "232"));

      expect(result).toEqual([
        {
          month: "OCT",
          count: 3,
        },
        {
          month: "JUL",
          count: 1,
        },
        {
          month: "DEC",
          count: 1,
        },
        {
          month: "JAN",
          count: 1,
        },
      ]);
      
    } catch (error) {
      expect(error).toBeNil();
    }
  });
});
