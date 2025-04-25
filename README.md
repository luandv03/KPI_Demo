## Install packages

> npm install

## Run server

> npm run dev

## Trang hiển thị lịch sau phân bổ: http://localhost:5173/

-   Chú ý: Để hiển thị được lịch sau khi phân bổ thì ta cần để đúng đường dẫn đến file schedule.json (file đầu ra của thuật toán) ở thư mục tour chạy thuật toán
-   Tham khảo cấu trúc của file: data/schedule.json
-   Thư mục component: App.jsx
    ![alt text](image-1.png)

-   Bên dưới là ảnh giao diện, phần lịch ta có thể kéo chuột để co giãn chiều rộng của lịch
-   Giao diện được hiển thị tại route: /
    ![alt text](image.png)

## Trang hiển thị lịch của nhân viên: http://localhost:5173/schedule

-   Chú ý: file monthly_schedule2.json là lịch cho các bộ data lớn (không phải lịch của bộ data 2 lệnh sản xuất - do cách đặt tên trên máy tác giả Luận Đinh)
-   File schedule.json tương tự như trên
-   Tham khảo cấu trúc của file: data/monthly_schedule.json
-   Thư mục component: Schedule.jsx

![alt text](image-2.png)

-   Lịch này gồm 3 trạng thái:
    -   Khả dụng: ✔
    -   Không làm việc:✘
    -   Được xếp lịch cho công đoạn: ví dụ: OP002

![alt text](image-3.png)

## Trang hiển thị KPI của các công doạn: http://localhost:5173/kpi

-   Chú ý: về đường dẫn file thì tương tự 2 trang trên
-   Thư mục component: KPI.jsx

## Các vấn đề tồn đọng:

### 1. Còn xảy ra các trường hợp: có công đoạn phải chờ rất lâu mới được phân công nhân viên, mặc dù thời gian trống đó nhân viên đang rảnh rỗi

-   Ví dụ:
-   Công đoạn OP003 - may ráp từng phần
-   Vấn đề: Công đoạn OP002 đã kết thúc vào ca 4 ngày 2025/04/01
-   Tuy nhiên đến ca 3 ngày 2025/04/11 công đoạn OP003 mới được bắt đầu
-   Công đoạn OP003: yêu cầu Nhân viên may ráp
-   Nhân viên: W0201 - W0220

![alt text](image-4.png)

-   Nhìn vào hình dưới ta có thể thấy các nhân viên may ráp trên có rất nhiều thời gian rảnh, tuy nhiên lại không được xếp vào thực hiện công đoạn OP002
    ![alt text](image-5.png)

### 2. Hiện tại KPI đạt được vượt quá xa so với KPI ngưỡng

-   ví dụ như phần khoanh đỏ trong ảnh

![alt text](image-6.png)

### 3. Chưa xét đến trường hợp nhân viên i có khả dụng ca j không

-   Đã fix trong code
    ![alt text](image-7.png)

## Note: Nhớ thêm đoạn sau để ra lịch

![alt text](image-8.png)
