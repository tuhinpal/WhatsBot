module.exports = (number) => {
  let num = Number(number);
  let out;
  if (Math.abs(num) < 999) {
    out = num;
  }
  if (Math.abs(num) >= 999) {
    out = Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k+";
  }
  if (Math.abs(num) >= 999999) {
    out = Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + "m+";
  }
  if (Math.abs(num) >= 999999999) {
    out = Math.sign(num) * (Math.abs(num) / 1000000000).toFixed(1) + "b+";
  }
  return out;
};
