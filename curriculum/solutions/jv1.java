public class Intro {
    static String intro(String handle, int level) {
        return "Agent " + handle + " // level " + level;
    }

    public static void main(String[] args) {
        var handle = "neo";
        System.out.printf("%s%n", intro(handle, 3));
    }
}
