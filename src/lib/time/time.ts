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

  if (seconds >= 0) formattedTimeString += isShort && !minutes ? `${seconds}` : seconds.toString().padStart(2, "0");

  return `${formattedTimeString}.${millisecondsString}`;
}

export const convertMillisecondsToMinSecString = (ms: number) => {
  const { minutes, seconds } = createDurationPyramidFromMilliseconds(ms);
  if (!minutes && !seconds) return "";

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const DURATION_STRING_REGEX = /^((\d+):)?([0-5][0-9]):([0-5][0-9])\.([0-9][0-9][0-9])$/;

export const convertDurationStringToMilliseconds = (string: string) => {
  if (!string || !string.length) return 0;

  const regexMatch = string.match(DURATION_STRING_REGEX);
  if (!regexMatch) return 0;

  const [match, hoursWithSymbol, hours, minutes, seconds, milliseconds] = regexMatch;
  const hoursNumber = Number(hours);
  const minutesNumber = Number(minutes);
  const secondsNumber = Number(seconds);
  const millisecondsNumber = Number(milliseconds);

  const hoursToSeconds = !isNaN(hoursNumber) ? hoursNumber * 3600 : 0;
  const minutesToSeconds = !isNaN(minutesNumber) ? minutesNumber * 60 : 0;
  const verifiedSeconds = !isNaN(secondsNumber) ? secondsNumber : 0;
  const verifiedMilliseconds = !isNaN(millisecondsNumber) ? millisecondsNumber : 0;

  return (hoursToSeconds + minutesToSeconds + verifiedSeconds) * 1000 + verifiedMilliseconds;
};
