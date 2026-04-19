'use strict';

/**
 * Dummy receiver endpoint for simulated external analytics service integration.
 * Logs the payload and returns a success response.
 */
function receiveWebhook(req, res) {
  console.log('[WEBHOOK RECEIVER] Payload received:', JSON.stringify(req.body, null, 2));

  res.status(200).json({
    status: 'success',
    message: 'Webhook payload received successfully.',
    data: req.body,
  });
}

module.exports = { receiveWebhook };
