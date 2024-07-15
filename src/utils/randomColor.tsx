export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
export function generateContrastingColors(num: number) {
    const colors = [];
    const hueIncrement = 360 / num;

    for (let i = 0; i < num; i++) {
        const hue = (i * hueIncrement) % 360;
        colors.push(`hsl(${hue}, 60%, 50%)`); // 70% Saturation, 50% Lightness for good contrast
    }

    return colors;
};