import { useState, useEffect, useContext } from "react";
import LastseenContext from "../Lastseen";
import style from "./style.module.css";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import { AddKanbanCard, FetchKanbanID } from "../../api";
import { useQuery, useQueryClient } from "react-query";
import "antd/dist/antd.min.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  Box,
} from "@chakra-ui/react";
import { Popconfirm } from "antd";
import { v4 as uuid } from "uuid";
function Section() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { isLoading, isError, data } = useQuery(["kanbanID", id], () =>
    FetchKanbanID(id)
  );
  const { lastSeen, setLastseen } = useContext(LastseenContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const NewID = uuid();
  const [title, setTitle] = useState("");
  const [dragging, setDragging] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#6a6dcd");
  const [parts] = useState(["Backlog", "To do", "Inprogress", "Done"]);
  const [section, setSection] = useState("");

  useEffect(() => {
    if (data) {
      lastSeen.find((item) =>
        item === data.id
          ? console.log("item eskiden vardı")
          : lastSeen.push(data.id)
      );
    }
  }, [data]);

  // yeni kart ekleme kodu başlangıç
  const HandleSubmit = async () => {
    //yeni value'ları obje haline getirdim
    const CardValues = data.cards.push({
      id: NewID,
      title: title,
      content: content,
      section: section,
      color: color,
    });
    //pushlanacak datayı eskilerini koruyarak hazırladım
    const values = {
      name: data.name,
      user: data.user,
      cards: [...data.cards, CardValues],
    };

    //db'ye data pushlama
    if (title !== "" && content !== "") {
      await AddKanbanCard(id, values);
    }
    onClose();
    setTitle("");
    setContent("");
    setColor("#6a6dcd");
  };
  // yeni kart ekleme kodu bitiş

  // kart silme kodu başlangıç

  const DeleteCards = async (id) => {
    const CardValues = data.cards.filter((card) => card.id !== id);

    const values = {
      name: data.name,
      user: data.user,
      cards: CardValues,
    };
    await AddKanbanCard(data.id, values);
    queryClient.invalidateQueries("kanbanID", data.id);
    //bu id sayesinde location.reload olmadan arkada refetch işlemi yapılıyor. Silinen veri anında ekrandan kaldırılmış oluyor.
  };
  // kart silme kodu bitiş

  //sürükle bırak fonksiyonları başlangıç
  const dragStart = (e, cardID) => {
    setDragging(cardID);
  };
  const dragKeeping = (e, dragging) => {
    e.preventDefault();
  };
  const dragDropped = async (e, part) => {
    //kartı buldum
    let Newcard = data.cards.find((card) => card.id === dragging);
    //bölümünü değiştirdim
    Newcard.section = part;
    //pushladım
    await AddKanbanCard(id, data);
    //bu id sayesinde location.reload olmadan refetch işlemi yapılıyor arkada.
    queryClient.invalidateQueries("kanbanID", data.id);
  };
  //sürükle bırak fonksiyonları bitiş

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent background="#262626" color="white ">
          <ModalHeader>Add a new {section}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              mb={3}
              placeholder="title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="content"
              onChange={(e) => setContent(e.target.value)}
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
            <Button color="black" onClick={HandleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {parts.map((part, index) => (
        // belirlediğim 4 section'ı burada dönmeye başlıyorum.
        <div
          key={index}
          className={style.section}
          onDragOver={(e) => dragKeeping(e, dragging)}
          onDrop={(e) => dragDropped(e, part)}
        >
          <div className={style.heading}>
            {part}
            <span value={part} onClick={() => setSection(part)}>
              <AddIcon w={3} h={3} onClick={onOpen} cursor="pointer" />
            </span>
          </div>
          {data.cards.map(
            (card, index) =>
              // eğer kartın bölümüyle yukarda döndüğüm bölüm eşleşirse kartı içine yazmış oluyor. Tek kod bloğuyla 4 section yazmış oluyorum.
              card?.section === part && (
                <div
                  style={
                    card.color
                      ? { background: card.color }
                      : { background: color }
                  }
                  key={index}
                  className={style.card}
                  draggable
                  onDragStart={(e) => dragStart(e, card.id)}
                >
                  <div className={style.cardContent}>
                    <div className={style.title}>
                      {card.title}
                      <Popconfirm
                        width="200px"
                        title="Are you sure want to delete this card?"
                        // silme işlemi için confirm dialog'ını açıyorum
                        onConfirm={() => DeleteCards(card.id)}
                      >
                        <CloseIcon cursor="pointer" w={3} h={3} />
                      </Popconfirm>
                    </div>
                    <div className={style.content}>{card.content}</div>
                  </div>
                </div>
              )
          )}
        </div>
      ))}
    </>
  );
}

export default Section;
