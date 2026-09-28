import {
  Person,
  Post,
  Story,
  Reel,
  Chat,
  Group,
  FriendRequest,
  UserProfile,
  NotificationItem,
  MiniAppInfo,
  SongTrack,
  CanteenItem,
  CampusLocation,
  GpaGrade,
  StudentIDInfo
} from '../types';

export const INITIAL_PEOPLE: Person[] = [
  {
    id: 1,
    name: 'Nguyễn Hoàng Linh',
    handle: '@linh_12a1',
    emoji: '🌸',
    school: 'THPT Cẩm Bình · Lớp 12A1',
    bio: 'Lớp trưởng 12A1 🌸 | Đội tuyển HSG Ngữ Văn tỉnh Hà Tĩnh | Yêu trà sữa cổng trường & chụp kỷ yếu 📸',
    avatarGradient: 'linear-gradient(135deg, #ff6bcb, #7c6bff)',
    avatarUrl: '/images/avatars/avatar-linh.svg',
    online: true,
    mutualCount: 28
  },
  {
    id: 2,
    name: 'Trần Đức Nam',
    handle: '@nam_guitar',
    emoji: '🎸',
    school: 'THPT Cẩm Bình · Lớp 11A3',
    bio: 'Cây Guitar CLB Âm nhạc Cẩm Bình 🎸 | Tiền đạo số 10 giải bóng đá 26/3 trường Cẩm Bình ⚽',
    avatarGradient: 'linear-gradient(135deg, #38e6c5, #7c6bff)',
    avatarUrl: '/images/avatars/avatar-nam.svg',
    online: true,
    mutualCount: 19
  },
  {
    id: 3,
    name: 'Thầy Nguyễn Văn Tuấn',
    handle: '@thaytuan_toancb',
    emoji: '📐',
    school: 'Tổ Toán · Bí thư Đoàn trường THPT Cẩm Bình',
    bio: 'Giáo viên Toán & Bí thư Đoàn THPT Cẩm Bình 📐 | "Toán học không nói dối, chỉ có chưa chăm thôi!" | Chúc 2k7 đỗ NV1!',
    avatarGradient: 'linear-gradient(135deg, #ffb84d, #ff6bcb)',
    avatarUrl: '/images/avatars/avatar-thay-tuan.svg',
    online: true,
    mutualCount: 45
  },
  {
    id: 4,
    name: 'Lê Bảo Trâm',
    handle: '@tram_media',
    emoji: '📸',
    school: 'THPT Cẩm Bình · Lớp 12A2',
    bio: 'Chủ nhiệm CLB Truyền Thông Cẩm Bình (CB Media) 📸 | Thích quay vlog giờ ra chơi, review đồ ăn căng tin',
    avatarGradient: 'linear-gradient(135deg, #ff6bcb, #7c6bff)',
    avatarUrl: '/images/avatars/avatar-tram.svg',
    online: false,
    mutualCount: 34
  },
  {
    id: 5,
    name: 'Đặng Quang Huy',
    handle: '@huy_hsg',
    emoji: '💻',
    school: 'THPT Cẩm Bình · Lớp 12A1',
    bio: 'Thủ khoa Tin học trẻ Hà Tĩnh 💻 | Cày đề ĐH Bách Khoa | Lập trình viên Trường Cẩm 🚀',
    avatarGradient: 'linear-gradient(135deg, #38e6c5, #ffb84d)',
    avatarUrl: '/images/avatars/avatar-huy.svg',
    online: true,
    mutualCount: 22
  },
  {
    id: 6,
    name: 'Mai Phương Uyên',
    handle: '@uyen_10a2',
    emoji: '🎨',
    school: 'THPT Cẩm Bình · Lớp 10A2',
    bio: 'K78 Cẩm Bình thân thiện 🎨 | Vẽ báo tường & thiết kế avatar lớp | Thành viên CLB Tiếng Anh (CEC)',
    avatarGradient: 'linear-gradient(135deg, #7c6bff, #38e6c5)',
    avatarUrl: '/images/avatars/avatar-an.svg',
    online: false,
    mutualCount: 15
  },
  {
    id: 7,
    name: 'Cô Nguyễn Thị Hạnh',
    handle: '@cohanh_english',
    emoji: '🇬🇧',
    school: 'Tổ Ngoại Ngữ · THPT Cẩm Bình',
    bio: 'Tổ trưởng Ngoại ngữ THPT Cẩm Bình ✨ | Luyện thi IELTS & Tốt nghiệp THPT | CLB Du học Cẩm Bình ✈️',
    avatarGradient: 'linear-gradient(135deg, #ff6bcb, #38e6c5)',
    avatarUrl: '/images/avatars/avatar-huong.svg',
    online: true,
    mutualCount: 40
  },
  {
    id: 8,
    name: 'Bác Ba Bảo Vệ',
    handle: '@bacba_cambinh',
    emoji: '🛡️',
    school: 'Tổ Bảo vệ & Quản lý cơ sở vật chất',
    bio: 'Bảo vệ cổng trường THPT Cẩm Bình 🛡️ | Đi học đúng giờ, dựng xe ngay ngắn nhé các cháu!',
    avatarGradient: 'linear-gradient(135deg, #ffb84d, #7c6bff)',
    avatarUrl: '/images/avatars/avatar-duc.svg',
    online: false,
    mutualCount: 50
  },
  {
    id: 9,
    name: 'Hà Minh Tú',
    handle: '@tu_basketball',
    emoji: '🏀',
    school: 'THPT Cẩm Bình · Lớp 11A1',
    bio: 'Đội trưởng đội bóng rổ Cẩm Bình 🏀 | 1m82 | Hẹn giao lưu sau giờ tan học sân B',
    avatarGradient: 'linear-gradient(135deg, #7c6bff, #ff6bcb)',
    avatarUrl: '/images/avatars/avatar-phong.svg',
    online: false,
    mutualCount: 12
  },
  {
    id: 10,
    name: 'Phạm Thuỳ Dung',
    handle: '@dung_canteen',
    emoji: '🧋',
    school: 'Căng-tin THPT Cẩm Bình',
    bio: 'Chị Dung Căng-tin trường Cẩm Bình 🧋 | Bánh mì pate nóng giòn, trà tắc khổng lồ, nem chua rán thơm nức!',
    avatarGradient: 'linear-gradient(135deg, #38e6c5, #7c6bff)',
    avatarUrl: '/images/avatars/avatar-co-lan.svg',
    online: true,
    mutualCount: 37
  }
];

export const INITIAL_USER: UserProfile = {
  id: 0,
  name: 'Vũ Minh Khang',
  handle: '@khang_12a1',
  emoji: '🎓',
  school: 'Trường THPT Cẩm Bình · Lớp 12A1',
  bio: 'Học sinh 12A1 THPT Cẩm Bình 🌸 | Quyết tâm đỗ Nguyện vọng 1 ĐH Bách Khoa Hà Nội 🚀 | Trợ lý kỹ thuật Trường Cẩm',
  avatarGradient: 'linear-gradient(135deg, #7c6bff, #38e6c5, #ff6bcb)',
  avatarUrl: '/images/avatars/avatar-me.svg',
  friendsCount: 368,
  postsCount: 24,
  groupsCount: 8,
  savedPostIds: [2],
  photos: [
    'linear-gradient(140deg, #7c6bff, #ff6bcb)',
    'linear-gradient(140deg, #38e6c5, #7c6bff)',
    'linear-gradient(140deg, #ffb84d, #ff6bcb)',
    'linear-gradient(140deg, #ff6bcb, #38e6c5)',
    'linear-gradient(140deg, #7c6bff, #38e6c5)',
    'linear-gradient(140deg, #38e6c5, #ffb84d)'
  ]
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 1,
    personId: 1,
    seen: false,
    slides: [
      {
        type: 'photo',
        grad: 'linear-gradient(160deg, #7c6bff, #ff6bcb)',
        text: 'Nắng sớm trên sân trường THPT Cẩm Bình sớm thứ 2 🌤️ Bó hoa 12A1 chuẩn bị tặng cô chủ nhiệm!'
      },
      {
        type: 'quote',
        grad: 'linear-gradient(160deg, #38e6c5, #7c6bff)',
        text: '"Thanh xuân ở Cẩm Bình là những ngày ôn thi cùng bạn bè, rộn rã tiếng cười dưới hàng phượng vĩ."'
      }
    ]
  },
  {
    id: 2,
    personId: 2,
    seen: false,
    slides: [
      {
        type: 'photo',
        grad: 'linear-gradient(160deg, #38e6c5, #7c6bff)',
        text: 'Tập bài hát truyền thống trường tại phòng đoàn thể 🎸 Chiều nay 16h30 giao lưu văn nghệ nha!'
      }
    ]
  },
  {
    id: 3,
    personId: 3,
    seen: false,
    slides: [
      {
        type: 'quote',
        grad: 'linear-gradient(160deg, #ff6bcb, #ffb84d)',
        text: '"Đoàn trường thông báo: Tuần lễ Văn minh học đường & Giải bóng đá nam nữ bắt đầu từ thứ Ba!"'
      },
      {
        type: 'photo',
        grad: 'linear-gradient(160deg, #ffb84d, #ff6bcb)',
        text: 'Sân bóng cỏ nhân tạo trường Cẩm Bình vừa kẻ lại vạch sơn chuẩn bị khai mạc ⚽🏆'
      }
    ]
  },
  {
    id: 4,
    personId: 4,
    seen: true,
    slides: [
      {
        type: 'photo',
        grad: 'linear-gradient(160deg, #ff6bcb, #7c6bff)',
        text: 'Một góc Dãy nhà A ngập tràn cờ hoa rực rỡ 📸 Góc chụp đẹp nhất trường!'
      }
    ]
  },
  {
    id: 5,
    personId: 10,
    seen: false,
    slides: [
      {
        type: 'photo',
        grad: 'linear-gradient(160deg, #38e6c5, #ffb84d)',
        text: 'Căng tin hôm nay có thêm món trà đào cam sả và bánh mì que Hải Phòng giòn rụm nha các em 🥪🧋'
      }
    ]
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    personId: 3,
    type: 'image',
    imgData: '/images/posts/post-doan-truong.svg',
    grad: 'linear-gradient(160deg, #7c6bff, #ff6bcb)',
    text: '📣 THÔNG BÁO TỪ ĐOÀN TRƯỜNG THPT CẨM BÌNH:\nKế hoạch thi thử Tốt nghiệp THPT Quốc Gia đợt 1 năm học 2026 sẽ diễn ra vào ngày 15 & 16 tháng tới. Học sinh khối 12 tập trung ôn tập theo chuyên đề của từng tổ chuyên môn. Chúc các em 2k8, 2k7 ôn luyện vững vàng! #THPTCamBinh #OnThiTHPT #HocSinhGioi',
    time: '30m trước',
    likes: 184,
    liked: false,
    saved: true,
    fontChoice: 'display',
    comments: [
      { id: 'c1', personId: 1, text: 'Dạ chúng em 12A1 đã chuẩn bị sẵn sàng rồi thầy ơi! 💯', time: '20m trước', likes: 12 },
      { id: 'c2', personId: 5, text: 'Đề Toán năm nay có câu phân loại hình học không gian không thầy? 📐', time: '15m trước', likes: 7 }
    ],
    commentsOpen: false,
    sharesCount: 35
  },
  {
    id: 2,
    personId: 1,
    type: 'quote',
    imgData: '/images/posts/post-ky-yeu.svg',
    text: '"Áo dài trắng thướt tha sân trường Cẩm Bình, dưới ánh nắng vàng óng ả của miền quê Hà Tĩnh yêu thương. Ba năm cấp 3 sẽ trôi qua rất nhanh, hãy trân trọng từng tiết học bên nhau nhé 12A1! 🌸"',
    time: '2h trước',
    likes: 142,
    liked: true,
    saved: true,
    fontChoice: 'editorial',
    grad: 'linear-gradient(135deg, rgba(124, 107, 255, 0.45), rgba(255, 107, 203, 0.35))',
    comments: [
      { id: 'c3', personId: 4, text: 'Ảnh kỷ yếu tuần này Trâm chụp cho Linh góc sân bóng cực đẹp luôn nè!', time: '1h trước', likes: 8 }
    ],
    commentsOpen: false,
    sharesCount: 19
  },
  {
    id: 3,
    personId: 2,
    type: 'image',
    imgData: '/images/posts/post-bong-da.svg',
    grad: 'linear-gradient(160deg, #38e6c5, #ffb84d)',
    text: 'Trận bán kết bóng đá giữa 11A3 và 11A1 nghẹt thở đến phút 90! Tỉ số 3 - 2 nghiêng về A3 ⚽🔥 Cảm ơn toàn thể cổ động viên trên khán đài đã tiếp lửa cuồng nhiệt!',
    time: '4h trước',
    likes: 96,
    liked: false,
    saved: false,
    fontChoice: 'clean',
    comments: [
      { id: 'c4', personId: 9, text: 'Nam đá quả sút phạt góc hình quả chuối ảo thực sự! 👏', time: '3h trước', likes: 5 }
    ],
    commentsOpen: false,
    sharesCount: 14
  },
  {
    id: 4,
    personId: 5,
    type: 'image',
    imgData: '/images/posts/post-truong-cam-tech.svg',
    grad: 'linear-gradient(160deg, #00f2fe, #4facfe)',
    text: 'Cổng thông tin và tiện ích "Trường Cẩm" dành cho học sinh THPT Cẩm Bình đã sẵn sàng! Ứng dụng tích hợp diễn đàn chia sẻ, nhắn tin trao đổi học tập, trợ lý Cẩm AI giải bài tập, bản đồ trường, căng-tin và thẻ học sinh CẩmID. Mọi người cùng trải nghiệm nhé! #THPTCamBinh #TruongCam',
    time: '6h trước',
    likes: 230,
    liked: true,
    saved: true,
    fontChoice: 'code',
    comments: [
      { id: 'c5', personId: 3, text: 'Thầy rất hoan nghênh tinh thần sáng tạo số của học sinh Cẩm Bình!', time: '5h trước', likes: 25 },
      { id: 'c6', personId: 10, text: 'Menu Căng-tin hiển thị rõ ràng, các em order bánh mì nhanh lắm nhé!', time: '4h trước', likes: 18 }
    ],
    commentsOpen: false,
    sharesCount: 52
  },
  {
    id: 5,
    personId: 4,
    type: 'image',
    imgData: '/images/posts/post-thu-vien.svg',
    grad: 'linear-gradient(160deg, #ff6bcb, #38e6c5)',
    text: 'Góc thư viện mới sửa chữa của trường Cẩm Bình yên tĩnh và xịn xò như quán cà phê vintage 🌿📚 Bạn nào cần tài liệu ôn thi môn Sử - Địa qua tầng 2 mượn nhé.',
    time: '8h trước',
    likes: 77,
    liked: false,
    saved: false,
    fontChoice: 'hand',
    comments: [],
    commentsOpen: false,
    sharesCount: 6
  }
];

export const INITIAL_REELS: Reel[] = [
  {
    id: 1,
    personId: 2,
    grad: 'linear-gradient(200deg, #1b1030, #7c6bff 55%, #ff6bcb)',
    text: 'Guitar solo ca khúc "Hành Khúc THPT Cẩm Bình" giữa giờ ra chơi 🎸 Cả dãy nhà A cùng hát theo!',
    likes: 380,
    liked: true,
    soundTrack: 'Hành Khúc Cẩm Bình (Acoustic) · Nam Guitar',
    commentsCount: 45
  },
  {
    id: 2,
    personId: 4,
    grad: 'linear-gradient(200deg, #0d1b3a, #38e6c5 55%, #7c6bff)',
    text: 'Thử thách 1 ngày làm học sinh 12 chuyên cần ở THPT Cẩm Bình 📚 Từ 6h30 sáng đến 17h chiều!',
    likes: 520,
    liked: false,
    soundTrack: 'Lofi Học Bài Cẩm Bình · Sam Beats',
    commentsCount: 68
  },
  {
    id: 3,
    personId: 10,
    grad: 'linear-gradient(200deg, #2a0f3a, #ffb84d 55%, #ff6bcb)',
    text: 'Một mẻ bánh mì pate nóng hổi vừa ra lò phục vụ giờ ra chơi 15 phút 🥪 Ai đặt trước trên Cẩm Căng-tin qua lấy nha!',
    likes: 290,
    liked: false,
    soundTrack: 'Ăn Vặt Học Đường Vui Nhộn',
    commentsCount: 31
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'group_12a1',
    isGroup: true,
    groupName: '12A1 THPT Cẩm Bình 🌸 (Chính Thức)',
    unread: 4,
    msgs: [
      { id: 'm1', me: false, personId: 1, text: 'Các bạn ơi, tiết 4 hôm nay cô Nga kiểm tra 15 phút bài thơ Tây Tiến nhé!', time: '08:15' },
      { id: 'm2', me: false, personId: 5, text: 'Mình đã gửi file tóm tắt sơ đồ tư duy lên mục Cẩm Drive rồi đó.', time: '08:17' },
      { id: 'm3', me: false, personId: 1, text: 'Ai chưa nộp quỹ lớp photo đề thi thì qua CẩmPay quét mã QR giúp Linh nhé!', time: '08:20' }
    ]
  },
  {
    id: 'group_doantruong',
    isGroup: true,
    groupName: 'BCH Đoàn Trường THPT Cẩm Bình 🇻🇳',
    unread: 1,
    msgs: [
      { id: 'm4', me: false, personId: 3, text: 'Chiều thứ Bảy này các chi đoàn cử 5 bạn tham gia lao động chăm sóc vườn hoa thanh niên.', time: 'Hôm qua' },
      { id: 'm5', me: true, text: 'Dạ chi đoàn 12A1 chúng em đăng ký đủ danh sách rồi thầy ơi!', time: 'Hôm qua' }
    ]
  },
  {
    id: 1,
    personId: 1,
    online: true,
    unread: 2,
    msgs: [
      { id: 'm10', me: false, text: 'Khang ơi! Bạn xem giúp Linh bài giải câu 45 đề Toán chuyên Hà Tĩnh với?', time: '09:10' },
      { id: 'm11', me: true, text: 'Được chứ Linh, câu đó áp dụng công thức tọa độ Oxyz là ra nhanh lắm!', time: '09:12' },
      { id: 'm12', me: false, text: 'Cảm ơn Khang nhiều nha, lát ra chơi mình mời cốc trà đào căng-tin!', time: '09:14' }
    ]
  },
  {
    id: 2,
    personId: 2,
    online: true,
    unread: 0,
    msgs: [
      { id: 'm20', me: false, text: 'Thứ Năm này tập văn nghệ chào mừng 26/3 lúc 16h45 ở nhà đa năng nhé ông!', time: 'Hôm qua' },
      { id: 'm21', me: true, text: 'Ok Nam, tôi mang theo dây loa và micro cho.', time: 'Hôm qua' }
    ]
  },
  {
    id: 10,
    personId: 10,
    online: true,
    unread: 0,
    msgs: [
      { id: 'm30', me: false, text: 'Chị chuẩn bị xong bánh mì pate và trà tắc cho Khang rồi nhé, chuông reo chạy xuống lấy nóng giòn nha!', time: '07:45' }
    ]
  }
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: 1,
    name: 'Khối 12 THPT Cẩm Bình (2024 - 2027)',
    grad: 'linear-gradient(120deg, #7c6bff, #ff6bcb)',
    members: 412,
    joined: true,
    desc: 'Cộng đồng học sinh khối 12 toàn trường: chia sẻ tài liệu ôn thi, kỷ yếu, tư vấn tuyển sinh ĐH.',
    category: 'School',
    about: 'Diễn đàn chính thức của các bạn học sinh khối 12 trường Cẩm Bình chuẩn bị vượt vũ môn.'
  },
  {
    id: 2,
    name: 'Cẩm Bình Confessions & Chuyện Học Đường',
    grad: 'linear-gradient(120deg, #ff6bcb, #ffb84d)',
    members: 1250,
    joined: true,
    desc: 'Nơi thổ lộ tâm tình, tìm đồ thất lạc, chia sẻ kỉ niệm dưới mái trường Cẩm Bình thân thương.',
    category: 'Interest',
    about: 'Góc chia sẻ ẩn danh và công khai về những điều đáng nhớ nhất của tuổi học trò Cẩm Bình.'
  },
  {
    id: 3,
    name: 'Hội Ôn Thi THPT Quốc Gia - Hà Tĩnh',
    grad: 'linear-gradient(120deg, #38e6c5, #7c6bff)',
    members: 890,
    joined: true,
    desc: 'Giải đề thi thử Toán, Lý, Hóa, Văn, Anh, Sử, Địa từ các trường chuyên và THPT toàn tỉnh.',
    category: 'College',
    about: 'Kho đề thi thử cập nhật liên tục với lời giải chi tiết và mẹo làm bài trắc nghiệm.'
  },
  {
    id: 4,
    name: 'CLB Âm Nhạc & Nghệ Thuật Cẩm Bình',
    grad: 'linear-gradient(120deg, #ffb84d, #38e6c5)',
    members: 120,
    joined: true,
    desc: 'Dành cho các bạn đam mê guitar, thanh nhạc, nhảy hiện đại và dẫn chương trình MC.',
    category: 'Interest',
    about: 'Tập luyện biểu diễn các ngày lễ lớn: 20/11, 26/3, lễ bế giảng và các sự kiện đoàn thể.'
  },
  {
    id: 5,
    name: 'Căng-tin & Chợ Pass Đồ Học Sinh Cẩm Bình',
    grad: 'linear-gradient(120deg, #7c6bff, #38e6c5)',
    members: 540,
    joined: false,
    desc: 'Thanh lý sách giáo khoa, đồng phục, máy tính cầm tay Casio 580VNX, đồ dùng học tập giá hạt dẻ.',
    category: 'Interest',
    about: 'Chợ đồ cũ văn minh tiết kiệm của học sinh các khối 10-11-12 THPT Cẩm Bình.'
  }
];

export const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [
  { id: 6, mutual: 15, time: '15m trước' },
  { id: 9, mutual: 12, time: '2h trước' }
];

export const INITIAL_FRIEND_SUGGESTIONS = [
  { id: 7, mutual: 40 },
  { id: 8, mutual: 50 },
  { id: 4, mutual: 34 }
];

export const INITIAL_FRIENDS_ALL = [1, 2, 3, 5, 10];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    personId: 1,
    action: 'đã thích bài viết "Trường Cẩm v2.0"',
    time: '10m trước',
    read: false,
    type: 'like'
  },
  {
    id: 'n2',
    personId: 3,
    action: 'đã ghim thông báo mới trong nhóm "BCH Đoàn Trường"',
    time: '45m trước',
    read: false,
    type: 'group'
  },
  {
    id: 'n3',
    personId: 6,
    action: 'đã gửi lời mời kết bạn từ Lớp 10A2',
    time: '2h trước',
    read: false,
    type: 'friend'
  },
  {
    id: 'n4',
    personId: 2,
    action: 'đã đăng video mới: "Hành Khúc Cẩm Bình 🎸"',
    time: '4h trước',
    read: true,
    type: 'like'
  }
];

// Complete list of 35+ Apps inspired by the user request
export const ALL_MINI_APPS: MiniAppInfo[] = [
  // Social & Chat
  {
    id: 'facebook',
    name: 'Cẩm Social',
    vietnameseName: 'Bảng Tin Confessions',
    category: 'social',
    description: 'Bảng tin trường, confessions ẩn danh, thảo luận sự kiện',
    iconBg: 'linear-gradient(135deg, #1877f2, #0052cc)',
    iconEmoji: '📘',
    inspiredBy: 'Facebook'
  },
  {
    id: 'messenger',
    name: 'Cẩm Messenger',
    vietnameseName: 'Nhắn Tin Tức Thì',
    category: 'social',
    description: 'Bong bóng chat, gọi thoại nhóm, sticker học sinh vui nhộn',
    iconBg: 'linear-gradient(135deg, #00B2FF, #006AFF)',
    iconEmoji: '💬',
    badge: '4 mới',
    inspiredBy: 'Messenger'
  },
  {
    id: 'zalo',
    name: 'Zalo Cẩm Bình',
    vietnameseName: 'Nhóm Lớp & Đoàn Đội',
    category: 'social',
    description: 'Ghim thông báo bài học, nhóm phụ huynh, chuyển ảnh HD',
    iconBg: 'linear-gradient(135deg, #0068FF, #0091FF)',
    iconEmoji: '🔷',
    badge: '12A1',
    inspiredBy: 'Zalo'
  },
  {
    id: 'telegram',
    name: 'Cẩm Telegram',
    vietnameseName: 'Kênh Tài Liệu Thi',
    category: 'social',
    description: 'Kênh tài liệu thi THPT QG không giới hạn dung lượng, tin nhắn tự hủy',
    iconBg: 'linear-gradient(135deg, #2AABEE, #229ED9)',
    iconEmoji: '✈️',
    inspiredBy: 'Telegram'
  },
  {
    id: 'whatsapp',
    name: 'Cẩm WhatsApp',
    vietnameseName: 'Nhóm Bài Tập Học Kỳ',
    category: 'social',
    description: 'Gửi tài liệu bài tập PDF mã hóa an toàn, liên lạc cán bộ lớp',
    iconBg: 'linear-gradient(135deg, #25D366, #128C7E)',
    iconEmoji: '🟢',
    inspiredBy: 'WhatsApp'
  },
  {
    id: 'instagram',
    name: 'Cẩm Insta',
    vietnameseName: 'Kho Ảnh Kỷ Yếu',
    category: 'social',
    description: 'Story 24h, bộ lọc màu aesthetic thanh xuân, khoảnh khắc lớp',
    iconBg: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
    iconEmoji: '📷',
    inspiredBy: 'Instagram'
  },
  {
    id: 'tiktok',
    name: 'Cẩm Shorts',
    vietnameseName: 'Video Ngắn Học Sinh',
    category: 'entertainment',
    description: 'Lướt video dọc, nhạc nền hot trend, thử thách học đường',
    iconBg: 'linear-gradient(135deg, #000000, #ff0050, #00f2fe)',
    iconEmoji: '🎵',
    badge: 'Hot',
    inspiredBy: 'TikTok'
  },
  {
    id: 'threads',
    name: 'Cẩm Threads',
    vietnameseName: 'Tâm Sự Tuổi 18',
    category: 'social',
    description: 'Chia sẻ ngắn, chuỗi suy nghĩ ôn thi, tâm tình cùng bạn bè',
    iconBg: 'linear-gradient(135deg, #000000, #333333)',
    iconEmoji: '🧵',
    inspiredBy: 'Threads'
  },
  {
    id: 'twitter',
    name: 'Cẩm X (Twitter)',
    vietnameseName: 'Xu Hướng & Thăm Dò',
    category: 'social',
    description: 'Bình chọn thăm dò ý kiến lớp, hashtag trending #THPTCamBinh',
    iconBg: 'linear-gradient(135deg, #111111, #222222)',
    iconEmoji: '✖️',
    inspiredBy: 'X (Twitter)'
  },
  {
    id: 'youtube',
    name: 'CẩmBình TV',
    vietnameseName: 'Kênh Video Trường',
    category: 'entertainment',
    description: 'Video văn nghệ 20/11, clip khai giảng, phóng sự học đường',
    iconBg: 'linear-gradient(135deg, #FF0000, #CC0000)',
    iconEmoji: '▶️',
    inspiredBy: 'YouTube'
  },

  // AI & Study Assistants
  {
    id: 'chatgpt',
    name: 'Cẩm GPT',
    vietnameseName: 'Gia Sư AI Đa Năng',
    category: 'study_ai',
    description: 'Giải bài tập SGK Toán Lý Hóa, gợi ý dàn bài nghị luận Văn',
    iconBg: 'linear-gradient(135deg, #10a37f, #0d8c6d)',
    iconEmoji: '🤖',
    badge: 'AI',
    inspiredBy: 'ChatGPT'
  },
  {
    id: 'gemini',
    name: 'Cẩm Gemini',
    vietnameseName: 'Trí Tuệ Nhân Tạo Google',
    category: 'study_ai',
    description: 'Phân tích hình ảnh đề bài, dịch văn bản tiếng Anh chính xác',
    iconBg: 'linear-gradient(135deg, #1A73E8, #7B1FA2)',
    iconEmoji: '✨',
    badge: 'Pro',
    inspiredBy: 'Gemini'
  },
  {
    id: 'claude',
    name: 'Cẩm Claude',
    vietnameseName: 'Trợ Lý Luận Văn & Đọc Hiểu',
    category: 'study_ai',
    description: 'Phân tích tác phẩm văn học lớp 12, lập luận chặt chẽ sâu sắc',
    iconBg: 'linear-gradient(135deg, #cc785c, #9d503b)',
    iconEmoji: '🧠',
    inspiredBy: 'Claude'
  },
  {
    id: 'duolingo',
    name: 'Cẩm Duolingo',
    vietnameseName: 'Luyện Tiếng Anh Mỗi Ngày',
    category: 'study_ai',
    description: 'Cú xanh nhắc học từ vựng, duy trì streak ngọn lửa chăm chỉ',
    iconBg: 'linear-gradient(135deg, #58cc02, #46a302)',
    iconEmoji: '🦉',
    badge: '🔥 14 ngày',
    inspiredBy: 'Duolingo'
  },
  {
    id: 'quizlet',
    name: 'Cẩm Quizlet',
    vietnameseName: 'Bộ Flashcard Ôn Thi',
    category: 'study_ai',
    description: 'Lật thẻ ghi nhớ 3000 từ vựng cốt lõi kỳ thi THPT Quốc Gia',
    iconBg: 'linear-gradient(135deg, #4257b2, #2e3d82)',
    iconEmoji: '🃏',
    inspiredBy: 'Quizlet'
  },
  {
    id: 'anki',
    name: 'Cẩm Anki',
    vietnameseName: 'Ôn Tập Ngắt Quãng',
    category: 'study_ai',
    description: 'Ghi nhớ công thức Toán - Lý - Hóa bằng thuật toán Spaced Repetition',
    iconBg: 'linear-gradient(135deg, #007acc, #005999)',
    iconEmoji: '⚡',
    inspiredBy: 'Anki'
  },

  // Productivity & Office
  {
    id: 'google_search',
    name: 'Cẩm Search',
    vietnameseName: 'Tìm Kiếm Đa Năng',
    category: 'utilities',
    description: 'Tra cứu tài liệu, đáp án đề thi thử, thông tin trường ĐH',
    iconBg: 'linear-gradient(135deg, #4285F4, #34A853, #FBBC05, #EA4335)',
    iconEmoji: '🔍',
    inspiredBy: 'Google Search'
  },
  {
    id: 'safari',
    name: 'Cẩm Safari',
    vietnameseName: 'Trình Duyệt Web iOS',
    category: 'utilities',
    description: 'Duyệt web mượt mà, tra cứu điểm thi Sở GD&ĐT Hà Tĩnh',
    iconBg: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
    iconEmoji: '🧭',
    inspiredBy: 'Safari'
  },
  {
    id: 'gmail',
    name: 'Cẩm Mail',
    vietnameseName: 'Hòm Thư Học Sinh',
    category: 'utilities',
    description: 'Hòm thư @cambinh.edu.vn, gửi đơn xin phép nghỉ học trực tuyến',
    iconBg: 'linear-gradient(135deg, #EA4335, #C5221F)',
    iconEmoji: '✉️',
    badge: '2 thư',
    inspiredBy: 'Gmail'
  },
  {
    id: 'outlook',
    name: 'Cẩm Outlook',
    vietnameseName: 'Lịch Thi & Lịch Học',
    category: 'utilities',
    description: 'Lịch thi học kỳ, đồng bộ thời khóa biểu tiết học',
    iconBg: 'linear-gradient(135deg, #0078D4, #106EBE)',
    iconEmoji: '📅',
    inspiredBy: 'Outlook'
  },
  {
    id: 'google_drive',
    name: 'Cẩm Drive',
    vietnameseName: 'Kho Đề Thi & Bài Giảng',
    category: 'utilities',
    description: 'Lưu trữ đề thi thử, slide bài giảng các môn học',
    iconBg: 'linear-gradient(135deg, #FFBA00, #00AC47, #0066DA)',
    iconEmoji: '📁',
    inspiredBy: 'Google Drive'
  },
  {
    id: 'onedrive',
    name: 'Cẩm Cloud',
    vietnameseName: 'Đám Mây Lưu Trữ',
    category: 'utilities',
    description: 'Sao lưu an toàn ảnh kỷ yếu và kỷ niệm 3 năm cấp 3',
    iconBg: 'linear-gradient(135deg, #0078D4, #004578)',
    iconEmoji: '☁️',
    inspiredBy: 'OneDrive'
  },
  {
    id: 'word',
    name: 'Cẩm Docs / Word',
    vietnameseName: 'Soạn Thảo Bài Văn',
    category: 'utilities',
    description: 'Soạn thảo văn bản, viết đơn từ, làm báo cáo hoạt động chi đoàn',
    iconBg: 'linear-gradient(135deg, #2B579A, #1E395B)',
    iconEmoji: '📝',
    inspiredBy: 'Word / Docs'
  },
  {
    id: 'excel',
    name: 'Cẩm GPA / Excel',
    vietnameseName: 'Tính Điểm Trung Bình Môn',
    category: 'utilities',
    description: 'Bảng tính điểm TBM học kỳ, tự động xếp loại học lực Giỏi/Khá',
    iconBg: 'linear-gradient(135deg, #217346, #104C27)',
    iconEmoji: '📊',
    inspiredBy: 'Excel / Sheets'
  },
  {
    id: 'notion',
    name: 'Cẩm Notion',
    vietnameseName: 'Thời Khóa Biểu & Mục Tiêu',
    category: 'utilities',
    description: 'Kế hoạch ôn thi 90 ngày, quản lý to-do list bài tập tuần',
    iconBg: 'linear-gradient(135deg, #000000, #222222)',
    iconEmoji: '📓',
    inspiredBy: 'Notion'
  },

  // Collaboration & Meetings
  {
    id: 'teams',
    name: 'Cẩm Study Room',
    vietnameseName: 'Phòng Học Nhóm Online',
    category: 'study_ai',
    description: 'Học nhóm Pomodoro 25 phút, âm thanh lofi chống mất tập trung',
    iconBg: 'linear-gradient(135deg, #464EB8, #2E3378)',
    iconEmoji: '👥',
    badge: 'Đang mở',
    inspiredBy: 'Teams / Zoom / Meet'
  },
  {
    id: 'slack',
    name: 'Cẩm Slack',
    vietnameseName: 'Kênh Ban Cán Sự',
    category: 'social',
    description: 'Trao đổi riêng giữa ban cán sự các lớp và ban giám hiệu',
    iconBg: 'linear-gradient(135deg, #4A154B, #611f69)',
    iconEmoji: '💼',
    inspiredBy: 'Slack'
  },

  // Campus Food & Ride
  {
    id: 'shopee',
    name: 'Căng-tin Cẩm Bình',
    vietnameseName: 'Đặt Món Giờ Ra Chơi',
    category: 'utilities',
    description: 'Bánh mì que giòn tan, trà sữa trân châu, không cần xếp hàng',
    iconBg: 'linear-gradient(135deg, #EE4D2D, #D03E1B)',
    iconEmoji: '🥪',
    badge: 'Nóng giòn',
    inspiredBy: 'Shopee / TikTok Shop'
  },
  {
    id: 'grab',
    name: 'Cẩm Ride',
    vietnameseName: 'Xe Ôm Học Sinh Về Nhà',
    category: 'utilities',
    description: 'Đặt xe ôm/xe buýt đón trước cổng trường Cẩm Bình an toàn',
    iconBg: 'linear-gradient(135deg, #00B14F, #00883D)',
    iconEmoji: '🛵',
    inspiredBy: 'Grab / Be'
  },
  {
    id: 'google_maps',
    name: 'Cẩm Maps',
    vietnameseName: 'Bản Đồ Khuôn Viên Trường',
    category: 'utilities',
    description: 'Định vị Dãy A, Dãy B, Nhà đa năng, Thư viện, Sân bóng Cẩm Bình',
    iconBg: 'linear-gradient(135deg, #34A853, #4285F4)',
    iconEmoji: '🗺️',
    inspiredBy: 'Google Maps'
  },

  // Finance & Pay
  {
    id: 'momo',
    name: 'CẩmPay',
    vietnameseName: 'Ví Học Sinh & Quỹ Lớp',
    category: 'finance',
    description: 'Nộp tiền quỹ lớp 12A1, quét mã VietQR chuyển tiền ăn vặt',
    iconBg: 'linear-gradient(135deg, #A50064, #D82D8B)',
    iconEmoji: '👛',
    badge: '150.000đ',
    inspiredBy: 'MoMo / VNPay / Vietcombank'
  },

  // Entertainment & Music
  {
    id: 'spotify',
    name: 'CẩmMusic',
    vietnameseName: 'Nhạc Lofi Ôn Thi',
    category: 'entertainment',
    description: 'Playlist lofi chill, hiển thị lời bài hát, âm thanh học đường chất lượng',
    iconBg: 'linear-gradient(135deg, #1DB954, #128038)',
    iconEmoji: '🎧',
    badge: 'Playing',
    inspiredBy: 'Spotify / Apple Music'
  },
  {
    id: 'netflix',
    name: 'Cẩm Cinema',
    vietnameseName: 'Phim Ngắn Học Đường',
    category: 'entertainment',
    description: 'Phim kỷ yếu, phóng sự tri ân thầy cô giáo, video tài năng',
    iconBg: 'linear-gradient(135deg, #E50914, #B81D24)',
    iconEmoji: '🍿',
    inspiredBy: 'Netflix / VieON'
  },

  // News, Fitness & Identity
  {
    id: 'vnexpress',
    name: 'Cẩm News',
    vietnameseName: 'Điểm Tin Học Đường Hà Tĩnh',
    category: 'utilities',
    description: 'Tin tức tuyển sinh ĐH 2026, thời tiết Cẩm Xuyên - Cẩm Bình',
    iconBg: 'linear-gradient(135deg, #9F224E, #6B1131)',
    iconEmoji: '📰',
    inspiredBy: 'VnExpress'
  },
  {
    id: 'strava',
    name: 'Cẩm Strava',
    vietnameseName: 'CLB Chạy Bộ Cẩm Bình',
    category: 'entertainment',
    description: 'Đếm bước chân đi bộ quanh sân trường, bảng xếp hạng thể thao lớp',
    iconBg: 'linear-gradient(135deg, #FC4C02, #C63900)',
    iconEmoji: '🏃',
    badge: 'Top 3',
    inspiredBy: 'Strava'
  },
  {
    id: 'vneid',
    name: 'CẩmID',
    vietnameseName: 'Thẻ Học Sinh Số',
    category: 'finance',
    description: 'Mã QR điểm danh vào cổng, thẻ thư viện điện tử THPT Cẩm Bình',
    iconBg: 'linear-gradient(135deg, #C41E24, #8B0000)',
    iconEmoji: '🪪',
    badge: 'Đã xác thực',
    inspiredBy: 'VNeID'
  },
  {
    id: 'canva',
    name: 'Cẩm Studio',
    vietnameseName: 'Chế Meme & Thiệp 20/11',
    category: 'creative',
    description: 'Ghép khung ảnh kỷ yếu lớp, tạo avatar sự kiện, chế meme trường',
    iconBg: 'linear-gradient(135deg, #00C4CC, #7D2AE8)',
    iconEmoji: '🎨',
    inspiredBy: 'Canva / CapCut'
  }
];

export const INITIAL_CANTEEN_MENU: CanteenItem[] = [
  {
    id: 'food_1',
    name: 'Bánh Mì Pate Trứng Nóng Giòn',
    price: 15000,
    category: 'Ăn sáng',
    emoji: '🥪',
    imageUrl: '/images/canteen/banh-mi.svg',
    rating: 4.9,
    sold: 128,
    popular: true
  },
  {
    id: 'food_2',
    name: 'Xôi Xéo Ruốc Hành Phi Cô Lan',
    price: 12000,
    category: 'Ăn sáng',
    emoji: '🍚',
    imageUrl: '/images/canteen/xoi-xeo.svg',
    rating: 4.8,
    sold: 95
  },
  {
    id: 'drink_1',
    name: 'Trà Sữa Trân Châu Hoàng Kim',
    price: 18000,
    category: 'Đồ uống',
    emoji: '🧋',
    imageUrl: '/images/canteen/tra-sua.svg',
    rating: 5.0,
    sold: 210,
    popular: true
  },
  {
    id: 'drink_2',
    name: 'Trà Đào Cam Sả Mát Lạnh',
    price: 15000,
    category: 'Đồ uống',
    emoji: '🍑',
    imageUrl: '/images/canteen/tra-dao.svg',
    rating: 4.9,
    sold: 140
  },
  {
    id: 'snack_1',
    name: 'Nem Chua Rán Giòn Rụm (5 chiếc)',
    price: 20000,
    category: 'Ăn vặt',
    emoji: '🍢',
    imageUrl: '/images/canteen/nem-chua-ran.svg',
    rating: 4.7,
    sold: 84
  },
  {
    id: 'study_1',
    name: 'Bút Bi Thiên Long 0.5mm (vỉ 3 chiếc)',
    price: 10000,
    category: 'Dụng cụ học tập',
    emoji: '🖊️',
    imageUrl: '/images/canteen/but-bi.svg',
    rating: 5.0,
    sold: 320
  }
];

export const INITIAL_SONGS: SongTrack[] = [
  {
    id: 'song_1',
    title: 'Hành Khúc THPT Cẩm Bình (Lofi)',
    artist: 'Ban Văn Nghệ Đoàn Trường Cẩm Bình',
    duration: '3:24',
    coverGradient: 'linear-gradient(135deg, #7c6bff, #ff6bcb)',
    lyrics: [
      'Dưới mái trường Cẩm Bình rợp bóng cây xanh...',
      'Tiếng trống trường vang lên giục giã bước chân em tới lớp.',
      'Thầy cô mến yêu chắp cánh ước mơ bay xa...',
      'Thanh xuân rạng ngời cùng bạn bè 12A1 thân thương!'
    ]
  },
  {
    id: 'song_2',
    title: 'Giai Điệu Ôn Thi 25 Phút (Deep Focus)',
    artist: 'Cẩm Bình Study Beats',
    duration: '25:00',
    coverGradient: 'linear-gradient(135deg, #38e6c5, #7c6bff)',
    lyrics: [
      'Âm thanh mưa rơi nhè nhẹ ngoài hiên lớp học...',
      'Hít thở sâu, tập trung giải từng phương trình Toán học.',
      'Sự nỗ lực của ngày hôm nay là thành công của ngày mai!',
      'Giữ vững niềm tin, ước mơ đại học đang chờ đón bạn.'
    ]
  },
  {
    id: 'song_3',
    title: 'Nụ Cười Mười Tám Đôi Mươi',
    artist: 'Nam Guitar & Linh Vocal (11A3 - 12A1)',
    duration: '3:45',
    coverGradient: 'linear-gradient(135deg, #ffb84d, #ff6bcb)',
    lyrics: [
      'Nhớ những chiều tan học ngắm hoàng hôn sân trường...',
      'Cơn gió hè thổi bay tà áo trắng tinh khôi.',
      'Lời hứa năm ấy cùng nhau bước vào cánh cổng trường đại học...',
      'Mãi mãi không quên ký ức thanh xuân Cẩm Bình!'
    ]
  }
];

export const INITIAL_GPA_GRADES: GpaGrade[] = [
  { subject: 'Toán học', midterm: 9.0, final: 9.2, weight: 2 },
  { subject: 'Ngữ văn', midterm: 8.5, final: 8.8, weight: 2 },
  { subject: 'Tiếng Anh', midterm: 9.5, final: 9.6, weight: 2 },
  { subject: 'Vật lý', midterm: 8.8, final: 9.0, weight: 1 },
  { subject: 'Hóa học', midterm: 8.5, final: 8.7, weight: 1 },
  { subject: 'Sinh học', midterm: 8.6, final: 8.8, weight: 1 },
  { subject: 'Lịch sử', midterm: 9.0, final: 9.2, weight: 1 },
  { subject: 'Địa lý', midterm: 8.9, final: 9.0, weight: 1 },
  { subject: 'Tin học', midterm: 10.0, final: 10.0, weight: 1 }
];

export const INITIAL_STUDENT_ID: StudentIDInfo = {
  fullName: 'VŨ MINH KHANG',
  studentCode: 'CB-2024-12A1-042',
  className: '12A1 (Ban Tự Nhiên)',
  academicYear: '2024 - 2027',
  birthday: '15/08/2009',
  unionMember: true,
  status: 'Đang theo học',
  conductScore: 98,
  gpa: 9.05
};

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc_1',
    name: 'Dãy Nhà A (3 Tầng)',
    desc: 'Khu vực lớp học Khối 12 & Văn phòng Ban Giám hiệu',
    icon: '🏛️',
    imageUrl: '/images/campus/day-nha-a.svg',
    coords: 'Tầng 1-3, Hướng Đông',
    status: 'Đang diễn ra tiết học'
  },
  {
    id: 'loc_2',
    name: 'Dãy Nhà B (3 Tầng)',
    desc: 'Khu vực lớp học Khối 10 & Khối 11',
    icon: '🏢',
    imageUrl: '/images/campus/day-nha-b.svg',
    coords: 'Tầng 1-3, Hướng Tây',
    status: 'Đang diễn ra tiết học'
  },
  {
    id: 'loc_3',
    name: 'Thư Viện & Phòng Tin Học',
    desc: 'Tủ sách ôn thi THPT Quốc Gia, 40 máy vi tính kết nối mạng',
    icon: '📚',
    imageUrl: '/images/campus/map-overview.svg',
    coords: 'Tòa nhà Thư viện trung tâm',
    status: 'Mở cửa: 07:00 - 17:30'
  },
  {
    id: 'loc_4',
    name: 'Nhà Đa Năng & Sân Bóng Đá',
    desc: 'Sân bóng cỏ nhân tạo, sân bóng rổ, cầu lông',
    icon: '⚽',
    imageUrl: '/images/campus/san-bong.svg',
    coords: 'Khu thể chất phía sau trường',
    status: 'Sẵn sàng giao lưu thể thao'
  },
  {
    id: 'loc_5',
    name: 'Căng-tin Trường Cẩm Bình',
    desc: 'Điểm tâm sáng, nước giải khát, đồ dùng học tập',
    icon: '🧋',
    imageUrl: '/images/campus/cang-tin.svg',
    coords: 'Cạnh nhà gửi xe học sinh',
    status: 'Đang phục vụ đồ ăn nóng giòn'
  },
  {
    id: 'loc_6',
    name: 'Cổng Trường THPT Cẩm Bình',
    desc: 'Cổng chính đón trả học sinh, phòng bác bảo vệ trực 24/7',
    icon: '⛩️',
    imageUrl: '/images/campus/cong-truong.svg',
    coords: 'Mặt đường Quốc Lộ, Cẩm Xuyên',
    status: 'Điểm danh thẻ số CẩmID'
  }
];
