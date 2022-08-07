import { useState, useEffect, useRef, useContext } from "react";
import LastseenContext from "../Lastseen";
import { Input, Button } from "@chakra-ui/react";
import style from "./style.module.css";
function Navbar({ user, setUser, color, setColor }) {
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }
    //her sayfa yenilendiğinde lastSeen context'i değerini kaybedecek, bu nedenle değerini kaybettiği zaman localStorage'ı sıfırlamasını önledim.
    if (lastSeen.length !== 0) {
      localStorage.setItem("lastseen", JSON.stringify(lastSeen));
    }
    setColor("#6a6dcd");
  }, []);

  const username = useRef();
  const handleSubmit = () => {
    if (username.current.value !== "") {
      setUser(username.current.value);
      localStorage.setItem("user", username.current.value);
    }
  };
  const Logout = () => {
    setUser("");
    localStorage.removeItem("user");
    setLastseen("");
    localStorage.removeItem("lastseen");
  };

  const { lastSeen, setLastseen } = useContext(LastseenContext);
  return (
    <div className={style.main}>
      <div className={style.left}>
        <div className={style.logo}>Kanban Board</div>
      </div>
      <div className={style.right}>
        {" "}
        <div className={style.Welcome}>
          {!user && (
            <div className={style.InputArea}>
              <form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  placeholder="Username"
                  ref={username}
                  isRequired
                  color="white"
                />
                <br />
              </form>
              <Button onClick={handleSubmit} colorScheme="blue" ml={3}>
                Login
              </Button>
            </div>
          )}
          {user && (
            <div className={style.InputArea}>
              <div className={style.Inputs}>
                <div className={style.InputHeader}>Welcome {user},</div>
                <Button
                  type="submit"
                  onClick={() => Logout()}
                  colorScheme="blue"
                  style={{
                    margin: "10px",
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
