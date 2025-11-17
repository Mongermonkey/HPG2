
import { characterList } from "./characters";
import { Gifts, Grade, Pet, QuidditchGame } from "../utilities/compositetypes";

export type { Gifts };
export type { Pet };
import { alignement as alignment, bloodStatus, gameclass, gender, hogwartsHouse, quidditchRole, sevenBool, sevenNums, subject } from "../utilities/basetypes";

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
    house: hogwartsHouse;
    housePoints: number;
    quidditchRole: quidditchRole;
    quidditchCaptain: boolean;
    stress: number;          // fraction: da 0 a 1
    fame: number;            // fraction: da 0 a 1
    clues: sevenBool;
    characterList: typeof characterList; // lista interazioni con NPC
    quidditchGames: QuidditchGame[];
    year: sevenNums;
    grades: Grade[];
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
 * Retrieves the maximum skill value among the given subjects.
 * @param chara The mc.
 * @param subjects The subjects to check.
 * @returns The maximum skill value.
 */
export function getMaxSkill(chara: MainChara<'Wizard'>, subjects: subject[]): number
{
    return Math.max(...subjects.map(subject => getSkill(chara, subject)));
}

// #endregion