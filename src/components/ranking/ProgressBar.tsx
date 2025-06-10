import * as Progress from "@radix-ui/react-progress";

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <div className="progress-section">
      <Progress.Root className="progress-root" value={percentage}>
        <Progress.Indicator
          className="progress-indicator"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </Progress.Root>
    </div>
  );
};
