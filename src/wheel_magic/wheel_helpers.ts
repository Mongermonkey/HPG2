/**
 * Funzioni di supporto per la gestione della ruota (Wheel):
 * - Definizione e creazione di segmenti della ruota (newSegment, sevenSegments, uniformSegments)
 * - Visualizzazione del risultato e gestione dell'area ruota (showWheelResult, seeWheel)
 * - Funzioni per lo spin e la configurazione dei segmenti (depr, spinWheelImpl, spinWheel)
 */

import { Wheel } from './Wheel';
import * as io from "../utilities/input_output_helpers";

export type WheelSegment =
{
  text: string;
  fraction: WheelPercent;
  fillStyle: string;
}

// Semantic constraint: fractions are expressed as percentages in the range 1..100.
export type WheelPercent = number & { readonly __wheelPercent: unique symbol };

export const pct = (value: number): WheelPercent => value as WheelPercent;

export const percentToRatio = (value: WheelPercent): number => value / 100;

export const newSegment = (text: string, fraction: number, fillStyle?: string): WheelSegment =>
  ({ text, fraction: pct(fraction), fillStyle: fillStyle ?? '#a1c4ff' });

export const sevenSegments: WheelSegment[] =
[
  newSegment('1', 10),
  newSegment('2', 15),
  newSegment('3', 21),
  newSegment('4', 21),
  newSegment('5', 15),
  newSegment('6', 10),
  newSegment('7', 8),
];

/**
 * Mostra il risultato della ruota nell'elemento #wheel-output, in giallo.
 */
export function showWheelResult(result: string)
{
  const wheelOutput = document.getElementById('wheel-output') as HTMLElement;
  if (wheelOutput) {
    wheelOutput.innerHTML = result.replace(/\n/g, '<br>');
    wheelOutput.style.color = '#ffd700';
    // wheelOutput.style.visibility = "visible";
  }
}

export function depr(myWheel: Wheel): Promise<WheelSegment>
{
  return new Promise((resolve) => {
    const spinBtn = (window as any).spinBtn as HTMLButtonElement;
    spinBtn.disabled = false;
    const onSpin = async () => {
      spinBtn.removeEventListener('click', onSpin);
      spinBtn.disabled = true;
      const result = await spinWheelImpl(myWheel);
      showWheelResult(result.text);
      spinBtn.disabled = false;
      resolve(result);
    };
    spinBtn.addEventListener('click', onSpin);
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
  const wheel_area = document.getElementById('wheel-area') as HTMLElement;
  if (wheel_area) wheel_area.style.visibility = visibility ? 'visible' : 'hidden';
}

/**
 * Crea un array di WheelSegment da una lista di stringhe, con probabilità uniforme.
 */
export function getUniformSegments(strings: string[], fillStyle?: string): WheelSegment[]
{
  if (!strings.length) return [];
  const fraction = 100 / strings.length;
  return strings.map(s => newSegment(s, fraction, fillStyle));
}

/**
 * Gira la ruota con i segmenti specificati e restituisce il testo del segmento su cui si ferma.
 * @param message Messaggio da mostrare prima dello spin
 * @param segments Segmenti della ruota
 * @param hideAfterSpin Se true, nasconde la ruota subito dopo lo spin
 * @returns Testo del segmento su cui si ferma la ruota
 */
export async function spinWheel(message: string, segments: WheelSegment[], hideAfterSpin: boolean = true): Promise<string>
{  
    const myWheel = (window as any).myWheel as Wheel;
    myWheel.setSegments(segments);
    seeWheel(true);
    await io.showText(message, false);
    const wheelStop = await depr(myWheel);
    if (hideAfterSpin) seeWheel(false);

    return wheelStop.text;
}

/**
 * Rimuove un segmento specifico dall'array di segmenti.
 * @param segments Array di segmenti della ruota
 * @param removal Segmento da rimuovere
 * @returns Nuovo array di segmenti senza il segmento rimosso
 */
export function removeSegment(segments: WheelSegment[], removal: WheelSegment): WheelSegment[]
{
  // Trova il segmento da rimuovere
  const toRemove = segments.find(s => s === removal);
  if (!toRemove) return segments;

  // Filtra i segmenti rimanenti
  const remaining = segments.filter(s => s !== removal);
  const n = remaining.length;
  if (n === 0) return [];

  // Distribuzione intera della probabilità
  const total = Math.floor(toRemove.fraction);
  const rest = toRemove.fraction - total;
  const base = Math.floor(total / n);
  let extra = total % n;

  // Assegna il resto ai primi segmenti
  return remaining.map((s, i) => {
    let add = base;
    if (extra > 0) {
      add += 1;
      extra--;
    }
    // Se la probabilità rimossa aveva una parte decimale, aggiungila al primo segmento
    if (i === 0) add += rest;
    return { ...s, fraction: pct(s.fraction + add) };
  });
}

/**
 * Aggiunge un segmento specifico all'array di segmenti, ridistribuendo le probabilità dei segmenti già presenti.
 * @param segments Array di segmenti della ruota
 * @param segmentToAdd Segmento da aggiungere
 * @returns Nuovo array di segmenti con il segmento aggiunto
 */
export function addSegment(segments: WheelSegment[], segmentToAdd: WheelSegment): WheelSegment[]
{
  if (segments.length >= 100) throw new Error('Impossibile aggiungere segmenti: max 100 segmenti.');
  if (!Number.isFinite(segmentToAdd.fraction)) throw new Error('fraction non valido: deve essere un numero finito.');
  if (!Number.isInteger(segmentToAdd.fraction)) throw new Error('fraction non valido: deve essere un intero.');

  if (segments.length === 0) return [newSegment(segmentToAdd.text, 100, segmentToAdd.fillStyle)];
  
  if (segmentToAdd.fraction < 1 || segmentToAdd.fraction > 100 - segments.length)
    throw new Error('fraction richiesta fuori range: range consentito 1..' + (100 - segments.length) + '.');
  
  const distributable = 100 - segmentToAdd.fraction - segments.length;

  // Assegna 1% a ogni segmento esistente e distribuisci il resto in modo proporzionale.
  const currentSum = segments.reduce((sum, segment) => sum + segment.fraction, 0);
  const weights = segments.map(s => s.fraction / currentSum);
  const idealExtra = weights.map(w => w * distributable);
  const extraParts = idealExtra.map(Math.floor);
  let remainder = distributable - extraParts.reduce((a, b) => a + b, 0);

  const remainders = idealExtra
    .map((v, i) => ({ i, rem: v - extraParts[i] }))
    .sort((a, b) => b.rem - a.rem || a.i - b.i);

  for (let i = 0; i < remainder; i++) extraParts[remainders[i].i] += 1;

  const parts = extraParts.map(v => v + 1);

  return [
    ...segments.map((s, i) => ({ ...s, fraction: pct(parts[i]) })),
    { ...segmentToAdd, fraction: pct(segmentToAdd.fraction) }
  ];
}