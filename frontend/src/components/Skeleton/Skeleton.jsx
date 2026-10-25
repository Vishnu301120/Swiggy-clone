import "./Skeleton.css";

function Skeleton() {
  return (
    <div className="skeletonGrid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="skeletonCard" key={index}>
          <div className="skeletonImage"></div>
          <div className="skeletonLine title"></div>
          <div className="skeletonLine"></div>
          <div className="skeletonLine short"></div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;