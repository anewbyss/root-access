type Predicate<T> = (x: T) => boolean;
function where<T>(items: T[], p: Predicate<T>): T[] {
  return items.filter(p);
}
function not<T>(p: Predicate<T>): Predicate<T> {
  return x => !p(x);
}
