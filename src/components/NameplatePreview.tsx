import React, { useMemo } from 'react';
import { FlipHorizontal2, Scissors } from 'lucide-react';
import { NameplateConfig } from '../types/nameplate';
import { getCapHeightRatio, measureTextWidthCm } from '../utils/fontCheck';

interface Props {
  config: NameplateConfig;
  fontLoaded: boolean;
  svgRef?: React.RefObject<SVGSVGElement>;
  isPrintMode?: boolean;
}

interface ProcessedLine {
  lines: string[];
  capHeightCm: number;
  svgFontSizeCm: number;
  scaleX: number;
  isCompressed: boolean;
}

interface FaceOptions {
  /** Lật mặt sau (mirror / xoay 180°) theo cấu hình gấp đôi */
  flipped?: boolean;
  /** Gắn ref để xuất file SVG (chỉ dùng cho mặt trước) */
  bindRef?: boolean;
  /** Hiện khung gióng kích thước (chỉ có trên màn hình) */
  showGuides?: boolean;
}

export const NameplatePreview: React.FC<Props> = ({
  config,
  fontLoaded,
  svgRef,
  isPrintMode = false,
}) => {
  const fontFamily = fontLoaded
    ? '"UTM HelvetIns", "Anton", "Oswald", sans-serif'
    : '"Anton", "Oswald", "Impact", "Arial Narrow", sans-serif';

  // Tỷ lệ chiều cao thân chữ in hoa (Cap Height / Font Size)
  const capRatio = useMemo(() => getCapHeightRatio(fontFamily), [fontFamily]);

  // Chiều rộng tối đa cho phép chữ hiển thị (nằm gọn trong khung viền vàng, cách viền 0.4cm mỗi bên)
  const maxTextWidthCm = Math.max(
    2,
    config.plateWidthCm - Math.max((config.borderMarginMm * 2) / 10, 1.0) - 0.8
  );

  /**
   * Tính toán cỡ chữ SVG:
   * - Luôn giữ nguyên chiều cao thân chữ dọc = boxHeightCm (1.0cm hoặc 1.5cm).
   * - Nếu chữ dài hơn chiều ngang cho phép, chỉ co chữ theo chiều ngang (scaleX < 1),
   *   tuyệt đối không giảm chiều cao chữ.
   */
  const processBlock = (rawText: string, boxHeightCm: number): ProcessedLine => {
    const rawLines = rawText.split('\n').filter((l) => l.length > 0);
    // Giữ nguyên chiều cao thân chữ dọc trong mọi trường hợp
    const capHeightCm = boxHeightCm;
    const svgFontSizeCm = capHeightCm / capRatio;

    if (rawLines.length === 0) {
      return {
        lines: [],
        capHeightCm,
        svgFontSizeCm,
        scaleX: 1,
        isCompressed: false,
      };
    }

    let maxMeasuredCm = 0;
    for (const line of rawLines) {
      const w = measureTextWidthCm(line, svgFontSizeCm, fontFamily);
      if (w > maxMeasuredCm) maxMeasuredCm = w;
    }

    let scaleX = 1;
    let isCompressed = false;

    // Nếu nội dung quá dài: chỉ co theo chiều ngang (scaleX), giữ nguyên chiều dọc (scaleY = 1)
    if (maxMeasuredCm > maxTextWidthCm && maxMeasuredCm > 0) {
      isCompressed = true;
      scaleX = maxTextWidthCm / maxMeasuredCm;
    }

    return {
      lines: rawLines,
      capHeightCm,
      svgFontSizeCm,
      scaleX,
      isCompressed,
    };
  };

  const rankData = useMemo(
    () => processBlock(config.rank, config.rankBoxHeightCm),
    [config.rank, config.rankBoxHeightCm, maxTextWidthCm, fontFamily, capRatio]
  );

  const nameData = useMemo(
    () => processBlock(config.fullName, config.nameBoxHeightCm),
    [config.fullName, config.nameBoxHeightCm, maxTextWidthCm, fontFamily, capRatio]
  );

  const titleData = useMemo(
    () => processBlock(config.title, config.titleBoxHeightCm),
    [config.title, config.titleBoxHeightCm, maxTextWidthCm, fontFamily, capRatio]
  );

  // Tọa độ Y của 7 dải dọc: 1.0 - 1.0 - 1.5 - 1.5 - 1.5 - 1.0 - 1.0 = 8.5cm
  const rankTopY = config.topMarginCm;
  const rankBottomY = rankTopY + config.rankBoxHeightCm;

  const nameTopY = rankBottomY + config.gapRankToNameCm;
  const nameBottomY = nameTopY + config.nameBoxHeightCm;

  const titleTopY = nameBottomY + config.gapNameToTitleCm;
  const titleBottomY = titleTopY + config.titleBoxHeightCm;

  const borderMarginCm = config.borderMarginMm / 10;
  const borderStrokeCm = config.borderThicknessMm / 10;

  // ----- Hiệu ứng gấp đôi 2 mặt (mirror) -----
  const foldEnabled = config.foldMode !== 'none';
  const foldGapMm = foldEnabled ? Math.max(0, config.foldGapMm) : 0;
  const foldModeLabel =
    config.foldMode === 'mirrorX' ? 'lật gương ngang' : 'xoay 180°';

  /**
   * Phép biến đổi cho mặt thứ 2 (mặt sau) trong khung viewBox của mặt biển:
   * - rotate180: xoay quanh tâm biển. Đây là phép biến đổi ĐÚNG khi gấp giấy:
   *   sau khi gấp đôi theo đường gấp, mặt sau đọc xuôi y như mặt trước.
   * - mirrorX: lật gương ngang (dùng cho mica trong / in qua mặt sau).
   */
  const backFaceTransform =
    config.foldMode === 'mirrorX'
      ? `translate(${config.plateWidthCm} 0) scale(-1 1)`
      : `rotate(180 ${config.plateWidthCm / 2} ${config.plateHeightCm / 2})`;

  /**
   * Vẽ từng khối chữ sao cho chân chữ (alphabetic baseline) nằm đúng đường gióng dưới của dải
   * và đỉnh chữ in hoa chạm đúng đường gióng trên của dải (cao đúng 1cm hoặc 1.5cm).
   */
  const renderTextInBand = (
    data: ProcessedLine,
    bandTopY: number,
    bandHeight: number
  ) => {
    if (data.lines.length === 0) return null;
    const centerX = config.plateWidthCm / 2;

    if (data.lines.length === 1) {
      const baselineY = bandTopY + (bandHeight + data.capHeightCm) / 2;
      return (
        <g transform={`translate(${centerX}, ${baselineY}) scale(${data.scaleX}, 1)`}>
          <text
            x={0}
            y={0}
            fill={config.textColor}
            fontFamily={fontFamily}
            fontSize={data.svgFontSizeCm}
            textAnchor="middle"
            dominantBaseline="alphabetic"
            style={{
              fontWeight: 400,
              letterSpacing: '0.01em',
              userSelect: 'none',
            }}
          >
            {data.lines[0]}
          </text>
        </g>
      );
    }

    // Trường hợp người dùng nhấn Enter xuống nhiều dòng trong 1 mục
    const lineStep = data.capHeightCm * 1.28;
    const totalBlockHeight = data.capHeightCm + (data.lines.length - 1) * lineStep;
    const firstLineBaselineY =
      bandTopY + (bandHeight - totalBlockHeight) / 2 + data.capHeightCm;

    return data.lines.map((line, idx) => {
      const y = firstLineBaselineY + idx * lineStep;
      return (
        <g key={idx} transform={`translate(${centerX}, ${y}) scale(${data.scaleX}, 1)`}>
          <text
            x={0}
            y={0}
            fill={config.textColor}
            fontFamily={fontFamily}
            fontSize={data.svgFontSizeCm}
            textAnchor="middle"
            dominantBaseline="alphabetic"
            style={{
              fontWeight: 400,
              letterSpacing: '0.01em',
              userSelect: 'none',
            }}
          >
            {line}
          </text>
        </g>
      );
    });
  };

  // Nội dung mặt biển SVG (1 đơn vị viewBox = 1 cm thực tế)
  const renderPlateFace = (options: FaceOptions = {}) => {
    const {
      flipped = false,
      bindRef = false,
      showGuides = !isPrintMode && !flipped,
    } = options;

    return (
      <svg
        ref={bindRef ? svgRef : undefined}
        xmlns="http://www.w3.org/2000/svg"
        width={`${config.plateWidthCm}cm`}
        height={`${config.plateHeightCm}cm`}
        viewBox={`0 0 ${config.plateWidthCm} ${config.plateHeightCm}`}
        className="plate-svg"
        data-plate-face={flipped ? 'back' : 'front'}
      >
        {/* Toàn bộ nội dung gom vào 1 nhóm để lật cho mặt sau */}
        <g
          className="plate-face-content"
          transform={flipped ? backFaceTransform : undefined}
        >
          {/* Nền biển đỏ */}
          <rect
            x={0}
            y={0}
            width={config.plateWidthCm}
            height={config.plateHeightCm}
            fill={config.bgColor}
          />

          {/* Viền vàng bên trong */}
          <rect
            x={borderMarginCm}
            y={borderMarginCm}
            width={Math.max(0, config.plateWidthCm - borderMarginCm * 2)}
            height={Math.max(0, config.plateHeightCm - borderMarginCm * 2)}
            fill="none"
            stroke={config.borderColor}
            strokeWidth={borderStrokeCm}
          />

          {/* 3 dòng nội dung đặt đúng vào các dải 1cm - 1.5cm - 1cm */}
          {renderTextInBand(rankData, rankTopY, config.rankBoxHeightCm)}
          {renderTextInBand(nameData, nameTopY, config.nameBoxHeightCm)}
          {renderTextInBand(titleData, titleTopY, config.titleBoxHeightCm)}

          {/* Lưới gióng kiểm tra kích thước 7 dải (chỉ hiện trên màn hình khi bật) */}
          {showGuides && config.showDimensionGuides && (
            <g className="dimension-guides" pointerEvents="none">
              {[
                { y1: 0, y2: rankTopY, label: `${config.topMarginCm}cm`, w: 4.5 },
                { y1: rankTopY, y2: rankBottomY, label: `${config.rankBoxHeightCm}cm`, w: 4.5 },
                { y1: rankBottomY, y2: nameTopY, label: `${config.gapRankToNameCm}cm`, w: 1.8 },
                { y1: nameTopY, y2: nameBottomY, label: `${config.nameBoxHeightCm}cm`, w: 1.8 },
                { y1: nameBottomY, y2: titleTopY, label: `${config.gapNameToTitleCm}cm`, w: 1.8 },
                { y1: titleTopY, y2: titleBottomY, label: `${config.titleBoxHeightCm}cm`, w: 4.2 },
                {
                  y1: titleBottomY,
                  y2: config.plateHeightCm,
                  label: `${config.bottomMarginCm}cm`,
                  w: 4.2,
                },
              ].map((b, i) => (
                <g key={i}>
                  <rect
                    x={0.02}
                    y={b.y1}
                    width={b.w}
                    height={Math.max(0, b.y2 - b.y1)}
                    fill="rgba(0, 0, 0, 0.18)"
                    stroke="#00ffff"
                    strokeWidth={0.03}
                  />
                  <line
                    x1={0}
                    y1={b.y2}
                    x2={config.plateWidthCm}
                    y2={b.y2}
                    stroke="rgba(0, 255, 255, 0.45)"
                    strokeWidth={0.02}
                    strokeDasharray="0.15,0.15"
                  />
                  <text
                    x={0.25}
                    y={(b.y1 + b.y2) / 2}
                    fill="#ffffff"
                    fontSize={0.34}
                    fontFamily="sans-serif"
                    dominantBaseline="central"
                    style={{ fontWeight: 700 }}
                  >
                    {b.label}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* Đường viền cắt cực mảnh khi in */}
          {isPrintMode && config.printCropMarks && (
            <rect
              x={0}
              y={0}
              width={config.plateWidthCm}
              height={config.plateHeightCm}
              fill="none"
              stroke="#333333"
              strokeWidth={0.015}
              strokeDasharray="0.15,0.15"
            />
          )}
        </g>
      </svg>
    );
  };

  /**
   * Khe gấp nằm giữa 2 mặt: cao đúng bằng khoảng hở (mặc định 0) để không làm lệch
   * vị trí vật lý của 2 mặt khi in; đường kẻ đứt được đặt tuyệt đối nên không chiếm chỗ.
   */
  const renderFoldGap = (prefix: 'fold' | 'print-fold') => (
    <div
      className={`${prefix}-gap`}
      style={{ height: `${foldGapMm}mm` }}
      aria-hidden="true"
    >
      {config.foldShowLine && <div className={`${prefix}-crease-line`} />}
    </div>
  );

  if (isPrintMode) {
    return (
      <div className="print-sheet">
        <div className="print-sheet-stack">
          <div className="print-plate-wrapper">{renderPlateFace()}</div>

          {foldEnabled ? (
            <>
              {renderFoldGap('print-fold')}
              <div className="print-plate-wrapper">
                {renderPlateFace({ flipped: true })}
              </div>
            </>
          ) : (
            config.printTwoSides && (
              <div className="print-plate-wrapper" style={{ marginTop: '8mm' }}>
                {renderPlateFace()}
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  const maxContainerWidthCm = Math.max(
    config.plateWidthCm,
    config.showStandPreview ? config.standBottomWidthCm : config.plateWidthCm
  );

  return (
    <div className="preview-stage">
      <div className="dimension-badge">
        Kích thước chuẩn: <strong>{config.plateWidthCm} cm × {config.plateHeightCm} cm</strong> (Tỷ lệ dọc:{' '}
        {config.topMarginCm} - {config.rankBoxHeightCm} - {config.gapRankToNameCm} -{' '}
        {config.nameBoxHeightCm} - {config.gapNameToTitleCm} - {config.titleBoxHeightCm} -{' '}
        {config.bottomMarginCm} cm)
        {(rankData.isCompressed || nameData.isCompressed || titleData.isCompressed) && (
          <span className="compress-notice">
            • Đã tự động co ngang chữ (giữ nguyên chiều cao dọc)
          </span>
        )}
      </div>

      <div className="assembly-container">
        <div className="plate-screen-wrapper">{renderPlateFace({ bindRef: true })}</div>

        {config.showStandPreview && (
          <div
            className="stand-preview"
            style={{
              width: `${(config.standBottomWidthCm / config.plateWidthCm) * 100}%`,
            }}
          >
            <svg
              viewBox={`0 0 ${maxContainerWidthCm} ${config.standHeightCm + 0.6}`}
              width="100%"
              style={{ display: 'block', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="standGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5c2c16" />
                  <stop offset="65%" stopColor="#3d1b0c" />
                  <stop offset="100%" stopColor="#261006" />
                </linearGradient>
                <linearGradient id="lipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8a4b29" />
                  <stop offset="50%" stopColor="#b86b3d" />
                  <stop offset="100%" stopColor="#6e381b" />
                </linearGradient>
              </defs>

              {(() => {
                const topW = config.standTopWidthCm;
                const botW = config.standBottomWidthCm;
                const h = config.standHeightCm;
                const lipH = config.standLipHeightCm;
                const centerX = maxContainerWidthCm / 2;

                const topLeftX = centerX - topW / 2;
                const topRightX = centerX + topW / 2;
                const botLeftX = centerX - botW / 2;
                const botRightX = centerX + botW / 2;

                return (
                  <g>
                    <polygon
                      points={`${topLeftX},0 ${topRightX},0 ${botRightX},${h - lipH} ${botLeftX},${h - lipH}`}
                      fill="url(#standGrad)"
                      stroke="#2a1208"
                      strokeWidth="0.03"
                    />
                    <rect
                      x={botLeftX}
                      y={h - lipH}
                      width={botW}
                      height={lipH}
                      fill="url(#lipGrad)"
                      stroke="#2a1208"
                      strokeWidth="0.03"
                    />
                    <text
                      x={centerX}
                      y={h / 2}
                      fill="rgba(255,255,255,0.65)"
                      fontSize="0.32"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      Chân đế tham chiếu ({topW}cm / {botW}cm × cao {h}cm) - Không in phần này
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>
        )}
      </div>

      {/* Xem trước bố cục tờ in gấp đôi: mặt trước + mặt sau đã lật */}
      {foldEnabled && (
        <div className="fold-print-preview">
          <div className="fold-print-caption">
            <FlipHorizontal2 size={16} />
            <span>
              Bố cục tờ in gấp đôi – mặt sau {foldModeLabel}
            </span>
          </div>

          <div className="fold-stack">
            <div className="fold-face">{renderPlateFace({ showGuides: false })}</div>
            {renderFoldGap('fold')}
            <div className="fold-face">{renderPlateFace({ flipped: true })}</div>
          </div>

          <div className="fold-legend">
            <span>
              <Scissors size={13} /> Trên: mặt trước · Dưới: mặt sau (đã lật sẵn)
            </span>
            <span>
              Gấp theo đường kẻ đứt, mặt in ra ngoài → 2 mặt đều đọc xuôi và đúng{' '}
              {config.plateWidthCm} × {config.plateHeightCm} cm.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
