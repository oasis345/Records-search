import { Skeleton as ShadcnSkeleton } from '@/components/ui/skeleton';

export function Skeleton({ classes, children }: { classes: string; children?: React.ReactNode }) {
  return <ShadcnSkeleton className={classes}>{children}</ShadcnSkeleton>;
}
