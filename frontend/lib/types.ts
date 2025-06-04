export interface Dish {
  _id: number;
  name: string;
  ingredients: string[];
  diet: string;
  prep_time?: number;
  cook_time?: number;
  flavor_profile: string;
  course: string;
  state: string;
  region: string;
}

export interface ApiResponse {
  _id: number;
  name: string;
  ingredients: string;
  diet: string;
  prep_time?: number;
  cook_time?: number;
  flavor_profile: string;
  course: string;
  state: string;
  region: string;
}

export enum DIET {
  VEG = "vegetarian",
  NONVEG = "non vegetarian",
}
