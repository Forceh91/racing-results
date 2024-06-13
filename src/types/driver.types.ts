export type Driver = {
  uuid: string;
  name: string;
  created: string; // iso string
  nationality?: string; // 2 letter codes
};

export type Drivers = Driver[];

export type DriverSearchItem = { uuid: string; name: string } & { inputValue?: string };
export type DriverSearch = {
  drivers: DriverSearchItem[];
};
