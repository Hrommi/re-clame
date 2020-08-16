export const formatTime = (seconds) => {
  if (seconds === undefined) {
    return "...";
  }

  const formattingMinutes = Math.floor(seconds / 60);
  const formattingSeconds = (seconds % 60).toFixed(1).padStart(4, "0");

  return `${formattingMinutes}:${formattingSeconds}`;
};
