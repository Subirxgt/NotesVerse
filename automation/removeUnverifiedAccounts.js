const { default: nodeCron } = require("node-cron");
const User = require("../models/users");

// This function deletes unverified accounts older than 30 minutes
async function runCleanup() {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    console.log(
      `[CRON] Running unverified accounts cleanup at ${new Date().toISOString()}`
    );
    console.log(
      `[CRON] Looking for accounts created before: ${thirtyMinutesAgo.toISOString()}`
    );

    const result = await User.deleteMany({
      accountVerified: false,
      createdAt: { $lt: thirtyMinutesAgo },
    });

    if (result.deletedCount > 0) {
      console.log(
        `[CRON] Successfully deleted ${result.deletedCount} unverified account(s)`
      );
    } else {
      console.log(
        `[CRON] No unverified accounts to delete at ${new Date().toISOString()}`
      );
    }
  } catch (error) {
    console.error(
      `[CRON] Error in unverified accounts cleanup: ${error.message}`
    );
    console.error(`Stack: ${error.stack}`);
  }
}

module.exports.removeUnverifiedAccounts = () => {
  try {
    // 🟢 Run immediately on system start
    runCleanup();

    // 🟢 Schedule to run every 30 minutes
    const task = nodeCron.schedule("*/30 * * * *", runCleanup);

    task.on("error", (error) => {
      console.error(`[CRON] Task scheduling error: ${error.message}`);
    });

    console.log(
      "[CRON] Unverified accounts cleanup job scheduled (every 30 minutes)"
    );

    return task;
  } catch (error) {
    console.error(
      `[CRON] Failed to schedule unverified accounts cleanup: ${error.message}`
    );
    throw error;
  }
};
