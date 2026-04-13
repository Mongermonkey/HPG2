
import { connectionlvl, hogwartsHouseName, hogwartsRole, quidditchRole, subject } from "../utilities/basetypes";
import { alignment, DeathEaterAlignment, NeutralAlignment, PhoenixOrderAlignment, ChaosAlignment } from "../utilities/compositetypes";

// #region types
/**
 * BaseCharacter<T>
 * Represents the basic structure of a Hogwarts character, parametrized by role.
 */
export type BaseCharacter<T extends hogwartsRole> =
{
    role: T;
    id: number;
    name: string;
    surname: string;
    longname: string;
    male: boolean;
    alignement: alignment;
    connectionlvl: connectionlvl;
}

/**
 * Student
 * Extends BaseCharacter for students, adding Quidditch and house info.
 */
export type Student =
{
    quidditchRole: quidditchRole;
    house: hogwartsHouseName;
    senior: boolean;
    captain: boolean;
}

/**
 * Teacher
 * Extends BaseCharacter for teachers, adding subject info.
 */
export type Teacher =
{
    subject: subject;
    isHeadofHouse: boolean;
    house: hogwartsHouseName;
}

/**
 * Creature
 * Extends BaseCharacter for creatures, adding house info when applicable.
 */
export type Creature =
{
    house: hogwartsHouseName;
}

/**
 * HogwartsCharacter
 * Maps each hogwartsRole to its specific extension type.
 */
export type HogwartsCharacter =
{
    [key in hogwartsRole]: key extends 'Student' ? Student
                        : key extends 'Teacher' ? Teacher
                        : key extends 'Creature' ? Creature
                        : key extends 'Staff' ? {}
                        : key extends 'External' ? {}
                        : never;
}

/**
 * Character<T>
 * Combines BaseCharacter and the role-specific extension.
 */
export type Character<T extends hogwartsRole> = BaseCharacter<T> & HogwartsCharacter[T];
// #endregion

/**
 * characterList
 * The main array containing all Hogwarts characters.
 */
export const characterList: Character<hogwartsRole>[] =
[
    // Hogwarts Staff (1-4)
    { role: 'Staff', id: 1, name: 'Albus Percival Wulfric Brian', surname: 'Dumbledore', longname: 'Professor Dumbledore', male: true, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral' },
    { role: 'Staff', id: 2, name: 'Rubeus', surname: 'Hagrid', longname: 'Hagrid', male: true, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral' },
    { role: 'Staff', id: 3, name: 'Argus', surname: 'Filch', longname: 'Filch', male: true, alignement: NeutralAlignment, connectionlvl: 'foe' },
    { role: 'Staff', id: 4, name: 'Irma', surname: 'Prince', longname: 'Madam Prince', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral' },
    
    // Hogwarts Creatures (5-10)
    { role: 'Creature', id: 5, name: '', surname: 'Peeves', longname: 'Peeves', male: true, alignement: ChaosAlignment, connectionlvl: 'foe', house: 'none' },
    { role: 'Creature', id: 6, name: 'Myrtle', surname: '', longname: 'Moaning Myrtle', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', house: 'none' },
    { role: 'Creature', id: 7, name: 'Sir Nicholas', surname: 'de Mimsy-Porpington', longname: 'Nearly Headless Nick', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', house: 'Gryffindor' },
    { role: 'Creature', id: 8, name: 'The Fat Friar', surname: '', longname: 'The Fat Friar', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', house: 'Hufflepuff' },
    { role: 'Creature', id: 9, name: 'Helena', surname: 'Ravenclaw', longname: 'The Grey Lady', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', house: 'Ravenclaw' },
    { role: 'Creature', id: 10, name: 'The Bloody Baron', surname: '', longname: 'The Bloody Baron', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', house: 'Slytherin' },
    // n°11: Dobby
    // n°12: Buckbeak
    // n°13: Sirius Black
    // n°14: Grawp

    // Hogwarts Teachers (20-36)
    { role: 'Teacher', id: 20, name: 'Minerva', surname: 'McGonagall', longname: 'Professor McGonagall', male: false, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', subject: 'Transfiguration', isHeadofHouse: true, house: 'Gryffindor' },
    { role: 'Teacher', id: 21, name: 'Pomona', surname: 'Sprout', longname: 'Professor Sprout', male: false, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', subject: 'Herbology', isHeadofHouse: true, house: 'Hufflepuff' },
    { role: 'Teacher', id: 22, name: 'Filius', surname: 'Flitwick', longname: 'Professor Flitwick', male: true, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', subject: 'Charms', isHeadofHouse: true, house: 'Ravenclaw' },
    { role: 'Teacher', id: 23, name: 'Severus', surname: 'Snape', longname: 'Professor Snape', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', subject: 'Potions', isHeadofHouse: true, house: 'Slytherin' },
    { role: 'Teacher', id: 24, name: 'Aurora', surname: 'Sinistra', longname: 'Professor Sinistra', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', subject: 'Astronomy', isHeadofHouse: false, house: 'none' },
    { role: 'Teacher', id: 25, name: 'Cuthbert', surname: 'Binns', longname: 'Professor Binns', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', subject: 'History of Magic', isHeadofHouse: false, house: 'none' },
    { role: 'Teacher', id: 26, name: 'Rolanda', surname: 'Hooch', longname: 'Madam Hooch', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', subject: 'Flying', isHeadofHouse: false, house: 'none' },
    { role: 'Teacher', id: 27, name: 'Quirinus', surname: 'Quirrell', longname: 'Professor Quirrell', male: true, alignement: DeathEaterAlignment, connectionlvl: 'neutral', subject: 'Defense Against the Dark Arts', isHeadofHouse: false, house: 'none' },
    // n°28: Gilderoy Lockhart
    // n°29: Remus Lupin
    // n°30: Sybill Trelawney
    // n°31: Septima Vector
    // n°32: Charity Burbage
    // n°33: Bathesda Bagshot
    // n°34: Alastor Moody
    // n°35: Dolores Umbridge
    // n°36: Horace Slughorn

    // Hogwarts Students (senior) (40-54)
    { role: 'Student', id: 40, name: 'Oliver', surname: 'Wood', longname: 'Oliver Wood', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'keeper', senior: true, captain: true, house: 'Gryffindor' },
    { role: 'Student', id: 41, name: 'Angelina', surname: 'Johnson', longname: 'Angelina Johnson', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'chaser', senior: true, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 42, name: 'Katie', surname: 'Bell', longname: 'Katie Bell', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'chaser', senior: true, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 43, name: 'Alicia', surname: 'Spinnet', longname: 'Alicia Spinnet', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'chaser', senior: true, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 44, name: 'Lee', surname: 'Jordan', longname: 'Lee Jordan', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: true, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 45, name: 'Fred', surname: 'Weasley', longname: 'Fred Weasley', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'beater', senior: true, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 46, name: 'George', surname: 'Weasley', longname: 'George Weasley', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'beater', senior: true, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 47, name: 'Percy', surname: 'Weasley', longname: 'Percy Weasley', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: true, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 48, name: 'Cedric', surname: 'Diggory', longname: 'Cedric Diggory', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'seeker', senior: true, captain: true, house: 'Hufflepuff' },
    { role: 'Student', id: 49, name: 'Cho', surname: 'Chang', longname: 'Cho Chang', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: true, captain: false, house: 'Ravenclaw' },
    { role: 'Student', id: 50, name: 'Marietta', surname: 'Edgecombe', longname: 'Marietta Edgecombe', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: true, captain: false, house: 'Ravenclaw' },
    { role: 'Student', id: 51, name: 'Roger', surname: 'Davies', longname: 'Roger Davies', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'seeker', senior: true, captain: true, house: 'Ravenclaw' },
    { role: 'Student', id: 52, name: 'Marcus', surname: 'Belby', longname: 'Marcus Belby', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: true, captain: false, house: 'Hufflepuff' },
    { role: 'Student', id: 53, name: 'Penelope', surname: 'Clearwater', longname: 'Penelope Clearwater', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: true, captain: false, house: 'Ravenclaw' },
    { role: 'Student', id: 54, name: 'Marcus', surname: 'Flint', longname: 'Marcus Flint', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: true, captain: false, house: 'Slytherin' },

    // Hogwarts Students (junior) (55-88)
    { role: 'Student', id: 55, name: 'Harry', surname: 'Potter', longname: 'Harry Potter', male: true, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', quidditchRole: 'seeker', senior: false, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 56, name: 'Ron', surname: 'Weasley', longname: 'Ron Weasley', male: true, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 57, name: 'Hermione', surname: 'Granger', longname: 'Hermione Granger', male: false, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 58, name: 'Neville', surname: 'Longbottom', longname: 'Neville Longbottom', male: true, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 59, name: 'Seamus', surname: 'Finnigan', longname: 'Seamus Finnigan', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 60, name: 'Dean', surname: 'Thomas', longname: 'Dean Thomas', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 61, name: 'Lavender', surname: 'Brown', longname: 'Lavender Brown', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 62, name: 'Parvati', surname: 'Patil', longname: 'Parvati Patil', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Gryffindor' },
    { role: 'Student', id: 63, name: 'Ernie', surname: 'McMillan', longname: 'Ernie McMillan', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Hufflepuff' },
    { role: 'Student', id: 59, name: 'Hannah', surname: 'Abbott', longname: 'Hannah Abbott', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Hufflepuff' },
    { role: 'Student', id: 64, name: 'Susan', surname: 'Bones', longname: 'Susan Bones', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Hufflepuff' },
    { role: 'Student', id: 65, name: 'Justin', surname: 'Finch-Fletchley', longname: 'Justin Finch-Fletchley', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Hufflepuff' },
    { role: 'Student', id: 66, name: 'Kevin', surname: 'Entwhistle', longname: 'Kevin Entwhistle', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Hufflepuff' },
    { role: 'Student', id: 67, name: 'Wayne', surname: 'Hopkins', longname: 'Wayne Hopkins', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Hufflepuff' },
    { role: 'Student', id: 68, name: 'Padma', surname: 'Patil', longname: 'Padma Patil', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Ravenclaw' },
    { role: 'Student', id: 69, name: 'Michael', surname: 'Corner', longname: 'Michael Corner', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Ravenclaw' },
    { role: 'Student', id: 70, name: 'Terry', surname: 'Boot', longname: 'Terry Boot', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Ravenclaw' },
    { role: 'Student', id: 71, name: 'Lisa', surname: 'Turpin', longname: 'Lisa Turpin', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Ravenclaw' },
    { role: 'Student', id: 72, name: 'Anthony', surname: 'Goldstein', longname: 'Anthony Goldstein', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Ravenclaw' },
    { role: 'Student', id: 73, name: 'Mandy', surname: 'Brocklehurst', longname: 'Mandy Brocklehurst', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Ravenclaw' },
    { role: 'Student', id: 74, name: 'Morag', surname: 'MacDougal', longname: 'Morag MacDougal', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Ravenclaw' },
    { role: 'Student', id: 75, name: 'Bradley', surname: 'Shaw', longname: 'Bradley Shaw', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Ravenclaw' },
    { role: 'Student', id: 76, name: 'Draco', surname: 'Malfoy', longname: 'Draco Malfoy', male: true, alignement: DeathEaterAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Slytherin' },
    { role: 'Student', id: 77, name: 'Vincent', surname: 'Crabbe', longname: 'Vincent Crabbe', male: true, alignement: DeathEaterAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Slytherin' },
    { role: 'Student', id: 78, name: 'Gregory', surname: 'Goyle', longname: 'Gregory Goyle', male: true, alignement: DeathEaterAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Slytherin' },
    { role: 'Student', id: 79, name: 'Blaise', surname: 'Zabini', longname: 'Blaise Zabini', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Slytherin' },
    { role: 'Student', id: 80, name: 'Theodore', surname: 'Nott', longname: 'Theodore Nott', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Slytherin' },
    { role: 'Student', id: 81, name: 'Pansy', surname: 'Parkinson', longname: 'Pansy Parkinson', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Slytherin' },
    { role: 'Student', id: 82, name: 'Astoria', surname: 'Greengrass', longname: 'Astoria Greengrass', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Slytherin' },
    { role: 'Student', id: 83, name: 'Millicent', surname: 'Bulstrode', longname: 'Millicent Bulstrode', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Slytherin' },
    // n°84: Ginny Weasley
    // n°85: Colin Creevey
    // n°86: Dennis Creevey
    // n°87: Zacharias Smith
    // n°88: Luna Lovegood

    // Externals (100-102)
    // n°100: Viktor Krum
    // n°101: Fleur Delacour
    // n°102: Gabrielle Delacour
];

// #region characterList update functions

/**
 * Replaces a character in characterList by role and id.
 * @param role The role of the character to replace.
 * @param id The id of the character to replace.
 * @param newCharacter The new character object.
 */
function replaceCharacter(role: hogwartsRole, id: number, newCharacter: Character<hogwartsRole>)
{
    const index = characterList.findIndex(c => c.role === role && c.id === id);
    if (index !== -1) characterList.splice(index, 1);
    characterList.push(newCharacter);
}

/**
 * Updates characterList for Year 2.
 * Adds new characters and replaces a teacher for the second year.
 */
export function characterListUpd_Y2()
{
    characterList.push(
        { role: 'Student', id: 84, name: 'Ginny', surname: 'Weasley', longname: 'Ginny Weasley', male: false, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Gryffindor' },
        { role: 'Student', id: 85, name: 'Colin', surname: 'Creevey', longname: 'Colin Creevey', male: true, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Gryffindor' },
        { role: 'Student', id: 86, name: 'Dennis', surname: 'Creevey', longname: 'Dennis Creevey', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Gryffindor' },
        { role: 'Student', id: 87, name: 'Zacharias', surname: 'Smith', longname: 'Zacharias Smith', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Hufflepuff' },
        { role: 'Student', id: 88, name: 'Luna', surname: 'Lovegood', longname: 'Luna Lovegood', male: false, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', quidditchRole: 'none', senior: false, captain: false, house: 'Ravenclaw' }
    );
    replaceCharacter('Teacher', 27, { role: 'Teacher', id: 28, name: 'Gilderoy', surname: 'Lockhart', longname: 'Professor Lockhart', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', subject: 'Defense Against the Dark Arts', isHeadofHouse: false, house: 'none' });
}

/**
 * Updates characterList for Year 3.
 * Adds new characters, replaces a teacher, and promotes a staff member to teacher for the third year.
 */
export function characterListUpd_Y3()
{
    characterList.push(
        { role: 'Creature', id: 11, name: 'Dobby', surname: '', longname: 'Dobby', male: true, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', house: 'none' },
        { role: 'Creature', id: 12, name: 'Buckbeak', surname: '', longname: 'Buckbeak', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', house: 'none' },
        { role: 'External', id: 13, name: 'Sirius', surname: 'Black', longname: 'Sirius Black', male: true, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral' },
        { role: 'Teacher', id: 30, name: 'Sybill', surname: 'Trelawney', longname: 'Professor Trelawney', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', subject: 'Divination' },
        { role: 'Teacher', id: 31, name: 'Septima', surname: 'Vector', longname: 'Professor Vector', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', subject: 'Arithmancy' },
        { role: 'Teacher', id: 32, name: 'Charity', surname: 'Burbage', longname: 'Professor Burbage', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', subject: 'Muggle Studies' },
        { role: 'Teacher', id: 33, name: 'Bathesda', surname: 'Bagshot', longname: 'Professor Bagshot', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral', subject: 'Ancient Runes' }
    );
    replaceCharacter('Teacher', 28, { role: 'Teacher', id: 29, name: 'Remus', surname: 'Lupin', longname: 'Professor Lupin', male: true, alignement: PhoenixOrderAlignment, connectionlvl: 'neutral', subject: 'Defense Against the Dark Arts', isHeadofHouse: false, house: 'none' });
    
    const hagrid = characterList.find(c => c.role === 'Staff' && c.id === 2);
    if (hagrid)
    {
        hagrid.role = 'Teacher';
        (hagrid as Character<'Teacher'>).subject = 'Care of Magical Creatures';
    }
}

/**
 * Updates characterList for Year 4.
 * Adds new external characters and replaces a teacher for the fourth year.
 */
export function characterListUpd_Y4()
{
    characterList.push(
        { role: 'External', id: 100, name: 'Viktor', surname: 'Krum', longname: 'Viktor Krum', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral' },
        { role: 'External', id: 101, name: 'Fleur', surname: 'Delacour', longname: 'Fleur Delacour', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral' },
        { role: 'External', id: 102, name: 'Gabrielle', surname: 'Delacour', longname: 'Gabrielle Delacour', male: false, alignement: NeutralAlignment, connectionlvl: 'neutral' }
    );
    replaceCharacter('Teacher', 29, { role: 'Teacher', id: 34, name: 'Alastor', surname: 'Moody', longname: 'Professor Moody', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', subject: 'Defense Against the Dark Arts', isHeadofHouse: false, house: 'none' });
}

/**
 * Updates characterList for Year 5.
 * Adds a new creature and replaces a teacher for the fifth year.
 */
export function characterListUpd_Y5()
{
    characterList.push({ role: 'Creature', id: 14, name: 'Grawp', surname: '', longname: 'Grawp', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', house: 'none' });
    replaceCharacter('Teacher', 34, { role: 'Teacher', id: 35, name: 'Dolores', surname: 'Umbridge', longname: 'Dolores Umbridge', male: false, alignement: DeathEaterAlignment, connectionlvl: 'foe', subject: 'Defense Against the Dark Arts', isHeadofHouse: false, house: 'none' });
}

/**
 * Updates characterList for Year 6.
 * Replaces a teacher and updates the subject of another teacher for the sixth year.
 */
export function characterListUpd_Y6()
{
    replaceCharacter('Teacher', 35, { role: 'Teacher', id: 36, name: 'Horace', surname: 'Slughorn', longname: 'Professor Slughorn', male: true, alignement: NeutralAlignment, connectionlvl: 'neutral', subject: 'Potions', isHeadofHouse: false, house: 'none' });
    
    const snape = characterList.find(c => c.role === 'Teacher' && c.id === 23);
    if (snape) (snape as Character<'Teacher'>).subject = 'Defense Against the Dark Arts';
}
//#endregion
