
import { newSegment } from "./wheel_helpers";
import { WheelSegment } from "./wheel_helpers";

export type Wheela =
{
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  rotation: number;               // in radianti, offset globale
  wheel: any;                     // API compatibile con codice esistente
  spinResult?: string;
  palette: string[];
  spinParams?: {
    startRotation: number;
    total: number;
    startTime: number;
    durationMs: number;
    wasColorOn: boolean;
    anim: any;
  };
}

export function newWheela(canvasId: string): Wheela
{
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) throw new Error(`Canvas con id ${canvasId} non trovato`);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Impossibile ottenere 2D context');

  const spinBtn = (window as any).spinBtn as HTMLButtonElement;
  if (spinBtn) spinBtn.disabled = true;

  let rotation = 0;
  let segments = [ newSegment('You win!', 0.1), newSegment('You lose!', 0.9) ];
  let palette = ['#a1c4ff', '#fab8ff', '#ffca9f', '#fff692', '#baffc3'];

  function draw() {
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    const centerX = canvas!.width / 2;
    const centerY = canvas!.height / 2;
    const outerRadius = Math.min(200, Math.min(canvas!.width, canvas!.height) / 2 - 10);
    let currentAngle = rotation;
    for (let i = 0; i < segments.length; i++)
    {
      const seg = segments[i];
      const start = currentAngle;
      const arc = seg.fraction * 2 * Math.PI;
      const end = start + arc;
      ctx!.beginPath();
      ctx!.moveTo(centerX, centerY);
      ctx!.arc(centerX, centerY, outerRadius, start, end);
      ctx!.closePath();
      ctx!.fillStyle = seg.fillStyle || palette[i % palette.length];
      ctx!.fill();
      currentAngle = end;
    }
  }

  return { canvas, ctx, rotation, wheel: { segments, draw, palette }, palette };
}

export const getSegments = (wheel: Wheela): WheelSegment[] => wheel.wheel.segments;

// *********************************************************************************************

export class Wheel
{
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rotation: number; // in radianti, offset globale
  public wheel: any; // API compatibile con codice esistente
  public spinResult?: string;
  public palette: string[] = ['#a1c4ff', '#fab8ff', '#ffca9f', '#fff692', '#baffc3'];

  private spinParams?: {
    startRotation: number;
    total: number;
    startTime: number;
    durationMs: number;
    wasColorOn: boolean;
    anim: any;
  };

  constructor(canvasId: string)
  {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) throw new Error(`Canvas con id ${canvasId} non trovato`);
    this.canvas = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Impossibile ottenere 2D context');
    this.ctx = ctx;

    // Inizializza con due segmenti di default
    this.wheel = {
      segments: [
        newSegment('You win!', 0.1),
        newSegment('You lose!', 0.9),
      ],
      draw: () => this.draw()
    };
    this.rotation = 0;

    const spinBtn = (window as any).spinBtn as HTMLButtonElement;
    if (spinBtn) spinBtn.disabled = true;
  }

  public getSegments() { return this.wheel.segments; }

  /**
   * Imposta i segmenti della ruota.
   */
  public setSegments(segments: WheelSegment[])
  {
    if (!segments || segments.length === 0)
    {
      console.log("Segments array vuoto o non valido. Nessuna modifica.");
      return;
    }
    this.wheel.segments = segments;
    this.draw(); // Qui sì, disegna la ruota solo quando cambi i segmenti
  }

  /**
   * Disegna la ruota sul canvas usando i segmenti e la rotazione attuale.
   */
  public draw()
  {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(200, Math.min(canvas.width, canvas.height) / 2 - 10);

    let currentAngle = this.rotation;
    for (let i = 0; i < this.wheel.segments.length; i++)
    {
      const seg = this.wheel.segments[i];
      const start = currentAngle;
      const end = start + seg.fraction * Math.PI * 2;

      // fill
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, outerRadius, start, end, false);
      ctx.closePath();
      ctx.fillStyle = seg.fillStyle || '#999';
      ctx.fill();

      // Bordo
      ctx.strokeStyle = '#55555555';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      // Posizione testo: angolo medio
      const mid = (start + end) / 2;
      const textRadius = outerRadius * 0.92;  // più dentro il bordo
      ctx.translate(centerX + Math.cos(mid) * textRadius, centerY + Math.sin(mid) * textRadius);
      ctx.rotate(mid);
      ctx.fillStyle = '#0f0f0f';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'right';                // il testo si estende verso l'esterno
      ctx.textBaseline = 'middle';

      // --- WRAPPING TESTO AUTOMATICO ---
      const maxWidth = outerRadius * 0.7;
      const words = (seg.text || '').split(' ');
      let lines: string[] = [];
      let currentLine = '';

      for (let w of words)
      {
        const testLine = currentLine ? currentLine + ' ' + w : w;
        if (ctx.measureText(testLine).width > maxWidth)
        {
          if (currentLine) lines.push(currentLine);
          currentLine = w;
        }
        else { currentLine = testLine; }
      }
      if (currentLine) lines.push(currentLine);

      // Disegna linee verticalmente centrate
      const lineHeight = 16;
      const offsetY = -((lines.length - 1) / 2) * lineHeight;
      lines.forEach((line, i) => {
        ctx.fillText(line, 0, offsetY + i * lineHeight);
      });

      ctx.restore();

      currentAngle = end; // aggiorna l'angolo di partenza per il prossimo segmento
    }
  }

  /**
   * GIRA LA RUOTA YEE YEE - Avvia la rotazione della ruota (mantenendo compatibilità animazione e pausa rainbow).
   * @returns Una Promise che si risolve con il segmento su cui si ferma la ruota.
   */
  public async spin(): Promise<WheelSegment>
  {
    console.log("myWheel.spin() CALLED");
    (this.wheel as any).animation = { type: 'spinToStop', duration: 8 + Math.random() * 2, spins: 5 };
    const wasColorOn = (window as any).colorInterval != null;
    if (wasColorOn)
    {
      clearInterval((window as any).colorInterval);
      (window as any).colorInterval = null;
    }

    const anim = (this.wheel as any).animation || { duration: 6, spins: 5 };
    const durationMs = (anim.duration || 6) * 1000;
    const spins = anim.spins || 5;
    const startRotation = this.rotation;
    const total = startRotation + spins * Math.PI * 2 + (Math.random() * Math.PI * 2);
    const startTime = performance.now();

    this.spinParams = { startRotation, total, startTime, durationMs, wasColorOn, anim };

    return new Promise<WheelSegment>((resolve) => {
      const frame = (now: number) => {
        if (!this.spinParams) return;
        const { wasColorOn, anim } = this.spinParams;
        const { rotation, done } = this.getRotation(now, this.spinParams);
        this.rotation = rotation;
        this.draw();

        if (!done) {
          requestAnimationFrame(frame);
        } else {
          this.rotation %= Math.PI * 2;
          this.draw();

          if (wasColorOn) {
            (window as any).colorInterval = setInterval((window as any).rainbowWheel, 50);
          }
          if (anim && typeof anim.callbackFinished === 'function') {
            try { anim.callbackFinished(); } catch (e) { console.error(e); }
          }
          this.spinParams = undefined;

          // Calcola il segmento sotto il pointer (angolo 0)
          let pointerAngle = 0; // il pointer è sempre a 0 radianti
          let angle = this.rotation % (Math.PI * 2);
          let acc = angle;
          for (const seg of this.wheel.segments) {
            const segStart = acc;
            const segEnd = acc + seg.fraction * Math.PI * 2;
            // Se il pointer (0) è tra segStart e segEnd
            if (
              (segStart <= pointerAngle && pointerAngle < segEnd) ||
              (segEnd > Math.PI * 2 && pointerAngle < segEnd - Math.PI * 2)
            ) {
              this.spinResult = seg.text;
              resolve(seg);
              return;
            }
            acc = segEnd;
          }
          // fallback: se non trovato, restituisci il primo segmento
          resolve(this.wheel.segments[0]);
        }
      };
      requestAnimationFrame(frame);
    });
  }

  /**
   * Calcola la rotazione attuale della ruota in base al tempo e ai parametri di spin.
   * @param now Il tempo attuale in millisecondi.
   * @param spinParams I parametri di spin contenenti informazioni sulla rotazione.
   * @returns Un oggetto contenente la rotazione attuale e se l'animazione è completata.
   */
  private getRotation(now: number, spinParams: {startRotation: number; total: number; startTime: number; durationMs: number; })
  {
    const { startRotation, total, startTime, durationMs } = spinParams;
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / durationMs);
    const eased = 1 - Math.pow(1 - t, 3); // easing cubic out
    return { rotation: startRotation + (total - startRotation) * eased, done: t >= 1 };
  }

  /**
   * Gestisce il frame dell'animazione.
   * @param now Il tempo attuale in millisecondi.
   */
  private frame(now: number)
  {
    if (!this.spinParams) return;

    const { wasColorOn, anim } = this.spinParams;
    const { rotation, done } = this.getRotation(now, this.spinParams);
    this.rotation = rotation;
    this.draw();

    if (!done) { requestAnimationFrame(this.frame.bind(this)); }
    else
    {
      this.rotation %= Math.PI * 2;
      this.draw();

      if (wasColorOn) { (window as any).colorInterval = setInterval((window as any).rainbowWheel, 50); }
      if (anim && typeof anim.callbackFinished === 'function') { try { anim.callbackFinished(); } catch (e) { console.error(e); }}

      this.spinParams = undefined; // pulizia
    }
  }

}


// export class WheelSegment
// {
//   fillStyle: string;
//   text: string;
//   fraction: number; // frazione del giro (da 0 a 1)

//   constructor(text: string, fraction: number, fillStyle?: string)
//   {
//     this.text = text;
//     this.fraction = fraction;
//     this.fillStyle = fillStyle ?? '#a1c4ff';
//   }
// }