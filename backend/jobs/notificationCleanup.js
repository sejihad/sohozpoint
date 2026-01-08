const cron = require("node-cron");
const Notify = require("../models/notifyModel");
const UserNotify = require("../models/userNotifyModel");
const deleteFromS3 = require("../config/deleteFromS3");

cron.schedule(
  "0 3 * * *",
  async () => {
    try {
      const expired = await Notify.find(
        { expiresAt: { $lte: new Date() } },
        "_id image"
      );

      if (!expired.length) return;
      for (const notify of expired) {
        if (notify.image?.public_id) {
          try {
            await deleteFromS3(notify.image.public_id);
          } catch (err) {}
        }
      }
      const ids = expired.map((n) => n._id);

      await Notify.deleteMany({ _id: { $in: ids } });
      await UserNotify.deleteMany({ notify: { $in: ids } });
    } catch (e) {}
  },
  { timezone: "Asia/Dhaka" }
);
