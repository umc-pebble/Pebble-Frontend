import type { Category, MilestoneItem, ScheduleItem, TaskItem } from "@/types";
import type {
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";

export const cloneScheduleItems = <T extends ScheduleItem>(items: T[]): T[] =>
  items.map((item) =>
    (item.tasks
      ? {
          ...item,
          tasks: cloneScheduleItems(item.tasks),
        }
      : { ...item }) as T,
  );

const createClientCategoryId = () => `category-${crypto.randomUUID()}`;
const createClientMilestoneId = () => `milestone-${crypto.randomUUID()}`;
const createClientTaskId = () => `task-${crypto.randomUUID()}`;

export const createCategoryEntity = (
  input: CreateCategoryInput,
): Category => ({
  ...input,
  id: input.id ?? createClientCategoryId(),
  items: input.items ? cloneScheduleItems(input.items) : [],
  tasks: input.tasks ? cloneScheduleItems(input.tasks) : undefined,
});

export const createMilestoneEntity = (
  input: CreateScheduleItemInput,
): MilestoneItem => ({
  ...input,
  id: input.id ?? createClientMilestoneId(),
  itemType: "milestone",
  tasks: input.tasks ? cloneScheduleItems(input.tasks) : [],
});

export const createTaskEntity = (
  input: CreateScheduleItemInput,
): TaskItem => {
  const { tasks: _tasks, ...taskInput } = input;

  return {
    ...taskInput,
    id: taskInput.id ?? createClientTaskId(),
    itemType: "task",
  };
};

export const replaceCategoryList = (categories: Category[]) =>
  categories.map(createCategoryEntity);

export const updateCategoryInList = (
  categories: Category[],
  categoryId: string,
  input: UpdateCategoryInput,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          ...input,
          items: input.items ? cloneScheduleItems(input.items) : category.items,
          tasks: input.tasks ? cloneScheduleItems(input.tasks) : category.tasks,
        }
      : category,
  );

export const appendMilestoneToCategory = (
  categories: Category[],
  categoryId: string,
  milestone: MilestoneItem,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: [...category.items, milestone],
        }
      : category,
  );

export const appendMilestonesToCategory = (
  categories: Category[],
  categoryId: string,
  milestones: MilestoneItem[],
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: [...category.items, ...cloneScheduleItems(milestones)],
        }
      : category,
  );

export const updateMilestoneInCategory = (
  categories: Category[],
  categoryId: string,
  milestoneId: string,
  milestone: MilestoneItem,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: category.items.map((item) =>
            item.id === milestoneId
              ? {
                  ...item,
                  ...milestone,
                  tasks: item.tasks,
                }
              : item,
          ),
        }
      : category,
  );

export const appendTaskToMilestone = (
  categories: Category[],
  categoryId: string,
  milestoneId: string,
  task: TaskItem,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: category.items.map((item) =>
            item.id === milestoneId
              ? {
                  ...item,
                  tasks: [...(item.tasks ?? []), task],
                }
              : item,
          ),
        }
      : category,
  );

export const updateTaskInMilestone = (
  categories: Category[],
  categoryId: string,
  milestoneId: string,
  taskId: string,
  task: TaskItem,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: category.items.map((item) =>
            item.id === milestoneId
              ? {
                  ...item,
                  tasks: item.tasks?.map((previousTask) =>
                    previousTask.id === taskId
                      ? {
                          ...previousTask,
                          ...task,
                        }
                      : previousTask,
                  ),
                }
              : item,
          ),
        }
      : category,
  );

export const appendTaskToCategory = (
  categories: Category[],
  categoryId: string,
  task: TaskItem,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          tasks: [...(category.tasks ?? []), task],
        }
      : category,
  );

export const updateCategoryTaskInList = (
  categories: Category[],
  categoryId: string,
  taskId: string,
  input: CreateScheduleItemInput,
) => {
  const { tasks: _tasks, ...taskInput } = input;

  return categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          tasks: category.tasks?.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...taskInput,
                }
              : task,
          ),
        }
      : category,
  );
};

export const replaceStandaloneTaskInList = (
  tasks: TaskItem[],
  taskId: string,
  task: TaskItem,
) =>
  tasks.map((previousTask) =>
    previousTask.id === taskId
      ? {
          ...previousTask,
          ...task,
        }
      : previousTask,
  );

export const removeCategoryTaskFromList = (
  categories: Category[],
  categoryId: string,
  taskId: string,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          tasks: category.tasks?.filter((task) => task.id !== taskId),
        }
      : category,
  );

export const removeMilestoneFromCategory = (
  categories: Category[],
  categoryId: string,
  milestoneId: string,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: category.items.filter((item) => item.id !== milestoneId),
        }
      : category,
  );

export const removeTaskFromMilestone = (
  categories: Category[],
  categoryId: string,
  milestoneId: string,
  taskId: string,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: category.items.map((item) =>
            item.id === milestoneId
              ? {
                  ...item,
                  tasks: item.tasks?.filter((task) => task.id !== taskId),
                }
              : item,
          ),
        }
      : category,
  );

export const toggleMilestoneCompletedInCategory = (
  categories: Category[],
  categoryId: string,
  milestoneId: string,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: category.items.map((item) =>
            item.id === milestoneId
              ? { ...item, isCompleted: !item.isCompleted }
              : item,
          ),
        }
      : category,
  );

export const toggleCategoryTaskCompletedInList = (
  categories: Category[],
  categoryId: string,
  taskId: string,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          tasks: category.tasks?.map((task) =>
            task.id === taskId
              ? { ...task, isCompleted: !task.isCompleted }
              : task,
          ),
        }
      : category,
  );

export const toggleTaskCompletedInMilestone = (
  categories: Category[],
  categoryId: string,
  milestoneId: string,
  taskId: string,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: category.items.map((item) =>
            item.id === milestoneId
              ? {
                  ...item,
                  tasks: item.tasks?.map((task) =>
                    task.id === taskId
                      ? { ...task, isCompleted: !task.isCompleted }
                      : task,
                  ),
                }
              : item,
          ),
        }
      : category,
  );

export const toggleStandaloneTaskCompletedInList = (
  tasks: TaskItem[],
  taskId: string,
) =>
  tasks.map((task) =>
    task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task,
  );
