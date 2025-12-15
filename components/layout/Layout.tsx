import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`
        w-full
        max-w-[402px]
        px-4
        mx-auto
        sm:max-w-[640px] lg:max-w-[768px] xl:max-w-[1024px]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
