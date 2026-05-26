import { task } from '@trigger.dev/sdk';

export const exampleTask = task({
  id: 'example-task',
  run: async (payload: { message: string }) => {
    return {
      message: payload.message,
      completedAt: new Date().toISOString()
    };
  }
});
