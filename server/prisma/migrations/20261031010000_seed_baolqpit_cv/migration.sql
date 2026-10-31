-- Seed data based on CV of Lê Phạm Quốc Bảo for user id cmvwldzcv0000gclcnumbvg32
-- Idempotent: ON CONFLICT DO NOTHING on all inserts.

-- ────────────────────────────────────────────────────────────────────────────
-- Profile
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO "Profile" (
  "userId", "fullName", "address", "email", "phone", "occupation", "bio",
  "socialLinks", "updatedAt"
) VALUES (
  'cmvwldzcv0000gclcnumbvg32',
  'Lê Phạm Quốc Bảo',
  'TP. Hồ Chí Minh, Việt Nam',
  'baolqp.it@gmail.com',
  '+84 829 250 703',
  'Mobile Developer',
  'Mobile Developer với hơn 3 năm kinh nghiệm phát triển ứng dụng Flutter phức tạp (Booking, E-commerce, Fintech, Secure Chat). Nắm vững BLoC / Clean Architecture, có nền backend vững (NestJS, Python). Kinh nghiệm thực tế với E2EE, pentest MobSF, tối ưu render list lớn và phát hành Google Play & App Store.',
  '{"github":"https://github.com/baolqpit","linkedin":"https://linkedin.com/in/baolqpit"}'::jsonb,
  NOW()
) ON CONFLICT ("userId") DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- Settings
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO "Settings" (
  "userId", "theme", "accentColor", "layout", "modulesVisibility", "seo", "updatedAt"
) VALUES (
  'cmvwldzcv0000gclcnumbvg32',
  'system',
  '#6366F1',
  'grid',
  '{
    "profile": {
      "visible": true,
      "fields": {
        "fullName": true,
        "email": true,
        "phone": true,
        "address": true,
        "dateOfBirth": false,
        "occupation": true,
        "bio": true,
        "avatarUrl": true,
        "coverUrl": true,
        "socialLinks": true
      }
    },
    "projects":  { "visible": true, "showRevenue": false, "showClient": true },
    "daily":     { "visible": true },
    "knowledge": { "visible": true, "showCertificates": true }
  }'::jsonb,
  '{
    "title": "Lê Phạm Quốc Bảo — Mobile Developer",
    "description": "Portfolio: dự án Flutter, kiến thức mobile/backend, nhật ký học hỏi."
  }'::jsonb,
  NOW()
) ON CONFLICT ("userId") DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- Projects
-- ────────────────────────────────────────────────────────────────────────────

-- 1. NEX NOW
INSERT INTO "Project" (
  "id", "userId", "slug", "name", "summary", "content", "contentHtml",
  "startDate", "endDate", "teamSize", "technologies", "results",
  "client", "role", "isPublished", "publishedAt", "createdAt", "updatedAt"
) VALUES (
  'seedcv_proj_nexnow',
  'cmvwldzcv0000gclcnumbvg32',
  'nex-now',
  'NEX NOW — Booking phòng, spa & giao đồ ăn',
  'Ứng dụng đặt phòng, dịch vụ spa và giao đồ ăn đa mô hình. Tự động hoá luồng book xe qua GRAB API, tính giá đa tầng tích hợp cổng Payoo.',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Vai trò"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Middle Mobile Developer tại LOT Software — xây dựng ứng dụng khách hàng đa dịch vụ (booking phòng, spa, F&B)."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Điểm nổi bật"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Tự động hoá luồng book xe và giao vận nhanh qua GRAB API; thiết lập công thức tính giá đơn hàng đa tầng (thuế, phí phục vụ, chiết khấu động) tích hợp cổng Payoo."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Tích hợp Google ML Kit để nhận diện và trích xuất OCR giấy tờ tuỳ thân; cấu hình Amplitude tracking các điểm drop-off trong luồng thanh toán."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Tái cấu trúc luồng render bằng RepaintBoundary và selective BLoC rebuilds, loại bỏ giật khung khi cuộn danh sách dữ liệu lớn."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Chịu trách nhiệm toàn bộ chu kỳ phát hành: build versions, staging, phased rollout trên Google Play & App Store."}]}]}
      ]}
    ]
  }'::jsonb,
  '<h2>Vai trò</h2><p>Middle Mobile Developer tại LOT Software — xây dựng ứng dụng khách hàng đa dịch vụ.</p><h2>Điểm nổi bật</h2><ul><li>Tự động hoá luồng book xe qua GRAB API; tính giá đa tầng tích hợp Payoo.</li><li>Google ML Kit OCR giấy tờ; Amplitude tracking drop-off.</li><li>Tối ưu render với RepaintBoundary và selective BLoC rebuilds.</li><li>Điều phối phased rollout Google Play & App Store.</li></ul>',
  '2025-07-01',
  '2026-06-30',
  8,
  ARRAY['Flutter','Dart','BLoC','Clean Architecture','GRAB API','Payoo','Google ML Kit','Amplitude'],
  'Giảm hiện tượng giật khung ~90% khi cuộn danh sách dài; onboarding OCR tự động giảm 60% thao tác tay.',
  'LOT Software',
  'Middle Mobile Developer',
  true, NOW(), NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- 2. Nextalk
INSERT INTO "Project" (
  "id", "userId", "slug", "name", "summary", "content", "contentHtml",
  "startDate", "endDate", "teamSize", "technologies", "results",
  "client", "role", "isPublished", "publishedAt", "createdAt", "updatedAt"
) VALUES (
  'seedcv_proj_nextalk',
  'cmvwldzcv0000gclcnumbvg32',
  'nextalk',
  'Nextalk — Nhắn tin E2EE & hệ sinh thái nội bộ',
  'Nền tảng nhắn tin bảo mật chuẩn mã hoá đầu cuối (E2EE), tích hợp gọi thoại/video độ trễ thấp qua LiveKit và module email in-app realtime.',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Bối cảnh"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Nền tảng nhắn tin nội bộ với yêu cầu bảo mật cao: mã hoá đầu cuối, xác thực sinh trắc học, pentest tự động."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Điểm nổi bật"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Thiết kế cơ chế mã hoá E2EE: sinh cụm 12 từ khôi phục, Master Key lưu trong iOS Keychain / Android Keystore kết hợp Face ID / Vân tay."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Tích hợp MobSF (SAST & DAST) vào CI; khắc phục triệt để lỗi rò rỉ bộ nhớ đệm và dữ liệu nhạy cảm giữa các phiên đăng nhập."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Xây dựng gọi thoại/video 1:1 và phòng nhóm qua LiveKit (WebRTC SFU); module email in-app realtime qua WebSockets."}]}]}
      ]}
    ]
  }'::jsonb,
  '<h2>Bối cảnh</h2><p>Nền tảng nhắn tin nội bộ với yêu cầu bảo mật cao.</p><h2>Điểm nổi bật</h2><ul><li>E2EE: 12-word recovery, Master Key trong Keychain/Keystore + Face ID.</li><li>MobSF SAST/DAST trong CI, zero data leak giữa các session.</li><li>LiveKit 1:1 và group call, email in-app realtime qua WebSocket.</li></ul>',
  '2025-07-01',
  '2026-06-30',
  6,
  ARRAY['Flutter','Dart','E2EE','LiveKit','WebRTC','WebSocket','MobSF','Keychain','Keystore','Biometric'],
  'Pass pentest MobSF định kỳ; call quality duy trì < 150ms RTT nội mạng.',
  'LOT Software',
  'Middle Mobile Developer',
  true, NOW(), NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- 3. Nex Dashboard & Nex EInvoice
INSERT INTO "Project" (
  "id", "userId", "slug", "name", "summary", "content", "contentHtml",
  "startDate", "endDate", "teamSize", "technologies", "results",
  "client", "role", "isPublished", "publishedAt", "createdAt", "updatedAt"
) VALUES (
  'seedcv_proj_nex_pos',
  'cmvwldzcv0000gclcnumbvg32',
  'nex-dashboard-einvoice',
  'Nex Dashboard & Nex EInvoice — Hệ thống POS',
  'POS quản lý điểm bán và kê khai thuế doanh nghiệp. Điều khiển thiết bị ngoại vi POS (máy in nhiệt XPrinter, barcode scanner) và tối ưu danh sách hàng nghìn hoá đơn.',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Mục tiêu"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Giúp cửa hàng/chuỗi bán lẻ xuất hoá đơn, in nhanh và kê khai thuế trực tiếp từ máy POS cấu hình thấp."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Điểm nổi bật"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Kết nối và điều khiển trực tiếp thiết bị POS: in hoá đơn nhiệt qua XPrinter, xử lý barcode/QR tốc độ cao."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Ảo hoá và lazy-loading cho hàng nghìn hoá đơn, phản hồi dưới 100ms trên máy POS cấu hình hạn chế."}]}]}
      ]}
    ]
  }'::jsonb,
  '<h2>Mục tiêu</h2><p>POS cho cửa hàng bán lẻ, xuất hoá đơn & kê khai thuế.</p><ul><li>In nhiệt XPrinter + scan barcode/QR tốc độ cao.</li><li>Virtualization danh sách hàng nghìn hoá đơn, &lt;100ms response.</li></ul>',
  '2025-07-01',
  '2026-06-30',
  5,
  ARRAY['Flutter','Dart','BLoC','XPrinter','Barcode Scanner','Virtualization','POS'],
  'Thời gian render list hoá đơn giảm từ ~800ms xuống <100ms trên máy POS 2GB RAM.',
  'LOT Software',
  'Middle Mobile Developer',
  true, NOW(), NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- 4. PetPet
INSERT INTO "Project" (
  "id", "userId", "slug", "name", "summary", "content", "contentHtml",
  "startDate", "endDate", "teamSize", "technologies", "results",
  "client", "role", "isPublished", "publishedAt", "createdAt", "updatedAt",
  "links"
) VALUES (
  'seedcv_proj_petpet',
  'cmvwldzcv0000gclcnumbvg32',
  'petpet',
  'PetPet — E-commerce phụ kiện & dịch vụ thú cưng',
  'Ứng dụng thương mại điện tử phụ kiện & dịch vụ thú cưng, đã publish Google Play. Tự xây cơ chế load-more phân trang không phụ thuộc package.',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Mô tả"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Dự án freelance. Người dùng mua phụ kiện, đặt dịch vụ (grooming, khám bệnh) cho thú cưng."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Điểm nổi bật"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Xây dựng toàn bộ luồng mua sắm: giỏ hàng, lọc đa tiêu chí, thanh toán VNPAY."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Tự thiết kế load-more phân trang dựa trên ScrollController, không phụ thuộc package ngoài."}]}]}
      ]}
    ]
  }'::jsonb,
  '<h2>Mô tả</h2><p>Freelance e-commerce cho thú cưng.</p><ul><li>Luồng mua sắm + VNPAY.</li><li>Custom load-more với ScrollController.</li></ul>',
  '2024-06-01',
  '2024-12-31',
  1,
  ARRAY['Flutter','Dart','VNPAY','ScrollController'],
  'Đã publish Google Play, chạy ổn định trên các thiết bị Android 7+.',
  'Khách hàng freelance',
  'Mobile Developer (solo)',
  true, NOW(), NOW(), NOW(),
  '[{"label":"Google Play","url":"https://play.google.com/store"}]'::jsonb
) ON CONFLICT ("id") DO NOTHING;

-- 5. CYSGOV-Platform
INSERT INTO "Project" (
  "id", "userId", "slug", "name", "summary", "content", "contentHtml",
  "startDate", "endDate", "teamSize", "technologies", "results",
  "client", "role", "isPublished", "publishedAt", "createdAt", "updatedAt"
) VALUES (
  'seedcv_proj_cysgov',
  'cmvwldzcv0000gclcnumbvg32',
  'cysgov-platform',
  'CYSGOV-Platform — Điều phối & cảnh báo an toàn thông tin',
  'Nền tảng điều phối và cảnh báo an toàn thông tin khu công nghệ cao. Dashboard trực quan hoá sự cố bảo mật theo cấp độ rủi ro.',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Bối cảnh"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Hệ thống quan sát sự cố ATTT phục vụ khu công nghệ cao — ưu tiên response time thấp và phân quyền chặt."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Điểm nổi bật"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Dashboard trực quan hoá dữ liệu sự cố theo cấp độ rủi ro bằng FLChart."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Phân quyền vai trò (RBAC) và đẩy thông báo khẩn cấp qua FCM."}]}]}
      ]}
    ]
  }'::jsonb,
  '<h2>Bối cảnh</h2><p>Observability sự cố ATTT khu công nghệ cao.</p><ul><li>Dashboard FLChart theo risk level.</li><li>RBAC + FCM alerts.</li></ul>',
  '2024-09-01',
  '2025-05-31',
  3,
  ARRAY['Flutter','Dart','FLChart','FCM','RBAC','Security'],
  'Thời gian phát hiện và escalate sự cố giảm ~40%.',
  'Khu công nghệ cao',
  'Mobile Developer',
  true, NOW(), NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- 6. The ENEST Management
INSERT INTO "Project" (
  "id", "userId", "slug", "name", "summary", "content", "contentHtml",
  "startDate", "endDate", "teamSize", "technologies", "results",
  "client", "role", "isPublished", "publishedAt", "createdAt", "updatedAt"
) VALUES (
  'seedcv_proj_enest',
  'cmvwldzcv0000gclcnumbvg32',
  'enest-management',
  'The ENEST Management — Quản lý trung tâm Anh ngữ',
  'Hệ thống quản lý đào tạo & thời khoá biểu trung tâm Anh ngữ. Lịch học động và gọi thoại hỗ trợ trực tuyến.',
  '{
    "type": "doc",
    "content": [
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Mô tả"}]},
      {"type":"paragraph","content":[{"type":"text","text":"Dự án đầu tiên trong vai trò Intern/Fresher — tập trung vào UI lịch học, performance và giao tiếp realtime."}]},
      {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Điểm nổi bật"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Xây dựng module lịch học động với SfCalendar; tối ưu số lần rebuild widget khi chuyển tuần học."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Tính năng gọi thoại hỗ trợ trực tuyến qua Stringee SDK."}]}]}
      ]}
    ]
  }'::jsonb,
  '<h2>Mô tả</h2><p>Dự án Intern tại Kthub Technologies — quản lý đào tạo & lịch học.</p><ul><li>SfCalendar với tối ưu rebuild.</li><li>Stringee SDK voice support.</li></ul>',
  '2023-06-01',
  '2024-06-30',
  4,
  ARRAY['Flutter','Dart','SfCalendar','Stringee SDK'],
  'Giảm 50% số lần rebuild widget khi điều hướng tuần/tháng.',
  'Kthub Technologies Co., Ltd',
  'Fresher / Intern Mobile Developer',
  true, NOW(), NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- Knowledge: học vấn & chứng chỉ + nhóm kỹ năng
-- ────────────────────────────────────────────────────────────────────────────

-- 1. UIT — Hệ thống Thông tin
INSERT INTO "Knowledge" (
  "id", "userId", "slug", "title", "content", "contentHtml",
  "method", "source", "startedAt", "completedAt", "tags",
  "isPublished", "createdAt", "updatedAt"
) VALUES (
  'seedcv_knowledge_uit',
  'cmvwldzcv0000gclcnumbvg32',
  'uit-he-thong-thong-tin',
  'Cử nhân Hệ thống Thông tin — Đại học Công nghệ Thông tin (UIT, ĐHQG-HCM)',
  '{
    "type":"doc",
    "content":[
      {"type":"paragraph","content":[{"type":"text","text":"Chương trình Cử nhân Hệ thống Thông tin 2021 – 2025 tại UIT. Nền tảng về cấu trúc dữ liệu, giải thuật, cơ sở dữ liệu, phân tích thiết kế hệ thống, bảo mật ứng dụng."}]}
    ]
  }'::jsonb,
  '<p>Cử nhân Hệ thống Thông tin 2021 – 2025 tại UIT.</p>',
  'Học chính quy + làm dự án môn học + thực tập doanh nghiệp.',
  'Trường Đại học Công nghệ Thông tin (UIT - ĐHQG-HCM)',
  '2021-09-01',
  '2025-07-31',
  ARRAY['education','university','information-systems'],
  true, NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- 2. TOEIC Speaking & Writing
INSERT INTO "Knowledge" (
  "id", "userId", "slug", "title", "content", "contentHtml",
  "method", "source", "startedAt", "completedAt", "tags",
  "isPublished", "createdAt", "updatedAt"
) VALUES (
  'seedcv_knowledge_toeic_sw',
  'cmvwldzcv0000gclcnumbvg32',
  'toeic-speaking-writing-270',
  'TOEIC Speaking & Writing — 270 (2025)',
  '{
    "type":"doc",
    "content":[
      {"type":"paragraph","content":[{"type":"text","text":"Chứng chỉ TOEIC Speaking & Writing năm 2025 với tổng điểm 270."}]}
    ]
  }'::jsonb,
  '<p>Chứng chỉ TOEIC Speaking &amp; Writing 270 (2025).</p>',
  'Luyện phần Speaking qua shadowing + Writing qua mẫu template.',
  'ETS TOEIC',
  '2025-01-01',
  '2025-06-30',
  ARRAY['english','toeic','certificate'],
  true, NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- 3. TOEIC Listening & Reading
INSERT INTO "Knowledge" (
  "id", "userId", "slug", "title", "content", "contentHtml",
  "method", "source", "startedAt", "completedAt", "tags",
  "isPublished", "createdAt", "updatedAt"
) VALUES (
  'seedcv_knowledge_toeic_lr',
  'cmvwldzcv0000gclcnumbvg32',
  'toeic-listening-reading-690',
  'TOEIC Listening & Reading — 690 (2022)',
  '{
    "type":"doc",
    "content":[
      {"type":"paragraph","content":[{"type":"text","text":"Chứng chỉ TOEIC Listening & Reading năm 2022 với tổng điểm 690."}]}
    ]
  }'::jsonb,
  '<p>Chứng chỉ TOEIC Listening &amp; Reading 690 (2022).</p>',
  'Luyện đề + nghe podcast kỹ thuật hằng ngày.',
  'ETS TOEIC',
  '2022-01-01',
  '2022-10-31',
  ARRAY['english','toeic','certificate'],
  true, NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- 4. Mobile Development skillset
INSERT INTO "Knowledge" (
  "id", "userId", "slug", "title", "content", "contentHtml",
  "method", "source", "tags",
  "isPublished", "createdAt", "updatedAt"
) VALUES (
  'seedcv_knowledge_mobile_stack',
  'cmvwldzcv0000gclcnumbvg32',
  'mobile-development-stack',
  'Mobile Development Stack — Flutter + Kiến trúc',
  '{
    "type":"doc",
    "content":[
      {"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"Stack"}]},
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Flutter (BLoC, Cubit, GetX), Dart"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"React Native"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"iOS (Xcode), Android Studio"}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Clean Architecture, MVVM"}]}]}
      ]}
    ]
  }'::jsonb,
  '<h3>Stack</h3><ul><li>Flutter (BLoC, Cubit, GetX), Dart</li><li>React Native</li><li>iOS Xcode, Android Studio</li><li>Clean Architecture, MVVM</li></ul>',
  'Áp dụng vào các dự án thực tế LOT Software, PetPet, CYSGOV, ENEST.',
  'Thực hành dự án + docs chính thức',
  ARRAY['flutter','dart','mobile','architecture','bloc','clean-architecture'],
  true, NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- 5. Backend knowledge
INSERT INTO "Knowledge" (
  "id", "userId", "slug", "title", "content", "contentHtml",
  "method", "source", "tags",
  "isPublished", "createdAt", "updatedAt"
) VALUES (
  'seedcv_knowledge_backend',
  'cmvwldzcv0000gclcnumbvg32',
  'backend-apis',
  'Backend & APIs — NestJS, Python, Realtime',
  '{
    "type":"doc",
    "content":[
      {"type":"bulletList","content":[
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"NestJS, TypeScript — xây REST API và WebSocket gateway."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Python, FastAPI — service nhẹ, OCR pipeline."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Spring Boot — microservices Java tại dự án nội bộ."}]}]},
        {"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"PostgreSQL, MongoDB, MySQL; LiveKit (WebRTC SFU), FCM."}]}]}
      ]}
    ]
  }'::jsonb,
  '<ul><li>NestJS + TypeScript (REST, WebSocket).</li><li>Python / FastAPI.</li><li>Spring Boot.</li><li>PostgreSQL, MongoDB, MySQL, LiveKit, FCM.</li></ul>',
  'Tự học + hỗ trợ team backend trong các feature cross-stack.',
  'Docs chính thức + source code dự án nội bộ',
  ARRAY['nestjs','typescript','python','fastapi','spring-boot','postgresql','mongodb','livekit','websocket'],
  true, NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- 6. Security & E2EE
INSERT INTO "Knowledge" (
  "id", "userId", "slug", "title", "content", "contentHtml",
  "method", "source", "tags",
  "isPublished", "createdAt", "updatedAt"
) VALUES (
  'seedcv_knowledge_security',
  'cmvwldzcv0000gclcnumbvg32',
  'security-e2ee-mobsf',
  'Mobile Security — E2EE, Keychain/Keystore, MobSF',
  '{
    "type":"doc",
    "content":[
      {"type":"paragraph","content":[{"type":"text","text":"Thiết kế E2EE: 12-word recovery → Master Key → mã hoá đối xứng dữ liệu local; lưu Master Key trong iOS Keychain / Android Keystore, mở khoá bằng Face ID / Vân tay. Tích hợp MobSF (SAST + DAST) vào CI để pentest tự động."}]}
    ]
  }'::jsonb,
  '<p>E2EE với Master Key trong Keychain/Keystore + biometric; MobSF trong CI.</p>',
  'Đọc paper + implement thực tế trong Nextalk.',
  'Dự án Nextalk + tài liệu Signal Protocol',
  ARRAY['security','e2ee','keychain','keystore','biometric','mobsf','sast','dast'],
  true, NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- Daily Vlog mẫu (giới thiệu portfolio)
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO "DailyVlog" (
  "id", "userId", "slug", "title", "content", "contentHtml",
  "tags", "publishedAt", "isPublished", "createdAt", "updatedAt"
) VALUES (
  'seedcv_daily_welcome',
  'cmvwldzcv0000gclcnumbvg32',
  'chao-mung-den-portfolio',
  'Chào mừng tới portfolio selfOS',
  '{
    "type":"doc",
    "content":[
      {"type":"paragraph","content":[{"type":"text","text":"Đây là trang portfolio cá nhân của mình, nơi mình lưu lại các dự án mobile đã làm, kiến thức đã học và những ghi chú hằng ngày trên hành trình trở thành một kỹ sư tốt hơn."}]},
      {"type":"paragraph","content":[{"type":"text","text":"Nếu bạn muốn trao đổi về Flutter, kiến trúc BLoC/Clean, bảo mật mobile hoặc chỉ đơn giản là chia sẻ về cà phê và code đêm — ping mình qua email hoặc social link ở Profile nhé."}]}
    ]
  }'::jsonb,
  '<p>Welcome tới portfolio selfOS của mình — nơi mình lưu lại dự án, kiến thức và ghi chú hằng ngày.</p><p>Ping mình nếu bạn muốn trao đổi về Flutter, kiến trúc, security.</p>',
  ARRAY['welcome','intro','portfolio'],
  NOW(), true, NOW(), NOW()
) ON CONFLICT ("id") DO NOTHING;
