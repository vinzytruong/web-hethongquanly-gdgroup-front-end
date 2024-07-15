export function formatCurrency(value: number) {
    // Chuyển đổi số thành chuỗi
    const stringValue = value?.toString();

    // Tách phần nguyên và phần thập phân
    const parts = stringValue?.split('.');
    const integerPart = parts && parts[0];
    const decimalPart = parts?.length > 1 ? '.' + parts[1] : '';

    // Định dạng phần nguyên với dấu phân cách hàng nghìn
    const formattedInteger = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    if(!value) return 0
    // Kết hợp phần nguyên và phần thập phân lại với nhau
    return formattedInteger + decimalPart + " VNĐ";
};
export function removeCommasAndDots (value: string) {
  return value.replace(/[,.]/g, '');
};
export function formatCurrencyNoUnit(value: number) {
  // Chuyển đổi số thành chuỗi
  const stringValue = value?.toString();

  // Tách phần nguyên và phần thập phân
  const parts = stringValue?.split('.');
  const integerPart = parts && parts[0];
  const decimalPart = parts?.length > 1 ? '.' + parts[1] : '';

  // Định dạng phần nguyên với dấu phân cách hàng nghìn
  const formattedInteger = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if(!value) return 0
  // Kết hợp phần nguyên và phần thập phân lại với nhau
  return formattedInteger + decimalPart;
};
export function formatNumber(number:number) {
    const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];
  
    // kiểm tra xem số có âm không
    const isNegative = number < 0;
    const absNumber = Math.abs(number);
  
    // tìm mũ của số
    const tier = Math.log10(absNumber) / 3 | 0;
  
    // nếu tier không thuộc danh sách kí hiệu (thường là 0, 1, 2, 3, ...)
    if (tier === 0) return number.toString();
  
    // tính giá trị sau khi được chia cho 1000^(tier)
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = absNumber / scale;
  
    // format giá trị sau khi được chia
    const formattedNumber = scaled.toFixed(1);
  
    // nếu số âm, thêm dấu trừ
    if (isNegative) {
      return "-" + formattedNumber + suffix;
    } else {
      return formattedNumber + suffix;
    }
  }