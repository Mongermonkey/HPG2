import { characterList } from "./characters";
import { nextEvent } from "../utilities/input_output_helpers";
import { showWheelResult } from "../wheel_magic/wheel_helpers";
import { alignment, Secrets } from "../utilities/compositetypes";
import { Gifts, Grade, Pet, QuidditchGame, secretPassage, Clue } from "../utilities/compositetypes";
import { bloodStatus, gameclass, gender, hogwartsHouseName, quidditchRole, sevenNums, subject } from "../utilities/basetypes";

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
    stress: number;
    fame: number;
    clues: Clue[];
    secrets: Secrets;
    characterList: typeof characterList;
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
            console.log(key + ': ' + value);
            continue;
        }
        console.log(key + ':');
        for (const subKey in value)
        {
            if (!Object.prototype.hasOwnProperty.call(value, subKey)) continue;
            console.log('  ' + subKey + ': ' + value[subKey]);
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

/**
 * Increases the stress level of the character.
 * @param chara The main character.
 * @param increment The amount of stress to add (default is 1).
 */
export async function stress(chara: MainChara<'Wizard'>, increment?: number)
{
    chara.stress += increment ?? 1;
    chara.stress = Math.max(0, chara.stress); // Ensure stress does not go below 0
    showWheelResult('stress++');
    await nextEvent();
}

/**
 * Increases the fame level of the character.
 * @param chara The main character.
 * @param increment The amount of fame to add (default is 1).
 */
export async function fame(chara: MainChara<'Wizard'>, increment?: number)
{
    chara.fame += increment ?? 1;
    showWheelResult('fame++');
    await nextEvent();
}

/**
 * Increases an alignment level of the character.
 * @param chara The main character.
 * @param alignment The alignment to increase ('phoenix_order', 'chaos', or 'death_eater').
 * @param increment The amount to increase the alignment by (default is 1).
 */
export async function shiftAlignment(chara: MainChara<'Wizard'>, alignment: 'phoenix_order' | 'chaos' | 'death_eater', increment?: number)
{
    switch (alignment)
    {
        case 'phoenix_order': chara.alignment.phoenix_order += increment ?? 1; break;
        case 'chaos': chara.alignment.chaos += increment ?? 1; break;
        case 'death_eater': chara.alignment.death_eater += increment ?? 1; break;
        default: return;
    }
    showWheelResult('your alignment has shifted.');
    await nextEvent();
}

/**
 * Increases or decreases the skill value for a specific subject.
 * @param chara The main character.
 * @param subject The subject to increase/decrease.
 * @param increment The amount to change the skill by (default is 1).
 */
export async function subjectIncrement(chara: MainChara<'Wizard'>, subject: subject, increment?: number)
{
    let grade = chara.grades.find(g => g.subject === subject);
    increment = increment ?? 1;
    grade!.score += increment;
    showWheelResult(subject + (increment > 0 ? '++' : '--'));
    await nextEvent();
}

/**
 * Increases or decreases the house points of the character.
 * @param chara The main character.
 * @param increment The amount to change the house points by (default is 1).
 */
export function housePointsIncrement(chara: MainChara<'Wizard'>, increment?: number)
{
    increment = increment ?? 1;
    chara.housePoints += increment;
    chara.housePoints = Math.max(0, chara.housePoints); // Ensure house points do not go below 0
    showWheelResult((increment > 0 ? '+' : '-') + Math.abs(increment) + ' house points');
}

// #endregion