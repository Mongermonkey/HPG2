import { characterList } from "./characters";
import { Gifts, Grade, Pet, QuidditchGame, secretPassage, Clue, Secret } from "../utilities/compositetypes";
import { alignment, bloodStatus, gameclass, gender, hogwartsHouseName, quidditchRole, sevenNums, subject } from "../utilities/basetypes";

export type { Pet };
export type { Gifts };
export type Baseclass<T extends gameclass> =
{
    gameclass: T;
    gender: gender;
    name: string;
    blood: bloodStatus;
    gifts: Gifts;
}
export type Wizard =
{
    pet: Pet;
    alignment: alignment;
    house: hogwartsHouseName;
    housePoints: number;
    quidditchRole: quidditchRole;
    quidditchCaptain: boolean;
    stress: number;          // fraction: da 0 a 1
    fame: number;            // fraction: da 0 a 1
    clues: Clue[];
    secrets: Secret[];
    characterList: typeof characterList; // lista interazioni con NPC
    quidditchGames: QuidditchGame[];
    year: sevenNums;
    grades: Grade[];
    secretPassages: secretPassage[];
    mainQuestProgress: number;
}

export type CustomClass =
{
    [key in gameclass]: key extends 'Muggle' ? {}
                      : key extends 'Wizard' ? Wizard
                      : never;
}

export type MainChara<T extends gameclass> = Baseclass<T> & CustomClass[T];

// #region functions

/**
 * Prints the details of a character.
 * @param character The character to print.
 */
export function print<T extends gameclass>(character: Baseclass<T> | MainChara<T>): void
{
    for (const key in character)
    {
        if (!Object.prototype.hasOwnProperty.call(character, key)) continue;
        const value = (character as any)[key];
        if (!(typeof value === 'object' && value !== null))
        {
            console.log(`${key}: ${value}`);
            continue;
        }
        console.log(`${key}:`);
        for (const subKey in value)
        {
            if (!Object.prototype.hasOwnProperty.call(value, subKey)) continue;
            console.log(`  ${subKey}: ${value[subKey]}`);
        }
    }
}

/**
 * Retrieves the subjects the character is studying.
 * @param chara The mc.
 * @returns The list of subjects the character is studying.
 */
export function getSubjects(chara: MainChara<'Wizard'>): subject[]
{
    return chara.grades.map(g => g.subject).filter(s => s !== 'none');
}

/**
 * Retrieves the skill value for a specific subject.
 * @param chara The mc.
 * @param subject The subject to check.
 * @returns The skill value for the subject.
 */
export function getSkill(chara: MainChara<'Wizard'>, subject: subject): number
{
    const grade = chara.grades.find(g => g.subject === subject);
    return grade ? grade.score : 0;
}

/**
 * Calculates the average skill value from a list of grades.
 * @param grades The list of grades.
 */
export function getAverageSkill(grades: Grade[]): number
{
    if (!grades || grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.score, 0);
    return Math.round(total / grades.length);
}

/**
 * Returns the n highest skill grades.
 * @param chara The mc.
 * @param n The number of grades to return.
 * @returns An array of the n highest skill grades (sorted from highest to lowest).
 */
export function getMaxGrades(chara: MainChara<'Wizard'>, n: number): Grade[]
{
    if (!chara.grades || chara.grades.length === 0) return [];
    return [...chara.grades]
        .sort((a, b) => b.score - a.score)
        .slice(0, n);
}

/**
 * Returns the n lowest skill grades.
 * @param chara The mc.
 * @param n The number of grades to return.
 * @returns An array of the n lowest skill grades (sorted from lowest to highest).
 */
export function getMinGrades(chara: MainChara<'Wizard'>, n: number): Grade[]
{
    if (!chara.grades || chara.grades.length === 0) return [];
    return [...chara.grades]
        .sort((a, b) => a.score - b.score)
        .slice(0, n);
}

// #endregion