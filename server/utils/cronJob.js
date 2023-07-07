const orderModel = require("../models/orderModel");
const eventModel = require("../models/eventModel");
const notifyModel = require("../models/notifyModel");
const dayjs = require("dayjs");

const cronJob = require("cron").CronJob;
const job = new cronJob(
  "0 8 * * *",
  async function () {
    const endTimeToday = dayjs().endOf("day");
    const endTimeTomorrow = dayjs().add(1, "day").endOf("day");
    const upcomingEvent = await eventModel.find({
      timeBegin: { $gte: endTimeToday, $lte: endTimeTomorrow },
    });
    await Promise.all(
      upcomingEvent.map(async (item, index) => {
        const getOrder = await orderModel.find({
          event: item._id,
          isPaid: true,
        });
        if (getOrder.length > 0) {
          await Promise.all(
            getOrder.map(async (order) => {
              await notifyModel.create({
                notifyTo: order.user,
                eventId: item._id,
                notifyType: "upcoming-event",
                content: `sẽ diễn ra vào ngày mai`,
              });
            })
          );
        }
      })
    );
  },
  null,
  true,
  "Asia/Ho_Chi_Minh"
);
module.exports = job;
