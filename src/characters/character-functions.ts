
/**
 * Funzioni di supporto per la gestione dei personaggi e delle relazioni:
 * - Gestione amicizie e ruote (friendshipWheel, befriend, handleFriendshipOutcome)
 * - Ricerca e utilità personaggi (getStudentList, getCharacterByLongname, getById, isFriend, getRandomStudent)
 * - Gestione ruoli e docenti (getProfessorFromSubject, getRandomClassStudent, getHeadOfHouse, getQuidditchCaptain)
 */

import { shiftAlignment, MainChara } from './maincharacter';
import { Wheel } from '../wheel_magic/Wheel';
import * as wheels from '../wheel_magic/wheel_helpers';
import * as io from '../utilities/input_output_helpers';
import { Character, characterList } from './characters';
import { spinEqual } from '../utilities/random';
import { WheelSegment } from '../wheel_magic/wheel_helpers';
import { hogwartsHouseName, hogwartsRole } from '../utilities/basetypes';

/**
 * Handles friendship interactions between mc and npcs.
 * @param chara The mc.
 * @param sureFriend If true, the wheel will not include the "mind your business" option, and the player will always befriend someone.
 * @param senior True to consider only senior students, false for non-senior, undefined for all.
 */
export async function friendshipWheel(chara: MainChara<'Wizard'>, sureFriend?: boolean, senior?: boolean): Promise<void>
{
    const nextBtn = (window as any).nextBtn as HTMLButtonElement;
    nextBtn.disabled = true;

    if (!sureFriend)
    {
        let friendshipChance = Math.min(0.55 + chara.fame - chara.stress + (chara.quidditchRole != 'none' ? 0.10 : 0), 1);
        let chance = wheels.newSegment('Make friends', friendshipChance * 100),
            notchance = wheels.newSegment('Mind your business', 100 - friendshipChance * 100);
        
        const result = await wheels.spinWheel('Friendship Wheel! What do you do?', [chance, notchance]);
        if (result === 'Mind your business')
        {
            await io.showText('You decide to mind your own business.');
            return;
        }
    }

    await io.showText('You make friends!');

    await io.showText('Who do you befriend?');
    await befriend(chara, false, senior);
}

/**
 * Handles the process of befriending a character.
 * @param chara The main character.
 * @param sameHouse Whether to consider only characters from the same house.
 * @param senior True to consider only senior students, false for non-senior, undefined for all.
 */
export async function befriend(chara: MainChara<'Wizard'>, sameHouse: boolean, senior?: boolean): Promise<void>
{
    let result = await wheels.spinWheel('Who do you befriend?', getStudentList(chara, sameHouse, senior));
    let newFriend = getCharacterByLongname(characterList, result) as Character<'Student'>;
    
    await improveConnection(chara, newFriend);
    wheels.seeWheel(false);
}

/**
 * Handles the improving connection with a character: including friendship level upgrades + special cases.
 * @param chara The main character.
 * @param friend The character whose connection is being improved: works with both the Character object and Character.longname.
 */
export async function improveConnection(chara: MainChara<'Wizard'>, friend: Character<hogwartsRole> | string): Promise<void>
{
    if (typeof friend === 'string')
    {
        friend = getCharacterByLongname(characterList, friend) as Character<hogwartsRole>;
        if (!friend) throw new Error('Character with longname ' + friend + ' not found.');
    }

    if (friend.role != 'Student')
    {
        await io.showText('Your relation with ' + friend.longname + ' has improved.');
        switch (friend.connectionlvl)
        {
            case 'foe': friend.connectionlvl = 'neutral'; break;
            case 'none':
            case 'neutral': friend.connectionlvl = 'friend'; break;
            case 'friend': friend.connectionlvl = 'bff'; break;
        }
        return;
    }
    let studentFriend = friend as Character<'Student'>;
    switch (studentFriend?.connectionlvl)
    {
        case 'foe':
            studentFriend.connectionlvl = 'neutral';
            await io.showText('You and ' + studentFriend.longname + ', who used to despise you, unexpectedly became friends. Cheers!');
            break;
        case 'none':
        case 'neutral':
            studentFriend.connectionlvl = 'friend';
            await io.showText('You befriended ' + studentFriend.longname + ' (' + studentFriend.house + ')!');
            break;
        case 'friend':
            studentFriend.connectionlvl = 'bff';
            await io.showText('You and ' + studentFriend.longname + ' are now BFFs! Cheers!');
            break;
        case 'bff':
            studentFriend.connectionlvl = 'lover';
            await io.showText('Something changed between you and ' + studentFriend.longname + '.\nAfter what you\'ve been through, you and ' + studentFriend.name + ' became lovers!');
            break;
    }

    if (['Harry', 'Ron', 'Hermione'].includes(studentFriend.name))
    {
        let harry = getCharacterByLongname(chara.characterList, 'Harry Potter'),
        ron = getCharacterByLongname(chara.characterList, 'Ron Weasley'),
        hermione = getCharacterByLongname(chara.characterList, 'Hermione Granger');        

        // Presenta gli altri membri del golden trio
        if (studentFriend.longname !== 'Harry Potter')
        {
            await io.showText(studentFriend.name + ' introduced you to his friend ' + harry!.longname + ' (Gryffindor).');
            harry!.connectionlvl = 'friend';
        }
        if (studentFriend.longname !== 'Ron Weasley')
        {
            await io.showText(studentFriend.name + ' introduced you to his friend ' + ron!.longname + ' (Gryffindor).');
            ron!.connectionlvl = 'friend';
        }
        if (studentFriend.longname !== 'Hermione Granger')
        {
            await io.showText(studentFriend.name + ' introduced you to his friend ' + hermione!.longname + ' (Gryffindor).');
            hermione!.connectionlvl = 'friend';
        }

        await shiftAlignment(chara, 'phoenix_order', 3);
    }
    else if (studentFriend.longname === 'Draco Malfoy')
    {
        let crabbe = getCharacterByLongname(chara.characterList, 'Vincent Crabbe'),
        goyle = getCharacterByLongname(chara.characterList, 'Gregory Goyle');

        // Presenta i due scagnozzi di Draco se non sono già amici
        if (!isFriend(crabbe))
        {
            await io.showText('Draco introduced you to his friend ' + crabbe!.longname + ' (Slytherin).');
            crabbe!.connectionlvl = 'friend';
        }
        if (!isFriend(goyle))
        {
            await io.showText('Draco introduced you to his friend ' + goyle!.longname + ' (Slytherin).');
            goyle!.connectionlvl = 'friend';
        }
        
        await shiftAlignment(chara, 'death_eater', 3);
    }

    // Mappa bidirezionale dei longname dei gemelli
    const twinPairs: Record<string, string> = {
        'Fred Weasley': 'George Weasley',
        'George Weasley': 'Fred Weasley',
        'Padma Patil': 'Parvati Patil',
        'Parvati Patil': 'Padma Patil'
    };

    if (['Fred Weasley', 'George Weasley', 'Padma Patil', 'Parvati Patil'].includes(studentFriend.longname))
    {
        const other = getCharacterByLongname(chara.characterList, twinPairs[studentFriend.longname]!)!;
        other.connectionlvl = 'friend';
        await io.showText('You got to know ' + studentFriend.name + '\'s ' + (studentFriend.name === 'Fred' || studentFriend.name === 'George Weasley' ? 'twin brother' : 'twin sister') + ' ' + other.name + ' as well!');
    }
}

/**
 * Handles the worsening connection with a character: including friendship level downgrades + special cases.
 * @param chara The main character.
 * @param foe The character whose connection is being worsened.
 */
export async function worsenConnection(chara: MainChara<'Wizard'>, foe: Character<hogwartsRole>): Promise<void>
{
    await io.showText('Your relation with ' + foe.longname + ' has worsened.');
    switch (foe.connectionlvl)
    {
        case 'lover': foe.connectionlvl = 'friend'; break;
        case 'bff': foe.connectionlvl = 'friend'; break;
        case 'friend': foe.connectionlvl = 'neutral'; break;
        case 'none':
        case 'neutral': foe.connectionlvl = 'foe'; break;
    }

    if (foe.longname === 'Draco Malfoy' && foe.connectionlvl === 'foe')
    {
        let crabbe = getCharacterByLongname(chara.characterList, 'Vincent Crabbe'), goyle = getCharacterByLongname(chara.characterList, 'Gregory Goyle');
        crabbe!.connectionlvl = 'foe';
        goyle!.connectionlvl = 'foe';
        await io.showText('Vincent Crabbe and Gregory Goyle, Draco\'s closest friends, are also upset with you for what happened with Draco.\nYour relation with them has worsened as well.');
    }

    if ((foe.longname === 'Fred Weasley' || foe.longname === 'George Weasley') && foe.connectionlvl === 'foe')
    {
        let otherName = foe.longname === 'Fred Weasley' ? 'George Weasley' : 'Fred Weasley';
        let other = getCharacterByLongname(chara.characterList, otherName);
        other!.connectionlvl = 'foe';
        await io.showText('Your relation with ' + otherName + ' has worsened as well.');
    }

    if ((foe.longname === 'Padma Patil' || foe.longname === 'Parvati Patil') && foe.connectionlvl === 'foe')
    {
        let otherName = foe.longname === 'Padma Patil' ? 'Parvati Patil' : 'Padma Patil';
        let other = getCharacterByLongname(chara.characterList, otherName);
        other!.connectionlvl = 'foe';
        await io.showText('Your relation with ' + otherName + ' has worsened as well.');
    }
    
    return;
}

/**
 * Gets a list of student segments.
 * @param chara The main character.
 * @param sameHouse Whether to filter for students from the same house as the mc.
 * @param senior Whether to filter for senior students, non-senior students, or all students.
 * @returns A list of student segments.
 */
export function getStudentList(chara: MainChara<'Wizard'>, sameHouse: boolean = false, senior?: boolean): WheelSegment[]
{
    let students = chara.characterList.filter(
        c => c.role === 'Student'
        && c.connectionlvl !== 'lover'
    ) as Character<'Student'>[];

    if (sameHouse) students = students.filter(s => s.house === chara.house);    

    students = senior === false
        ? students.filter(c => c.senior === false)
        : senior === true
        ? students.filter(c => c.senior === true)
        : students;

    const fraction = students.length > 0 ? 100 / students.length : 0;

    return students.map(s => wheels.newSegment(s.longname, fraction));
}

/**
 * Gets a character by their long name.
 * @param characterlist The list of characters to search.
 * @param longname The long name of the character to find.
 * @returns The character with the matching long name, or undefined if not found.
 */
export function getCharacterByLongname(characterlist: Character<hogwartsRole>[], longname: string): Character<hogwartsRole> | undefined
{
    return characterlist.find(c => c.longname === longname);
}

/**
 * Gets a character by their id.
 * @param characterlist The list of characters to search.
 * @param id The id of the character to find.
 * @returns The character with the matching id, or undefined if not found.
 */
function getById(characterlist: Character<hogwartsRole>[], id: number): Character<hogwartsRole> | undefined
{
    return characterlist.find(c => c.id === id);
}

/**
 * Checks if a character is a friend.
 * @param characterlist The list of characters to search.
 * @param id The id of the character to check.
 * @returns True if the character is a friend, false otherwise.
 */
export function isFriend(character: Character<hogwartsRole> | undefined): boolean
{
    return character?.connectionlvl === 'friend' || character?.connectionlvl === 'bff' || character?.connectionlvl === 'lover';
}

/**
 * Checks if a character is a friend by their long name.
 * @param characterlist The list of characters to search.
 * @param longname The long name of the character to check.
 * @returns True if the character is a friend, false otherwise.
 */
export function isFriendByLongname(characterlist: Character<hogwartsRole>[], longname: string): boolean
{
    const connlvl = getCharacterByLongname(characterlist, longname)?.connectionlvl;
    return connlvl === 'friend' || connlvl === 'bff' || connlvl === 'lover';
}

/**
 * Gets a random student from the character list.
 * @param characterlist The list of characters to search.
 * @param sameyear If true, only consider students from the same year as the main character;
 *                  if false, only consider students from different years;
 *                  if undefined, consider all students.
 * @param houses If provided, only consider students from the specified houses.
 * @returns A random student character, or undefined if none found.
 */
export function getRandomStudent(characterlist: Character<hogwartsRole>[], sameyear?: boolean, houses?: hogwartsHouseName[] | undefined): Character<'Student'> | undefined
{
    let students = characterlist.filter(c => c.role === 'Student') as Character<'Student'>[];
    if (houses && houses.length > 0)
    {
        students = students.filter(s => houses.includes(s.house));
    }
    if (sameyear !== undefined)
    {
        students = students.filter(s => s.senior === !sameyear);
    }
    if (students.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * students.length);
    return students[randomIndex];
}

/**
 * Restituisce il professore di una materia dalla lista personaggi.
 */
export function getProfessorFromSubject(characterList: any[], subject: string): any
{
    return characterList.find(c => c.role === 'Teacher' && c.subject === subject);
}

/**
 * Gets the head of house for a specific house.
 * @param characterList The list of characters to search.
 * @param house The house to find the head for.
 * @returns The head of house character, or undefined if not found.
 */
export function getHeadOfHouse(characterList: any[], house: hogwartsHouseName): Character<'Teacher'>
{
    return characterList.find(c => c.role === 'Teacher' && c.isHeadofHouse && c.house === house);
}

/**
 * Gets the Quidditch captain for a specific house.
 */
export function getQuidditchCaptain(characterList: any[], house: hogwartsHouseName): Character<'Student'>
{
    return characterList.find(c => c.role === 'Student' && c.captain && c.house === house);
}

/**
 * Restituisce il numero di amici (friend, bff, lover) nella lista personaggi.
 * @param characterList Lista dei personaggi da esaminare.
 * @returns Numero di amici.
 */
export function countFriends(characterList: Character<hogwartsRole>[]): number {
    return characterList.filter(c => c.connectionlvl === 'friend' || c.connectionlvl === 'bff' || c.connectionlvl === 'lover').length;
}

/**
 * Restituisce un elemento random dalla lista che sia un amico (friend, bff, lover).
 * @param characterList Lista dei personaggi da cui estrarre.
 * @returns Un Character che è amico, oppure undefined se nessuno trovato.
 */
export function getRandomFriend(characterList: Character<hogwartsRole>[]): Character<hogwartsRole> | undefined
{
    const friends = characterList.filter(isFriend);
    if (friends.length === 0) return undefined;
    return spinEqual(friends);
}