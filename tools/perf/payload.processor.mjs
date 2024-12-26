export function randomOperationsPair(requestParams, context, ee, next) {
  context.vars.buy_date = _randomDate('2022-01-01', '2022-12-31');
  context.vars.buy_price = _randomInt(400, 450);
  context.vars.buy_qty = _randomInt(100, 200);
  context.vars.buy_fee_total_amount = _randomInt(10, 50);
  context.vars.sell_date = _randomDate('2023-01-01', '2023-12-31');
  context.vars.sell_price = _randomInt(300, 550);
  context.vars.sell_qty = _randomInt(50, 100);
  context.vars.sell_fee_total_amount = _randomInt(10, 50);
  next();
}

function _randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _randomDate(start, end) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();

  const randomTimestamp =
    Math.floor(Math.random() * (endDate - startDate + 1)) + startDate;

  const randomDate = new Date(randomTimestamp);

  const year = randomDate.getFullYear();
  const month = String(randomDate.getMonth() + 1).padStart(2, '0');
  const day = String(randomDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
