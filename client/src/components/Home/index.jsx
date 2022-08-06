import { useState, useEffect, useRef, useContext } from "react";
import style from "./style.module.css";
import { useQuery, useQueryClient } from "react-query";
import { FetchAllKanbans, AddKanban, DeleteKanban } from "../../api";
import { Link } from "react-router-dom";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import "antd/dist/antd.min.css";
import { Popconfirm } from "antd";
import LastseenContext from "../Lastseen";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Box,
  Button,
} from "@chakra-ui/react";
function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const { isLoading, isError, data } = useQuery("allkanbans", FetchAllKanbans);
  const username = useRef();
  const queryClient = useQueryClient();
  const { lastSeen, setLastseen } = useContext(LastseenContext);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }
    //her sayfa yenilendiğinde lastSeen context'i değerini kaybedecek bu nedenle değerini kaybettiği zaman localStorage'ı sıfırlamasını önledim
    if (lastSeen.length !== 0) {
      localStorage.setItem("lastseen", JSON.stringify(lastSeen));
    }
    setColor("#6a6dcd");
  }, []);

  const handleSubmit = () => {
    if (username.current.value !== "") {
      setUser(username.current.value);
      localStorage.setItem("user", username.current.value);
    }
  };
  //kullanıcı çıkış işlemi
  const Logout = () => {
    setUser("");
    localStorage.removeItem("user");
    setLastseen("");
    localStorage.removeItem("lastseen");
  };
  const DeleteKanbanBoard = async (id) => {
    await DeleteKanban(id);
    queryClient.invalidateQueries("allkanbans");
  };
  console.log(lastSeen);
  const NewKanban = async () => {
    const values = {
      name: name,
      user: user,
      color: color,
      cards: [],
    };
    if (name !== "") {
      await AddKanban(values);
      queryClient.invalidateQueries("allkanbans");
    }
    onClose();
    setName("");
    setColor("#6a6dcd");
  };
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div
      className={style.main}
      style={!user ? { height: "100vh", width: "100%" } : { height: "100vh" }}
    >
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent background="#262626" color="white ">
          <ModalHeader>Add a new Kanban Board</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              mb={3}
              placeholder="Kanban name"
              onChange={(e) => setName(e.target.value)}
            />
            <Box>
              <Input
                type="color"
                className="colorpicker"
                border="none"
                mt={2}
                value={color}
                width="80px"
                padding={0}
                onChange={(e) => setColor(e.target.value)}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button color="black" onClick={() => NewKanban()}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className={style.leftside}>
        <div className={style.lastSaw}>
          {user && JSON.parse(localStorage.getItem("lastseen")) && (
            <div className={style.itemsArea}>
              <div> Last seen</div>
              <div className={style.ItemsSection}>
                {JSON.parse(localStorage.getItem("lastseen")).map(
                  (lastseen, index) => (
                    <Link to={`/content/${lastseen.id}`} key={index}>
                      <div
                        className={style.items}
                        style={{
                          background: lastseen.color,
                        }}
                      >
                        <div>
                          {lastseen.name}
                          <br />
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </div>
        <div className={style.Welcome}>
          {!user && (
            <div className={style.InputArea}>
              <div className={style.Inputs}>
                <h1
                  style={{
                    color: "white",
                    fontSize: "50px",
                    marginBottom: "5px",
                  }}
                >
                  Login
                </h1>
                <form onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    placeholder="Username"
                    ref={username}
                    isRequired
                  />
                  <br />
                  <Button onClick={handleSubmit}>Login</Button>
                </form>
              </div>
            </div>
          )}
          {user && (
            <div className={style.InputArea}>
              <div className={style.Inputs}>
                <div className={style.InputHeader}>Welcome {user},</div>
                <Button
                  type="submit"
                  onClick={() => Logout()}
                  style={{
                    margin: "10px",
                    // display: "flex",
                    // justifyContent: "center",
                    // alignItems: "center",
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={style.rightside}>
        {user && (
          <div className={style.heading}>
            My Kanbans
            <AddIcon
              onClick={onOpen}
              cursor="pointer"
              className={style.AddIcon}
            />
          </div>
        )}
        <div className={style.Kanbans}>
          {data.map(
            (kanban, index) =>
              kanban.user === user && (
                <div key={index} className={style.MyKanbans}>
                  <div
                    className={style.card}
                    style={
                      kanban.color
                        ? { background: kanban.color }
                        : { background: color }
                    }
                  >
                    <Link to={`/content/${kanban.id}`}>{kanban.name} </Link>
                    <Popconfirm
                      width="200px"
                      title="Are you sure want to delete this Kanban?"
                      // silme işlemi için confirm dialog'ını açıyorum
                      onConfirm={() => DeleteKanbanBoard(kanban.id)}
                    >
                      <CloseIcon
                        cursor="pointer"
                        w={3}
                        h={3}
                        className={style.CloseIcon}
                      />
                    </Popconfirm>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
