import { createQueryKeys } from "@lukemorales/query-key-factory";
import axios from "lib/axios";
import { Driver, DriverSearch } from "types";

export default createQueryKeys("drivers", {
  detail: (uuid: string) => ({
    queryKey: [uuid],
    queryFn: () => axios.get<Driver>(`/timandsco/drivers/${uuid}`).then((resp) => resp.data),
  }),
  search: (query: string) => ({
    queryKey: [query],
    queryFn: () => axios.get<DriverSearch>(`/timandsco/drivers/?search=${query}`).then((resp) => resp.data),
  }),
});
