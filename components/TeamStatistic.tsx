import { VStack, HStack, Text, Box } from "@chakra-ui/react";
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
  return parseInt(match![1], 10);
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
    if (!isVisible) return '50%';
    return width;
  };

  const total = leftInt + rightInt;
  const leftWidth = total === 0 ? '50%' : `${(leftInt / total) * 100}%`;
  const rightWidth = total === 0 ? '50%' :`${(rightInt / total) * 100}%`;

  return (
    <VStack gap={2} w={"full"}>
      <HStack w={"full"} justifyContent={"space-between"}>
        <Text>{leftLabel}</Text>
        <Text>{label}</Text>
        <Text>{rightLabel}</Text>
      </HStack>
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
    </VStack>
  );
}
