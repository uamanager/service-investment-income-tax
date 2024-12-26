module.exports = {
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  randomDate: function (start, end) {
    // Convert start and end dates to timestamps
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    // Generate a random timestamp between start and end
    const randomTimestamp =
      Math.floor(Math.random() * (endDate - startDate + 1)) + startDate;

    // Convert the timestamp back to a Date object
    const randomDate = new Date(randomTimestamp);

    // Format the date as 'YYYY-MM-DD'
    const year = randomDate.getFullYear();
    const month = String(randomDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(randomDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  },
};
