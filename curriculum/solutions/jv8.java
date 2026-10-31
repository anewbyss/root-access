import java.util.*;

interface Detector {
    boolean detect(String line);

    default long count(List<String> lines) {
        return lines.stream().filter(this::detect).count();
    }
}

abstract class Rule implements Detector {
    abstract String name();
}

class Keyword extends Rule {
    private final String word;

    Keyword(String word) { this.word = word; }

    @Override
    public boolean detect(String line) { return line.contains(word); }

    @Override
    String name() { return "keyword:" + word; }
}
