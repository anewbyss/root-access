while IFS= read -r host; do
  ping -c 1 "$host" &>/dev/null && echo "$host up" || echo "$host down"
done < hosts.txt
