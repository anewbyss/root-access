TARGET="relay.log"
STAMP=$(date +%F)
HITS=$(grep -c FAIL "$TARGET")
echo "$STAMP: $HITS failures in $TARGET"
