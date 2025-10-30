
import { Wheel } from './wheel_magic/Wheel';
import { startStory } from "./story/story";

document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("game-output")!;
  const input = document.getElementById("player-input") as HTMLInputElement;
  const nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
  const spinBtn = document.getElementById("spin-btn") as HTMLButtonElement;
  const wheelArea = document.getElementById("wheel-area") as HTMLElement;

  (window as any).output = output;
  (window as any).input = input;
  (window as any).nextBtn = nextBtn;
  (window as any).spinBtn = spinBtn;

  // Nascondi subito tutta l'area della ruota
  if (wheelArea) wheelArea.style.visibility = "hidden";

  const myWheel = new Wheel('canvas');
  (window as any).myWheel = myWheel;

  // Avvia il gioco
  startStory();
});