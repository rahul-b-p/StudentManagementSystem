export type StanderdGrades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];

export interface StudentWithGrades {
    id: string;
    userId: string;
    name: string;
    age: number;
    email: string;
    grades: Record<string,string>
};
