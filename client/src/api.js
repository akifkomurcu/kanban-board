import axios from "axios";

export const FetchAllKanbans = async () => {
  const { data } = await axios.get(`http://localhost:4000/myKanbans`);
  return data;
};
export const FetchKanbanID = async (id) => {
  const { data } = await axios.get(`http://localhost:4000/myKanbans/${id}`);
  return data;
};
export const AddKanbanCard = async (id, values) => {
  const { data } = await axios.put(
    `http://localhost:4000/myKanbans/${id}`,
    values
  );
  return data;
};
export const DeleteKanbanCard = async (id) => {
  const { data } = await axios.delete(`http://localhost:4000/myKanbans/${id}`);
  return data;
};
