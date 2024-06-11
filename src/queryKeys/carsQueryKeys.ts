import { createQueryKeys } from "@lukemorales/query-key-factory";
import axios from "lib/axios";
import { Car, CarSearch } from "types";

export default createQueryKeys("cars", {
  detail: (uuid: string) => ({
    queryKey: [uuid],
    queryFn: () => axios.get<Car>(`/timandsco/cars/${uuid}`).then((resp) => resp.data),
  }),
  search: (query: string) => ({
    queryKey: [query],
    queryFn: () => axios.get<CarSearch>(`/timandsco/cars/?search=${query}`).then((resp) => resp.data),
  }),
});
