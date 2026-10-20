# HOAPA — Bó hoa 20/10 🌹

Web app tĩnh chúc mừng **Ngày Phụ nữ Việt Nam 20/10**: một bó hoa SVG nở dần, sinh động,
và một phong thư bấm vào sẽ mở ra lá thư chúc mừng.

## Có gì bên trong

- **Bó hoa động**: 19 bông (hồng nhiều lớp cánh, cúc trắng, baby) dựng bằng SVG sinh ra từ JS
  — thân hoa mọc lên theo `stroke-dashoffset`, hoa nở so le, lá bung ra, cả bó đung đưa nhẹ.
- **Giấy gói + nơ**: dựng bằng SVG, hiện lên theo thứ tự.
- **Khung cảnh**: nền gradient hồng-mận với các vầng sáng trôi, mưa cánh hoa, hạt bokeh vẽ trên `<canvas>`.
- **Phong thư 3D**: nắp lật bằng `rotateX`, tờ thư trượt lên, rồi mở ra lá thư chúc mừng
  với từng dòng hiện dần và tim/hoa bay lên.
- **Nhạc nền**: hộp nhạc tổng hợp bằng WebAudio (không cần file audio), bật/tắt ở nút góc phải.
- **Khả dụng**: điều hướng bàn phím, `Esc` để đóng, `aria-*` đầy đủ, tôn trọng `prefers-reduced-motion`.
- **Responsive**: bố cục luôn vừa một màn hình (`svh`) để phong thư không bao giờ bị khuất.

Không build step, không dependency runtime — chỉ HTML + CSS + 1 module JS.

## Cấu trúc

```
public/
  index.html    # khung trang, SVG giấy gói, overlay lá thư
  styles.css    # toàn bộ hoạt ảnh và bố cục
  main.js       # sinh hoa SVG, mưa cánh hoa, bokeh, phong thư, nhạc
wrangler.jsonc  # cấu hình deploy Cloudflare Workers (static assets)
```

## Chạy thử

```bash
cd public && python -m http.server 8731
# mở http://127.0.0.1:8731
```

## Deploy

```bash
npx wrangler deploy
```

## Chỉnh lời chúc

Sửa trực tiếp phần `.letter-body` trong `public/index.html`.
Đổi màu hoa / bố cục bó hoa: sửa `PALETTES` và `LAYOUT` ở đầu `public/main.js`.
