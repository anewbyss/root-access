import java.util.*;

class Box<T> {
    private final T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}

class Generics {
    static <T extends Comparable<T>> T strongest(List<T> xs) {
        T best = null;
        for (T x : xs) if (best == null || x.compareTo(best) > 0) best = x;
        return best;
    }

    static double total(List<? extends Number> xs) {
        double sum = 0;
        for (Number n : xs) sum += n.doubleValue();
        return sum;
    }
}
