import { Activity } from "./Activity";
import { Client } from "./Client";
import { Status } from "./Status";

export interface Project {
    id: string;
    description: string;
    activities: Activity[];
    status: Status;
    client: Client;
}