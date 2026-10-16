import { useEffect, useId, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { clsx } from "clsx";

export type MaterialId = "frost" | "liquid";
export type GlassRole = "chrome" | "card" | "solid";

export type MaterialParams = {
  blur: number;
  tint: number;
  spec: number;
  refract: number;
};

type GlassStyle = CSSProperties & {
  "--blur": string;
  "--tint": string;
  "--spec": string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildDisplacementMap() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const image = ctx.createImageData(size, size);
  const data = image.data;
  const radius = 0.34;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const px = ((x + 0.5) / size - 0.5) * 2;
      const py = ((y + 0.5) / size - 0.5) * 2;
      const boxX = Math.abs(px) - (1 - radius);
      const boxY = Math.abs(py) - (1 - radius);
      const outside = Math.hypot(Math.max(boxX, 0), Math.max(boxY, 0));
      const inside = Math.min(Math.max(boxX, boxY), 0);
      const sdf = outside + inside - radius;
      const band = Math.max(0, 1 - Math.abs(sdf) / 0.34);
      const amp = (sdf < 0 ? band : band * 0.25) * 0.62;
      const len = Math.hypot(px, py) || 1;
      const i = (y * size + x) * 4;
      data[i] = clamp(128 + (px / len) * amp * 127, 0, 255);
      data[i + 1] = 128;
      data[i + 2] = clamp(128 + (py / len) * amp * 127, 0, 255);
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

export function LiquidFilter({ scale }: { scale: number }) {
  const reactId = useId();
  const mapId = `lg-map-${reactId.replace(/:/g, "")}`;

  useEffect(() => {
    const url = buildDisplacementMap();
    const map = document.getElementById(mapId);
    if (!map || !url) return;
    map.setAttribute("href", url);
    map.setAttributeNS("http://www.w3.org/1999/xlink", "href", url);
  }, [mapId]);

  useEffect(() => {
    document.getElementById("lg-disp")?.setAttribute("scale", String(scale));
  }, [scale]);

  return (
    <svg className="pointer-events-none absolute size-0" aria-hidden="true">
      <filter id="lg-lens" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feImage id={mapId} result="map" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" />
        <feDisplacementMap
          id="lg-disp"
          in="SourceGraphic"
          in2="map"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="B"
        />
      </filter>
    </svg>
  );
}

export function Glass({
  material,
  role = "chrome",
  variant = "ui",
  params,
  className,
  children,
}: {
  material: MaterialId;
  role?: GlassRole;
  variant?: "ui" | "specimen";
  params: MaterialParams;
  className?: string;
  children: ReactNode;
}) {
  const floor =
    role === "solid"
      ? 1
      : variant === "specimen"
        ? params.tint
        : role === "card"
          ? Math.max(params.tint, material === "liquid" ? 0.7 : 0.74)
          : Math.max(params.tint, material === "liquid" ? 0.18 : 0.66);

  const style: GlassStyle = {
    "--blur": `${role === "solid" ? 0 : params.blur}px`,
    "--tint": String(floor),
    "--spec": String(material === "liquid" ? params.spec : Math.min(params.spec, 0.2)),
  };

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (material !== "liquid" || role !== "chrome") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--gx", `${x}%`);
    event.currentTarget.style.setProperty("--gy", `${y}%`);
  }

  return (
    <div
      data-material={material}
      data-role={role}
      className={clsx("glass", className)}
      style={style}
      onPointerMove={onPointerMove}
    >
      <div className="glass-blur" aria-hidden="true" />
      <div className="glass-content">{children}</div>
    </div>
  );
}
