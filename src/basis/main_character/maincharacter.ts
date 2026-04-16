
import { characterList } from "../npcs/characters";
import { alignment, Secrets, Gifts, Grade, Pet, QuidditchGame, secretPassage, Clue } from "../types/complex_types";
import { bloodStatus, race, gameclass, gender, hogwartsHouseName, quidditchRole, sevenNums, subject } from "../types/base_types";

export type Baseclass<T extends gameclass> =
{
    gameclass: T;
    gender: gender;
    name: string;
    blood: bloodStatus;
    race: race;
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
    infamy: number;
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
export type CharacterInfoRow = { key: string | null; value: unknown };

/**
 * Prints the details of a character.
 * @param character The character to print.
 */
export function print<T extends gameclass>(character: Baseclass<T> | MainChara<T>): void
{
    for (const line of getCharacterInfo(character, false)) console.log(line);
}

// #region GETTERS

/**
 * Builds the structured rows used by character info views.
 * @param character The character to serialize.
 * @param summarized If true, hides verbose fields.
 */
export function getCharacterInfoRows<T extends gameclass>(character: Baseclass<T> | MainChara<T>, summarized: boolean = true): CharacterInfoRow[]
{
    const rows: CharacterInfoRow[] = [];
    const hiddenSummaryKeys = new Set(['secrets', 'characterList', 'secretPassages']);
    const raw = character as Record<string, unknown>;

    if (summarized)
    {
        const characterName = typeof raw.name === 'string' ? raw.name : 'Unknown';
        const characterClass = typeof raw.gameclass === 'string' ? raw.gameclass : 'Unknown';
        rows.push({ key: null, value: characterName + ' (' + characterClass + ')' });

        const bloodValue = typeof raw.blood === 'string' ? raw.blood : 'unknown';
        const raceValue = typeof raw.race === 'string' ? raw.race : 'unknown';
        const genderValue = raw.gender === 'm' ? 'male' : 'female';
        rows.push({ key: null, value: bloodValue + 'blood ' + raceValue + ' ' + genderValue });

        rows.push({ key: 'alignment', value: raw.alignment });

        const giftsValue = (typeof raw.gifts === 'object' && raw.gifts !== null)
            ? raw.gifts as Record<string, unknown>
            : {};
        const giftPriority = ['metamorphmagus', 'parselmouth', 'sight', 'lycanthropy'];
        const activeGift = giftPriority.find((giftKey) => {
            const candidate = giftsValue[giftKey];
            return typeof candidate === 'number' && candidate !== 0;
        }) ?? 'n/a';
        rows.push({ key: 'gift', value: activeGift });

        const houseValue = typeof raw.house === 'string' ? raw.house : 'n/a';
        const housePointsValue = typeof raw.housePoints === 'number' ? raw.housePoints : 0;
        rows.push({ key: 'Hogwarts House', value: houseValue + ' (' + housePointsValue + ' points earned)' });

        const petValue = (typeof raw.pet === 'object' && raw.pet !== null)
            ? raw.pet as Record<string, unknown>
            : {};
        const petName = typeof petValue.name === 'string' ? petValue.name.trim() : '';
        const petType = typeof petValue.type === 'string' ? petValue.type.trim() : '';
        rows.push({ key: 'pet', value: petName && petType ? petName + ' (' + petType + ')' : 'n/a' });

        rows.push({ key: 'fame', value: raw.fame });
        rows.push({ key: 'infamy', value: raw.infamy });
        rows.push({ key: 'stress', value: raw.stress });

        rows.push({
            key: 'quidditch',
            value: {
                role: String(raw.quidditchRole ?? 'none') + (raw.quidditchCaptain === true ? ' (captain)' : ''),
                quidditchGames: raw.quidditchGames
            }
        });
    }

    for (const key in character)
    {
        if (!Object.prototype.hasOwnProperty.call(character, key)) continue;
        if (summarized)
        {
            if (key === 'name' || key === 'gameclass') continue;
            if (key === 'blood' || key === 'race' || key === 'gender') continue;
            if (key === 'alignment') continue;
            if (key === 'gifts' || key === 'pet') continue;
            if (key === 'fame' || key === 'infamy' || key === 'stress') continue;
            if (key === 'quidditchRole' || key === 'quidditchCaptain' || key === 'quidditchGames') continue;
            if (key === 'house' || key === 'housePoints') continue;
            if (hiddenSummaryKeys.has(key)) continue;
            if (key === 'clues' && Array.isArray(raw[key]))
            {
                const clues = (raw[key] as unknown[]).map((clue) => {
                    if (typeof clue !== 'object' || clue === null) return '???';
                    const clueObj = clue as Record<string, unknown>;
                    return clueObj.discovered === true && typeof clueObj.name === 'string'
                        ? clueObj.name
                        : '???';
                });
                rows.push({ key, value: clues });
                continue;
            }
            if (key === 'grades' && Array.isArray(raw[key]))
            {
                const grades = (raw[key] as unknown[])
                    .map((grade) => {
                        if (typeof grade !== 'object' || grade === null) return null;
                        const gradeObj = grade as Record<string, unknown>;
                        const score = typeof gradeObj.score === 'number' ? gradeObj.score : 0;
                        if (score === 0) return null;
                        const subject = typeof gradeObj.subject === 'string' ? gradeObj.subject : 'unknown';
                        return { subject, score };
                    })
                    .filter((grade): grade is { subject: string; score: number } => grade !== null);
                const gradesMap: Record<string, number> = {};
                for (const grade of grades) gradesMap[grade.subject] = grade.score;
                rows.push({ key, value: gradesMap });
                continue;
            }
        }
        rows.push({ key, value: raw[key] });
    }

    return rows;
}

/**
 * Builds the same line-by-line output used by print().
 * @param character The character to serialize into printable lines.
 * @param summarized If true, hides large verbose fields from the output.
 */
export function getCharacterInfo<T extends gameclass>(character: Baseclass<T> | MainChara<T>, summarized: boolean = true): string[]
{
    const lines: string[] = [];

    for (const row of getCharacterInfoRows(character, summarized))
    {
        if (row.key === null)
        {
            lines.push(String(row.value));
            continue;
        }

        const key = row.key;
        const value = row.value;
        if (!(typeof value === 'object' && value !== null))
        {
            lines.push(key + ': ' + value);
            continue;
        }
        lines.push(key + ':');
        const nestedValue = value as Record<string, unknown>;
        for (const subKey in value)
        {
            if (!Object.prototype.hasOwnProperty.call(value, subKey)) continue;
            lines.push('  ' + subKey + ': ' + nestedValue[subKey]);
        }
    }

    return lines;
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