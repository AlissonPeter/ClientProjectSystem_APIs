import type { Activity } from "./Activity";
import type { Client } from "./Client";
import type { Status } from "./Status";

export interface Project {
    id: string | null;
    description: string;
    activities: Activity[];
    status: Status;
    client: Client;
}