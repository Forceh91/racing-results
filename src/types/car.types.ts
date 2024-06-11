export type Car = {
  uuid: string;
  name: string;
};

export type Cars = Car[];

export type CarSearch = {
  cars: Cars;
};
