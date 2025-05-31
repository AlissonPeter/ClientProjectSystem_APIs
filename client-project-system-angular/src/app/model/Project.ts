import { Activity } from "./Activity";
import { Client } from "./Client";
import { Status } from "./Status";

export class Project {
    id: string | null = null;
    description: string = '';
    activities: Activity[] = [];
    status: Status = new Status();
    client: Client = new Client();
}