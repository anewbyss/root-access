// @cp parse_port ok | parse_port rejects junk | parse_port rejects out of range | parse_port rejects trailing junk
//@@PRELUDE@@
//@@USER@@
int main() {
    ra_try("parse_port ok", [] { auto p = parse_port("443"); ra_cp(p && *p == 443, "parse_port ok"); });
    ra_try("parse_port rejects junk", [] { ra_cp(!parse_port("http"), "parse_port rejects junk"); });
    ra_try("parse_port rejects out of range", [] { ra_cp(!parse_port("70000") && !parse_port("0"), "parse_port rejects out of range"); });
    ra_try("parse_port rejects trailing junk", [] { ra_cp(!parse_port("80abc"), "parse_port rejects trailing junk"); });
}
