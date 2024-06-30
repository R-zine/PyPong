export const Ball = ({ x, y, r }: { x: number; y: number; r: number }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        width: r,
        height: r,
        background: "white",
        borderRadius: "50%",
      }}
    />
  );
};
