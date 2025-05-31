import { Status } from "./Status";

export class Activity {
    id: string | null = null;
    description: string = '';
    status: Status = new Status();
}