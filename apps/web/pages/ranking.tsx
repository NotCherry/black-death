import { ReactChild, useEffect, useState } from "react";

import Image from "next/image";
import Navbar from "../components/Navbar";
import RankingRow from "../components/RankingRow";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetch("/api/dethbringers")
      .then((res) => res.json())
      .then((data) => setRanking(data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col mt-10 items-center">
        <h1 className="text-5xl text-white font-bold m-10">
          THE MOST ACTIVE USERS
        </h1>

        {ranking.map((killer, i) => (
          <RankingRow killer={killer} key={i} />
        ))}
      </div>
    </>
  );
}
