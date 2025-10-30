
export class Point
{
  x: number;
  y: number;
  exit: boolean = false;
  constructor(x: number, y: number, exit: boolean = false)
  {
    this.x = x;
    this.y = y;
    this.exit = exit;
  }
}

export class Pixel
{
  x: number;
  y: number;
  charIdx: number;
  constructor(x: number, y: number, charIdx: number)
  {
    this.x = x;
    this.y = y;
    this.charIdx = charIdx;
  }
}

export class Circle
{
  center: Point;
  radius: number;
  constructor(center: Point, radius: number)
  {
    this.center = center;
    this.radius = radius;
  }
}

export class Particle
{
  x: number;                        // Posizione X corrente della particella
  y: number;                        // Posizione Y corrente della particella
  exit?: Point;                     // Punto di uscita assegnato alla particella
  charIdx: number;                  // Indice del carattere di testo associato

  vx: number;                       // Velocità X della particella
  vy: number;                       // Velocità Y della particella
  size: number;                     // Dimensione della particella
  alpha: number;                    // Trasparenza (opacità) della particella
  out: boolean;                     // True se la particella è uscita dall'area di input, false altrimenti
  color: string;                    // Colore della particella (RGBA)
  wiggle: number;                   // Fattore di oscillazione casuale
  angle: number;                    // Angolo di movimento iniziale o corrente

  constructor(x: number, y: number, exit?: Point, charIdx?: number, isLeader: boolean = false)
  {
    this.x = x;
    this.y = y;
    this.exit = exit;
    this.charIdx = charIdx ?? 0;
    this.vx = 0;
    this.vy = 0;
    this.size = 1;
    this.alpha = isLeader ? 0 : 1;
    this.out = false;
    this.color = "rgba(255,255,255,1)";
    this.wiggle = Math.random() * 0.5 + 0.5;
    this.angle = Math.random() * Math.PI * 2;
  }
}

export class LeaderParticle extends Particle
{
    trail: Point[];                  // Lista delle posizioni precedenti (per effetto scia)
    followers: FollowerParticle[];   // Array di follower associati
    circleCenter: Point;             // Centro del cerchio per il movimento circolare
    circleRadius: number;            // Raggio del cerchio per il movimento circolare
    circleAngle: number;             // Angolo corrente sul cerchio
    circleDuration: number;          // Durata del movimento circolare
    circleProgress: number;          // Stato di avanzamento sul cerchio
    circleDirection: number;         // Direzione del movimento circolare
    usedCircles: Circle[];           // Cerchi già usati dal leader per evitare sovrapposizioni
    currentCircleIndex: number;      // Indice del cerchio attualmente usato

    constructor(pixel: Pixel, exit: Point)
    {
        super(pixel.x, pixel.y, exit, pixel.charIdx, true);
        this.trail = [];
        this.followers = [];

        const baseRadius = 30 + Math.random() * 40;
        const firstCircle = new Circle(new Point(pixel.x, pixel.y), baseRadius);

        this.circleCenter = firstCircle.center;
        this.circleRadius = firstCircle.radius;
        this.circleAngle = Math.random() * Math.PI * 2;
        this.circleDuration = 40 + Math.floor(Math.random() * 30);
        this.circleProgress = 0;
        this.circleDirection = Math.random() < 0.5 ? 1 : -1;
        this.usedCircles = [firstCircle];
        this.currentCircleIndex = 0;
    }
}

export class FollowerParticle extends Particle
{
    leader: LeaderParticle;         // Riferimento al leader
    inFila: boolean;                // True se la particella è in fila
    followTarget?: Particle;        // Particella da seguire (per follower avanzati)

    constructor(pixel: Pixel, leader: LeaderParticle, followTarget?: Particle)
    {
        super(pixel.x, pixel.y, leader.exit, pixel.charIdx);
        this.leader = leader;
        this.inFila = true;
        this.followTarget = followTarget;
    }
}

export class InputData
{
  chars: string[];
  inputRect: DOMRect;
  inputStyle: CSSStyleDeclaration;
  fontSize: number;
  paddingLeft: number;
  paddingTop: number;
  font: string;
  charWidth: number;
  yTop: number;
  inputCenter: Point;

  constructor(text: string, container: HTMLElement, ctx: CanvasRenderingContext2D)
  {
    const input = container as HTMLInputElement;
    const value = input.value || text;
    this.chars = value.split("");

    this.inputRect = input.getBoundingClientRect();
    this.inputStyle = window.getComputedStyle(input);

    this.fontSize = parseFloat(this.inputStyle.fontSize);
    this.paddingLeft = parseFloat(this.inputStyle.paddingLeft);
    this.paddingTop = parseFloat(this.inputStyle.paddingTop);

    this.font = this.inputStyle.font || `${this.fontSize}px monospace`;
    ctx.font = this.font;

    this.charWidth = ctx.measureText("M").width;
    this.yTop = this.inputRect.top + this.paddingTop;

    this.inputCenter = new Point(
        (this.inputRect.left + this.inputRect.right) / 2,
        (this.inputRect.top + this.inputRect.bottom) / 2
    );
  }
}

export class AnimationConfig
{
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  particles: Particle[];
  exitGroups: Map<string, Particle[]>;
  inputData: InputData;
  showDebugPaths: boolean;
  animationDuration: number;
  maxParticleSpeed: number;
  followerReleaseRatio: number;
  isInsideInput: (x: number, y: number) => boolean;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    particles: Particle[],
    exitGroups: Map<string, Particle[]>,
    inputData: InputData,
    showDebugPaths: boolean,
    animationDuration: number,
    maxParticleSpeed: number,
    followerReleaseRatio: number
  )
  {
    this.ctx = ctx;
    this.canvas = canvas;
    this.particles = particles;
    this.exitGroups = exitGroups;
    this.inputData = inputData;
    this.showDebugPaths = showDebugPaths;
    this.animationDuration = animationDuration;
    this.maxParticleSpeed = maxParticleSpeed;
    this.followerReleaseRatio = followerReleaseRatio;
    this.isInsideInput = (x: number, y: number) =>
        x >= inputData.inputRect.left &&
        x <= inputData.inputRect.right &&
        y >= inputData.inputRect.top &&
        y <= inputData.inputRect.bottom;
  }
}

export class LeaderSettings
{
  circleCenter: Point;
  circleRadius: number;
  circleAngle: number;
  circleDirection: number;
  circleDuration: number;
  out: boolean;
  maxFrames: number;

  constructor(
    circleCenter: Point,
    circleRadius: number,
    circleAngle: number,
    circleDirection: number,
    circleDuration: number,
    out: boolean,
    maxFrames: number
  ) {
    this.circleCenter = circleCenter;
    this.circleRadius = circleRadius;
    this.circleAngle = circleAngle;
    this.circleDirection = circleDirection;
    this.circleDuration = circleDuration;
    this.out = out;
    this.maxFrames = maxFrames;
  }
}

export class Path
{
  points: Point[] = [];

  constructor(start: Point, exit: Point, leaderSettings: LeaderSettings)
  {
    // Simula frame-by-frame il percorso del leader
    let x = start.x;
    let y = start.y;
    let circleCenter = { ...leaderSettings.circleCenter };
    let circleRadius = leaderSettings.circleRadius;
    let circleAngle = leaderSettings.circleAngle;
    let circleDirection = leaderSettings.circleDirection;
    let circleDuration = leaderSettings.circleDuration;
    let circleProgress = 0;
    let out = leaderSettings.out;

    const maxFrames = leaderSettings.maxFrames || 2000;
    for (let frame = 0; frame < maxFrames; frame++)
    {
      // Calcolo come in updateLeaderMovement
      circleProgress++;
      circleAngle += circleDirection * (Math.PI * 2) / circleDuration;
      let targetX = circleCenter.x + Math.cos(circleAngle) * circleRadius;
      let targetY = circleCenter.y + Math.sin(circleAngle) * circleRadius;

      if (!out && circleProgress > circleDuration)
      {
        const dx = exit.x - x;
        const dy = exit.y - y;
        const dist = Math.hypot(dx, dy) || 1;
        const step = Math.min(60, dist);
        circleCenter = new Point(
          x + (dx / dist) * step + (Math.random() - 0.5) * 60,
          y + (dy / dist) * step + (Math.random() - 0.5) * 60
        );
        circleRadius = 20 + Math.random() * 40;
        circleDuration = 30 + Math.floor(Math.random() * 40);
        circleProgress = 0;
        circleDirection = -circleDirection;
      }

      const dx = targetX - x;
      const dy = targetY - y;
      const dist = Math.hypot(dx, dy) || 1;
      x += (dx / dist) * 0.13;
      y += (dy / dist) * 0.13;

      this.points.push(new Point(x, y));

      // Condizione per fermare il calcolo se siamo vicini all'uscita
      if (!out && Math.hypot(x - exit.x, y - exit.y) < 1) break;
    }
  }
}
