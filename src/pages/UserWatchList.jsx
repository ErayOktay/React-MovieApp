import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import WatchList from "../components/WatchList";

function UserWatchList() {
  const { watchList, removeFromWatchList } = useContext(UserContext);

  return (
    <WatchList
      movies={watchList}
      title="İzlenecek Filmler"
      removeFromWatchList={removeFromWatchList}
    />
  );
}

export default UserWatchList;
