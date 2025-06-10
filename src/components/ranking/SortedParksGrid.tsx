import type { Park } from "../../data/parks";

interface SortedParksGridProps {
  parks: Park[];
}

export const SortedParksGrid = ({ parks }: SortedParksGridProps) => {
  return (
    <div
      className="sorted-parks-grid"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "20px",
        maxHeight: "200px",
        overflowY: "auto",
      }}
    >
      {parks.map((park, index) => (
        <div
          key={park.name}
          className="mini-park-card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            minWidth: "80px",
            fontSize: "12px",
          }}
        >
          <img
            src={park.imageUrl}
            alt={park.name}
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "4px",
              marginBottom: "4px",
            }}
          />
          <span style={{ textAlign: "center", lineHeight: "1.2" }}>
            #{index + 1} {park.name}
          </span>
        </div>
      ))}
    </div>
  );
};
