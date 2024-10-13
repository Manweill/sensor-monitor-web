import dayjs from 'dayjs';

const [year, month, day, hour, minute] = [
  12 * 30 * 24 * 60 * 60,
  30 * 24 * 60 * 60,
  24 * 60 * 60,
  60 * 60,
  60,
];

/** 动态显示持续时间 */
export function durationFormat(duration?: number) {
  if (!duration) return undefined;

  const time = dayjs.duration(duration * 1000);
  if (duration <= minute) {
    return time.format('s秒');
  }
  if (duration <= hour) {
    return time.format('m分 s秒');
  }
  if (duration <= day) {
    return time.format('H小时 m分 s秒');
  }
  if (duration <= month) {
    return time.format('D天 H小时 m分 s秒');
  }
  if (duration <= year) {
    return time.format('M月 D天 H小时 m分 s秒');
  }
  return time.format('y年 M月 D天 H小时 m分 s秒');
}

/** 持续时间 */
export function durationWithNow(date?: Date) {
  if (!date) return undefined;
  const duration = dayjs().diff(dayjs(date), 'seconds');
  return durationFormat(duration);
}

/** 持续时间 */
export function durationWithTime(date?: Date) {
  if (!date) return undefined;
  const duration = dayjs(date).diff(new Date(), 'seconds');
  return durationFormat(duration);
}
