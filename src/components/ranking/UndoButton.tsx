import { ChevronLeftIcon } from "@radix-ui/react-icons";

interface UndoButtonProps {
  onUndo: () => void;
  disabled: boolean;
}

export const UndoButton = ({ onUndo, disabled }: UndoButtonProps) => {
  return (
    <div className="undo-section">
      <button
        onClick={onUndo}
        className="nav-button undo-button"
        disabled={disabled}
        title="Undo last choice"
      >
        <ChevronLeftIcon />
      </button>
    </div>
  );
};
