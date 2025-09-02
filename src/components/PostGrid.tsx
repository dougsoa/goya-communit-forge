import { ReactNode } from "react";

interface PostGridProps {
  children: ReactNode;
  className?: string;
}

const PostGrid = ({ children, className = "" }: PostGridProps) => {
  return (
    <div className={`grid gap-6 ${className}`}>
      {children}
    </div>
  );
};

export default PostGrid;