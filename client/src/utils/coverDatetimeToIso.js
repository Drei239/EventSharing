// Corvert thời gian thành định dạng iso string
const covertDatetimeToISO = (dateValue, time) => {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const [hour, minute] = time.split(':');
  return new Date(year, month, day, hour, minute).toISOString();
};

export default covertDatetimeToISO;
