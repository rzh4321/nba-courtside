import useIntersectionObserver from "@/hooks/useIntersectionObserver";

type TeamStatisticProps = {
  label: string;
  leftLabel: string;
  rightLabel: string;
  leftColor: string;
  rightColor: string;
};

function extractPercentage(str: string) {
  // Use a regular expression to match the number inside parentheses
  const match = str.match(/\((\d+)%\)/);
  // extract the number and convert it to an integer
  try {
    return parseInt(match![1], 10);
  } catch {
    return 0;
  }
}

export default function TeamStatistic({
  label,
  leftLabel,
  rightLabel,
  leftColor,
  rightColor,
}: TeamStatisticProps) {
  let leftInt, rightInt;
  if (
    label === "Field Goals" ||
    label === "3 Pointers" ||
    label === "Free Throws"
  ) {
    leftInt = extractPercentage(leftLabel);
    rightInt = extractPercentage(rightLabel);
  } else {
    leftInt = parseInt(leftLabel);
    rightInt = parseInt(rightLabel);
  }
  const [ref, isVisible] = useIntersectionObserver();

  const getWidth = (width: string) => {
    if (!isVisible) return "50%";
    return width;
  };

  const total = leftInt + rightInt;

  const leftWidth = total === 0 ? "50%" : `${(leftInt / total) * 100}%`;
  const rightWidth = total === 0 ? "50%" : `${(rightInt / total) * 100}%`;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex w-full justify-between">
        <span>{leftLabel}</span>
        <span>{label}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="bar-container" ref={ref}>
        <div
          className="left-bar"
          style={{ width: getWidth(leftWidth), backgroundColor: leftColor }}
        />
        <div
          className="right-bar"
          style={{ width: getWidth(rightWidth), backgroundColor: rightColor }}
        />
      </div>
    </div>
  );
}
