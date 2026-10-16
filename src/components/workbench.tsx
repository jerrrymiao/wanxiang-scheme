import { useMemo, useState, type ReactNode } from "react";
import {
  Bell,
  Check,
  Clock,
  Copy,
  FileText,
  LayoutGrid,
  Link2,
  Maximize2,
  MessageCircle,
  Monitor,
  Play,
  Pause,
  RotateCw,
  ScanSearch,
  Search,
  ShieldAlert,
  SkipBack,
  SkipForward,
  Sparkles,
  Tag,
  UserRound,
  Volume2,
} from "lucide-react";
import { clsx } from "clsx";
import { Glass, type MaterialId, type MaterialParams } from "@/components/glass";

const NAV = ["首页", "生产任务", "业务管理", "质量管理", "学习成长", "人力资源", "特征中心", "个人中心", "方案管理"];

const TAGS = [
  { id: "t1", name: "虚拟货币平台-推广", score: "98%" },
  { id: "t2", name: "虚拟货币广告-提供", score: "95%" },
  { id: "t3", name: "虚拟货币工具-推广", score: "85%" },
  { id: "t4", name: "虚拟货币系统-推广", score: "80%" },
];

const FRAMES = ["01", "02", "03", "04", "05", "06"];

const EVIDENCE = [
  { label: "预警信息", strong: true },
  { label: "策略类型", strong: false },
  { label: "策略类型示例", strong: true },
  { label: "送审策略名称", strong: false },
  { label: "送审策略名称示例", strong: true },
  { label: "文本命中策略关键词", strong: false },
  { label: "文本命中策略关键词示例", strong: true },
];

type Look = "light" | "dark" | "blend" | "direction" | "glass";

function Surface({
  glass,
  material,
  params,
  role = "card",
  bare,
  className,
  children,
}: {
  glass?: boolean;
  material?: MaterialId;
  params?: MaterialParams;
  role?: "chrome" | "card" | "solid";
  bare?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (bare) return <div className={className}>{children}</div>;
  if (glass && material && params) {
    return (
      <Glass material={material} role={role} params={params} className={className}>
        {children}
      </Glass>
    );
  }
  return <div className={clsx("rv-solid", className)}>{children}</div>;
}

function Mark() {
  return (
    <svg className="rv-mark" viewBox="0 0 40 24" aria-hidden="true">
      <path
        d="M12 5.2c-3.6 0-6.4 2.7-6.4 6.3S8.4 17.8 12 17.8c2.2 0 4-1.1 5.1-2.9l1.4-2.2 1.4 2.2c1.1 1.8 2.9 2.9 5.1 2.9 3.6 0 6.4-2.7 6.4-6.3S28.6 5.2 25 5.2c-2.2 0-4 1.1-5.1 2.9L18.5 10.3 17.1 8.1C16 6.3 14.2 5.2 12 5.2z"
        fill="none"
        stroke="#2f6fed"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Workbench({
  look,
  night = false,
  material = "frost",
  params,
}: {
  look: Look;
  night?: boolean;
  material?: MaterialId;
  params?: MaterialParams;
}) {
  const glass = look === "glass";
  const grouped = !glass;
  const titled = look === "blend" || look === "direction";
  const [nav, setNav] = useState("方案管理");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [frame, setFrame] = useState("01");
  const [playing, setPlaying] = useState(false);
  const [spin, setSpin] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [handled, setHandled] = useState(false);

  const tags = useMemo(() => {
    const q = query.trim();
    if (!q) return TAGS;
    return TAGS.filter((tag) => tag.name.includes(q));
  }, [query]);

  const frameIndex = Math.max(0, FRAMES.indexOf(frame));

  return (
    <div className="wb rv" data-look={look} data-scene={night ? "night" : "day"}>
      {glass && (
        <>
          <span className="wb-wash wash-a" />
          <span className="wb-wash wash-b" />
          <span className="wb-wash wash-c" />
        </>
      )}

      <div className="rv-chrome">
      <header className="rv-top">
        <Surface glass={glass} material={material} params={params} role="chrome" className="rv-brand">
          <Mark />
          <strong>万象审核平台</strong>
        </Surface>
        <Surface glass={glass} material={material} params={params} role="chrome" className="rv-tabs-wrap">
          <nav className="rv-tabs" aria-label="主导航">
            {NAV.map((item) => (
              <button
                key={item}
                type="button"
                className="rv-tab"
                data-active={nav === item}
                onClick={() => {
                  setNav(item);
                  setNote(`已切到 ${item}`);
                }}
              >
                {item}
              </button>
            ))}
          </nav>
        </Surface>
        <div className="rv-tools">
          <span>
            <LayoutGrid size={15} aria-hidden="true" />
            概览
          </span>
          <span>
            <Clock size={15} aria-hidden="true" />
            概览
          </span>
          <span>
            <Bell size={15} aria-hidden="true" />
            消息
          </span>
          <img className="rv-user" src="/header-avatar.png" alt="" />
        </div>
      </header>

      <div className="rv-sub">
        <span>新审核界面人机联审</span>
        <span className="rv-metrics">
          <span>
            总待审 <b>5000</b>
          </span>
          <i />
          <span>
            总超时 <b>0</b>
          </span>
          <i />
          <span>
            个人已审 <b>12</b>
          </span>
        </span>
      </div>
      </div>

      <div className="rv-grid">
        <Surface glass={glass} material={material} params={params} role="card" className="rv-col tone-side wb-block">
          <h2>
            <FileText size={15} aria-hidden="true" /> 资料与证据
          </h2>
          <p className="rv-kicker">基础信息</p>
          <div className="rv-person">
            <img src="/avatar.png" alt="" />
            <span>
              <b>岚楠</b>
              <small>宋晓东的频道</small>
            </span>
          </div>
          <button type="button" className="rv-meta" onClick={() => setNote("已复制 traceid")}>
            traceid：— <Copy size={12} aria-hidden="true" />
          </button>
          <hr className="rv-rule" />
          <p className="rv-kicker">初审信息</p>
          <div className="rv-flag">
            <span>既有结论</span>
            <strong>违法（仅参考）</strong>
          </div>
          <button type="button" className="rv-meta" onClick={() => setNote("已复制样本 ID")}>
            样本ID：— <Copy size={12} aria-hidden="true" />
          </button>
          <hr className="rv-rule" />
          <p className="rv-kicker rv-danger-kicker">
            <ShieldAlert size={13} aria-hidden="true" /> 风险证据
          </p>
          <ul className="rv-evidence">
            {EVIDENCE.map((item) => (
              <li key={item.label} data-strong={item.strong}>
                {item.label}
              </li>
            ))}
          </ul>
          <div className="rv-alert-head">
            <b>策略模型预警</b>
            <button type="button" onClick={() => setHandled((value) => !value)}>
              {handled ? "已处置" : "处置"}
            </button>
          </div>
          <p className="rv-kicker">命中标准</p>
          <p className="rv-strong">常态重大风险一号命理umi运营中</p>
          <p className="rv-kicker">原因</p>
          <p className="rv-copy">
            文章主旨为对景甜的八字命理和面相进行详细分析，属于利用命理学对公众人物进行解读。符合管控标准中关于对特定人物进行命理分析的处置要求。
          </p>
          <div className="rv-quote">
            <span>有害点摘录</span>
            景甜的盘跟她的人生经历和面相是非常一致的…这个特质非常富有男性，在从儿格里面尤其会体现得淋漓尽致
          </div>
          <p className="rv-kicker">命中细则</p>
          <p className="rv-copy">1、提及八字或命理为癸巳甲子丁酉。</p>
        </Surface>

        <div className="rv-main tone-main">
          <div className={grouped ? "rv-sheet wb-block" : "rv-stack"}>
          {titled && (
            <div className="rv-sheet-head">
              <h2>内容审查</h2>
              <span>视频 · 音频 · 图文 当前：视频</span>
            </div>
          )}
          <Surface
            bare={grouped}
            glass={glass}
            material={material}
            params={params}
            role="card"
            className={grouped ? "rv-section" : "rv-card wb-block"}
          >
            <div className="rv-card-head">
              <h2>
                <Monitor size={15} aria-hidden="true" /> 视频窗口
              </h2>
              <button type="button" className="rv-link" onClick={() => setNote("已切换备用连接")}>
                <Link2 size={13} aria-hidden="true" /> 备用连接
              </button>
            </div>
            <div className="rv-player">
              <img
                src="/review-video.png"
                alt="待审视频画面"
                style={{ transform: `rotate(${spin}deg)` }}
              />
              <div className="rv-player-bar">
                <button type="button" aria-label={playing ? "暂停" : "播放"} onClick={() => setPlaying((value) => !value)}>
                  {playing ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <span className="rv-time">0:12 / 2:16</span>
                <span className="rv-scrub" data-on={playing} />
                <span className="rv-rate">1.0x</span>
                <Volume2 size={14} aria-hidden="true" />
                <Maximize2 size={13} aria-hidden="true" />
              </div>
            </div>
            <div className="rv-actions-row">
              <button type="button" onClick={() => setNote(`已选取抽帧 ${frame}`)}>
                <ScanSearch size={13} aria-hidden="true" /> 选取帧
              </button>
              <button type="button" onClick={() => setSpin((value) => (value + 90) % 360)}>
                <RotateCw size={13} aria-hidden="true" /> 旋转
              </button>
              <button type="button" onClick={() => setNote("已复制视频链接")}>
                <Link2 size={13} aria-hidden="true" /> 复制链接
              </button>
              <button type="button" onClick={() => setFrame(FRAMES[Math.max(0, frameIndex - 1)])}>
                <SkipBack size={13} aria-hidden="true" /> 上一帧
              </button>
              <button type="button" onClick={() => setFrame(FRAMES[Math.min(FRAMES.length - 1, frameIndex + 1)])}>
                <SkipForward size={13} aria-hidden="true" /> 下一帧
              </button>
            </div>
            <div className="rv-card-head">
              <h3>视频抽帧</h3>
              <span>6 张</span>
            </div>
            <div className="rv-frames">
              {FRAMES.map((id, index) => (
                <button key={id} type="button" data-active={frame === id} onClick={() => setFrame(id)}>
                  <span className="rv-shot">
                    <img src={`/frame-${index + 1}.png`} alt="" />
                    <span className="rv-shot-cap">
                      <span>抽帧 {id}</span>
                      {frame === id && <em>当前</em>}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Surface>

          {titled ? (
            <div className="rv-pair">
              <Surface bare className="rv-section">
                <h2>
                  <FileText size={15} aria-hidden="true" /> 标题与正文
                </h2>
                <p className="rv-kicker">标题</p>
                <p className="rv-title">
                  信息交流询微信：<em>18349118631</em> 我们在做闪电网络，这是普通人最
                </p>
                <hr />
                <p className="rv-kicker">正文</p>
                <p className="rv-copy">
                  信息交流询微信：18349118631，我们在做闪电网络，这是普通人最后一次拥有比特币的机会！
                </p>
              </Surface>
              <Surface bare className="rv-section">
                <h2>
                  <Sparkles size={15} aria-hidden="true" /> 音转文组件
                </h2>
                <div className="rv-pills">
                  <span>
                    <UserRound size={12} aria-hidden="true" /> 习近平
                  </span>
                  <span>
                    <MessageCircle size={12} aria-hidden="true" /> 你好
                  </span>
                </div>
                <div className="rv-transcript">
                  <p className="rv-kicker">音转文全文</p>
                  <p>
                    崇祯皇帝朱由检，明朝最后一位皇帝，1627年至1644年在位。他在位期间，勤于政事，试图挽救大明王朝的衰落，但最终未能阻止明朝的灭亡。关于崇祯皇帝是否“有道无福”，历史上一直存在争议。
                  </p>
                  <p>
                    虽然崇祯皇帝勤政爱民，但如果换个角度思考，这个季节最适合的服装搭配。现在购买享受限时八折优惠，点击下方链接立即获取专属优惠券。活动仅限今日，数量有限，先到先得！
                  </p>
                </div>
              </Surface>
            </div>
          ) : (
            <>
          <Surface
            bare={grouped}
            glass={glass}
            material={material}
            params={params}
            role="card"
            className={grouped ? "rv-section" : "rv-card wb-block"}
          >
            <h2>
              <FileText size={15} aria-hidden="true" /> 标题与正文
            </h2>
            <p className="rv-kicker">标题</p>
            <p className="rv-title">
              信息交流询微信：<em>18349118631</em> 我们在做闪电网络，这是普通人最
            </p>
            <hr />
            <p className="rv-kicker">正文</p>
            <p className="rv-copy">
              信息交流询微信：18349118631，我们在做闪电网络，这是普通人最后一次拥有比特币的机会！
            </p>
          </Surface>

          <Surface
            bare={grouped}
            glass={glass}
            material={material}
            params={params}
            role="card"
            className={grouped ? "rv-section" : "rv-card wb-block"}
          >
            <h2>
              <Sparkles size={15} aria-hidden="true" /> 音转文组件
            </h2>
            <div className="rv-pills">
              <span>
                <UserRound size={12} aria-hidden="true" /> 习近平
              </span>
              <span>
                <MessageCircle size={12} aria-hidden="true" /> 你好
              </span>
            </div>
            <div className="rv-transcript">
              <p className="rv-kicker">音转文全文</p>
              <p>
                崇祯皇帝朱由检，明朝最后一位皇帝，1627年至1644年在位。他在位期间，勤于政事，试图挽救大明王朝的衰落，但最终未能阻止明朝的灭亡。关于崇祯皇帝是否“有道无福”，历史上一直存在争议。
              </p>
              <p>
                虽然崇祯皇帝勤政爱民，但如果换个角度思考，这个季节最适合的服装搭配。现在购买享受限时八折优惠，点击下方链接立即获取专属优惠券。活动仅限今日，数量有限，先到先得！赶快行动吧！新款春季服饰上线，全场商品限时七折起，更有满减活动等你来！注册会员即可享受新人专属折扣，首次下单立减50元。精选品质保证，假一赔十，七天无理由退换货，让您购物无忧！立即点击购买，开启您的时尚之旅！这与崇祯皇帝时期的商业活动形成鲜明对比。
              </p>
            </div>
          </Surface>
            </>
          )}
          </div>
        </div>

        <Surface glass={glass} material={material} params={params} role="chrome" className="rv-col tone-right wb-block">
          <h2>
            <Tag size={15} aria-hidden="true" /> 标签判决
          </h2>
          <label className="rv-search">
            <Search size={14} aria-hidden="true" />
            <input
              value={query}
              placeholder="搜索或输入关键词"
              aria-label="搜索标签"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="rv-card-head">
            <span>模型推荐标签</span>
            <b>{tags.length}</b>
          </div>
          <ul className="rv-tags">
            {tags.length === 0 && <li className="rv-empty">没有匹配的标签</li>}
            {tags.map((tag) => {
              const on = picked.includes(tag.id);
              return (
                <li key={tag.id}>
                  <button
                    type="button"
                    data-active={on}
                    onClick={() =>
                      setPicked((current) =>
                        current.includes(tag.id) ? current.filter((id) => id !== tag.id) : [...current, tag.id],
                      )
                    }
                  >
                    <span className="rv-box" aria-hidden="true">
                      {on && <Check size={11} />}
                    </span>
                    <span>{tag.name}</span>
                    <b>{tag.score}</b>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="rv-card-head">
            <span>已打标签</span>
            <b>{picked.length}</b>
          </div>
          <div className="rv-applied">
            {picked.length === 0 ? (
              <p>
                <Tag size={16} aria-hidden="true" />
                暂无已选标签
              </p>
            ) : (
              picked.map((id) => {
                const tag = TAGS.find((item) => item.id === id);
                return tag ? <span key={id}>{tag.name}</span> : null;
              })
            )}
          </div>
          <div className="rv-verdict">
            <button type="button" className="ghost" onClick={() => setNote("继续审核：已保留当前标签")}>
              继续审核
            </button>
            <button type="button" onClick={() => setNote("提交离开：判决已记录")}>
              提交离开
            </button>
          </div>
          {note && <p className="rv-note">{note}</p>}
        </Surface>
      </div>
    </div>
  );
}
