import { useState } from "react";
import { useRouter } from "next/navigation";

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery) {
      setError("Please enter a username.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      router.push(`/search?username=${searchQuery}`);
    } catch (error) {
      console.log(error);
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full md:w-1/3 mt-4 md:mt-0 mr-96"
    >
      <input
        type="text"
        placeholder="Search Users"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      />
      <button
        type="submit"
        className={`ml-2 px-4 py-2 bg-white text-black rounded-md border border-black hover:bg-black hover:text-white hover:border-black hover:border ${
          loading ? "opacity-50" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Search;
