import { InputData, Point, Pixel, Circle, Path } from "./dust_helpers.ts";

const PIXEL_SPEED = 130;
export let VISIBLE_PATH = true;

export function animateText(text: string, container: HTMLElement) {
  const canvas = setupCanvas();
  const ctx = canvas.getContext("2d")!;
  const pixels = getTextPixels(inputDataFromText(text, container, ctx));
  console.log("Punti creati: ", pixels.length);

  // disegna subito i pixel
  drawPixels(ctx, pixels);

  // genera un percorso casuale di esempio
  const path = generatePath(new Point(0, 0));

  if (VISIBLE_PATH)
  {
    const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
    drawPath(ctx, path, randomPixel);
  }

  // applica il percorso a tutti i pixel
  animatePixelsAlongPath(ctx, pixels, path);

  // dopo un po' cancella il canvas
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
}

function setupCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);
  return canvas;
}

function inputDataFromText(text: string, container: HTMLElement, ctx: CanvasRenderingContext2D): InputData {
  return new InputData(text, container, ctx);
}

// funzione: getTextPixels
function getTextPixels(inputData: InputData): Pixel[] {
  const pixel_offset_x = 2;
  const pixel_offset_y = 4;

  const pixels: Pixel[] = [];

  for (let i = 0; i < inputData.chars.length; i++) {
    if (inputData.chars[i] === " ") continue;

    const charX = inputData.inputRect.left + inputData.paddingLeft + i * inputData.charWidth;

    const charCanvas = document.createElement("canvas");
    charCanvas.width = Math.ceil(inputData.charWidth);
    charCanvas.height = Math.ceil(parseFloat(inputData.inputStyle.fontSize) * 1.2);

    const charCtx = charCanvas.getContext("2d")!;
    charCtx.font = inputData.font;
    charCtx.fillStyle = "#fff";
    charCtx.textBaseline = "top";
    charCtx.textAlign = "left";
    charCtx.clearRect(0, 0, charCanvas.width, charCanvas.height);
    charCtx.fillText(inputData.chars[i], 0, 0);

    const imageData = charCtx.getImageData(0, 0, charCanvas.width, charCanvas.height);

    for (let y = 0; y < charCanvas.height; y++) {
      for (let x = 0; x < charCanvas.width; x++) {
        const idx = (y * charCanvas.width + x) * 4;
        const alpha = imageData.data[idx + 3];
        if (alpha > 0) { // consideriamo tutti i pixel non trasparenti
          // creiamo un oggetto Pixel con i valori RGBA originali
          const p = new Pixel(
            new Point(charX + x + pixel_offset_x, inputData.yTop + y + pixel_offset_y, false, i),
            imageData.data[idx],       // r
            imageData.data[idx + 1],   // g
            imageData.data[idx + 2],   // b
            alpha                      // a
          );
          pixels.push(p);
        }
      }
    }
  }

  return pixels;
}

// funzione per disegnare i pixel sul canvas principale
function drawPixels(ctx: CanvasRenderingContext2D, pixels: Pixel[])
{
  ctx.save(); // Salva lo stato corrente del contesto

  // Imposta l'operazione di composizione globale su 'lighter'
  ctx.globalCompositeOperation = 'lighter';

  for (const p of pixels) {
    // Imposta il colore di riempimento con valori RGB e alpha
    ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a / 255})`;
    // Disegna un rettangolo di 1x1 pixel alla posizione specificata
    ctx.fillRect(p.point.x, p.point.y, 1, 1);
  }

  ctx.restore(); // Ripristina lo stato precedente del contesto
}

function generatePath(start: Point): Path {
    const path = new Path();

    // costanti configurabili
    const totalCircles = 20;       // quanti cerchi concatenare
    const minRadius = 5;          // raggio minimo di un cerchio
    const maxRadius = 15;          // raggio massimo di un cerchio
    const minArcDeg = 90;          // arco minimo in gradi
    const maxArcDeg = 180;         // arco massimo in gradi
    const distanceStep = 1;        // distanza tra punti sul cerchio

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    let lastPoint = start;
    let lastCenter = new Point(start.x, start.y - random(minRadius, maxRadius)); // centro iniziale sopra il punto
    let clockwise = true; // alterna senso di percorrenza

    for (let i = 0; i < totalCircles; i++)
    {
        // raggio e arco
        const radius = random(minRadius, maxRadius);
        const arcDeg = random(minArcDeg, maxArcDeg);
        const arcRad = (arcDeg * Math.PI) / 180;

        // calcolo centro del nuovo cerchio
        const dx = lastPoint.x - lastCenter.x;
        const dy = lastPoint.y - lastCenter.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        const scale = (distance + radius) / distance;
        const centerX = lastCenter.x + dx * scale;
        const centerY = lastCenter.y + dy * scale;
        const center = new Point(centerX, centerY);

        // angolo iniziale = punto di contatto
        const dx0 = lastPoint.x - center.x;
        const dy0 = lastPoint.y - center.y;
        const startAngle = Math.atan2(dy0, dx0);

        // angolo finale
        const endAngle = clockwise ? startAngle + arcRad : startAngle - arcRad;

        const circle = new Circle(center, radius, startAngle, endAngle, clockwise);

        // generazione dei punti
        const totalSteps = Math.ceil(Math.abs(endAngle - startAngle) / (distanceStep / radius));
        for (let s = 0; s <= totalSteps; s++) {
            const t = s / totalSteps;
            const angle = clockwise
                ? startAngle + t * (endAngle - startAngle)
                : startAngle - t * (startAngle - endAngle);

            const x = circle.center.x + circle.radius * Math.cos(angle);
            const y = circle.center.y + circle.radius * Math.sin(angle);

            path.points.push(new Point(x, y));
            lastPoint = new Point(x, y);
        }

        // alterna senso
        clockwise = !clockwise;
        lastCenter = center;
    }

    return path;
}

function drawPath(ctx: CanvasRenderingContext2D, path: Path, pixel: Pixel)
{
  ctx.save();
  ctx.strokeStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a / 255})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const firstPoint = path.points[0];
  ctx.moveTo(firstPoint.x, firstPoint.y);
  for (let i = 1; i < path.points.length; i++) {
    const p = path.points[i];
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  ctx.restore();
}

function runPixelStep(ctx: CanvasRenderingContext2D, pixels: Pixel[], path: Path, stepIndex: number): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Calcola il punto corrente del path per questo step
  const pathPoint = path.points[stepIndex];

  for (const p of pixels) {
    // Muovi ogni pixel relativamente alla propria posizione iniziale
    const newX = p.point.x + (pathPoint.x - path.points[0].x);
    const newY = p.point.y + (pathPoint.y - path.points[0].y);

    ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.a / 255})`;
    ctx.fillRect(newX, newY, 1, 1);
  }
}


export function animatePixelsAlongPath(ctx: CanvasRenderingContext2D, pixels: Pixel[], path: Path,)
{
  const stepDelay = 1000 / PIXEL_SPEED;
  let stepIndex = 0;
  const steps = path.points.length;

  const interval = setInterval(() => {
    if (stepIndex >= steps) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      clearInterval(interval);
      return;
    }

    runPixelStep(ctx, pixels, path, stepIndex);
    stepIndex++;
  }, stepDelay);
}