const cron = require("node-cron");
const { closeMonth } = require("./affiliateMonthClose");

// Run at 00:10 on 1st day of every month
cron.schedule("10 0 1 * *", async () => {
  const now = new Date();
  // previous month key
  const d = new Date(now.getFullYear(), now.getMonth(), 1);
  d.setMonth(d.getMonth() - 1);

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const prevMonth = `${y}-${m}`;

  await closeMonth({ month: prevMonth });
});
