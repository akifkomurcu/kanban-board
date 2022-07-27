import { useState } from "react";
import style from "./style.module.css";
import { useQuery } from "react-query";
import { FetchKanbanID } from "../../api";
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

import { useParams, Link } from "react-router-dom";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
function Content() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const AddNewCard = () => {
    const values = {
      title: title,
      content: content,
    };
  };
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading, isError, data } = useQuery(["kanbanID", id], () =>
    FetchKanbanID(id)
  );
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
          {data.length !== 0 && (
            <>
              <div className={style.backlog}>
                <div className={style.heading}>
                  Backlog <AddIcon onClick={onOpen} w={3} h={3} />
                </div>
                {data.backlog.map((backlog, index) => (
                  <div key={index} className={style.card}>
                    <div className={style.cardContent}>
                      <div className={style.title}>
                        {backlog.title}
                        <CloseIcon w={3} h={3} />
                      </div>
                      <div className={style.content}>{backlog.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={style.todo}>
                <div className={style.heading}>To do</div>
                {data.todo.map((todo, index) => (
                  <div key={index} className={style.card}>
                    <div className={style.cardContent}>
                      <div className={style.title}>
                        {todo.title} <CloseIcon w={3} h={3} />
                      </div>
                      <div className={style.content}>{todo.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={style.inprogress}>
                <div className={style.heading}>In progress</div>
                {data.inprog.map((inprog, index) => (
                  <div key={index} className={style.card}>
                    <div className={style.cardContent}>
                      <div className={style.title}>
                        {inprog.title} <CloseIcon w={3} h={3} />
                      </div>
                      <div className={style.content}>{inprog.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={style.done}>
                <div className={style.heading}>Done</div>
                {data.done.map((done, index) => (
                  <div key={index} className={style.card}>
                    <div className={style.cardContent}>
                      <div className={style.title}>
                        {done.title} <CloseIcon w={3} h={3} />
                      </div>
                      <div className={style.content}>{done.content}</div>
                    </div>
                  </div>
                ))}
                {/* modal */}
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent background="#262626" color="white">
                    <ModalHeader>Add Card</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Input
                        mb={3}
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <Input
                        placeholder="Content"
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                      </Button>
                      <Button
                        colorScheme="grey"
                        variant={"outline"}
                        onClick={AddNewCard()}
                      >
                        Add
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Content;
