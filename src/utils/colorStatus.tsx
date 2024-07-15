export function colorStatus(status: number) {
    switch (status) {
        case 1:
            return '#616161'; // Mới
        case 2:
            return '#2196F3'; // Quản lý duyệt
        case 3:
            return '#FF9800'; // Kế toán duyệt
        case 4:
            return '#166973'; // Hành chính duyệt
        case 5:
            return '#4CAF50'; // Hoàn thành
        case 6:
            return '#F44336'; // Không duyệt
        default:
            return 'gray';
    }
}