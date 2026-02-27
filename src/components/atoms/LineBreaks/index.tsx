interface LineBreaksProps {
  count?: number;
}

export const LineBreaks = ({ count = 1 }: LineBreaksProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <br key={idx} />
      ))}
    </>
  );
};
