curl -fsS -H "Authorization: Bearer $TOKEN" https://relay.example/api/nodes | jq -r '.nodes[] | select(.online == false) | .name'
