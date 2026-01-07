export type TeamType = "MAINTENANCE" | "QUALITY" | "PRODUCTION";

export interface Person {
    id: string;
    name: string;
}

export const peopleByTeam: Record<TeamType, Person[]> = {
    MAINTENANCE: [
        { id: "m1", name: "John Smith" },
        { id: "m2", name: "Mike Johnson" },
        { id: "m3", name: "David Lee" },
    ],
    QUALITY: [
        { id: "q1", name: "Jane Doe" },
        { id: "q2", name: "Sarah Wilson" },
        { id: "q3", name: "Emma Davis" },
    ],
    PRODUCTION: [
        { id: "p1", name: "Tom Brown" },
        { id: "p2", name: "Robert Taylor" },
        { id: "p3", name: "James Martinez" },
    ],
};
