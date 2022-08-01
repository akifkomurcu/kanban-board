import axios from "axios";

export const FetchAllKanbans = async () => {
  const { data } = await axios.get(`http://localhost:4000/myKanbans`);
  return data;
};
export const FetchKanbanID = async (id) => {
  const { data } = await axios.get(`http://localhost:4000/myKanbans/${id}`);
  return data;
};
export const AddKanban = async (body) => {
  const { data } = await axios.post(`http://localhost:4000/myKanbans/`, body);
  return data;
};
export const DeleteKanban = async (id) => {
  const { data } = await axios.delete(`http://localhost:4000/myKanbans/${id}`);
  return data;
};

export const AddKanbanCard = async (id, values) => {
  const { data } = await axios.put(
    `http://localhost:4000/myKanbans/${id}`,
    values
  );
  return data;
};
