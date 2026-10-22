/**
 * Kiểm tra xem font UTM HelvetIns đã được cài trên máy hoặc nạp qua @font-face chưa.
 */
export async function checkFontLoaded(fontName = 'UTM HelvetIns'): Promise<boolean> {
  if (typeof document === 'undefined') return false;

  try {
    await document.fonts.ready;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const testText = 'ĐẠITÁNGUYỄNVĂNVIỆN0123456789';
    ctx.font = '72px monospace';
    const monoWidth = ctx.measureText(testText).width;

    ctx.font = `72px "${fontName}", monospace`;
    const targetWidth = ctx.measureText(testText).width;

    return Math.abs(monoWidth - targetWidth) > 0.5;
  } catch {
    return false;
  }
}

/**
 * Đo tỷ lệ Cap-Height (chiều cao thực tế của chữ in hoa không dấu như N, H, E, V, T)
 * so với font-size của font hiện tại.
 * Trong SVG/CSS, font-size là chiều cao ô Em-square, trong khi thân chữ in hoa (Cap-Height)
 * thường chỉ chiếm khoảng 72% - 76% font-size. Đo chính xác tỷ lệ này giúp chữ "NGUYỄN MẠNH HÙNG"
 * có chiều cao thân chữ đạt đúng 1.5cm và "ĐẠI UÝ" / "ĐỘI TRƯỞNG TM-HC" đạt đúng 1.0cm theo đường gióng.
 */
export function getCapHeightRatio(fontFamily: string): number {
  if (typeof document === 'undefined') return 0.74;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0.74;

  const testSizePx = 200;
  ctx.font = `normal ${testSizePx}px ${fontFamily}`;
  const metrics = ctx.measureText('NHVTE');
  if (
    typeof metrics.actualBoundingBoxAscent === 'number' &&
    metrics.actualBoundingBoxAscent > 0
  ) {
    const ratio = metrics.actualBoundingBoxAscent / testSizePx;
    if (ratio > 0.5 && ratio < 0.95) {
      return ratio;
    }
  }
  return 0.74;
}

/**
 * Đo chiều rộng thực tế của một dòng văn bản (đơn vị: cm) ứng với fontSizeCm đã quy đổi.
 */
export function measureTextWidthCm(
  text: string,
  svgFontSizeCm: number,
  fontFamily: string
): number {
  if (typeof document === 'undefined' || !text) return 0;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;

  const pxScale = 100;
  const fontSizePx = svgFontSizeCm * pxScale;
  ctx.font = `normal ${fontSizePx}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  return metrics.width / pxScale;
}
