
import { animal, sevenNums, subject, firstYearClue, hogwartsHouseName } from "./basetypes";

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
 * Type representing a Hogwarts' house, with its name and points.
 */
export type hogwartsHouse =
{
    name: hogwartsHouseName;
    points: number;
}

/**
 * Type representing a Quidditch game.
 */
export type QuidditchGame =
{
    houseA: hogwartsHouse;
    houseB: hogwartsHouse;
    winner: hogwartsHouse;
    loser: hogwartsHouse;
    winnerScore: number;
    loserScore: number;
};

/**
 * Type representing a grade in a subject.
 */
export type Grade =
{
    subject: subject;
    score: number;
}

/**
 * Type representing a Hogwarts' secret.
 */
export type Secret =
{
    name: string;
    discovered: boolean;
}
export const BasicSecrets: Secret[] =
[
    { name: 'mirror_of_erised', discovered: false },
    { name: 'room_of_requirement', discovered: false },
];

/**
 * Type representing a secret passage in Hogwarts.
 */
export type secretPassage =
{
    name: string;
    password: string;
    description: string;
    internal: boolean;
    discovered: boolean;
}
export const freshPassages: secretPassage[] =
[
    { name: "Timothy the Timid", password: "flaming earwigs", description: "A painting of Timothy the Timid hid a shortcut between the fifth-floor corridor and the Herbology corridor.", internal: true, discovered: false },
    { name: "Giffard Abbot", password: "dragon's egg", description: "A painting of Giffard Abbot hid a shortcut between the Grand Staircase and the Middle Courtyard.", internal: true, discovered: false },
    { name: "Damara Dodderidge", password: "chops and gravy", description: "A painting of Damara Dodderidge hid a shortcut between the Grand Staircase and the Clock Tower Entrance.", internal: true, discovered: false },
    { name: "Edward Rabnott", password: "three heads are better than one", description: "A painting of Edward Rabnott hid a shortcut between the second - floor corridor and the fourth-floor corridor.", internal: true, discovered: false },
    { name: "George von Rheticus", password: "scurrilous scoundrel", description: "A painting of George von Rheticus hid a shortcut between the Grand Staircase and the seventh-floor corridor.", internal: true, discovered: false },
    { name: "Temeritus Shanks", password: "no news is good news", description: "A painting of Temeritus Shanks hid a shortcut between the Library and the fourth-floor corridor.", internal: true, discovered: false },
    { name: "Google Stump", password: "volo futurus unus", description: "A painting of Google Stump hid a shortcut between the Viaduct Entrance and the first - floor corridor.", internal: true, discovered: false },
    { name: "Percival Pratt", password: "this password is absurd", description: "A painting of Percival Pratt hid a shortcut between the Grand Staircase and the Boathouse.", internal: true, discovered: false },
    { name: "Elizabeth Burke", password: "slytherins are supreme", description: "A painting of Elizabeth Burke hid a shortcut between the Entrance Dungeon and the Dungeons near the Potions Classroom.", internal: true, discovered: false },
    { name: "Boris the Bewildered", password: "forget-me-never", description: "A painting of Boris the Bewildered hid a shortcut between the second-floor corridor and the third-floor corridor.", internal: true, discovered: false },
    { name: "One-Eyed Witch", password: "", description: "The One-Eyed Witch statue in the third-floor corridor hid a passageway that leads to Honeydukes Sweet Shop.", internal: false, discovered: false },
    { name: "Fourth-Floor Mirror", password: "", description: "The Fourth-Floor Mirror hid a passageway that leads to Hogsmeade Village.", internal: false, discovered: false },
    { name: "Whomping Will", password: "", description: "Under the Whomping Will opens a passageway that leads to the Shrieking Shack.", internal: false, discovered: false },
    { name: "Gregory The Smarmy", password: "", description: "The Gregory The Smarmy statue hid a passageway that leads To Hogsmeade Village.", internal: false, discovered: false },
    { name: "West Tower floor", password: "", description: "On the ground floor of the Castle's West Tower lies a passageway within the West Well, that leads to a fountain In Hogsmeade Village.", internal: false, discovered: false },
];

/**
 * Type representing the clues for the main quest.
 */
export type Clue =
{
    name: firstYearClue;
    discovered: boolean;
}
export const FirstYearClues: Clue[] =
[
    { name: 'dumbledores_speech', discovered: false },
    { name: 'snape_halloween', discovered: false },
    { name: 'gringotts_theft', discovered: false },
    { name: 'library', discovered: false },
    { name: 'chocolate_frog', discovered: false },
    { name: 'snape_quirrell_talk', discovered: false },
    { name: 'fluffy_talk', discovered: false },
];