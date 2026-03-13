import Header from "@/components/layouts/header";
import RestaurantFinder from "@/features/restaurant-finder/components/restaurant-finder";
export default function Home() {

  return (
    <div className="flex flex-col items-center px-4">
      <Header />
      <RestaurantFinder />
    </div>
  );
}