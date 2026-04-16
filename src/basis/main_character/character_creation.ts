/**
 * Funzioni di supporto per la creazione e l'inizializzazione del personaggio principale:
 * - Creazione del personaggio (createCharacter, chooseGender, writeName)
 * - Sorteggio delle caratteristiche (sortBlood, sortGifts)
 * - Inizializzazione del mago e delle sue proprietà (urawizard, sortPet, sortSkills)
 */

import * as d from '../../dialogues/_index';
import * as u from '../../utilities/_index';
import { Wheel } from '../../utilities/_index';
import { characterList } from '../npcs/characters';
import { Baseclass, MainChara } from './maincharacter';
import { animal, race, subject, bloodStatus, sevenNums } from '../types/base_types';
import { firstYearClues, freshPassages, Grade, NeutralAlignment, HogwartsSecrets, Gifts, Pet } from '../types/complex_types';

function getMyWheel(): Wheel
{
    const myWheel = (window as any).myWheel as Wheel | undefined;
    if (!myWheel) throw new Error('Wheel non inizializzata.');
    return myWheel;
}

function getNextBtn(): HTMLButtonElement
{
    const nextBtn = (window as any).nextBtn as HTMLButtonElement | undefined;
    if (!nextBtn) throw new Error('Pulsante Next non inizializzato.');
    return nextBtn;
}

// #region Character Creation

/**
 * Creates the main character.
 */
export async function createCharacter(): Promise<Baseclass<'Default'>>
{
    let gender = await chooseGender();
    await new Promise(resolve => setTimeout(resolve, 0));
    await u.nextEvent();

    let name = await writeName();
    await new Promise(resolve => setTimeout(resolve, 0));
    await u.nextEvent();
    
    let blood = await sortBlood();
    let race = await sortRace(blood);
    let gifts = await sortGifts(name);

    let chara: Baseclass<'Default'> = {gameclass: 'Default', gender, name, blood, race, gifts}
    return chara;
}

/**
 * Permette al giocatore di scegliere il genere del personaggio.
 * @returns "m" or "f"
 */ 
async function chooseGender(): Promise<"m" | "f">
{
    const nextBtn = getNextBtn();
    nextBtn.disabled = true;
    let gender: string | undefined = '';

    await u.showText('Choose your gender: (m/f)', false);

    do { gender = (await u.handleInput())?.toLowerCase(); }
    while (gender !== 'm' && gender !== 'f');

    u.showWheelResult(gender === 'm' ? 'male' : 'female');
    nextBtn.disabled = false;
    return gender as 'm' | 'f';
}

/**
 * Permette al giocatore di scegliere il nome del personaggio.
 * @returns Il nome scelto.
 */
async function writeName(): Promise<string>
{
    const nextBtn = getNextBtn();
    nextBtn.disabled = true;
    let name: string | undefined = '';
    
    await u.showText('What is your name?', false);
    do { name = await u.handleInput(); }
    while (!name || name.length < 2);

    u.showWheelResult('Your name is: \'' + name + '\'.');
    nextBtn.disabled = false;
    return name;
}

/**
 * Sort and returns the character's blood.
 */
async function sortBlood(): Promise<bloodStatus>
{
    let bloodOptions = [ u.newSegment('pureblood', 12), u.newSegment('halfblood', 70), u.newSegment('mudblood', 18) ];

    const result = await u.spinWheel('Which blood is your blood?', bloodOptions);
    let blood: bloodStatus = result === 'pureblood' ? 'pure' : result === 'mudblood' ? 'mud' : 'half';

    await u.nextEvent();
    await d.sortBlood(blood);
    return blood;
}

/**
 * Sort and returns the character's race.
 */
async function sortRace(blood: bloodStatus): Promise<race>
{
    console.log('BLOOD: ' + blood);
    let races = blood != 'half'
        ? [ u.newSegment('human', 98), u.newSegment('werewolf', 2) ]
        : [ u.newSegment('human', 79), u.newSegment('half-giant', 7), u.newSegment('half-veela', 7), u.newSegment('werewolf', 7) ];

    const result = await u.spinWheel('Which kind is your kind?', races) as race;

    await u.nextEvent();
    await d.sortRace(result);
    return result;
}

/**
 * Sorts and returns the character's gifts.
 */
async function sortGifts(name: string): Promise<Gifts>
{
    // spinBtn.disabled = true;
    let giftOptions = [ u.newSegment('none', 90), u.newSegment('gift', 10) ];
    let result = await u.spinWheel('Were you marked by any gift or curse?', giftOptions);
    await u.nextEvent();

    if (result === 'none')
    {
        await u.showText('No gift or curse has been bestowed upon you, ' + name + '.\n Not yet, at least...');
        return { metamorphmagus: 0, parselmouth: 0, sight: 0 };
    }

    // spinBtn.disabled = true;
    giftOptions = [
        u.newSegment('metamorphmagus', 70),
        u.newSegment('parselmouth', 20),
        u.newSegment('sight', 10),
    ];
    result = await u.spinWheel('Some mystical mark has been bestowed upon you, ' + name + '.\n Let\'s see what it is...', giftOptions);

    let lvl = u.spin(25, 20, 15, 15, 10, 10, 5) as sevenNums;

    let gifts: Gifts = { metamorphmagus: 0, parselmouth: 0, sight: 0 };
    let msg = '';
    switch (result)
    {
        case 'metamorphmagus':
            msg = `You are a Metamorphmagus(${lvl}), ${name}!\nYou're able to change your appearance at will, up to some degree.`;
            gifts.metamorphmagus = lvl;
            break;
        case 'parselmouth':
            msg = `You're a Parselmouth(${lvl}), ${name}.\nYou have the ability to understand and speak the secret language of snakes.`;
            gifts.parselmouth = lvl;
            break;
        case 'sight':
            msg = `You have THE SIGHT! (${lvl}).\nYou're able to see into the future, up to some degree.`;
            gifts.sight = lvl;
            break;
    }
    await u.showText(msg);
    return gifts;
}

// #endregion

// #region URAWIZARD (human player)
/**
 * Create a new wizard character.
 * @param chara The base character information.
 * @returns The first-year wizard character.
 */
export async function urawizard(chara: Baseclass<'Default'>): Promise<MainChara<'Wizard'>>
{
    let pet = await sortPet();

    let grades = await sortSkills();

    return {
        gameclass: 'Wizard',
        gender: chara.gender,
        name: chara.name,
        blood: chara.blood,
        race: chara.race,
        gifts: chara.gifts,
        pet: pet,
        alignment: NeutralAlignment,
        house: 'none',
        housePoints: 0,
        quidditchRole: "none",
        quidditchCaptain: false,
        stress: 0,
        fame: 0,
        infamy: 0,
        clues: firstYearClues,
        secrets: HogwartsSecrets,
        characterList: [...characterList],
        quidditchGames: [],
        year: 1,
        grades: grades,
        secretPassages: freshPassages,
        mainQuestProgress: 0
    };
}

/**
 * Sort a pet for the character.
 * @returns The pet sorted.
 */
async function sortPet(): Promise<Pet>
{
    let cat = u.newSegment('cat', 15), owl = u.newSegment('owl', 15),
    toad = u.newSegment('toad', 15), none = u.newSegment('none', 55);

    let result = await u.spinWheel('Did you bring a pet to Hogwarts?', [cat, owl, toad, none]) as animal;

    if (result === 'none')
    {
        await u.showText('You decided not to bring any pet with you.');
        return {type: result, name: ''};
    }

    let name = '';
    await u.showText('Wonderful, you brought a ' + result + '!\nWhat is its name?', false);
    do { name = await u.handleInput(); }
    while (!name || name.length < 2);

    u.showWheelResult('Your ' + result + '\'s name is: \'' + name + '\'.');

    return {type: result, name: name};
}

/**
 * Sort the mc skills.
 */
async function sortSkills(): Promise<Grade[]>
{    
    await u.showText('Now, let\'s see how good are your natural skills...');

    const myWheel = getMyWheel();
    myWheel.setSegments(u.sevenSegments);
    let grades: Grade[] = [];
    const coreSubjects = ['Astronomy', 'Charms', 'Defense Against the Dark Arts', 'Flying', 'Herbology', 'History of Magic', 'Potions', 'Transfiguration'] as subject[];

    for (let i = 0; i < coreSubjects.length; i++)
    {
        const subject = coreSubjects[i];
        let result = await u.spinWheel('Let\'s spin for ' + subject + '...', u.sevenSegments, false);
        grades.push({subject, score: Number(result)});
        u.showWheelResult('Your skill in ' + subject + ': ' + result);
        await u.nextEvent();
        u.seeWheel(false);
    }
    for (let subject of ['Ancient Runes', 'Arithmancy', 'Divination', 'Care of Magical Creatures', 'Muggle Studies'] as subject[])
    {
        grades.push({subject, score: 0});
    }

    return grades;
}

// #endregion