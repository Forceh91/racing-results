import { TimePyramid } from "types";

function createDurationPyramidFromMilliseconds(milliseconds: number) {
  const pyramid: TimePyramid = {
    hours: 3.6e6,
    minutes: 6e4,
    seconds: 1000,
    milliseconds: 1,
  };

  const msObject: TimePyramid = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
  Object.keys(pyramid).forEach((key) => {
    msObject[key as keyof TimePyramid] = Math.floor(milliseconds / pyramid[key as keyof TimePyramid]);
    milliseconds -= msObject[key as keyof TimePyramid] * pyramid[key as keyof TimePyramid];
  });

  return msObject;
}

export function convertMillsecondsToString(milliseconds: number, isShort: boolean = false) {
  const pyramid: TimePyramid = createDurationPyramidFromMilliseconds(milliseconds);
  if (!pyramid) return "";

  const { hours, minutes, seconds, milliseconds: parsedMilliseconds } = pyramid;

  const millisecondsString: string = parsedMilliseconds.toString().padStart(3, "0");

  if (hours > 0) {
    return `${hours > 9 ? hours : "0" + hours}:${minutes > 9 ? minutes : "0" + minutes}:${
      seconds > 9 ? seconds : "0" + seconds
    }.${millisecondsString}`;
  }

  let formattedTimeString = "";
  if (minutes > 0) formattedTimeString += isShort ? `${minutes}:` : `${minutes.toString().padStart(2, "0")}:`;

  if (seconds >= 0) formattedTimeString += isShort ? `${seconds}` : seconds.toString().padStart(2, "0");

  return `${formattedTimeString}.${millisecondsString}`;
}
