import { cn } from "@/lib/cn";

export const H1 = ({ className, children, ...props }) => {
  return (
    <h1
      className={cn(
        "text-[20px] font-bold text-sky-950",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export const H2 = ({ className, children, ...props }) => {
  return (
    <h1
      className={cn(
        "text-[36px] font-bold",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export const H3 = ({ className, children, ...props }) => {
  return (
    <h1
      className={cn(
        "text-[28px] font-bold",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export const H4 = ({ className, children, ...props }) => {
  return (
    <h1
      className={cn(
        "text-[24px] font-bold ",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export const H5 = ({ className, children, ...props }) => {
  return (
    <h1
      className={cn(
        "text-[20px] font-bold ",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export const H6 = ({ className, children, ...props }) => {
  return (
    <h1
      className={cn(
        "text-[16px] font-bold ",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export const P = ({ className, children, ...props }) => {
  return (
    <p
      className={cn(
        "text-[16px] font-medium",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}