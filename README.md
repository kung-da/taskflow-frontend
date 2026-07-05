# TaskFlow Frontend

Frontend cho ứng dụng Todo List, xây dựng bằng React, Vite và TailwindCSS.

## Chức Năng

- Hiển thị danh sách công việc
- Thêm công việc mới
- Chỉnh sửa công việc
- Xóa công việc với hộp thoại xác nhận
- Đánh dấu hoàn thành/chưa hoàn thành
- Tìm kiếm công việc theo tiêu đề
- Lọc theo trạng thái `All`, `Active`, `Completed`
- Hiển thị trạng thái loading, empty, no-results, error
- Responsive trên desktop và mobile

## Công Nghệ

- React 18
- Vite
- TailwindCSS
- Vitest
- React Testing Library
- Docker + Nginx

## Yêu Cầu Trước Khi Chạy

Frontend cần backend API đang chạy.

Mặc định frontend gọi API tại:

```text
http://localhost:4000/api
```

Nếu chạy backend bằng Docker, vào repo backend và chạy:

```bash
docker compose -f docker-compose.backend.yml up --build
```

Kiểm tra backend:

```text
http://localhost:4000/health
```

## Chạy Bằng Docker

Yêu cầu: đã cài Docker Desktop.

Từ thư mục frontend:

```bash
docker compose -f docker-compose.frontend.yml up --build
```

Mở ứng dụng:

```text
http://localhost:5173
```

Dừng container:

```bash
docker compose -f docker-compose.frontend.yml down
```

Lưu ý: `VITE_API_BASE_URL` được build vào image. Nếu backend không chạy ở `http://localhost:4000/api`, sửa file `docker-compose.frontend.yml`:

```yaml
args:
  VITE_API_BASE_URL: https://your-backend-url/api
```

Sau đó build lại:

```bash
docker compose -f docker-compose.frontend.yml up --build
```

## Chạy Không Dùng Docker

Tạo file `.env` từ `.env.example`:

```bash
copy .env.example .env
```

Cài dependencies và chạy dev server:

```bash
npm install
npm run dev
```

Mở ứng dụng:

```text
http://localhost:5173
```

## Biến Môi Trường

File `.env` khi chạy local:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Khi deploy frontend, đổi biến này thành URL backend đã deploy:

```env
VITE_API_BASE_URL=https://your-railway-service.up.railway.app/api
```

## Scripts

| Command | Mô tả |
|---|---|
| `npm run dev` | Chạy Vite dev server |
| `npm run build` | Build production |
| `npm run preview` | Xem thử bản production build |
| `npm test` | Chạy test frontend |
| `npm run test:watch` | Chạy test watch mode |
| `npm run lint` | Kiểm tra ESLint |
| `npm run format` | Format code |

## API Frontend Đang Dùng

| Method | Endpoint | Mục đích |
|---|---|---|
| `GET` | `/api/todos?search=&status=&page=&limit=` | Lấy danh sách, tìm kiếm, lọc |
| `POST` | `/api/todos` | Thêm công việc |
| `PUT` | `/api/todos/:id` | Chỉnh sửa công việc |
| `PATCH` | `/api/todos/:id/toggle` | Đổi trạng thái hoàn thành |
| `DELETE` | `/api/todos/:id` | Xóa công việc |

Response danh sách mong đợi:

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

Response lỗi mong đợi:

```json
{
  "error": {
    "message": "Title cannot be empty",
    "code": "VALIDATION_ERROR",
    "field": "title"
  }
}
```

## Test

```bash
npm test
```

Kết quả đã kiểm tra:

```text
6 tests passed
```

## Build

```bash
npm run build
```

Thư mục output:

```text
dist/
```

## Deploy Vercel

1. Push thư mục frontend thành một GitHub repo riêng.
2. Tạo project mới trên Vercel từ repo đó.
3. Set biến môi trường:

```env
VITE_API_BASE_URL=https://your-railway-service.up.railway.app/api
```

4. Deploy frontend.
5. Sau khi có domain Vercel, quay lại Railway backend và set:

```env
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

6. Redeploy backend trên Railway.

## Cấu Trúc Thư Mục

```text
src/
  api/                 Gọi HTTP API tới backend
  components/          Component giao diện
  context/             TodoProvider và state dùng chung
  hooks/               useTodos, useDebounce
  utils/               Validate dữ liệu frontend
  App.jsx              Layout chính
  main.jsx             Entry point React
tests/
  TodoItem.test.jsx    Test component TodoItem
```

## Checklist Yêu Cầu

- [x] Hiển thị danh sách công việc
- [x] Thêm công việc mới
- [x] Chỉnh sửa công việc
- [x] Xóa công việc
- [x] Đánh dấu hoàn thành/chưa hoàn thành
- [x] Tìm kiếm hoặc lọc theo trạng thái
- [x] Có README hướng dẫn cách chạy dự án
- [x] Có hướng dẫn chạy bằng Docker
