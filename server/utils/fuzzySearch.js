function fuzzyMatch(input, target) {
  if (!input || !target) return false;
  input = input.toLowerCase();
  target = target.toLowerCase();

  const isSubstring = target.includes(input);
  const isCharIncluded = input.split("").every(char => target.includes(char));

  return isSubstring || isCharIncluded;
}

module.exports = { fuzzyMatch };
