
import { mirrorOfErised } from "../dialogues/year-one-dialogues";
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
    houseA: hogwartsHouseName;
    houseB: hogwartsHouseName;
    winner: hogwartsHouseName;
    loser: hogwartsHouseName;
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
export const Grades: Grade[] =
[
    {subject: 'Astronomy', score: 5}, {subject: 'Charms', score: 4},
    {subject: 'Defense Against the Dark Arts', score: 4}, {subject: 'Herbology', score: 2},
    {subject: 'History of Magic', score: 3}, {subject: 'Potions', score: 4},
    {subject: 'Transfiguration', score: 4}, {subject: 'Flying', score: 4},
    {subject: 'Ancient Runes', score: 0}, {subject: 'Arithmancy', score: 0},
    {subject: 'Divination', score: 0}, {subject: 'Care of Magical Creatures', score: 0},
    {subject: 'Muggle Studies', score: 0}
]

/**
 * Type representing the alignment of a character, with its points towards each axis.
 */
export type alignment =
{
    neutral: number;
    phoenix_order: number;
    chaos: number;
    death_eater: number;
}
export const PhoenixOrderAlignment: alignment = { neutral: 0, phoenix_order: 100, chaos: 0, death_eater: 0 };
export const ChaosAlignment: alignment = { neutral: 0, phoenix_order: 0, chaos: 100, death_eater: 0 };
export const DeathEaterAlignment: alignment = { neutral: 0, phoenix_order: 0, chaos: 0, death_eater: 100 };
export const NeutralAlignment: alignment = { neutral: 100, phoenix_order: 0, chaos: 0, death_eater: 0 };
export const alignmentPhoenix = (align: alignment): boolean => align.phoenix_order > align.chaos && align.phoenix_order > align.death_eater;
export const alignmentChaos = (align: alignment): boolean => align.chaos > align.phoenix_order && align.chaos > align.death_eater;
export const alignmentDeath = (align: alignment): boolean => align.death_eater > align.phoenix_order && align.death_eater > align.chaos;

/**
 * Type representing the secrets a character can discover during the story.
 */
export type Secrets =
{
    // basic secrets
    mirrorOfErised: boolean,
    roomOfRequirement: boolean,
    darkForestPunishment: boolean,
    aragogMet: boolean,

    // first year uniques
    darkForestVoldemort: boolean,
};
export const HogwartsSecrets: Secrets =
{
    // basic secrets
    mirrorOfErised: false,
    roomOfRequirement: false,
    darkForestPunishment: false,
    aragogMet: false,

    // first year uniques
    darkForestVoldemort: false,
};

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
export const firstYearClues: Clue[] =
[
    { name: 'dumbledores_speech', discovered: false },
    { name: 'snape_halloween', discovered: false },
    { name: 'gringotts_theft', discovered: false },
    { name: 'library', discovered: false },
    { name: 'chocolate_frog', discovered: false },
    { name: 'snape_quirrell_talk', discovered: false },
    { name: 'fluffy_talk', discovered: false },
];