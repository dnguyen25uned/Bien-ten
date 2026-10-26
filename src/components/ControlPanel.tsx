import React from 'react';
import { FoldMode, NameplateConfig } from '../types/nameplate';
import {
  Printer,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle2,
  Info,
  Ruler,
  FlipHorizontal2,
  Scissors,
} from 'lucide-react';

interface Props {
  config: NameplateConfig;
  onChange: (newConfig: NameplateConfig) => void;
  onReset: () => void;
  onPrint: () => void;
  onDownloadSvg: () => void;
  fontLoaded: boolean;
}

export const ControlPanel: React.FC<Props> = ({
  config,
  onChange,
  onReset,
  onPrint,
  onDownloadSvg,
  fontLoaded,
}) => {
  const updateField = <K extends keyof NameplateConfig>(
    key: K,
    value: NameplateConfig[K]
  ) => {
    onChange({ ...config, [key]: value });
  };

  const totalVerticalBands = Number(
    (
      config.topMarginCm +
      config.rankBoxHeightCm +
      config.gapRankToNameCm +
      config.nameBoxHeightCm +
      config.gapNameToTitleCm +
      config.titleBoxHeightCm +
      config.bottomMarginCm
    ).toFixed(2)
  );

  const foldEnabled = config.foldMode !== 'none';

  // Kích thước tờ giấy sau khi xoay hướng + vùng in được (đã trừ lề 2 bên)
  const basePaperWmm = config.paperSize === 'A4' ? 210 : config.customPaperWidthMm;
  const basePaperHmm = config.paperSize === 'A4' ? 297 : config.customPaperHeightMm;
  const sheetWmm = config.orientation === 'landscape' ? basePaperHmm : basePaperWmm;
  const sheetHmm = config.orientation === 'landscape' ? basePaperWmm : basePaperHmm;
  const printableWmm = Math.max(0, sheetWmm - config.pageMarginMm * 2);
  const printableHmm = Math.max(0, sheetHmm - config.pageMarginMm * 2);

  const plateWmm = config.plateWidthCm * 10;
  const plateHmm = config.plateHeightCm * 10;
  const foldNeededHmm = foldEnabled
    ? plateHmm * 2 + Math.max(0, config.foldGapMm)
    : plateHmm;
  const foldFits =
    plateWmm <= printableWmm + 0.01 && foldNeededHmm <= printableHmm + 0.01;

  return (
    <div className="control-panel">
      {/* Trạng thái Font chữ */}
      <div className={`font-status-banner ${fontLoaded ? 'loaded' : 'fallback'}`}>
        {fontLoaded ? (
          <>
            <CheckCircle2 size={18} />
            <div>
              <strong>Đã nhận diện font UTM HelvetIns</strong>
              <p>Bản xem trước và bản in hiển thị đúng font thiết kế.</p>
            </div>
          </>
        ) : (
          <>
            <AlertTriangle size={20} />
            <div>
              <strong>Chưa tìm thấy font "UTM HelvetIns" trên máy</strong>
              <p>
                Ứng dụng đang dùng font <em>Anton / Oswald</em> thay thế tạm thời. Hãy chép file{' '}
                <code>UTM-HelvetIns.ttf</code> vào thư mục <code>public/fonts</code> hoặc cài vào
                máy để đạt độ chuẩn xác 100%.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Phần 1: Nội dung 3 dòng */}
      <section className="panel-section">
        <h3>1. Nội dung biển tên</h3>
        <div className="form-group">
          <label htmlFor="rank-input">Cấp bậc (Dòng 1 - Cao {config.rankBoxHeightCm} cm)</label>
          <textarea
            id="rank-input"
            rows={1}
            value={config.rank}
            onChange={(e) => updateField('rank', e.target.value)}
            placeholder="Ví dụ: ĐẠI UÝ"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name-input">Họ và tên (Dòng 2 - Cao {config.nameBoxHeightCm} cm)</label>
          <textarea
            id="name-input"
            rows={1}
            value={config.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="Ví dụ: NGUYỄN MẠNH TUẤN"
          />
        </div>

        <div className="form-group">
          <label htmlFor="title-input">Chức danh / Đơn vị (Dòng 3 - Cao {config.titleBoxHeightCm} cm)</label>
          <textarea
            id="title-input"
            rows={1}
            value={config.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ví dụ: ĐỘI TRƯỞNG TM-HC"
          />
          <small className="hint">
            Tự động co ngang nếu nội dung dài. Nhấn Enter nếu muốn ngắt thành 2 dòng.
          </small>
        </div>
      </section>

      {/* Phần 2: Kích thước chuẩn theo sơ đồ 7 dải dọc */}
      <section className="panel-section">
        <h3>2. Kích thước mặt biển & 7 dải căn lề chuẩn (cm)</h3>
        <p className="section-note">
          Đã thiết lập đúng theo bản vẽ kỹ thuật: Rộng <strong>15 cm</strong> × Cao{' '}
          <strong>8,5 cm</strong> (7 dải dọc: <strong>1 - 1 - 1,5 - 1,5 - 1,5 - 1 - 1 cm</strong>,
          không tính dấu thanh điệu).
        </p>

        <div className="checkbox-row" style={{ marginBottom: '0.85rem', background: '#eff6ff', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
          <input
            type="checkbox"
            id="toggle-guides"
            checked={config.showDimensionGuides}
            onChange={(e) => updateField('showDimensionGuides', e.target.checked)}
          />
          <label htmlFor="toggle-guides" style={{ fontWeight: 600, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
            <Ruler size={16} />
            Hiển thị khung gióng kích thước (1cm / 1,5cm) trên bản xem trước để kiểm tra
          </label>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Chiều rộng mặt biển (cm)</label>
            <input
              type="number"
              step="0.1"
              min="5"
              max="40"
              value={config.plateWidthCm}
              onChange={(e) => updateField('plateWidthCm', Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Chiều cao mặt biển (cm) [Tổng 7 dải: {totalVerticalBands}cm]</label>
            <input
              type="number"
              step="0.1"
              min="3"
              max="30"
              value={config.plateHeightCm}
              onChange={(e) => updateField('plateHeightCm', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label>1. Lề trên cùng (cm)</label>
            <input
              type="number"
              step="0.05"
              value={config.topMarginCm}
              onChange={(e) => updateField('topMarginCm', Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>2. Cao chữ Cấp bậc (cm)</label>
            <input
              type="number"
              step="0.05"
              value={config.rankBoxHeightCm}
              onChange={(e) => updateField('rankBoxHeightCm', Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>3. Cách Cấp bậc → Tên (cm)</label>
            <input
              type="number"
              step="0.05"
              value={config.gapRankToNameCm}
              onChange={(e) => updateField('gapRankToNameCm', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label>4. Cao chữ Tên (cm)</label>
            <input
              type="number"
              step="0.05"
              value={config.nameBoxHeightCm}
              onChange={(e) => updateField('nameBoxHeightCm', Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>5. Cách Tên → Chức danh (cm)</label>
            <input
              type="number"
              step="0.05"
              value={config.gapNameToTitleCm}
              onChange={(e) => updateField('gapNameToTitleCm', Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>6. Cao chữ Chức danh (cm)</label>
            <input
              type="number"
              step="0.05"
              value={config.titleBoxHeightCm}
              onChange={(e) => updateField('titleBoxHeightCm', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>7. Lề dưới cùng (cm)</label>
            <input
              type="number"
              step="0.05"
              value={config.bottomMarginCm}
              onChange={(e) => updateField('bottomMarginCm', Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Khoảng cách mép biển vào viền vàng (mm)</label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="20"
              value={config.borderMarginMm}
              onChange={(e) => updateField('borderMarginMm', Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* Phần 3: Màu sắc & Chân đế */}
      <section className="panel-section">
        <h3>3. Màu sắc & Mô phỏng chân đế</h3>
        <div className="grid-3">
          <div className="form-group">
            <label>Màu nền biển</label>
            <div className="color-picker-row">
              <input
                type="color"
                value={config.bgColor}
                onChange={(e) => updateField('bgColor', e.target.value)}
              />
              <span>{config.bgColor.toUpperCase()}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Màu chữ</label>
            <div className="color-picker-row">
              <input
                type="color"
                value={config.textColor}
                onChange={(e) => updateField('textColor', e.target.value)}
              />
              <span>{config.textColor.toUpperCase()}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Độ dày nét viền (mm)</label>
            <input
              type="number"
              step="0.1"
              min="0.2"
              max="5"
              value={config.borderThicknessMm}
              onChange={(e) => updateField('borderThicknessMm', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="toggle-stand"
            checked={config.showStandPreview}
            onChange={(e) => updateField('showStandPreview', e.target.checked)}
          />
          <label htmlFor="toggle-stand">
            Hiển thị chân đế tham chiếu trên màn hình ({config.standBottomWidthCm}cm ×{' '}
            {config.standHeightCm}cm)
          </label>
        </div>
      </section>

      {/* Phần 4: Hiệu ứng mirror – gấp đôi thành 2 mặt */}
      <section className="panel-section">
        <h3>4. Hiệu ứng mirror – Gấp đôi thành 2 mặt</h3>
        <p className="section-note">
          In 2 mặt biển trên cùng một tờ giấy: mặt thứ hai được lật sẵn để sau khi gấp đôi,
          cả hai mặt đều đọc xuôi và vẫn giữ đúng kích thước{' '}
          <strong>
            {config.plateWidthCm} × {config.plateHeightCm} cm
          </strong>
          .
        </p>

        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="fold-mode">Kiểu lật mặt sau (mirror)</label>
            <select
              id="fold-mode"
              value={config.foldMode}
              onChange={(e) => updateField('foldMode', e.target.value as FoldMode)}
            >
              <option value="rotate180">Xoay 180° – gấp giấy (chuẩn)</option>
              <option value="mirrorX">Lật gương ngang – mica trong</option>
              <option value="none">Tắt – chỉ in 1 mặt</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fold-gap">Khoảng hở giữa 2 mặt (mm)</label>
            <input
              id="fold-gap"
              type="number"
              min="0"
              max="40"
              step="0.5"
              value={config.foldGapMm}
              disabled={!foldEnabled}
              onChange={(e) => updateField('foldGapMm', Number(e.target.value))}
            />
            <small className="hint">Để 0 mm khi muốn gấp thành 1 tấm liền.</small>
          </div>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="fold-show-line"
            checked={config.foldShowLine}
            disabled={!foldEnabled}
            onChange={(e) => updateField('foldShowLine', e.target.checked)}
          />
          <label htmlFor="fold-show-line">In đường gấp (nét đứt) giữa hai mặt</label>
        </div>

        <div className="fold-note">
          <Scissors size={16} />
          <div>
            <strong>Cách gấp:</strong> in ra, gấp đôi tờ giấy theo đúng đường kẻ đứt,{' '}
            <em>mặt in quay ra ngoài</em>. Hai nửa tờ giấy trở thành 2 mặt của biển và cùng
            đọc xuôi. Gấp ở mép trên (biển dựng đứng) hay mép dưới (cắm vào chân đế) đều đúng,
            vì tờ in đối xứng 180°.
          </div>
        </div>

        {foldEnabled && config.foldMode === 'mirrorX' && (
          <div className="fold-note warn">
            <AlertTriangle size={16} />
            <div>
              <strong>Lưu ý:</strong> “Lật gương ngang” làm chữ ở mặt sau bị ngược khi nhìn trực
              tiếp – chỉ dùng khi in lên mica/giấy trong rồi nhìn xuyên từ mặt sau. Muốn gấp giấy
              thông thường, hãy chọn <strong>Xoay 180°</strong>.
            </div>
          </div>
        )}

        {foldEnabled && !foldFits && (
          <div className="fold-note warn">
            <AlertTriangle size={16} />
            <div>
              <strong>Không đủ chỗ trên tờ giấy:</strong> bản in 2 mặt cần{' '}
              {Math.round(plateWmm)} × {Math.round(foldNeededHmm)} mm, trong khi vùng in được chỉ
              còn {Math.round(printableWmm)} × {Math.round(printableHmm)} mm. Hãy giảm lề trang,
              chọn hướng giấy ngang hoặc giảm kích thước mặt biển.
            </div>
          </div>
        )}
      </section>

      {/* Phần 5: Thiết lập trang in */}
      <section className="panel-section">
        <h3>5. Thiết lập In ấn & Xuất file</h3>
        <div className="grid-3">
          <div className="form-group">
            <label>Khổ giấy</label>
            <select
              value={config.paperSize}
              onChange={(e) =>
                updateField('paperSize', e.target.value as 'A4' | 'custom')
              }
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>

          <div className="form-group">
            <label>Hướng giấy</label>
            <select
              value={config.orientation}
              onChange={(e) =>
                updateField('orientation', e.target.value as 'portrait' | 'landscape')
              }
            >
              <option value="portrait">Dọc (Portrait)</option>
              <option value="landscape">Ngang (Landscape)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Lề trang in (mm)</label>
            <input
              type="number"
              min="0"
              max="50"
              value={config.pageMarginMm}
              onChange={(e) => updateField('pageMarginMm', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="print-two-sides"
            checked={config.printTwoSides && !foldEnabled}
            disabled={foldEnabled}
            onChange={(e) => updateField('printTwoSides', e.target.checked)}
          />
          <label htmlFor="print-two-sides">
            In 2 bản rời trên cùng 1 tờ (dùng cho biển mica kẹp 2 mặt)
          </label>
        </div>
        {foldEnabled && (
          <small className="hint">
            Đang bật gấp đôi ở mục 4 nên tùy chọn in 2 bản rời được thay thế bằng bản in
            gấp đôi (mặt sau đã lật sẵn).
          </small>
        )}

        <div className="print-instruction-box">
          <Info size={18} />
          <div>
            <strong>Lưu ý để bản in ra giấy đạt đúng {config.plateWidthCm} × {config.plateHeightCm} cm:</strong>
            <ul>
              <li>Chọn khổ giấy <strong>A4</strong>, tỷ lệ (Scale) đặt <strong>100% (Actual size)</strong>.</li>
              <li>Tắt tùy chọn <em>"Fit to page"</em> hoặc <em>"Fit to printable area"</em>.</li>
              {foldEnabled && (
                <li>
                  Tờ in có 2 mặt: gấp đôi theo đường kẻ đứt, mép gấp trùng đúng mép biển để
                  2 mặt khít nhau (không hở viền trắng).
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="action-buttons">
          <button type="button" className="btn-primary" onClick={onPrint}>
            <Printer size={18} />
            In biển tên
          </button>

          <button type="button" className="btn-secondary" onClick={onDownloadSvg}>
            <Download size={18} />
            Xuất file SVG
          </button>

          <button type="button" className="btn-outline" onClick={onReset}>
            <RotateCcw size={18} />
            Mặc định
          </button>
        </div>
      </section>
    </div>
  );
};
