export const toBit = (num, length = 32) => {
  let bit = parseInt(num, 10).toString(2)
  if (bit.startsWith("-")) {
    bit = Math.abs(num) - 1
    console.log(num, ~num, bit)
    bit = parseInt(bit, 10).toString(2)
    bit = `0${bit}`
      .replace(/1/g, "x")
      .replace(/0/g, "1")
      .replace(/x/g, "0")
    while (bit.length < length) {
      bit = `1${bit}`
    }
  } else {
    while (bit.length < length) {
      bit = `0${bit}`
    }
  }
  return `0b${bit}`
}
