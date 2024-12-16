
export const enum grades {
    Aplus = 'A+',
    A = 'A',
    BPlus = 'B+',
    B = 'B',
    CPlus = 'C+',
    C = 'C',
    DPlus = 'D+',
    D = 'D',
    F = 'F'
}

export type StanderdGrades = grades[];

export interface StudentWithGrades {
    id: string;
    userId: string;
    name: string;
    age: number;
    email: string;
    grades: Record<string, string>;
    averageGrade: string;
};

