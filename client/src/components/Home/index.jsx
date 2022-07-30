import style from "./style.module.css";
import { useQuery } from "react-query";
import { FetchAllKanbans } from "../../api";
import { Link } from "react-router-dom";

function Home() {
  const { isLoading, isError, data } = useQuery("allkanbans", FetchAllKanbans);

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className={style.main}>
      <div className={style.board}>
        <div className={style.list}>
          {data.map((kanban, index) => (
            <Link key={index} to={`/content/${kanban.id}`}>
              <div className={style.card}>{kanban.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
