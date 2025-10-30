
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

export class Point
{
  x: number;
  y: number;
  exit: boolean = false;
  charIdx: number | null = null;
  constructor(x: number, y: number, exit: boolean = false, charIdx: number | null = null)
  {
    this.x = x;
    this.y = y;
    this.exit = exit;
    this.charIdx = charIdx;
  }
}

export class Pixel
{
  point: Point;  // posizione e informazioni aggiuntive
  r: number;     // rosso 0-255
  g: number;     // verde 0-255
  b: number;     // blu 0-255
  a: number;     // alpha 0-255

  constructor(point: Point, r: number, g: number, b: number, a: number) {
    this.point = point;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

export class Circle
{
    center: Point;
    radius: number;
    startAngle: number; // dove inizia l'arco
    endAngle: number;   // dove finisce l'arco
    clockwise: boolean; // senso di percorrenza

    constructor(center: Point, radius: number, startAngle: number, endAngle: number, clockwise: boolean)
    {
        this.center = center;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.clockwise = clockwise;
    }
}

export class Path
{
  points: Point[];

  constructor(points: Point[] = [])
  {
    this.points = points;
  }
}