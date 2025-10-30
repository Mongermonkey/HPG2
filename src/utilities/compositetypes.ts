
import { animal, sevenNums, hogwartsHouse, subject } from "./basetypes";

/**
 * Type representing a pet owned by a character.
 */
export type Pet =
{
    type: animal;
    name: string;
};

/**
 * Type representing the special gifts a character can have.
 */
export type Gifts =
{
    metamorphmagus: sevenNums;
    parselmouth: sevenNums;
    sight: sevenNums;
    lycanthropy: sevenNums;
}

/**
 * Type representing a Quidditch game.
 */
export type QuidditchGame =
{
    houseA: hogwartsHouse;
    houseB: hogwartsHouse;
    scoreA: number;
    scoreB: number;
    winner: hogwartsHouse;
};

/**
 * Type representing a grade in a subject.
 */
export type Grade =
{
    subject: subject;
    score: number;
}