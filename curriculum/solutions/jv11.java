import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Sweep {
    static boolean ping(String h) { return !h.isEmpty(); }

    static int sweep(List<String> hosts) {
        AtomicInteger up = new AtomicInteger();
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (String h : hosts) {
                executor.submit(() -> { if (ping(h)) up.incrementAndGet(); });
            }
        }
        return up.get();
    }

    static String report(List<String> hosts) {
        return CompletableFuture.supplyAsync(() -> sweep(hosts))
            .thenApply(n -> n + "/" + hosts.size() + " up")
            .join();
    }
}
