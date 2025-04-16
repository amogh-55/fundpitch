import NotFound from "../not-found";

const TimelineContent = ({ id }: { id: string }) => {
  if (!id) return <NotFound />;
  return <div>Timeline Content</div>;
};

export default TimelineContent;
