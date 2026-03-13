import { HugeiconsIcon } from "@hugeicons/react";
import { RestaurantIcon } from "@hugeicons/core-free-icons";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-row items-center justify-between w-full">
      <div className="flex items-center gap-2 px-4 py-2 text-primary">
        <HugeiconsIcon icon={RestaurantIcon} strokeWidth={2} className="lg:size-8 size-6" />
        <h1 className="text-lg lg:text-2xl font-bold">Restaurant Finder</h1>
      </div>
      <p className="text-xs lg:text-sm text-muted-foreground px-4 py-2">Find any restaurant you want</p>
    </header>
  );
}
