import axios from "axios";

export const FetchAllKanbans = async () => {
  const { data } = await axios.get(`http://localhost:4000/myKanbans`);
  return data;
};
export const FetchKanbanID = async (id) => {
  const { data } = await axios.get(`http://localhost:4000/myKanbans/${id}`);
  return data;
};
