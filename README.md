<div align="center">

# 🏷️ Biển Tên Để Bàn

**Ứng dụng web thiết kế, xem trước và in biển tên để bàn đúng kích thước vật lý thực tế**

*Biển tên mặc định 15 cm × 8,5 cm — thiết kế trên màn hình, in ra đúng chuẩn từng milimet*

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?style=flat&logo=nodedotjs&logoColor=white)

</div>

---

## 📖 Giới thiệu

**Biển Tên Để Bàn** là ứng dụng web giúp bạn tự thiết kế biển tên cho hội nghị, sự kiện, lễ tân hay bàn làm việc ngay trên trình duyệt — xem trước trực quan và in ra **đúng kích thước vật lý thật** (mặc định **15 cm × 8,5 cm**), không lo bị co giãn sai khổ khi in.

## ✨ Tính năng nổi bật

- 🎨 **Thiết kế trực quan** — chỉnh nội dung biển tên và xem trước ngay trên giao diện
- 📐 **In chuẩn kích thước thật** — bản in khớp đúng 15 cm × 8,5 cm trên giấy A4
- 🔁 **In gấp đôi 2 mặt (mirror)** — in 2 mặt trên cùng 1 tờ, mặt sau được lật sẵn để gấp đôi thành biển 2 mặt
- 🔤 **Hỗ trợ font UTM HelvetIns** — dùng font đã cài trên máy hoặc nhúng trực tiếp vào dự án
- ⚡ **Chạy ngay trên trình duyệt** — không cần cài đặt phức tạp, mở là dùng

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Giao diện | React |
| Ngôn ngữ | TypeScript |
| Công cụ build | Vite |
| Môi trường chạy | Node.js 18+ |

## 🚀 Cài đặt và chạy ứng dụng

**Yêu cầu:** máy tính đã cài đặt [Node.js](https://nodejs.org/) phiên bản **18 trở lên**.

Mở Terminal / Command Prompt tại thư mục dự án và chạy:

```bash
# 1. Cài đặt thư viện
npm install

# 2. Chạy ứng dụng ở chế độ phát triển
npm run dev
```

Sau đó mở trình duyệt tại địa chỉ hiển thị trên màn hình — thường là `http://localhost:5173`.

## 🔤 Cách thêm font UTM HelvetIns

**Cách 1 — Cài vào hệ điều hành:**
Cài đặt trực tiếp font `UTM HelvetIns` vào máy (Windows: thư mục Fonts · macOS: Font Book), sau đó tải lại trang.

**Cách 2 — Nhúng vào dự án:**
Chép file font `UTM-HelvetIns.ttf` (hoặc `UTM-HelvetIns.woff2`) vào thư mục `public/fonts/` của dự án rồi tải lại trang.

## 🖨️ Lưu ý khi in ấn chuẩn kích thước

> ⚠️ Bước này quyết định bản in có đúng 15 cm × 8,5 cm hay không — làm đúng cả 3 mục dưới đây:

- [x] Nhấn nút **In biển tên** trên giao diện
- [x] Chọn khổ giấy **A4**
- [x] Ở mục **Tỷ lệ (Scale)** của hộp thoại in: chọn **100% (Mặc định / Actual Size)** và **tắt** các tùy chọn *Fit to page / Fit to printable area*

## 🔁 In gấp đôi thành 2 mặt (mirror)

Mục **4. Hiệu ứng mirror – Gấp đôi thành 2 mặt** in 2 mặt biển trên cùng một tờ giấy, mặt sau được lật sẵn để sau khi gấp đôi, **cả hai mặt đều đọc xuôi**.

| Kiểu lật mặt sau | Dùng cho |
|---|---|
| **Xoay 180° – gấp giấy (chuẩn)** | Gấp đôi tờ giấy thông thường (mặc định) |
| **Lật gương ngang – mica trong** | In lên mica/giấy trong rồi nhìn xuyên từ mặt sau |
| **Tắt – chỉ in 1 mặt** | Biển 1 mặt, hoặc in 2 bản rời |

**Cách làm:**

1. Để **Khoảng hở giữa 2 mặt = 0 mm** → hai mặt sát nhau, gấp thành 1 tấm liền.
2. Bật **In đường gấp** để có nét đứt căn giữa hai mặt.
3. In với tỷ lệ **100%**, sau đó gấp đôi theo đúng đường kẻ đứt, **mặt in quay ra ngoài**.
4. Gấp ở mép trên (biển dựng đứng) hay mép dưới (cắm vào chân đế) đều cho kết quả đúng — tờ in đối xứng 180°.

> 💡 Bản xem trước có khối **“Bố cục tờ in gấp đôi”** để kiểm tra trước khi in; nút **Xuất file SVG** cũng xuất đủ 2 mặt (kèm đường gấp) khi bật chế độ này.

## 📁 Cấu trúc thư mục

```
├── public/
│   └── fonts/          # Nơi đặt file font nhúng (UTM-HelvetIns.ttf / .woff2)
├── src/                # Mã nguồn ứng dụng
└── README.md
```

## 📄 Giấy phép

Dự án phát hành theo giấy phép **MIT** — tự do sử dụng, chỉnh sửa và chia sẻ.

---

<div align="center">
<sub>Thiết kế & in biển tên để bàn — nhanh, chuẩn, đẹp 🏷️</sub>
</div>
