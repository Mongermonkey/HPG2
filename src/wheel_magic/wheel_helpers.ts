
import { Wheel } from './Wheel';

export type WheelSegment =
{
  text: string;
  fraction: number;
  fillStyle: string;
}

export const newSegment = (text: string, fraction: number, fillStyle?: string): WheelSegment =>
  ({ text, fraction, fillStyle: fillStyle ?? '#a1c4ff' });

export const sevenSegments: WheelSegment[] =
[
  newSegment('1', 0.10),
  newSegment('2', 0.15),
  newSegment('3', 0.21),
  newSegment('4', 0.21),
  newSegment('5', 0.15),
  newSegment('6', 0.10),
  newSegment('7', 0.08),
];

/**
 * Mostra il risultato della ruota nell'elemento #wheel-output, in giallo.
 */
export function showWheelResult(result: string)
{
  const wheelOutput = document.getElementById("wheel-output") as HTMLElement;
  if (wheelOutput) {
    wheelOutput.innerHTML = result.replace(/\n/g, "<br>");
    wheelOutput.style.color = "#ffd700";
    // wheelOutput.style.visibility = "visible";
  }
}

export function spinWheel(myWheel: Wheel): Promise<WheelSegment>
{
  return new Promise((resolve) => {
    const spinBtn = (window as any).spinBtn as HTMLButtonElement;
    spinBtn.disabled = false;
    const onSpin = async () => {
      spinBtn.removeEventListener("click", onSpin);
      spinBtn.disabled = true;
      const result = await spinWheelImpl(myWheel);
      showWheelResult(result.text);
      spinBtn.disabled = false;
      resolve(result);
    };
    spinBtn.addEventListener("click", onSpin);
    spinBtn.focus();
  });
}

function spinWheelImpl(myWheel: Wheel): Promise<WheelSegment>
{
  return (myWheel as any).spin ? (myWheel as any).spin() : Promise.reject('spin non implementato');
}

/**
 * Mostra/nasconde tutta l'area della ruota (canvas, pointer, spin button).
 * @param visibility true per mostrare la ruota, false per nasconderla
 */
export function seeWheel(visibility: boolean)
{
  const wheel_area = document.getElementById("wheel-area") as HTMLElement;
  if (wheel_area) wheel_area.style.visibility = visibility ? "visible" : "hidden";
}

/**
 * Crea un array di WheelSegment da una lista di stringhe, con probabilità uniforme.
 */
export function uniformSegments(strings: string[], fillStyle?: string): WheelSegment[]
{
  if (!strings.length) return [];
  const fraction = 1 / strings.length;
  return strings.map(s => newSegment(s, fraction, fillStyle));
}