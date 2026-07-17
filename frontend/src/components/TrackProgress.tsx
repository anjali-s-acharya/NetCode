export function TrackProgress({
  items,
  isSolved,
}: {
  items: { id: string; track: string }[];
  isSolved: (id: string) => boolean;
}) {
  const tracks = [...new Set(items.map((c) => c.track))];

  return (
    <div className="track-progress-row">
      {tracks.map((track) => {
        const inTrack = items.filter((c) => c.track === track);
        const solved = inTrack.filter((c) => isSolved(c.id)).length;
        const pct = Math.round((solved / inTrack.length) * 100);
        return (
          <div key={track} className="track-progress">
            <span className="track-progress-label">
              {track} {solved}/{inTrack.length}
            </span>
            <div className="level-bar">
              <div className="level-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
