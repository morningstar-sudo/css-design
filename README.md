# S!mple — CSS Design Standard

Bộ chuẩn CSS dùng chung, tái sử dụng cho mọi dự án. Xây bằng **CSS thuần + biến (design tokens)** — không phụ thuộc Bootstrap, jQuery hay build tool. Phong cách lấy từ admin dashboard *S!mple*: phẳng, gọn, accent xanh `#0e9aee`, **tự động responsive**.

## Dùng nhanh

Chỉ cần link 1 file:

```html
<link rel="stylesheet" href="css/simple.css">
<!-- Nếu dùng bố cục dashboard (sidebar/header) thì thêm: -->
<script src="js/dashboard.js"></script>
```

Mở `index.html` để xem demo toàn bộ component.

## Cấu trúc

```
css/
├── tokens.css        # ⭐ TẤT CẢ biến: màu, spacing, font, radius, shadow, layout
├── reset.css         # reset/normalize
├── base.css          # typography nền
├── grid.css          # container + lưới 12 cột responsive + auto-grid
├── utilities.css     # class tiện ích + responsive (d-md-none, mt-3, ...)
├── components/       # buttons, forms, check-radio, card, table, alert,
│                     #   nav, modal, misc, dashboard
└── simple.css        # gom tất cả (@import)
js/dashboard.js       # JS vanilla: sidebar, submenu, dropdown, tabs, modal
index.html            # trang showcase
```

## Đổi thương hiệu (chỉ sửa 1 chỗ)

Mở `css/tokens.css`, đổi biến — toàn hệ thống đổi theo:

```css
:root {
  --color-primary: #0e9aee;   /* màu chủ đạo của bạn */
  --radius: 2px;              /* bo góc (tăng lên 8px nếu muốn bo mềm) */
  --font-sans: 'Roboto', system-ui, sans-serif;
}
```

## Dark mode

Bật thủ công:

```html
<html data-theme="dark">
```

Hoặc để tự theo hệ điều hành (đã cấu hình sẵn qua `prefers-color-scheme`). Xem nút đổi theme trong `index.html`.

## Responsive (tự động)

| Breakpoint | Ngưỡng | Hành vi |
|---|---|---|
| xs | < 576px | 1 cột, sidebar là drawer trượt |
| sm | ≥ 576px | `col-sm-*` |
| md | ≥ 768px | `col-md-*` |
| lg | ≥ 992px | `col-lg-*`, sidebar đầy đủ + thu gọn được |
| xl | ≥ 1200px | `col-xl-*` |

- **Grid**: `<div class="row"><div class="col-12 col-md-6 col-lg-3">...`
- **Auto-grid** (không cần đếm cột): `<div class="grid-auto">...`
- **Ẩn/hiện theo màn**: `d-none d-md-block`, `hide-below-lg`, `show-below-lg`
- **Sidebar**: ≥992px thu gọn bằng nút ☰; < 992px trượt ra như drawer + overlay.

## Component có sẵn

Buttons (6 màu + outline/ghost/size/group) · Forms (input, select, textarea, input-group, validation, form ngang) · Checkbox/Radio/Switch tuỳ biến · Card · Table · Alert · Badge · Breadcrumb · Pagination · Tabs · Dropdown · Navbar · Modal · Avatar · Progress · Spinner · Tooltip · List-group · Chip.

## Token chính

| Nhóm | Biến |
|---|---|
| Màu | `--color-primary/-secondary/-info/-success/-warning/-danger` |
| Nền/chữ | `--bg-body/-surface`, `--text-body/-heading/-muted` |
| Sidebar | `--bg-sidebar/-sidebar-sub/-logo`, `--text-sidebar*` |
| Spacing | `--space-1..8` (thang 4px) |
| Font | `--font-sans/-mono`, `--fs-xs..3xl`, `--fw-light..bold` |
| Bo/bóng | `--radius*`, `--shadow*` |
| Layout | `--sidebar-width`, `--header-height` |
| Motion/Z | `--transition*`, `--z-*` |

## Ghi chú

- Class đặt tên kiểu Bootstrap (`btn`, `form-control`, `row`, `col-sm-6`) để markup cũ chạy được luôn.
- Icon trong demo dùng ký tự tạm; dự án thật gắn icon font/SVG tuỳ ý (`<i class="...">` hoặc `<span class="icon">`).
- Font Roboto nạp qua Google Fonts; có fallback `system-ui` nếu offline.
