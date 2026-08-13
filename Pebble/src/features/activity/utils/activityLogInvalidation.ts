export type ActivityLogChangeReason =
  | 'taskCompleted'
  | 'taskUncompleted'
  | 'taskUpdated'
  | 'taskDeleted';

export interface ActivityLogChangeEvent {
  reason: ActivityLogChangeReason;
  affectedDates?: string[];
}

type ActivityLogChangeListener = (event: ActivityLogChangeEvent) => void;

const listeners = new Set<ActivityLogChangeListener>();

export function subscribeActivityLogChanges(
  listener: ActivityLogChangeListener,
) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function notifyActivityLogsChanged(event: ActivityLogChangeEvent) {
  listeners.forEach((listener) => listener(event));
}