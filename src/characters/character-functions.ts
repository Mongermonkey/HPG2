
/**
 * Funzioni di supporto per la gestione dei personaggi e delle relazioni:
 * - Gestione amicizie e ruote (friendshipWheel, befriend, handleFriendshipOutcome)
 * - Ricerca e utilità personaggi (getStudentList, getCharacterByLongname, getById, isFriend, getRandomStudent)
 * - Gestione ruoli e docenti (getProfessorFromSubject, getRandomClassStudent, getHeadOfHouse, getQuidditchCaptain)
 */

import { MainChara } from "./maincharacter";
import { Wheel } from '../wheel_magic/Wheel';
import * as wheels from "../wheel_magic/wheel_helpers";
import * as io from "../utilities/input_output_helpers";
import { Character, characterList } from './characters';
import { spinEqual } from '../utilities/random';
import { WheelSegment } from '../wheel_magic/wheel_helpers';
import { hogwartsHouse, hogwartsRole } from "../utilities/basetypes";

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
        
        const result = await wheels.spinWheel("Friendship Wheel! What do you do?", [chance, notchance]);
        if (result === 'Mind your business')
        {
            io.showText("You decide to mind your own business.");
            await io.nextEvent();
            return;
        }
    }

    io.showText("You make friends!");
    await io.nextEvent();
    io.showText("Who do you befriend?");

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
    let result = await wheels.spinWheel("Who do you befriend?", getStudentList(chara, sameHouse, senior));
    let newFriend = getCharacterByLongname(characterList, result) as Character<'Student'>;
    
    await improveConnection(chara, newFriend);
    await io.nextEvent();
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
        if (!friend) throw new Error(`Character with longname ${friend} not found.`);
    }

    if (friend.role != 'Student')
    {
        io.showText('Your relation with ' + friend.longname + ' has improved.');
        await io.nextEvent();
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
            io.showText(`You and ${studentFriend.longname}, who used to despise you, unexpectedly became friends. Cheers!`);
            break;
        case 'none':
        case 'neutral':
            studentFriend.connectionlvl = 'friend';
            io.showText(`You befriended ${studentFriend.longname} (${studentFriend.house})!`);
            break;
        case 'friend':
            studentFriend.connectionlvl = 'bff';
            io.showText(`You and ${studentFriend.longname} are now BFFs! Cheers!`);
            break;
        case 'bff':
            studentFriend.connectionlvl = 'lover';
            io.showText(`Something changed between you and ${studentFriend.longname}.\nAfter what you've been through, you and ${studentFriend.name} became lovers!`);
            break;
    }

    // Mappa del golden trio (bidirezionale)
    const goldenTrio: Record<number, {first: number, second: number}> =
        {55: {first: 56, second: 57}, 56: {first: 55, second: 57}, 57: {first: 55, second: 56}};

    if (goldenTrio[studentFriend.id])
    {
        await io.nextEvent();
        let harry = getById(chara.characterList, 55), ron = getById(chara.characterList, 56), hermione = getById(chara.characterList, 57);
        let firstEnc = !isFriend(harry) && !isFriend(ron) && !isFriend(hermione);

        // Presenta ogni membro del trio che NON è ancora amico
        if (!isFriend(harry) && studentFriend.id !== 55)
        {
            io.showText(`${studentFriend.name} introduced you to his friend ${harry!.longname} (Gryffindor).`);
            harry!.connectionlvl = 'friend';
            await io.nextEvent();
        }
        if (!isFriend(ron) && studentFriend.id !== 56)
        {
            io.showText(`${studentFriend.name} introduced you to his friend ${ron!.longname} (Gryffindor).`);
            ron!.connectionlvl = 'friend';
            await io.nextEvent();
        }
        if (!isFriend(hermione) && studentFriend.id !== 57)
        {
            io.showText(`${studentFriend.name} introduced you to his friend ${hermione!.longname} (Gryffindor).`);
            hermione!.connectionlvl = 'friend';
            await io.nextEvent();
        }

        chara.alignment = 'phoenix_order';
        if (firstEnc) io.showText(`Your alignement has shifted.`);
        await io.nextEvent();
        return;
    }

    if (studentFriend.id === 76)    // Draco Malfoy
    {
        await io.nextEvent();
        let firstEnc = !isFriend(getById(chara.characterList, 76));
        let crabbe = getById(chara.characterList, 77), goyle = getById(chara.characterList, 78);
        if (!isFriend(crabbe))
        {
            io.showText(`Draco introduced you to his friend ${crabbe!.longname} (Slytherin).`);
            crabbe!.connectionlvl = 'friend';
            await io.nextEvent();
        }
        if (!isFriend(goyle))
        {
            io.showText(`Draco introduced you to his friend ${goyle!.longname} (Slytherin).`);
            goyle!.connectionlvl = 'friend';
            await io.nextEvent();
        }
        chara.alignment = 'death_eater';
        if (firstEnc) io.showText(`Your alignement has shifted.`);
        await io.nextEvent();
        return;
    }

    // Mappa delle coppie di gemelli (bidirezionale)
    const twinPairs: Record<number, number> = {45: 46, 46: 45, 62: 68, 68: 62};
    if (twinPairs[studentFriend.id])
    {
        await io.nextEvent();
        const otherId = twinPairs[studentFriend.id];
        const other = getById(chara.characterList, otherId);
        if (!isFriend(other))
        {
            other!.connectionlvl = 'friend';
            io.showText(`You got to know ${studentFriend.name}'s ${studentFriend.id == 45 || studentFriend.id == 46 ? 'twin brother' : 'twin sister'} ${other!.name} as well!`);
            await io.nextEvent();
        }
    }
}

/**
 * Handles the worsening connection with a character: including friendship level downgrades + special cases.
 * @param chara The main character.
 * @param foe The character whose connection is being worsened.
 */
export async function worsenConnection(chara: MainChara<'Wizard'>, foe: Character<hogwartsRole>): Promise<void>
{
    io.showText('Your relation with ' + foe.longname + ' has worsened.');
    await io.nextEvent();
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
        io.showText('Vincent Crabbe and Gregory Goyle, Draco\'s closest friends, are also upset with you for what happened with Draco.\nYour relation with them has worsened as well.');
        await io.nextEvent();
    }

    if ((foe.longname === 'Fred Weasley' || foe.longname === 'George Weasley') && foe.connectionlvl === 'foe')
    {
        let otherName = foe.longname === 'Fred Weasley' ? 'George Weasley' : 'Fred Weasley';
        let other = getCharacterByLongname(chara.characterList, otherName);
        other!.connectionlvl = 'foe';
        io.showText(`Your relation with ${otherName} has worsened as well.`);
        await io.nextEvent();
    }

    if ((foe.longname === 'Padma Patil' || foe.longname === 'Parvati Patil') && foe.connectionlvl === 'foe')
    {
        let otherName = foe.longname === 'Padma Patil' ? 'Parvati Patil' : 'Padma Patil';
        let other = getCharacterByLongname(chara.characterList, otherName);
        other!.connectionlvl = 'foe';
        io.showText(`Your relation with ${otherName} has worsened as well.`);
        await io.nextEvent();
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
export function getRandomStudent(characterlist: Character<hogwartsRole>[], sameyear?: boolean, houses?: hogwartsHouse[] | undefined): Character<'Student'> | undefined
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
export function getHeadOfHouse(characterList: any[], house: hogwartsHouse): Character<'Teacher'>
{
    return characterList.find(c => c.role === 'Teacher' && c.isHeadofHouse && c.house === house);
}

/**
 * Gets the Quidditch captain for a specific house.
 */
export function getQuidditchCaptain(characterList: any[], house: hogwartsHouse): Character<'Student'>
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
