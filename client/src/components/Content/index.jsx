import style from "./style.module.css";
import { useQuery } from "react-query";
import { FetchKanbanID } from "../../api";
import Section from "../Section";
import { useParams, Link } from "react-router-dom";
import { useKanban } from "../Context/KanbanContext";

function Content() {
  const { id } = useParams();

  const { isLoading, isError, data } = useQuery(["kanbanID", id], () =>
    FetchKanbanID(id)
  );

  const { Kanbans, setKanbans } = useKanban();

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className={style.main}>
      <div className={style.board}>
        <div className={style.kanbanTitle}>
          <Link to="/">Kanban Board</Link>
        </div>
        <div className={style.list}>
          <Section data={data} />
        </div>
      </div>
    </div>
  );
}

export default Content;
