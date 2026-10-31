function* chunks(arr, size) {
  for (let i = 0; i < arr.length; i += size) yield arr.slice(i, i + size);
}
function* take(iter, n) {
  if (n <= 0) return;
  let i = 0;
  for (const v of iter) { yield v; if (++i >= n) return; }
}
