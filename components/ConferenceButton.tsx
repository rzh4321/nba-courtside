import { Button } from "./ui/button";
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
  return (
    <Button
      className="px-4 py-2 font-semibold bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
