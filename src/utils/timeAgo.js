export function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  
    const intervals = [
      { value: 60, unit: "second" },
      { value: 60, unit: "minute" },
      { value: 24, unit: "hour" },
      { value: 7, unit: "day" },
      { value: 4.34524, unit: "week" },
      { value: 12, unit: "month" },
      { value: Number.POSITIVE_INFINITY, unit: "year" },
    ];
  
    let duration = seconds;
    for (let i = 0; i < intervals.length; i++) {
      if (duration < intervals[i].value) {
        return rtf.format(-Math.floor(duration), intervals[i].unit);
      }
      duration /= intervals[i].value;
    }
  }
  