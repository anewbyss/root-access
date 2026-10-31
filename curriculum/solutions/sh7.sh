awk '{ print $1 }' access.log | sort | uniq -c | sort -nr | head -n 5
sed 's/token=[^ ]*/token=REDACTED/g' app.log > clean.log
