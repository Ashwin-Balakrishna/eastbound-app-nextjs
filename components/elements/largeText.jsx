import { useState } from "react";

const LongText = ({ limit, className, children }) => {
  const [showAll, setShowAll] = useState(false);

  if (children.length <= limit) {
    return <div className={className}>{children}</div>;
  }
  if (showAll) {
    return (
      <div className={className}>
        {children}
        <a onClick={() => setShowAll(false)}>Read less</a>
      </div>
    );
  }
  const toShow = children.substring(0, limit) + "...";
  return (
    <div className={className}>
      {toShow}
      <a onClick={() => setShowAll(true)}>Read more</a>
    </div>
  );
};

export default LongText;
