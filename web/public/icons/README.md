# selfOS brand icons — chibi penguin (v2)

**v2 design — thiết kế riêng cho selfOS, không trùng với mascot/mẫu thương mại nào:**

- Palette brand: indigo `#6366F1` + cyan `#06B6D4` (khớp CSS vars của web)
- Chóp lông (tuft) đặc trưng trên đầu
- Khăn choàng cyan có hoạ tiết chấm dot-matrix (motif dev)
- Platform disc indigo (không dùng tím để tránh trùng)
- Mắt bầu dục lớn với iris gradient xanh, 2 điểm highlight
- Má hồng chibi, mỏ cam gradient 2 tone
- Tia nước cyan + bong bóng ở hai bên chân


Tất cả icon đều là SVG vector, có thể resize vô hạn mà không mất độ nét.

| File | Mục đích | Nền | viewBox |
|---|---|---|---|
| `penguin-mark.svg` | Logo inline (navbar, header, email) | transparent | 512×512 |
| `penguin-app.svg` | App icon (PWA, iOS/Android launcher, OpenGraph fallback) | gradient indigo→cyan, bo tròn 22% | 512×512 |
| `favicon.svg` | Favicon trình duyệt (16/32 px) | indigo rounded square | 32×32 |

## Dùng trong website

Đã wire sẵn trong `src/app/layout.tsx` (metadata.icons) và `src/components/layout/navbar.tsx` (logo).

## Xuất PNG cho mobile app

### Flutter
Đặt `penguin-app.svg` vào `assets/branding/` và dùng
[flutter_launcher_icons](https://pub.dev/packages/flutter_launcher_icons):

1. Convert SVG → PNG 1024×1024 bằng [Figma / Inkscape / rsvg-convert]:
   ```bash
   # macOS (cài qua: brew install librsvg)
   rsvg-convert -w 1024 -h 1024 web/public/icons/penguin-app.svg -o ios_icon_1024.png
   ```
2. Trong `pubspec.yaml`:
   ```yaml
   flutter_launcher_icons:
     android: "launcher_icon"
     ios: true
     image_path: "assets/branding/ios_icon_1024.png"
     min_sdk_android: 21
     web:
       generate: true
       image_path: "assets/branding/ios_icon_1024.png"
   ```
3. Chạy `flutter pub run flutter_launcher_icons`.

### React Native (Expo)
Đặt PNG 1024×1024 ở `assets/icon.png` → Expo tự generate cho iOS & Android.

### Kích thước khuyến nghị (tạo từ `penguin-app.svg`)
| Platform | Size (px) | Purpose |
|---|---|---|
| iOS | 1024×1024 | App Store |
| iOS | 180×180 | iPhone @3x home screen |
| Android | 512×512 | Play Store |
| Android | 192×192 | adaptive icon foreground |
| Web PWA | 512×512 + 192×192 | manifest icons |
| Favicon | 32×32 | from `favicon.svg` (ưu tiên SVG, PNG fallback nếu cần) |

### Convert nhanh toàn bộ (macOS, cần `librsvg`)
```bash
brew install librsvg
cd web/public/icons
for s in 192 512 1024; do
  rsvg-convert -w $s -h $s penguin-app.svg -o penguin-app-${s}.png
done
rsvg-convert -w 32 -h 32 favicon.svg -o favicon-32.png
rsvg-convert -w 16 -h 16 favicon.svg -o favicon-16.png
```

## Palette tham chiếu

| Màu | Hex | Dùng cho |
|---|---|---|
| Primary indigo | `#6366F1` → `#4F46E5` | gradient nền |
| Accent cyan | `#06B6D4` | gradient nền + accent CSS |
| Body dark | `#1F2937` → `#0B1120` | thân/đầu chim cánh cụt |
| Belly | `#FFFFFF` → `#E5E7EB` | bụng trắng |
| Beak/feet | `#F59E0B` + outline `#B45309` | mỏ, chân |
| Blush | `#F9A8D4` @ 70% | má hồng chibi |

Nếu muốn đổi màu brand sau này, chỉ cần sửa gradient `#appBg` trong `penguin-app.svg`.
