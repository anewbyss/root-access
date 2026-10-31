function makeCounter(start = 0) {
  let count = start;
  return () => ++count;
}
