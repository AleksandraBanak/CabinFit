export default function ColorCircle({ color }) {
  const colorMap = {
    black: "#000000",
    gray: "#b0b0b0",
    grey: "#b0b0b0",
    blue: "#2f6fed",
    red: "#d32f2f",
    green: "#2e7d32",
    white: "#ffffff",
    navy: "#1b2a49",
    beige: "#e8dcca",
  };

  const normalized = color?.toLowerCase();
  const bgColor = colorMap[normalized] || normalized;

  return (
    <span
      title={color}
      style={{
        width: 15,
        height: 15,
        borderRadius: "50%",
        backgroundColor: bgColor,
        border: "1px solid #ccc",
        display: "inline-block",
        boxShadow: "0 0 3px rgb(0, 0, 0)",
      }}
    />
  );
}
