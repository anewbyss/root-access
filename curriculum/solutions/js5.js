function isMalicious(input) {
  return /\$\{\s*jndi:/i.test(input);
}
