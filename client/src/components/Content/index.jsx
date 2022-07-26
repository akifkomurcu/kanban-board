import React from "react";
import { useEffect, useState } from "react";
import "./style.css";
function Content() {
  const [response, setResponse] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:4000/kanbans`)
      .then((res) => res.json())
      .then((data) => {
        setResponse(data[0].daily[0]);
      });
  }, []);
  console.log(response);
  return (
    <div className="main">
      <div className="board">
        <div className="kanbanTitle">Kanban Board</div>
        <div className="list">
          {response.length !== 0 && (
            <>
              <div className="backlog">
                <div className="heading">Backlog</div>
                <div className="card">
                  <div className="cardContent">
                    <div className="title">{response.backlog.title}</div>
                    <div className="content">{response.backlog.content}</div>
                  </div>
                </div>
              </div>

              <div className="todo">
                <div className="heading">To do</div>
                <div className="card">
                  <div className="cardContent">
                    <div className="title">Twilio Intergarion</div>
                    <div className="content">
                      go to shopping and buy some coffee
                    </div>
                  </div>
                </div>
              </div>

              <div className="inprogress">
                <div className="heading">In progress</div>
                <div className="card">
                  <div className="cardContent">
                    <div className="title">Twilio Intergarion</div>
                    <div className="content">
                      go to shopping and buy some coffee
                    </div>
                  </div>
                </div>
              </div>

              <div className="done">
                <div className="heading">Done</div>
                <div className="card">
                  <div className="cardContent">
                    <div className="title">Twilio Intergarion</div>
                    <div className="content">
                      go to shopping and buy some coffee
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Content;
