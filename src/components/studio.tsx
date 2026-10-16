import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { LiquidFilter, type MaterialId, type MaterialParams } from "@/components/glass";
import { Workbench } from "@/components/workbench";

const DEFAULTS: Record<MaterialId, MaterialParams> = {
  frost: { blur: 16, tint: 0.86, spec: 0.18, refract: 0 },
  liquid: { blur: 6, tint: 0.5, spec: 0.72, refract: 36 },
};

const SCHEMES = [
  {
    id: "pair" as const,
    index: "01",
    title: "明暗",
    text: "同一套三栏审查台，在白色和深色之间切换。",
  },
  {
    id: "split" as const,
    index: "02",
    title: "深白",
    text: "深色骨架托住白色内容。方向二把右侧判决收成深色操作区。",
  },
  {
    id: "glass" as const,
    index: "03",
    title: "玻璃",
    text: "磨砂把后面的颜色晕开，Liquid Glass 保留高光。点标签、抽帧和判决，看反馈。",
  },
];

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
}) {
  return (
    <label className="deck-slider">
      <span>
        {label}
        <b>{format(value)}</b>
      </span>
      <input
        className="slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function Studio() {
  const [scheme, setScheme] = useState<(typeof SCHEMES)[number]["id"]>("pair");
  const [pair, setPair] = useState<"light" | "dark">("light");
  const [split, setSplit] = useState<"blend" | "direction">("blend");
  const [material, setMaterial] = useState<MaterialId>("liquid");
  const [night, setNight] = useState(false);
  const [frost, setFrost] = useState<MaterialParams>(DEFAULTS.frost);
  const [liquid, setLiquid] = useState<MaterialParams>(DEFAULTS.liquid);

  const params = material === "frost" ? frost : liquid;
  const setParams = material === "frost" ? setFrost : setLiquid;
  const current = SCHEMES.find((item) => item.id === scheme) ?? SCHEMES[0];
  const look = scheme === "pair" ? pair : scheme === "split" ? split : "glass";

  return (
    <div className="deck">
      {scheme === "glass" && material === "liquid" && <LiquidFilter scale={liquid.refract} />}
      <header className="deck-head">
        <div>
          <p className="deck-kicker">万象审核平台 · 模板迭代</p>
          <h1>三套可演示的方案</h1>
        </div>
        <div className="deck-schemes" role="tablist" aria-label="方案">
          {SCHEMES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={scheme === item.id}
              onClick={() => setScheme(item.id)}
            >
              <small>方案 {item.index}</small>
              {item.title}
            </button>
          ))}
        </div>
      </header>

      <div className="deck-bar">
        <p>{current.text}</p>
        {scheme === "pair" && (
          <div className="seg" role="group" aria-label="明暗">
            <button type="button" className="seg-btn" aria-pressed={pair === "light"} onClick={() => setPair("light")}>
              <Sun size={15} aria-hidden="true" /> 白色
            </button>
            <button type="button" className="seg-btn" aria-pressed={pair === "dark"} onClick={() => setPair("dark")}>
              <Moon size={15} aria-hidden="true" /> 深色
            </button>
          </div>
        )}
        {scheme === "split" && (
          <div className="seg" role="group" aria-label="深白方向">
            <button type="button" className="seg-btn" aria-pressed={split === "blend"} onClick={() => setSplit("blend")}>
              深色+白色
            </button>
            <button
              type="button"
              className="seg-btn"
              aria-pressed={split === "direction"}
              onClick={() => setSplit("direction")}
            >
              深色+白色方向
            </button>
          </div>
        )}
        {scheme === "glass" && (
          <div className="deck-glass-controls">
            <div className="seg" role="group" aria-label="材质">
              <button type="button" className="seg-btn" aria-pressed={material === "frost"} onClick={() => setMaterial("frost")}>
                轻量磨砂
              </button>
              <button type="button" className="seg-btn" aria-pressed={material === "liquid"} onClick={() => setMaterial("liquid")}>
                Liquid Glass
              </button>
            </div>
            <div className="seg" role="group" aria-label="底色">
              <button type="button" className="seg-btn" aria-pressed={!night} onClick={() => setNight(false)}>
                白色
              </button>
              <button type="button" className="seg-btn" aria-pressed={night} onClick={() => setNight(true)}>
                深色
              </button>
            </div>
          </div>
        )}
      </div>

      {scheme === "glass" && (
        <div className="deck-optics" aria-label="玻璃参数">
          <Slider
            label="模糊"
            min={material === "frost" ? 8 : 2}
            max={material === "frost" ? 48 : 18}
            step={1}
            value={params.blur}
            format={(value) => `${value}px`}
            onChange={(blur) => setParams({ ...params, blur })}
          />
          <Slider
            label="着色"
            min={material === "frost" ? 0.5 : 0.08}
            max={material === "frost" ? 0.92 : 0.6}
            step={0.01}
            value={params.tint}
            format={(value) => value.toFixed(2)}
            onChange={(tint) => setParams({ ...params, tint })}
          />
          {material === "liquid" && (
            <>
              <Slider
                label="高光"
                min={0}
                max={1}
                step={0.01}
                value={params.spec}
                format={(value) => value.toFixed(2)}
                onChange={(spec) => setParams({ ...params, spec })}
              />
              <Slider
                label="折射"
                min={0}
                max={80}
                step={1}
                value={params.refract}
                format={(value) => String(value)}
                onChange={(refract) => setParams({ ...params, refract })}
              />
            </>
          )}
        </div>
      )}

      <div className="deck-stage">
        <Workbench look={look} night={scheme === "glass" && night} material={material} params={params} />
      </div>
    </div>
  );
}
