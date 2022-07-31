import style from "./style.module.css";
import Section from "../Section";
import { Link } from "react-router-dom";

function Content() {
  return (
    <div className={style.main}>
      <div className={style.board}>
        <div className={style.kanbanTitle}>
          <Link to="/">Kanban Board</Link>
        </div>
        <div className={style.list}>
          <Section />
        </div>
      </div>
    </div>
  );
}

export default Content;
