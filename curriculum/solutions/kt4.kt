fun scan(host: String, port: Int = 443): String = "$host:$port"

fun String.isPrivateIp(): Boolean =
    startsWith("10.") || startsWith("192.168.") || startsWith("172.16.")

fun repeatScan(times: Int, action: (Int) -> Unit) {
    for (i in 1..times) action(i)
}

fun main() {
    println(scan("relay.example", port = 8443))
    println("10.0.0.4".isPrivateIp())
    repeatScan(3) { attempt -> println("attempt $attempt") }
}
