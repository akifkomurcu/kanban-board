import { useState } from "react";
import style from "./style.module.css";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import { AddKanbanCard } from "../../api";
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
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
function Section({ data }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const NewID = uuid();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [dragging, setDragging] = useState("");
  const [content, setContent] = useState("");
  const [parts] = useState(["Backlog", "To do", "Inprogress", "Done"]);
  const [section, setSection] = useState("");

  const HandleSubmit = async () => {
    //yeni value'ları obje haline getirdim

    const CardValues = data.cards.push({
      id: NewID,
      title: title,
      content: content,
      section: section,
    });
    //pushlanacak datayı eskilerini koruyarak hazırladım
    const values = {
      name: data.name,
      cards: [...data.cards, CardValues],
    };

    onClose();
    setTitle("");
    setContent("");

    //db'ye data pushlama
    await AddKanbanCard(id, values);
  };

  const DeleteCards = async (id) => {
    const CardValues = data.cards.filter((card) => card.id !== id);

    const values = {
      name: data.name,
      cards: CardValues,
    };
    await AddKanbanCard(data.id, values);
    document.location.reload(true);
  };

  const dragStart = (e, cardID) => {
    setDragging(cardID);
  };
  const dragKeeping = (e, dragging) => {
    e.preventDefault();
  };
  const dragDropped = async (e, part) => {
    if (part !== section) {
      console.log("part", part, "section", section);
    }

    //kartı buldum
    let Newcard = data.cards.find((card) => card.id === dragging);
    //bölümünü değiştirdim

    Newcard.section = part;
    //pushladım
    await AddKanbanCard(id, data);
    document.location.reload(true);
  };
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
          <ModalHeader>Add a new card</ModalHeader>
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
              card?.section === part && (
                <div
                  key={index}
                  className={style.card}
                  draggable
                  onDragStart={(e) => dragStart(e, card.id)}
                >
                  <div className={style.cardContent}>
                    <div className={style.title}>
                      {card.title}
                      <button value={part} onClick={() => DeleteCards(card.id)}>
                        <CloseIcon
                          cursor="pointer"
                          w={3}
                          h={3}
                          onClick={() => DeleteCards(card.id)}
                        />
                      </button>
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
