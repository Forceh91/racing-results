export type Car = {
  uuid: string;
  name: string;
};

export type CarSearchItem = Car & { inputValue: string };
export type Cars = Car[];
export type CarSearchItems = CarSearchItem[];

export type CarSearch = {
  cars: Cars;
};
