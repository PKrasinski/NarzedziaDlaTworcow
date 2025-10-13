export const capitalize = <String extends string>(str: String) =>
  (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<String>;