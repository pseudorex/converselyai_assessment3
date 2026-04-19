'use strict';

const { Agenda } = require('agenda');
const { MongoBackend } = require('@agendajs/mongo-backend');
const axios = require('axios');
const mongoose = require('mongoose');
const { appendFile } = require('fs/promises');
const path = require('path');

const REMINDERS_LOG_PATH = process.env.REMINDERS_LOG_PATH || path.join(process.cwd(), 'reminders.log');
const REMINDER_WEBHOOK_URL = process.env.REMINDER_WEBHOOK_URL || null;
const COMPLETED_WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:5000/api/webhook/receive';

const agenda = new Agenda({
  backend: new MongoBackend({
    address: process.env.MONGO_URI,
    collection: 'agendaJobs',
  }),
});

async function writeReminderLog(message) {
  const timestamp = new Date().toISOString();
  await appendFile(REMINDERS_LOG_PATH, `[${timestamp}] ${message}\n`);
}

agenda.define('send task reminder', async (job) => {
  const { taskId, title } = job.attrs.data;
  const Task = mongoose.model('Task');
  const task = await Task.findById(taskId).catch(() => null);

  if (!task) {
    const message = `[REMINDER] Task ${taskId} not found. Skipping reminder.`;
    console.log(message);
    await writeReminderLog(message);
    return;
  }

  if (task.status === 'completed') {
    const message = `[REMINDER] Task "${title}" already completed. Skipping reminder.`;
    console.log(message);
    await writeReminderLog(message);
    return;
  }

  const message = `Reminder: Task "${title}" is due within 1 hour. Task ID: ${taskId}, userId: ${task.userId}`;
  console.log('\n======================================================');
  console.log(`[NOTIFICATION] ${message}`);
  console.log('======================================================\n');
  await writeReminderLog(message);

  if (REMINDER_WEBHOOK_URL) {
    try {
      await axios.post(REMINDER_WEBHOOK_URL, {
        event: 'task_reminder',
        taskId,
        title,
        dueDate: task.dueDate,
        userId: task.userId,
      });
      const webhookMessage = `[REMINDER] Sent notification to ${REMINDER_WEBHOOK_URL} for Task ${taskId}`;
      console.log(webhookMessage);
      await writeReminderLog(webhookMessage);
    } catch (err) {
      const webhookError = `[REMINDER] Failed to call webhook for Task ${taskId}: ${err.message}`;
      console.error(webhookError);
      await writeReminderLog(webhookError);
    }
  }
});

agenda.define('send completed webhook', async (job) => {
  const { taskId, title, completedAt, userId, retryCount = 0 } = job.attrs.data;

  try {
    console.log(`[AGENDA] Delivering completed webhook for Task ${taskId} to ${COMPLETED_WEBHOOK_URL}`);
    await axios.post(COMPLETED_WEBHOOK_URL, {
      id: taskId,
      title,
      completionDate: completedAt,
      userId,
    });
    console.log(`[AGENDA] Completed webhook sent successfully for Task ${taskId}`);
  } catch (error) {
    const nextRetry = retryCount + 1;
    const maxRetries = 3;
    const backoffMs = Math.pow(2, retryCount) * 1000;
    const errorMessage = `[AGENDA] Webhook attempt ${nextRetry} failed for Task ${taskId}: ${error.message}`;
    console.error(errorMessage);

    if (nextRetry <= maxRetries) {
      const retryTime = new Date(Date.now() + backoffMs);
      console.log(`[AGENDA] Scheduling retry ${nextRetry} for Task ${taskId} at ${retryTime.toISOString()}`);
      await agenda.schedule(retryTime, 'send completed webhook', {
        taskId,
        title,
        completedAt,
        userId,
        retryCount: nextRetry,
      });
    } else {
      console.error(`[AGENDA] Webhook permanently failed for Task ${taskId} after ${maxRetries} retries.`);
    }
  }
});

async function startAgenda() {
  await agenda.start();
  console.log('[Agenda] Started successfully.');
}

module.exports = { agenda, startAgenda };
