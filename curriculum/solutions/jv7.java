import java.io.*;
import java.nio.file.*;

class BadPortException extends Exception {
    BadPortException(String msg, Throwable cause) { super(msg, cause); }
}

public class Ports {
    static int parsePort(String s) throws BadPortException {
        try {
            int p = Integer.parseInt(s);
            if (p < 1 || p > 65535) throw new BadPortException("out of range: " + p, null);
            return p;
        } catch (NumberFormatException e) {
            throw new BadPortException("not a number: " + s, e);
        }
    }

    static long countLines(Path file) throws IOException {
        try (BufferedReader reader = Files.newBufferedReader(file)) {
            return reader.lines().count();
        }
    }
}
