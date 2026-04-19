'use strict';

const { agenda } = require('../config/agenda');

async function cancelTaskReminder(taskId) {
  await agenda.cancel({ name: 'send task reminder', 'data.taskId': taskId });
}

async function scheduleTaskReminder(task) {
  if (!task || !task.dueDate || task.status === 'completed') {
    return;
  }

  const now = new Date();
  const reminderTime = new Date(task.dueDate.getTime() - 60 * 60 * 1000);

  if (task.dueDate <= now) {
    return;
  }

  if (reminderTime <= now) {
    await agenda.now('send task reminder', {
      taskId: task._id.toString(),
      title: task.title,
    });
    return;
  }

  await agenda.schedule(reminderTime, 'send task reminder', {
    taskId: task._id.toString(),
    title: task.title,
  });
}

module.exports = { cancelTaskReminder, scheduleTaskReminder };
