
import { MainChara } from "./maincharacter";
import { Wheel } from '../wheel_magic/Wheel';
import * as wheels from "../wheel_magic/wheel_helpers";
import * as io from "../utilities/input_output_helpers";
import { Character, characterList } from './characters';
import { WheelSegment } from '../wheel_magic/wheel_helpers';
import { hogwartsHouse, hogwartsRole } from "../utilities/basetypes";

/**
 * Handles interactions between mc and npcs.
 * @param chara The mc.
 */
export async function friendshipWheel(chara: MainChara<'Wizard'>, sureFriend?: boolean, senior?: boolean): Promise<void>
{
    const myWheel = (window as any).myWheel as Wheel;
    const nextBtn = (window as any).nextBtn as HTMLButtonElement;

    nextBtn.disabled = true;
    let wheelStop: WheelSegment;

    if (!sureFriend)
    {
        let friendshipChance = Math.min(0.55 + chara.fame - chara.stress + (chara.quidditchRole != 'none' ? 0.10 : 0), 1);
        let chance = wheels.newSegment('Make friends', friendshipChance),
            notchance = wheels.newSegment('Mind your business', 1 - friendshipChance);
        
        io.showText("Friendship Wheel! What do you do?");
        myWheel.setSegments([chance, notchance]);
        wheelStop = await wheels.spinWheel(myWheel);

        if (wheelStop.text === 'Mind your business')
        {
            io.showText("You decided to mind your own business.");
            return;
        }
    }

    io.showText("You made friends!");
    await io.nextEvent();
    io.showText("Who did you befriend?");

    await befriend(chara, false, senior);
    // let list = getStudentList(chara, senior);
    // myWheel.setSegments(list);
    // wheelStop = await wheels.spinWheel(myWheel);
    // let newFriend = getCharacterByLongname(characterList, wheelStop.text) as Character<'Student'>;

    // await handleFriendshipOutcome(chara, newFriend);
}

export async function befriend(chara: MainChara<'Wizard'>, sameHouse: boolean, senior?: boolean): Promise<void>
{
    const myWheel = (window as any).myWheel as Wheel;
    const nextBtn = (window as any).nextBtn as HTMLButtonElement;

    nextBtn.disabled = true;
    let wheelStop: WheelSegment;

    let list = getStudentList(chara, sameHouse, senior);

    myWheel.setSegments(list);
    wheels.seeWheel(true);
    wheelStop = await wheels.spinWheel(myWheel);
    let newFriend = getCharacterByLongname(characterList, wheelStop.text) as Character<'Student'>;

    await handleFriendshipOutcome(chara, newFriend);
    wheels.seeWheel(false);    
}

/**
 * Handles the outcome of befriending a new character, including friendship level upgrades and special cases.
 * @param chara The main character.
 * @param newFriend The character that was befriended.
 */
export async function handleFriendshipOutcome(chara: MainChara<'Wizard'>, newFriend: Character<'Student'>)
{
    switch (newFriend?.connectionlvl)
    {
        case 'foe':
            newFriend.connectionlvl = 'neutral';
            io.showText(`You and ${newFriend.longname}, who used to despise you, unexpectedly became friends. Cheers!`);
            break;
        case 'none':
        case 'neutral':
            newFriend.connectionlvl = 'friend';
            io.showText(`You befriended ${newFriend.longname} (${newFriend.house})!`);
            break;
        case 'friend':
            newFriend.connectionlvl = 'bff';
            io.showText(`You and ${newFriend.longname} are now BFFs! Cheers!`);
            break;
        case 'bff':
            newFriend.connectionlvl = 'lover';
            io.showText(`Something changed between you and ${newFriend.longname}.\nAfter what you've been through, you and ${newFriend.name} became lovers!`);
            break;
    }

    // Mappa del golden trio (bidirezionale)
    const goldenTrio: Record<number, {first: number, second: number}> =
        {55: {first: 56, second: 57}, 56: {first: 55, second: 57}, 57: {first: 55, second: 56}};
    if (goldenTrio[newFriend.id])
    {        
        let harry = getById(chara.characterList, 55), ron = getById(chara.characterList, 56), hermione = getById(chara.characterList, 57);
        let firstEnc = !isFriend(harry) && !isFriend(ron) && !isFriend(hermione);

        // Presenta ogni membro del trio che NON è ancora amico
        if (!isFriend(harry) && newFriend.id !== 55)
        {
            await io.nextEvent();
            io.showText(`${newFriend.name} introduced you to his friend ${harry!.longname} (Gryffindor).`);
            harry!.connectionlvl = 'friend';
        }
        if (!isFriend(ron) && newFriend.id !== 56)
        {
            await io.nextEvent();
            io.showText(`${newFriend.name} introduced you to his friend ${ron!.longname} (Gryffindor).`);
            ron!.connectionlvl = 'friend';
        }
        if (!isFriend(hermione) && newFriend.id !== 57)
        {
            await io.nextEvent();
            io.showText(`${newFriend.name} introduced you to his friend ${hermione!.longname} (Gryffindor).`);
            hermione!.connectionlvl = 'friend';
        }

        chara.alignment = 'phoenix_order';
        if (firstEnc) io.showText(`Your alignement has shifted.`);
        await io.nextEvent();
        return;
    }

    if (newFriend.id === 76)    // Draco Malfoy
    {
        let firstEnc = !isFriend(getById(chara.characterList, 76));
        let crabbe = getById(chara.characterList, 77), goyle = getById(chara.characterList, 78);
        if (!isFriend(crabbe))
        {
            await io.nextEvent();
            io.showText(`Draco introduced you to his friend ${crabbe!.longname} (Slytherin).`);
            crabbe!.connectionlvl = 'friend';
        }
        if (!isFriend(goyle))
        {
            await io.nextEvent();
            io.showText(`Draco introduced you to his friend ${goyle!.longname} (Slytherin).`);
            goyle!.connectionlvl = 'friend';
        }
        chara.alignment = 'death_eater';
        if (firstEnc) io.showText(`Your alignement has shifted.`);
        await io.nextEvent();
        return;
    }

    // Mappa delle coppie di gemelli (bidirezionale)
    const twinPairs: Record<number, number> = {45: 46, 46: 45, 62: 68, 68: 62};
    if (twinPairs[newFriend.id])
    {
        const otherId = twinPairs[newFriend.id];
        const other = getById(chara.characterList, otherId);
        if (!isFriend(other))
        {
            other!.connectionlvl = 'friend';
            const relationWord = newFriend.id < 60 ? 'his twin brother' : 'her twin sister';
            await io.nextEvent();
            io.showText(`You got to know ${newFriend.name}'s ${newFriend.id == 45 || newFriend.id == 46 ? 'twin brother' : 'twin sister'} ${other!.name} as well!`);
            await io.nextEvent();
        }
    }
}

/**
 * Gets a list of student segments.
 * @param chara The main character.
 * @param senior Whether to filter for senior students, non-senior students, or all students.
 * @returns A list of student segments.
 */
function getStudentList(chara: MainChara<'Wizard'>, sameHouse: boolean = false, senior?: boolean): WheelSegment[]
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

    const fraction = students.length > 0 ? 1 / students.length : 0;

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
 * Gets a random student from the character list.
 * @param characterlist The list of characters to search.
 * @param houses The list of houses to filter by.
 * @returns A random student character, or undefined if none found.
 */
function getRandomStudent(characterlist: Character<hogwartsRole>[], houses?: hogwartsHouse[] | undefined): Character<'Student'> | undefined
{
    let students = characterlist.filter(c => c.role === 'Student') as Character<'Student'>[];
    if (houses && houses.length > 0)
    {
        students = students.filter(s => houses.includes(s.house));
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
 * Estrae uno studente casuale dalla lista dei personaggi.
 */
export function getRandomClassStudent(characterList: any[]): any
{
    const students = characterList.filter(c => c.role === 'Student');
    if (!students.length) return undefined;
    
    const idx = Math.floor(Math.random() * students.length);
    return students[idx];
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