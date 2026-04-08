/**
 * Funzioni di supporto per la creazione e l'inizializzazione del personaggio principale:
 * - Creazione del personaggio (createCharacter, chooseGender, writeName)
 * - Sorteggio delle caratteristiche (sortBlood, sortGifts)
 * - Inizializzazione del mago e delle sue proprietà (urawizard, sortPet, sortSkills)
 */

import { Wheel } from '../wheel_magic/Wheel';
import * as random from '../utilities/random';
import * as wheels from '../wheel_magic/wheel_helpers';
import * as io from '../utilities/input_output_helpers';
import { characterList } from '../characters/characters';
import { animal, subject } from '../utilities/basetypes';
import { newSegment } from '../wheel_magic/wheel_helpers';
import * as chitchat from '../dialogues/year-one-dialogues';
import { bloodStatus, sevenNums } from '../utilities/basetypes';
import { Baseclass, MainChara, Gifts, Pet } from './maincharacter';
import { Secrets, firstYearClues, freshPassages, Grade, NeutralAlignment, HogwartsSecrets } from '../utilities/compositetypes';

const myWheel = (window as any).myWheel as Wheel;
const nextBtn = (window as any).nextBtn as HTMLButtonElement;
const spinBtn = (window as any).spinBtn as HTMLButtonElement;

// #region Character Creation
/**
 * Crea il personaggio principale.
 * @returns Il personaggio creato.
 */
export async function createCharacter(): Promise<Baseclass<'Default'>>
{
    let gender = await chooseGender();
    await new Promise(resolve => setTimeout(resolve, 0));
    await io.nextEvent();

    let name = await writeName();
    await new Promise(resolve => setTimeout(resolve, 0));
    await io.nextEvent();
    
    let blood = await sortBlood();

    let gifts = await sortGifts(name);

    let chara: Baseclass<'Default'> = {gameclass: 'Default', gender, name, blood, gifts}
    return chara;
}

/**
 * Permette al giocatore di scegliere il genere del personaggio.
 * @returns "m" or "f"
 */ 
async function chooseGender(): Promise<"m" | "f">
{
    nextBtn.disabled = true;
    let gender: string | undefined = '';

    await io.showText('Choose your gender: (m/f)', false);

    do { gender = (await io.handleInput())?.toLowerCase(); }
    while (gender !== 'm' && gender !== 'f');

    wheels.showWheelResult(gender === 'm' ? 'male' : 'female');
    nextBtn.disabled = false;
    return gender as 'm' | 'f';
}

/**
 * Permette al giocatore di scegliere il nome del personaggio.
 * @returns Il nome scelto.
 */
async function writeName(): Promise<string>
{
    nextBtn.disabled = true;
    let name: string | undefined = '';
    
    await io.showText('What is your name?', false);
    do { name = await io.handleInput(); }
    while (!name || name.length < 2);

    wheels.showWheelResult('Your name is: \'' + name + '\'.');
    nextBtn.disabled = false;
    return name;
}

/**
 * Sorteggia il tipo di sangue del personaggio.
 * @returns "pure" | "half" | "mud"
 */
export async function sortBlood(): Promise<bloodStatus>
{
    let bloodOptions = [
        newSegment('pureblood', 12),
        newSegment('halfblood', 70),
        newSegment('mudblood', 18)
    ];

    const result = await wheels.spinWheel('Which blood is your blood?', bloodOptions);

    let blood: bloodStatus;
    switch (result)
    {
        case 'pureblood': blood = 'pure'; break;
        case 'halfblood': blood = 'half'; break;
        case 'mudblood': blood = 'mud'; break;
        default: blood = 'half';
    }
    wheels.seeWheel(false);
    await chitchat.sortBlood(blood);
    return blood;
}

/**
 * Sorteggia i doni/maledizioni del personaggio.
 * @returns L'oggetto gifts del pg.
 */
export async function sortGifts(name: string): Promise<Gifts>
{
    // spinBtn.disabled = true;
    let giftOptions = [ newSegment('none', 90), newSegment('gift', 10) ];
    let result = await wheels.spinWheel('Were you marked by any gift or curse?', giftOptions);

    if (result === 'none')
    {
        await io.showText('No gift or curse has been bestowed upon you, ' + name + '.\n Not yet, at least...');
        return { metamorphmagus: 0, parselmouth: 0, sight: 0, lycanthropy: 0  };
    }

    // spinBtn.disabled = true;
    giftOptions = [
        newSegment('metamorphmagus', 40),
        newSegment('lycanthropy', 25),
        newSegment('parselmouth', 25),
        newSegment('sight', 10),
    ];
    result = await wheels.spinWheel('Some mystical mark has been bestowed upon you, ' + name + '.\n Let\'s see what it is...', giftOptions);

    let lvl = random.spin(25, 20, 15, 15, 10, 10, 5) as sevenNums;

    let gifts: Gifts = { metamorphmagus: 0, parselmouth: 0, sight: 0, lycanthropy: 0  };
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
        case 'lycanthropy':
            msg = `Alas, years ago you were bitten by a werewolf,\nand suffer from Lycanthropy (${lvl}): every full moon night you transform into a beast.`;
            gifts.lycanthropy = lvl;
            break;
    }
    await io.showText(msg);
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
        gifts: chara.gifts,
        pet: pet,
        alignment: NeutralAlignment,
        house: 'none',
        housePoints: 0,
        quidditchRole: "none",
        quidditchCaptain: false,
        stress: 0.0,
        fame: 0.0,
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
    let cat = newSegment('cat', 15), owl = newSegment('owl', 15),
    toad = newSegment('toad', 15), none = newSegment('none', 55);

    let result = await wheels.spinWheel('Did you bring a pet to Hogwarts?', [cat, owl, toad, none]) as animal;

    if (result === 'none')
    {
        await io.showText('You decided not to bring any pet with you.');
        return {type: result, name: ''};
    }

    let name = '';
    await io.showText('Wonderful, you brought a ' + result + '!\nWhat is its name?', false);
    do { name = await io.handleInput(); }
    while (!name || name.length < 2);

    wheels.showWheelResult('Your ' + result + '\'s name is: \'' + name + '\'.');

    return {type: result, name: name};
}

/**
 * Sort the mc skills.
 */
export async function sortSkills(): Promise<Grade[]>
{    
    await io.showText('Now, let\'s see how good are your natural skills...');

    myWheel.setSegments(wheels.sevenSegments);
    let grades: Grade[] = [];
    const coreSubjects = ['Astronomy', 'Charms', 'Defense Against the Dark Arts', 'Flying', 'Herbology', 'History of Magic', 'Potions', 'Transfiguration'] as subject[];

    for (let i = 0; i < coreSubjects.length; i++)
    {
        const subject = coreSubjects[i];
        let result = await wheels.spinWheel('Let\'s spin for ' + subject + '...', wheels.sevenSegments, false);
        grades.push({subject, score: Number(result)});
        wheels.showWheelResult('Your skill in ' + subject + ': ' + result);
        await io.nextEvent();
        wheels.seeWheel(false);
    }
    for (let subject of ['Ancient Runes', 'Arithmancy', 'Divination', 'Care of Magical Creatures', 'Muggle Studies'] as subject[])
    {
        grades.push({subject, score: 0});
    }

    return grades;
}

// #endregion