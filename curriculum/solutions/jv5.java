public class Cipher {
    static final String BRIEF = """
        Operator,
        decode the relay before dawn.
        """;

    static String caesar(String text, int shift) {
        StringBuilder sb = new StringBuilder();
        int s = ((shift % 26) + 26) % 26;
        for (char c : text.toCharArray()) {
            if (Character.isUpperCase(c)) sb.append((char) ('A' + (c - 'A' + s) % 26));
            else if (Character.isLowerCase(c)) sb.append((char) ('a' + (c - 'a' + s) % 26));
            else sb.append(c);
        }
        return sb.toString();
    }
}
