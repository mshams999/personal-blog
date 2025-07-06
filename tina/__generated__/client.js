import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: "http://localhost:4001/graphql", token: "0f8e38f6067bce1eeb0e5d483589de86601ebd1c", queries });
export default client;
