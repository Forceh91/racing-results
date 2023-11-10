export type EventOverview = {
  uuid: string;
  name: string;
  start_date: string;
  end_date?: string;
  results: Array<unknown>;
};
