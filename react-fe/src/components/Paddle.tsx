export const Paddle = ({
  left,
  height,
  width,
  y,
  name,
}: {
  left: number;
  height: number;
  width: number;
  y: number;
  name: string;
}) => {
  return (
    <div
      data-name={name}
      style={{
        position: "absolute",
        top: y,
        left,
        background: "lightgray",
        height,
        width,
      }}
    />
  );
};
