interface WaveDividerProps {
  /** Background color of the section above the wave. */
  background: string;
  /** SVG path for the wave shape. */
  d: string;
  /** Fill color of the section below the wave. */
  fill: string;
  /** Optional solid strip at the bottom edge to avoid sub-pixel seams. */
  seam?: { y: number; height: number };
}

/** Decorative wave transition between two adjacent landing sections. */
const WaveDivider = ({ background, d, fill, seam }: WaveDividerProps) => (
  <div className="wave" style={{ background, lineHeight: 0 }} aria-hidden="true">
    <svg
      viewBox="0 0 1440 55"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "55px" }}>
      <path d={d} fill={fill} />
      {seam && <rect x="0" y={seam.y} width="1440" height={seam.height} fill={fill} />}
    </svg>
  </div>
);

export default WaveDivider;
