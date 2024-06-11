export type Driver = {
  uuid: string;
  name: string;
  created: string; // iso string
  nationality?: string; // 2 letter codes
};

export type Drivers = Driver[];

export type DriverSearch = {
  drivers: Drivers;
};
