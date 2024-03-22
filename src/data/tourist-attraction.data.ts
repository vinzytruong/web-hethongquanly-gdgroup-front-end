import type { Sites } from '@/interfaces/site'

// export const data: Array<Sites> = [
//   // {
//   //   id: 2,
//   //   photo: '/images/noi-bat/chua-ta-ot-2.jpg',
//   //   name: 'Chùa Salavana (Tà Ốt)',
//   //   category: 'di-tich-lich-su-cap-tinh',
//   //   address: 'Ấp Xóm Lớn, xã Châu Điền',
//   //   description:
//   //     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   //   isPopular: true,
//   //   detail: ''
//   //   , idDoc: ''
//   // },
//   // {
//   //   id: 3,
//   //   photo: '/images/no-data.png',
//   //   name: 'Thánh Tịnh Thanh Long Tràng Võ ',
//   //   category: 'di-tich-lich-su-cap-tinh',
//   //   address: 'Ấp Ngãi Nhì, xã Tam Ngãi',
//   //   description:
//   //     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   //   isPopular: true,
//   //   detail: ''
//   //   , idDoc: ''
//   // },
//   // {
//   //   id: 4,
//   //   photo: '/images/no-data.png',
//   //   name: 'Miếu Bà Chúa Xứ',
//   //   category: 'di-tich-lich-su-cap-tinh',
//   //   address: 'Ấp Tân Quy 1, xã An Phú Tân',
//   //   description:
//   //     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   //   isPopular: true,
//   //   detail: ''
//   //   , idDoc: ''
//   // },
//   // {
//   //   id: 5,
//   //   photo: '/images/no-data-1.png',
//   //   name: 'Nhà hàng Ẩm thực Điểm hẹn',
//   //   category: 'dia-diem-du-lich',
//   //   address: 'Ấp Tân Qui 1, xã An Phú Tân',
//   //   description:
//   //     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   //   isPopular: false,
//   //   detail: ''
//   //   , idDoc: ''
//   // },
//   // {
//   //   id: 6,
//   //   photo: '/images/no-data.png',
//   //   name: 'Thanh Trà quán',
//   //   category: 'dia-diem-du-lich',
//   //   address: 'Ấp Tân Qui 1, xã An Phú Tân',
//   //   description:
//   //     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   //   isPopular: false,
//   //   detail: ''
//   //   , idDoc: ''
//   // },
//   // {
//   //   id: 7,
//   //   photo: '/images/no-data.png',
//   //   name: 'Nhà hàng ẩm thực Vườn nhãn tím',
//   //   category: 'dia-diem-du-lich',
//   //   address: 'Ấp An Lộc, xã Hòa Tân',
//   //   description:
//   //     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   //   isPopular: false,
//   //   detail: ''
//   //   , idDoc: ''
//   // },
//   // {
//   //   id: 8,
//   //   photo: '/images/no-data.png',
//   //   name: 'Homestay Sonsia',
//   //   category: 'dia-diem-du-lich',
//   //   address: 'Âp Bà My, xã Hòa Ân',
//   //   description:
//   //     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   //   isPopular: false,
//   //   detail: ''
//   //   , idDoc: ''
//   // },
//   {
//     id: 9,
//     photo: '/images/no-data.png',
//     name: 'Vườn Dừa sáp Ba Thúy',
//     category: 'dia-diem-du-lich',
//     address: 'Âp Chông Nô 3, xã Hòa Tân',
//     description:
//       'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//     isPopular: false,
//     detail: ''
//     , idDoc: ''
//   },
//   {
//     id: 10,
//     photo: '/images/no-data.png',
//     name: 'Nhà hàng ẩm thực Sông Hậu',
//     category: 'dia-diem-du-lich',
//     address: 'Ấp Dinh An, xã An Phú Tân',
//     description:
//       'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//     isPopular: false,
//     detail: ''
//     , idDoc: ''
//   },
//   {
//     id: 11,
//     photo: '/images/noi-bat/cu-lao-tan-quy-1.jpg',
//     name: 'Khu du lịch sinh thái Cù lao Tân Qui',
//     category: 'dia-diem-du-lich',
//     address: 'Xã An Phú Tân',
//     description:
//       'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//     isPopular: true,
//     detail: ''
//     , idDoc: ''
//   },
//   {
//     id: 12,
//     photo: '/images/no-data.png',
//     name: 'Hòa Tân Quán',
//     category: 'dia-diem-du-lich',
//     address: 'Ấp An Bình, xã Hòa Tân',
//     description:
//       'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//     isPopular: false,
//     detail: ''
//     , idDoc: ''
//   },
//   {
//     id: 13,
//     photo: '/images/no-data.png',
//     name: 'Công ty TNHH VICOSAP',
//     category: 'dia-diem-du-lich',
//     address: 'Công ty TNHH Chế biến Dừa sáp (VICOSAP)',
//     description:
//       'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//     isPopular: false,
//     detail: ''
//     , idDoc: ''
//   },
//   {
//     id: 14,
//     photo: '/images/no-data.png',
//     name: 'Khu du lịch Nam Sơn',
//     category: 'dia-diem-du-lich',
//     address: 'Ấp An Trại, xã An Phú Tân',
//     description:
//       'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//     isPopular: false,
//     detail: ''
//     , idDoc: ''
//   },
//   // {
//   //   id: 15,
//   //   photo: '/images/no-data.png',
//   //   name: 'Nhà cổ Huỳnh Kỳ',
//   //   category: 'di-tich-kien-truc-cap-tinh',
//   //   address: 'Khóm 2, Thị trấn Cầu Kè',
//   //   description:
//   //     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   //   isPopular: false,
//   //   detail: ''
//   //   , idDoc: ''
//   // },
//   // {
//   //   id: 16,
//   //   photo: '/images/di-tich-lich-su/khu-tuong-niem/khu-tuong-niem (9).jpg',
//   //   name: 'Khu tưởng niệm nữ Anh hùng Liệt sĩ Nguyễn Thị Út',
//   //   category: 'di-tich-lich-su',
//   //   address: 'Ấp Ngọc Hồ, xã Tam Ngãi',
//   //   description:
//   //     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   //   isPopular: false,
//   //   detail: ''
//   //   , idDoc: ''
//   // },
//   // {
//   //   id: 17,
//   //   photo: '/images/noi-bat/chua-o-mich-9.jpg',
//   //   name: 'Chùa Ô Mịch',
//   //   category: 'di-tich-lich-su-cap-tinh',
//   //   address: 'Ấp Ô Mịch, xã Châu Điền',
//   //   description:
//   //     'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   //   isPopular: true,
//   //   detail: ''
//   //   , idDoc: ''
//   // },

// ]
