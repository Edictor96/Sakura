import type { DataApi } from "../types";
import { contentService } from "@/lib/server/services/contentService";
import { api as mock } from "./mock";

export const api: DataApi = {
  async getCities() {
    return mock.getCities();
  },
  getRooms: contentService.getRooms,
  getRoom: contentService.getRoom,
  getPosts: contentService.getPosts,
  getEvents: contentService.getEvents,
  getCatalogue: contentService.getCatalogue,
  getCatalogueItem: contentService.getCatalogueItem,
  getProducts: contentService.getProducts,
};
