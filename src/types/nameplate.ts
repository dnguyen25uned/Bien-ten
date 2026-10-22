export interface NameplateConfig {
  // Nội dung 3 dòng
  rank: string;
  fullName: string;
  title: string;

  // Màu sắc
  bgColor: string;
  textColor: string;
  borderColor: string;

  // Kích thước mặt biển (cm)
  plateWidthCm: number;
  plateHeightCm: number;

  // Viền (mm)
  borderMarginMm: number;      // Khoảng cách từ mép biển vào tâm khung viền vàng (5mm = 0.5cm)
  borderThicknessMm: number;   // Độ dày nét viền vàng

  // Kích thước 7 dải dọc theo bản vẽ kỹ thuật (cm):
  // 1.0 + 1.0 + 1.5 + 1.5 + 1.5 + 1.0 + 1.0 = 8.5 cm
  topMarginCm: number;         // Dải 1: 1.0 cm (Từ mép trên đến đỉnh chữ Cấp bậc)
  rankBoxHeightCm: number;     // Dải 2: 1.0 cm (Chiều cao thân chữ Cấp bậc)
  gapRankToNameCm: number;     // Dải 3: 1.5 cm (Khoảng cách từ chân Cấp bậc đến đỉnh Tên)
  nameBoxHeightCm: number;     // Dải 4: 1.5 cm (Chiều cao thân chữ Tên)
  gapNameToTitleCm: number;    // Dải 5: 1.5 cm (Khoảng cách từ chân Tên đến đỉnh Chức danh)
  titleBoxHeightCm: number;    // Dải 6: 1.0 cm (Chiều cao thân chữ Chức danh)
  bottomMarginCm: number;      // Dải 7: 1.0 cm (Từ chân Chức danh đến mép dưới)

  // Tùy chọn hiển thị lưới gióng kích thước 7 dải để kiểm tra trực quan
  showDimensionGuides: boolean;

  // Tùy chọn hiển thị mô phỏng chân đế trên màn hình
  showStandPreview: boolean;
  standTopWidthCm: number;
  standBottomWidthCm: number;
  standHeightCm: number;
  standLipHeightCm: number;

  // Tùy chọn trang in
  paperSize: 'A4' | 'custom';
  customPaperWidthMm: number;
  customPaperHeightMm: number;
  orientation: 'landscape' | 'portrait';
  pageMarginMm: number;
  printCropMarks: boolean;
  printTwoSides: boolean;
}

export const DEFAULT_CONFIG: NameplateConfig = {
  rank: 'ĐẠI UÝ',
  fullName: 'NGUYỄN MẠNH HÙNG',
  title: 'ĐỘI TRƯỞNG TM-HC',

  bgColor: '#ff0000',
  textColor: '#ffff00',
  borderColor: '#ffff00',

  plateWidthCm: 15.0,
  plateHeightCm: 8.5,

  // Viền vàng nằm chính giữa dải 1cm ngoài cùng -> cách mép 5mm (0.5cm)
  borderMarginMm: 5.0,
  borderThicknessMm: 1.2,

  // Đúng 7 dải kích thước trên ảnh: 1 - 1 - 1.5 - 1.5 - 1.5 - 1 - 1 (Tổng = 8.5 cm)
  topMarginCm: 1.0,
  rankBoxHeightCm: 1.0,
  gapRankToNameCm: 1.5,
  nameBoxHeightCm: 1.5,
  gapNameToTitleCm: 1.5,
  titleBoxHeightCm: 1.0,
  bottomMarginCm: 1.0,

  showDimensionGuides: false,

  showStandPreview: true,
  standTopWidthCm: 16.0,
  standBottomWidthCm: 17.0,
  standHeightCm: 2.0,
  standLipHeightCm: 0.4,

  paperSize: 'A4',
  customPaperWidthMm: 210,
  customPaperHeightMm: 297,
  orientation: 'portrait',
  pageMarginMm: 15,
  printCropMarks: true,
  printTwoSides: false,
};
