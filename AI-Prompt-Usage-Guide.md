---
title: AI-Prompt-Usage-Guide
tags:
  - ai prompt
  - hướng dẫn sử dụng
  - productivity
authors:
  - name: tannn
    title: AI Prompt Specialist
    url: https://github.com/annn.g1tla6
    imageUrl: https://secure.gravatar.com/avatar/acf89a2f408a656941879d28896eb0e59e47e005ebf56214c6f3fcdfb72f6904?s=80&d=identicon
---

## I. Benefits

- Tối ưu hóa kết quả khi làm việc với AI
- Tiết kiệm thời gian nhờ prompt rõ ràng, cụ thể
- Giảm sai sót, tăng chất lượng đầu ra
- Dễ dàng kiểm soát và lặp lại quy trình

## II. Prerequisites

- Có tài khoản truy cập vào nền tảng AI (ChatGPT, Gemini, Claude...)
- Hiểu khái niệm prompt và mục tiêu sử dụng AI
- Xác định rõ yêu cầu đầu ra mong muốn

## III. Information Level

- infoLevel:3 (reader must be signed official employee's contract from at least junior grade)
- writingLevel:1 (only text without image/video)

## IV. Tutorials

## IV. Tutorials

### Example 1: Cấu trúc prompt cơ bản cho tasks thông thường:

**Thiết lập:**

- Bước 1: Xác định vai trò (Role) cho AI
- Bước 2: Mô tả context (bối cảnh)
- Bước 3: Nêu rõ yêu cầu cụ thể (Task)
- Bước 4: Chỉ định format đầu ra
- Bước 5: Thêm ràng buộc và yêu cầu đặc biệt

**Sử dụng:**

- Ví dụ prompt hoàn chỉnh:

  \`\`\`
  Bạn là một chuyên gia marketing digital với 10 năm kinh nghiệm.

  Tôi đang xây dựng chiến lược content cho một startup công nghệ tài chính.

  Hãy giúp tôi tạo ra 5 ý tưởng bài viết blog thu hút khách hàng tiềm năng.

  Vui lòng trả lời theo format:

  - Tiêu đề
  - Mô tả ngắn (2-3 câu)
  - Keywords chính
  - Call-to-action đề xuất

  Giới hạn mỗi ý tưởng không quá 100 từ, sử dụng tone chuyên nghiệp nhưng thân thiện.
  \`\`\`

**Q&A cho ví dụ 1:**

- Q: Có cần phải cung cấp đầy đủ 5 bước trong mỗi prompt không?
- A: Không, tùy thuộc vào độ phức tạp của task. Đối với câu hỏi đơn giản, chỉ cần 2-3 bước.
- Q: Làm thế nào để biết prompt có hiệu quả không?
- A: Kiểm tra xem kết quả có đáp ứng đúng yêu cầu và có thể sử dụng ngay được không.

### Example 2: Prompt cho coding và technical tasks:

**Thiết lập:**

- Bước 1: Specify programming language và framework
- Bước 2: Mô tả chức năng cần implement
- Bước 3: Liệt kê requirements và constraints
- Bước 4: Yêu cầu documentation và testing

**Sử dụng:**

- Ví dụ prompt technical:

  \`\`\`
  Viết Js code sử dụng FastAPI framework.

  Tạo REST API endpoint để quản lý user authentication.

  Requirements:

  - POST /login: xác thực user với email/password
  - POST /register: đăng ký user mới
  - GET /profile: lấy thông tin user (cần authentication)
  - JWT token cho session management

  Constraints:

  - Sử dụng bcrypt cho password hashing
  - Validate email format
  - Handle common errors (user not found, wrong password, etc.)

  Bao gồm proper error handling, type hints, và docstrings cho mỗi function.
  \`\`\`

**Q&A cho ví dụ 2:**

- Q: AI có thể tạo code production-ready không?
- A: AI tạo code foundation tốt, nhưng vẫn cần review và testing kỹ lưỡng trước khi deploy.
- Q: Làm sao để đảm bảo code security?
- A: Luôn yêu cầu AI implement security best practices và review code về security vulnerabilities.

### Example 3: Prompt cho creative và content writing:

**Thiết lập:**

- Bước 1: Định nghĩa audience và purpose
- Bước 2: Specify tone và style
- Bước 3: Cung cấp key points hoặc outline
- Bước 4: Set length và format requirements

**Sử dụng:**

- Ví dụ prompt creative:

  \`\`\`
  Viết email marketing cho khách hàng hiện tại của một cửa hàng thời trang online.

  Mục đích: thông báo về sale cuối năm và khuyến khích mua hàng.

  Tone: thân thiện, exciting nhưng vẫn professional.

  Bao gồm:

  - Subject line bắt mắt
  - Personal greeting
  - Highlight sale offers (20-50% off)
  - Create urgency (limited time)
  - Clear call-to-action
  - Professional signature

  Độ dài: 150-200 từ, format email marketing chuẩn.
  \`\`\`

**Q&A cho ví dụ 3:**

- Q: Làm sao để content không bị generic?
- A: Cung cấp specific details về brand, audience, và unique selling points.
- Q: AI có thể tạo content theo brand voice riêng không?
- A: Có, nếu bạn mô tả rõ brand personality và cung cấp examples.

## V. Next Steps of Documentation

- 08/2025: ~~Init first commit to publish first tutorial~~ (Done)
- mm/yyyy: Waiting HCE's review to upgrađe into writeLevel:2 (acrediable) then publish in docs.gcalls.co
- mm//yyyy: second tutorial
- mm/yyyy: third tutorrial
- mm/yyyy: next update
