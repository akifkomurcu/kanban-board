import { useState, useEffect, useRef } from "react";
import style from "./style.module.css";
import { useQuery, useQueryClient } from "react-query";
import { FetchAllKanbans, AddKanban, DeleteKanban } from "../../api";
import { Link } from "react-router-dom";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import "antd/dist/antd.min.css";
import { Popconfirm } from "antd";
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
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }
  }, []);
  const handleSubmit = () => {
    if (username.current.value !== "") {
      setUser(username.current.value);
      localStorage.setItem("user", username.current.value);
    }
  };
  const Logout = () => {
    setUser("");
    localStorage.removeItem("user");
  };
  const DeleteKanbanBoard = async (id) => {
    await DeleteKanban(id);
    queryClient.invalidateQueries("allkanbans");
  };
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
    setColor("");
  };

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className={style.main}>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent background="#262626" color="white ">
          <ModalHeader>Add a new Kanban</ModalHeader>
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
          {data.map(
            (kanban, index) =>
              kanban.user === user && (
                <>
                  <div key={index}>
                    Last seen
                    <Link to={`/content/${kanban.id}`}>
                      <div
                        className={style.items}
                        key={kanban.id}
                        style={{ background: kanban.color }}
                      >
                        <div>
                          {kanban.name}
                          <br />
                        </div>
                      </div>
                    </Link>
                  </div>
                </>
              )
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
                <div style={{ fontSize: "50px", color: "white" }}>
                  Welcome {user},
                </div>
                <Button
                  type="submit"
                  onClick={() => Logout()}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
          <div
            className={style.heading}
            style={{
              fontSize: "50px",
              display: "flex",
              alignItems: "center",
              width: "315px",
              justifyContent: "space-between",
            }}
          >
            My Kanbans
            <AddIcon w={6} h={6} onClick={onOpen} cursor="pointer" />
          </div>
        )}
        {data.map(
          (kanban, index) =>
            kanban.user === user && (
              <>
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
                      <CloseIcon cursor="pointer" w={3} h={3} />
                    </Popconfirm>
                  </div>
                </div>
              </>
            )
        )}
      </div>
    </div>
  );
}

export default Home;
