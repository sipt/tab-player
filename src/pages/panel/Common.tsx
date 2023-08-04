const colorMap = {
  grey: "bg-gray-400 dark:bg-gray-500",
  blue: "bg-blue-400 dark:bg-blue-500",
  red: "bg-red-400 dark:bg-red-500",
  yellow: "bg-yellow-400 dark:bg-yellow-500",
  green: "bg-green-400 dark:bg-green-500",
  pink: "bg-pink-400 dark:bg-pink-500",
  purple: "bg-purple-400 dark:bg-purple-500",
  cyan: "bg-cyan-400 dark:bg-cyan-500",
  orange: "bg-orange-400 dark:bg-orange-500",
};

function colorFix(
  color: string
):
  | "grey"
  | "blue"
  | "red"
  | "yellow"
  | "green"
  | "pink"
  | "purple"
  | "cyan"
  | "orange" {
  if (colorMap[color]) {
    return color as any;
  } else {
    return "grey";
  }
}

export { colorMap, colorFix };
