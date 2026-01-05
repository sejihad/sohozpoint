const cron = require("node-cron");
const Notify = require("../models/notifyModel");
const UserNotify = require("../models/userNotifyModel");

cron.schedule(
  "0 3 * * *",
  async () => {
    try {
      const expired = await Notify.find(
        { expiresAt: { $lte: new Date() } },
        "_id"
      );

      if (!expired.length) return;

      const ids = expired.map((n) => n._id);

      await Notify.deleteMany({ _id: { $in: ids } });
      await UserNotify.deleteMany({ notify: { $in: ids } });

     
    } catch (e) {
  
    }
  },
  { timezone: "Asia/Dhaka" }
);
