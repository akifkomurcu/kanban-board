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
      <div className={style.leftside}>
        <div className={style.lastSaw}>
          <h2>Last seen</h2>
          <ul>
            {data.map((kanban) => (
              <li key={kanban.id}>
                <Link to={`/content/${kanban.id}`}>{kanban.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={style.rightside}>
        <h2>My Kanbans</h2>
        {data.map((kanban, index) => (
          <Link key={index} to={`/content/${kanban.id}`}>
            <div className={style.card}>{kanban.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
