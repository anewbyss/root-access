fun tally(ips: List<String>): Map<String, Int> = ips.groupingBy { it }.eachCount()

val ports = mapOf("ssh" to 22, "https" to 443, "dns" to 53)
