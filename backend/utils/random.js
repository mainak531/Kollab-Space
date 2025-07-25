const randomStringGenerator = (length = 4, useOnlyCapitals = true) => {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (!useOnlyCapitals) {
    characters += "abcdefghijklmnopqrstuvwxyz0123456789";
  }
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = {
  randomStringGenerator,
};
