// @cp scan uses the default port | scan with a named port | isPrivateIp true for 10.x and 192.168.x | isPrivateIp false for public IPs
//@@USER@@
//@@PRELUDE@@
fun main() {
    raTry("scan uses the default port") { raCp(scan("relay").contains("443"), "scan uses the default port", scan("relay")) }
    raTry("scan with a named port") { raCp(scan("relay", port = 22).contains("22"), "scan with a named port", scan("relay", port = 22)) }
    raTry("isPrivateIp true for 10.x and 192.168.x") { raCp("10.0.0.4".isPrivateIp() && "192.168.1.7".isPrivateIp(), "isPrivateIp true for 10.x and 192.168.x") }
    raTry("isPrivateIp false for public IPs") { raCp(!"8.8.8.8".isPrivateIp(), "isPrivateIp false for public IPs") }
}
