import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { postRequest } from "../services/apiRequests";


interface Location {
  place_id: string;
  display_name: string;
}


const CreateRidePost = () => {
  const [toQuery, setToQuery] = useState("");
  const [fromQuery, setFromQuery] = useState("");
  const [fare, setFare] = useState("");
  const [note, setNote] = useState("");
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string| null>(null);

  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }

  const fetchLocations = async (query:string, setSuggestions:any) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => fetchLocations(toQuery, setToSuggestions), 300);
    return () => clearTimeout(debounce);
  }, [toQuery]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchLocations(fromQuery, setFromSuggestions), 300);
    return () => clearTimeout(debounce);
  }, [fromQuery]);

  const handlePostClick = async (e:any) => {
    e.preventDefault();
    const postData = {
      pickLocation: fromQuery,
      dropLocation: toQuery,
      cost:fare,
      caption:note,
      poster: auth.user?.id,
    };
    const res = await postRequest(postData, "/rides/send-request", auth.accessToken, setLoading, setError);

    if (res) {
      window.location.assign("/");
    }

   
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 text-white shadow-xl rounded-2xl border border-gray-700">
      {/* <Map></Map> */}
      <h3 className="text-2xl font-bold text-center">Create Ride Post</h3>
      <form className="space-y-5 mt-6" onSubmit={handlePostClick}>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter destination..."
            value={toQuery}
            onChange={(e) => setToQuery(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {toSuggestions.length > 0 && (
            <ul className="absolute w-full bg-gray-800 border border-gray-600 shadow-md mt-1 rounded-md z-20 text-white">
              {toSuggestions.map((place:Location) => (
                <li
                  key={place.place_id}
                  className="p-3 cursor-pointer hover:bg-gray-700"
                  onClick={() => {
                    setToQuery(place.display_name);
                    setToSuggestions([]);
                  }}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Enter pickup location..."
            value={fromQuery}
            onChange={(e) => setFromQuery(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {fromSuggestions.length > 0 && (
            <ul className="absolute w-full bg-gray-800 border border-gray-600 shadow-md mt-1 rounded-md z-20 text-white">
              {fromSuggestions.map((place:Location) => (
                <li
                  key={place.place_id}
                  className="p-3 cursor-pointer hover:bg-gray-700"
                  onClick={() => {
                    setFromQuery(place.display_name);
                    setFromSuggestions([]);
                  }}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="number"
          placeholder="Fare in Rs..."
          min={0}
          value={fare}
          onChange={(e) => setFare(e.target.value)}
          className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="text"
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-4 rounded-lg font-semibold hover:bg-green-600 transition duration-300 text-lg"
        >
          Post Ride
        </button>
      </form>
    </div>
  );
};

export default CreateRidePost;
