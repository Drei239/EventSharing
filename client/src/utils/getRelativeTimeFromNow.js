import intervalToDuration from "date-fns/intervalToDuration";
import dayjs from "dayjs";
const getRelativeTimeFromNow = (date) => {
  const duration = intervalToDuration({
    start: new Date(date),
    end: new Date(),
  });
  const { months, days, hours, minutes, seconds } = duration;
  if (days >= 7) {
    return `${Math.floor(days / 7)} tuần trước`;
  } else if (days !== 0) {
    return `${days} ngày trước`;
  } else if (hours !== 0) {
    return `${hours} giờ trước`;
  } else if (minutes !== 0) {
    return `${minutes} phút trước`;
  } else {
    return `Mới đây`;
  }
};

export default getRelativeTimeFromNow;
