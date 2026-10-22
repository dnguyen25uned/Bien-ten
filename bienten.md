Hãy xây dựng một ứng dụng web hoàn chỉnh để tạo, xem trước và in biển tên để bàn. Đừng chỉ mô tả cách làm hoặc đưa ra mã giả: hãy viết mã nguồn chạy được, kèm hướng dẫn cài đặt và chạy ứng dụng.

## Mục tiêu
Người dùng nhập cấp bậc, tên và chức danh vào ba ô riêng biệt. Nội dung phải cập nhật tức thời trên bản xem trước biển tên. Người dùng có thể tùy chỉnh kích thước, kiểm tra bố cục và in thành phẩm đúng kích thước vật lý.

## Thiết kế biển tên
- Nền biển: màu đỏ.
- Viền: màu vàng.
- Chữ: màu vàng, dùng font UTM HelvetIns.
- Bố cục gồm đúng 3 dòng:
  1. Cấp bậc ở phía trên.
  2. Tên ở chính giữa, là dòng nổi bật nhất.
  3. Chức danh ở phía dưới.
- Căn giữa cả ba dòng theo chiều ngang; khoảng cách và kích thước chữ cần cân đối, tránh để chữ chạm viền hoặc bị cắt.
- Dùng ảnh tham chiếu người dùng cung cấp để định hướng kiểu dáng: biển hình chữ nhật đặt trên chân đế, phong cách trang trọng, rõ ràng, phù hợp với mẫu biển tên bàn làm việc.
- Màu đỏ và vàng nên có thể chỉnh bằng bộ chọn màu, nhưng giá trị mặc định phải đúng yêu cầu trên.

## Kích thước và in ấn
Dựa trên các số đo nhìn thấy trong ảnh tham chiếu:
- Mặt biển: rộng 15 cm, cao 8,5 cm.
- Chân đế: rộng khoảng 17 cm.
- Các số đo khác của chân đế hoặc phần nghiêng trong ảnh chưa đủ rõ để khẳng định. Không tự nhận đây là thông số chính thức; hãy cho phép người dùng chỉnh các kích thước đó.
- Tạo chế độ in riêng, loại bỏ thanh công cụ và các thành phần giao diện không cần in.
- Khi in, mặt biển phải giữ đúng kích thước vật lý đã chọn; không để trình duyệt tự co giãn làm sai kích thước.
- Có hướng dẫn ngắn trong giao diện: chọn khổ giấy phù hợp, đặt tỷ lệ in 100% / Actual size và tắt “Fit to page” nếu tùy chọn này xuất hiện.
- Cho phép chọn khổ giấy A4 hoặc tùy chỉnh, hướng giấy dọc/ngang và lề in.
- Có nút “In biển tên” gọi hộp thoại in của trình duyệt.
- Nếu phù hợp, thêm nút xuất bản thiết kế ra PDF hoặc SVG mà vẫn giữ kích thước thực. Nếu không thể bảo đảm chính xác trong môi trường hiện tại, ưu tiên chức năng in chuẩn và nêu rõ giới hạn.

## Giao diện
- Giao diện bằng tiếng Việt, dễ sử dụng, bố cục rõ ràng.
- Có ba ô nhập liệu với nhãn “Cấp bậc”, “Tên”, “Chức danh”; nội dung mẫu ban đầu có thể xóa hoặc sửa.
- Có khu vực xem trước thành phẩm cạnh khu vực nhập liệu trên màn hình rộng; tự chuyển thành bố cục dọc trên màn hình nhỏ.
- Bản xem trước phải phản ánh ngay mọi thay đổi của nội dung, màu sắc và kích thước.
- Thêm các điều khiển phù hợp cho kích thước chữ từng dòng, độ dày viền và kích thước mặt biển.
- Có nút khôi phục thiết lập mặc định.
- Xử lý văn bản tiếng Việt có dấu chính xác; cho phép xuống dòng nếu người dùng chủ động nhập xuống dòng, nhưng mặc định mỗi nội dung nằm trên một dòng.
- Nếu nội dung quá dài, tự giảm cỡ chữ đến giới hạn hợp lý để không tràn khỏi biển; không được cắt mất chữ mà không báo hiệu.

## Font chữ
- Ưu tiên font “UTM HelvetIns”.
- Không giả định font này luôn có sẵn trên mọi thiết bị. Hãy cung cấp hướng dẫn rõ ràng để người dùng thêm file font hợp pháp vào dự án (ví dụ thư mục `public/fonts`) và khai báo bằng `@font-face`.
- Nếu font chưa tải được, dùng font sans-serif thay thế phù hợp; giao diện nên thông báo rằng bản in có thể khác thiết kế khi thiếu font.
- Không tự nhúng hoặc phân phối file font có bản quyền nếu người dùng chưa cung cấp file.

## Kỹ thuật
- Chọn một stack phổ biến, tối giản và dễ chạy, ưu tiên React + TypeScript + Vite.
- Dùng HTML/CSS/SVG hoặc giải pháp khác miễn là bản xem trước sắc nét và kích thước in chính xác.
- Tách cấu trúc giao diện, logic tính kích thước và kiểu in thành các phần dễ bảo trì.
- Kiểm tra các trường hợp: nội dung tiếng Việt có dấu, tên dài, ô trống, màn hình nhỏ, font không khả dụng và in trên A4.
- Không dùng dịch vụ bên ngoài hoặc gửi nội dung người dùng ra máy chủ; ứng dụng nên hoạt động cục bộ trên trình duyệt.
- Không tuyên bố mẫu thiết kế tuân thủ một tiêu chuẩn quân đội chính thức nếu chưa có tài liệu tiêu chuẩn cụ thể. Hãy ghi rõ kích thước ban đầu được dựng theo ảnh tham chiếu và có thể chỉnh sửa.

## Kết quả cần trả về
1. Cấu trúc thư mục dự án.
2. Toàn bộ mã nguồn cần thiết, ghi rõ tên từng tệp.
3. Hướng dẫn cài đặt, chạy ứng dụng và thêm font UTM HelvetIns.
4. Giải thích ngắn cách kiểm tra kích thước in thực tế.
5. Nếu có chi tiết kích thước trong ảnh không đọc rõ, hãy xử lý bằng tùy chọn có thể chỉnh sửa thay vì tự đoán.
