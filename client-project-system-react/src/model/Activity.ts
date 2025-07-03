import type { Status } from "./Status";

export interface Activity {
    id: string | null;
    description: string;
    status: Status;
}