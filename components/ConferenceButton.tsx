import { Button } from "@chakra-ui/react";

type ConferenceButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export default function ConferenceButton({
  label,
  active,
  onClick,
}: ConferenceButtonProps) {
  return <Button onClick={onClick}>{label}</Button>;
}
