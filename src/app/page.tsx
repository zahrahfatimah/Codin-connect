"use client";

import NavbarComponent from "@/components/homeComponents/Navbar";
import FollowedChallengeCard from "@/components/homeComponents/FollowedChallengeCard";

const Home: React.FC = () => {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-0">
        <NavbarComponent />
        <FollowedChallengeCard />
        {/* <Hero /> */}
      </div>
    </div>
  );
};

export default Home;
