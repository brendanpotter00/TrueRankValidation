import type { Park } from "../../data/parks";

interface ParkComparisonProps {
  firstPark: Park;
  secondPark: Park;
  comparisonId: number;
  onChooseFirst: () => void;
  onChooseSecond: () => void;
}

export const ParkComparison = ({
  firstPark,
  secondPark,
  comparisonId,
  onChooseFirst,
  onChooseSecond,
}: ParkComparisonProps) => {
  return (
    <div className="park-comparison">
      <button
        key={`${firstPark.name}-${comparisonId}`}
        className="park-choice"
        onClick={onChooseFirst}
      >
        <img
          src={firstPark.imageUrl}
          alt={`${firstPark.name} poster`}
          className="park-image"
        />
        <span className="park-title">{firstPark.name}</span>
      </button>
      <span className="vs">VS</span>
      <button
        key={`${secondPark.name}-${comparisonId}`}
        className="park-choice"
        onClick={onChooseSecond}
      >
        <img
          src={secondPark.imageUrl}
          alt={`${secondPark.name} poster`}
          className="park-image"
        />
        <span className="park-title">{secondPark.name}</span>
      </button>
    </div>
  );
};
