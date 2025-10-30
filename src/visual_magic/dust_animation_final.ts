import { Pixel, InputData, AnimationConfig, Particle, LeaderParticle, FollowerParticle, Point, Path, LeaderSettings } from './visual_helpers';

export function animateText(text: string, container: HTMLElement) {
  const showDebugPaths = false;
  const PARTICLES_PER_EXIT = 18;
  const animationDuration = 3000;
  const maxParticleSpeed = 1.8;
  const followerReleaseRatio = 0.16;

  const canvas = setupCanvas();
  const ctx = canvas.getContext("2d")!;
  const inputData = new InputData(text, container, ctx);

  const EXIT_POINTS = calculateExitPoints(inputData);
  const pixels = getTextPixels(inputData);

  // --- Crea particelle con percorsi precomputati ---
  const particles = setupParticlesWithPaths(EXIT_POINTS, pixels, PARTICLES_PER_EXIT);

  const exitGroups = groupParticlesByExit(particles);

  const config = new AnimationConfig(
    ctx,
    canvas,
    particles,
    exitGroups,
    inputData,
    showDebugPaths,
    animationDuration,
    maxParticleSpeed,
    followerReleaseRatio
  );

  runAnimationLoop(config);
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

function calculateExitPoints(inputData: InputData): Point[] {
  const chars = inputData.chars;
  const inputRect = inputData.inputRect;
  const paddingLeft = inputData.paddingLeft;
  const charWidth = inputData.charWidth;

  const nonBlankIndices = chars.map((c, i) => c !== " " ? i : -1).filter(i => i !== -1);
  let notblank = nonBlankIndices.length;
  let numExits = notblank + (notblank <= 3 ? 2 : notblank <= 10 ? 3 : notblank <= 20 ? 4 : 5);

  const EXIT_POINTS: Point[] = [];
  for (let i = 0; i < numExits; i++) {
    const charIdx = nonBlankIndices[Math.floor(i * nonBlankIndices.length / numExits)];
    const charX = inputRect.left + paddingLeft + charIdx * charWidth + charWidth / 2;
    EXIT_POINTS.push(new Point(charX, inputRect.top));
    EXIT_POINTS.push(new Point(charX, inputRect.bottom));
  }

  return EXIT_POINTS;
}

function getTextPixels(inputData: InputData): Pixel[] {
  const textPixels: Pixel[] = [];
  for (let i = 0; i < inputData.chars.length; i++) {
    if (inputData.chars[i] === " ") continue;

    const charX = inputData.inputRect.left + inputData.paddingLeft + i * inputData.charWidth;
    const charCanvas = document.createElement("canvas");
    charCanvas.width = Math.ceil(inputData.charWidth);
    charCanvas.height = Math.ceil(parseFloat(inputData.inputStyle.fontSize) || 16);

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
        if (imageData.data[idx + 3] > 128) {
          textPixels.push(new Pixel(charX + x + 2, inputData.yTop + y + 5, i));
        }
      }
    }
  }

  return textPixels;
}

function groupParticlesByExit(particles: Particle[]): Map<string, Particle[]> {
  const exitGroups: Map<string, Particle[]> = new Map();
  for (const p of particles) {
    if (p.exit) {
      const key = `${p.exit.x},${p.exit.y}`;
      if (!exitGroups.has(key)) exitGroups.set(key, []);
      exitGroups.get(key)!.push(p);
    }
  }
  return exitGroups;
}

function runAnimationLoop(config: AnimationConfig) {
  const { ctx, particles } = config;
  const leaders = particles.filter(p => p instanceof LeaderParticle) as LeaderParticle[];
  let startTime: number | null = null;

  drawTrails(ctx, leaders);
  drawLeaderCircles(ctx, leaders);

  requestAnimationFrame((timestamp) =>
    animate(timestamp, leaders, config, startTime, (t) => { startTime = t; })
  );
}

function animate(timestamp: number, leaders: LeaderParticle[], config: AnimationConfig, startTime: number | null, setStartTime: (t: number) => void) {
  const { ctx, canvas } = config;
  if (!startTime) {
    setStartTime(timestamp);
    startTime = timestamp;
  }

  const elapsed = timestamp - startTime;
  const progress = Math.min(elapsed / config.animationDuration, 1);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (config.showDebugPaths) {
    drawTrails(ctx, leaders);
    drawLeaderCircles(ctx, leaders);
  }

  for (const p of config.particles) {
    updateParticle(p, elapsed, leaders, config.exitGroups, config);
    drawParticle(p, ctx, progress);
  }

  if (elapsed < config.animationDuration)
    requestAnimationFrame((t) => animate(t, leaders, config, startTime, setStartTime));
  else
    document.body.removeChild(canvas);
}

function updateParticle(p: Particle, elapsed: number, leaders: LeaderParticle[], exitGroups: Map<string, Particle[]>, config: AnimationConfig) {
  const t = Math.min(elapsed / config.animationDuration, 1);
  const leaderHoldTime = 0;
  const followerReleaseWindow = config.animationDuration * config.followerReleaseRatio;

  let releaseTime = leaderHoldTime;
  if (p instanceof FollowerParticle) {
    const key = `${p.exit?.x},${p.exit?.y}`;
    const group = exitGroups.get(key)!;
    const idx = group.indexOf(p);
    releaseTime = leaderHoldTime + (followerReleaseWindow * idx / group.length);
  }

  const speedFactor = elapsed < releaseTime ? 0.03 : 0.5 + 1.2 * t * t;
  if (elapsed < releaseTime) {
    const anchorX = p.x - p.vx * speedFactor;
    const anchorY = p.y - p.vy * speedFactor;
    p.vx += (anchorX - p.x) * 0.08;
    p.vy += (anchorY - p.y) * 0.08;
  }

  if (p instanceof LeaderParticle && elapsed >= releaseTime)
    updateLeaderMovement(p, elapsed, releaseTime, leaders, config);

  if (p instanceof FollowerParticle && elapsed >= releaseTime) {
    const trail = p.leader.trail;
    const trailIdx = Math.max(0, trail.length - 1 - 2 * (exitGroups.get(`${p.exit!.x},${p.exit!.y}`)!.indexOf(p)));
    const target = trail[trailIdx];
    if (target) {
      p.x = target.x;
      p.y = target.y;
    }
  }

  const speed = Math.hypot(p.vx, p.vy);
  if (speed > config.maxParticleSpeed) {
    p.vx = (p.vx / speed) * config.maxParticleSpeed;
    p.vy = (p.vy / speed) * config.maxParticleSpeed;
  }
  p.x += p.vx * speedFactor;
  p.y += p.vy * speedFactor;
}

function updateLeaderMovement(leader: LeaderParticle, elapsed: number, releaseTime: number, leaders: LeaderParticle[], config: AnimationConfig) {
  if (elapsed < releaseTime) return;

  leader.circleProgress!++;
  leader.circleAngle! += leader.circleDirection! * (Math.PI * 2) / leader.circleDuration!;
  const targetX = leader.circleCenter!.x + Math.cos(leader.circleAngle!) * leader.circleRadius!;
  const targetY = leader.circleCenter!.y + Math.sin(leader.circleAngle!) * leader.circleRadius!;

  if (leader.out) {
    const maxDist = Math.hypot(config.inputData.inputRect.width, config.inputData.inputRect.height) * 0.7;
    let tries = 0;
    let newCenter: Point;
    let newRadius: number;
    let overlaps: boolean;

    do {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * maxDist * 0.7;
      newCenter = new Point(config.inputData.inputCenter.x + Math.cos(angle) * radius,
        config.inputData.inputCenter.y + Math.sin(angle) * radius);
      
      newRadius = 20 + Math.random() * 40;

      overlaps = leaders.some(other => {
        if (other === leader || !other.usedCircles) return false;
        return other.usedCircles.some(circle => {
          const distCenters = Math.hypot(newCenter.x - circle.center.x, newCenter.y - circle.center.y);
          return distCenters < newRadius + circle.radius + 24;
        });
      });

      tries++;
    } while ((overlaps || Math.hypot(newCenter.x - config.inputData.inputCenter.x, newCenter.y - config.inputData.inputCenter.y) > maxDist) && tries < 30);

    leader.circleCenter = newCenter;
    leader.circleRadius = newRadius;
    leader.circleDuration = 30 + Math.floor(Math.random() * 40);
    leader.circleProgress = 0;
    leader.circleDirection = -leader.circleDirection!;
    if (!leader.usedCircles) leader.usedCircles = [];
    leader.usedCircles.push({ center: newCenter, radius: newRadius });
  }
  else
  {
    if (leader.circleProgress! > leader.circleDuration!)
    {
      const dx = leader.exit!.x - leader.x;
      const dy = leader.exit!.y - leader.y;
      const dist = Math.hypot(dx, dy) || 1;
      const step = Math.min(60, dist);
      leader.circleCenter = new Point(leader.x + (dx / dist) * step + (Math.random() - 0.5) * 60,
        leader.y + (dy / dist) * step + (Math.random() - 0.5) * 60);
      leader.circleRadius = 20 + Math.random() * 40;
      leader.circleDuration = 30 + Math.floor(Math.random() * 40);
      leader.circleProgress = 0;
      leader.circleDirection = -leader.circleDirection!;
    }
  }

  const dx = targetX - leader.x;
  const dy = targetY - leader.y;
  const dist = Math.hypot(dx, dy) || 1;
  leader.vx += (dx / dist) * 0.13;
  leader.vy += (dy / dist) * 0.13;
  leader.trail.push(new Point(leader.x, leader.y));
  if (leader.trail.length > 120) leader.trail.shift();
}

function drawParticle(p: Particle, ctx: CanvasRenderingContext2D, progress: number)
{
  p.alpha = p instanceof LeaderParticle ? 0 : 1 - progress;
  ctx.save();
  ctx.fillStyle = p.color.replace(/[\d\.]+\)$/g, `${p.alpha})`);
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTrails(ctx: CanvasRenderingContext2D, leaders: LeaderParticle[])
{
  ctx.save();
  ctx.strokeStyle = "rgba(0,200,0,0.7)";
  ctx.lineWidth = 1.5;
  for (const p of leaders) {
    if (p.trail.length > 1) {
      ctx.beginPath();
      p.trail.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawLeaderCircles(ctx: CanvasRenderingContext2D, leaders: LeaderParticle[])
{
  for (const leader of leaders)
  {
    ctx.save();
    ctx.strokeStyle = "rgba(100,100,255,0.15)";
    ctx.beginPath();
    ctx.arc(leader.circleCenter!.x, leader.circleCenter!.y, leader.circleRadius!, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function findNearestPixel(exit: Point, pixels: Pixel[]): Pixel | null {
  if (pixels.length === 0) return null;
  let nearest = pixels[0];
  let minDist = Math.hypot(exit.x - nearest.x, exit.y - nearest.y);
  for (let i = 1; i < pixels.length; i++) {
    const p = pixels[i];
    const d = Math.hypot(exit.x - p.x, exit.y - p.y);
    if (d < minDist) {
      minDist = d;
      nearest = p;
    }
  }
  return nearest;
}

function setupParticlesWithPaths(EXIT_POINTS: Point[], pixels: Pixel[], PARTICLES_PER_EXIT: number): Particle[]
{
  const particles: Particle[] = [];

  for (const exit of EXIT_POINTS) {
    const nearestPixel = findNearestPixel(exit, pixels);
    const relevantPixels = nearestPixel ? pixels.filter(p => p.charIdx === nearestPixel.charIdx) : [];

    const leaderPixel = relevantPixels.length > 0
      ? relevantPixels[Math.floor(Math.random() * relevantPixels.length)]
      : new Pixel(exit.x, exit.y, 0);
    const firstPoint = new Point(leaderPixel.x, leaderPixel.y);

    const leaderSettings = new LeaderSettings(
      new Point (leaderPixel.x, leaderPixel.y), 20 + Math.random() * 40, 0,
      Math.random() < 0.5 ? 1 : -1, 30 + Math.floor(Math.random() * 40), false, 2000
    );
    const path = new Path(firstPoint, exit, leaderSettings);
    const leader = new LeaderParticle(leaderPixel, exit);

    (leader as any)._path = path;
    particles.push(leader);

    for (let j = 0; j < PARTICLES_PER_EXIT - 1; j++) {
      const basePixel = relevantPixels.length > 0
        ? relevantPixels[Math.floor(Math.random() * relevantPixels.length)]
        : new Pixel(leader.x, leader.y, leader.charIdx);

      const follower = new FollowerParticle(basePixel, leader);
      leader.followers.push(follower);
      particles.push(follower);
    }
  }

  // Fix dei percorsi SOLO dopo aver creato tutti i leader

  return particles;
}
