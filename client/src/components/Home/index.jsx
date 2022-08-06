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
import Navbar from "../Navbar/Navbar";
function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const { isLoading, isError, data } = useQuery("allkanbans", FetchAllKanbans);
  const [user, setUser] = useState("");
  const queryClient = useQueryClient();
  const { lastSeen, setLastseen } = useContext(LastseenContext);

  //kullanıcı çıkış işlemi

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
    setColor("#6a6dcd");
  };
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className={style.main} style={{ background: "black" }}>
      <Navbar user={user} setUser={setUser} color={color} setColor={setColor} />
      {!user && (
        <div className={style.reception}>
          {" "}
          kanban board app{" "}
          <div className={style.subreception}> made by Akif Kömürcü </div>
        </div>
      )}
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

      <div className={style.lastSaw}>
        {user && lastSeen.length !== 0 && <div> Last seen</div>}
        {user && JSON.parse(localStorage.getItem("lastseen")) && (
          <div className={style.itemsArea}>
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
        )}
      </div>

      <div className={style.rightside}>
        {user && (
          <div className={style.heading}>
            My Kanbans
            <AddIcon
              onClick={onOpen}
              cursor="pointer"
              className={style.AddIcon}
              ml={4}
            />
          </div>
        )}
      </div>
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
  );
}

export default Home;
