import { findRestaurants } from "@/features/restaurant-finder/apis/restaurant-finder";

export default async function Home() {
  const restaurants = await findRestaurants("Find me a restaurant in New York");

  return (
    <div>
      <h1>Restaurants</h1>
      <ul>
        {restaurants.results.map((restaurant) => (
          <li key={restaurant.name}>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.location?.formatted_address}</p>
            <p>{restaurant.tel}</p>
            <p>{restaurant.email}</p>
            <p>{restaurant.website}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
