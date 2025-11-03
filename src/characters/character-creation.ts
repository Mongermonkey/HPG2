
import * as random from '../utilities/Random';
import { characterList } from "../characters/characters";
import { sevenNums } from "../utilities/basetypes";
import { Grade } from '../utilities/compositetypes';
import * as wheels from "../wheel_magic/wheel_helpers";
import * as io from "../utilities/input_output_helpers";
import { animal, subject } from '../utilities/basetypes';
import { newSegment } from '../wheel_magic/wheel_helpers';
import { Wheel } from '../wheel_magic/Wheel';
import { Baseclass, MainChara, Gifts, Pet } from './maincharacter';

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

    wheels.seeWheel(true);
    
    let blood = await sortBlood();
    await io.nextEvent();

    let gifts = await sortGifts(name);
    await io.nextEvent();

    wheels.seeWheel(false);
    io.showText("");

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
    let gender: string | undefined = "";

    io.showText("Choose your gender: (m/f)");
    do { gender = (await io.handleInput())?.toLowerCase(); }
    while (gender !== "m" && gender !== "f");

    wheels.showWheelResult(gender === "m" ? "male" : "female");
    nextBtn.disabled = false;
    return gender as "m" | "f";
}

/**
 * Permette al giocatore di scegliere il nome del personaggio.
 * @returns Il nome scelto.
 */
async function writeName(): Promise<string>
{
    nextBtn.disabled = true;
    let name: string | undefined = "";
    
    io.showText("What is your name?");
    do { name = await io.handleInput(); }
    while (!name || name.length < 2);

    wheels.showWheelResult(`Your name is: '${name}'.`);
    nextBtn.disabled = false;
    return name;
}

/**
 * Sorteggia il tipo di sangue del personaggio.
 * @returns "pure" | "half" | "mud"
 */
export async function sortBlood(): Promise<"pure" | "half" | "mud">
{
    spinBtn.disabled = true;
    io.showText("Which blood is your blood?");

    myWheel.setSegments([
        newSegment('pureblood', 0.12),
        newSegment('halfblood', 0.7),
        newSegment('mudblood', 0.18),
    ]);

    const wheelStop = await wheels.spinWheel(myWheel);

    let blood: "pure" | "half" | "mud";
    switch (wheelStop.text)
    {
        case "pureblood": blood = "pure"; break;
        case "halfblood": blood = "half"; break;
        case "mudblood": blood = "mud"; break;
        default: blood = "half";
    }
    return blood;
}

/**
 * Sorteggia i doni/maledizioni del personaggio.
 * @returns L'oggetto gifts del pg.
 */
export async function sortGifts(name: string): Promise<Gifts>
{
    spinBtn.disabled = true;
    io.showText("Were you marked by any gift or curse?");

    myWheel.setSegments([
        newSegment('none', 0.9),
        newSegment('gift', 0.1)
    ]);

    let wheelStop = await wheels.spinWheel(myWheel);
    await io.nextEvent();

    if (wheelStop.text === "none")
    {
        io.showText(`No gift or curse has been bestowed upon you, ${name}.\n Not yet, at least...`);
        return { metamorphmagus: 0, parselmouth: 0, sight: 0, lycanthropy: 0  };
    }

    io.showText(`Some mystical mark has been bestowed upon you, ${name}.\n Let's see what it is...`);

    spinBtn.disabled = true;
    myWheel.setSegments([
        newSegment('metamorphmagus', 0.40),
        newSegment('parselmouth', 0.25),
        newSegment('sight', 0.15),
        newSegment('lycanthropy', 0.20),
    ]);
    wheelStop = await wheels.spinWheel(myWheel);
    console.log(`Gift: ${wheelStop.text}`);

    let lvl = random.spin(25, 20, 15, 15, 10, 10, 5) as sevenNums;
    console.log(`Gift lvl: ${lvl}`);

    let gifts: Gifts = { metamorphmagus: 0, parselmouth: 0, sight: 0, lycanthropy: 0  };
    let msg = "";
    switch (wheelStop.text)
    {
        case "metamorphmagus":
            msg = `You are a Metamorphmagus(${lvl}), ${name}.\nYou're able to change your appearance at will, up to some degree.`;
            gifts.metamorphmagus = lvl;
            break;
        case "parselmouth":
            msg = `You're a Parselmouth(${lvl}), ${name}.\nYou have the ability to understand and speak the secret language of snakes.`;
            gifts.parselmouth = lvl;
            break;
        case "sight":
            msg = `You have THE SIGHT! (${lvl}).\nYou're able to see into the future, up to some degree.`;
            gifts.sight = lvl;
            break;
        case "lycanthropy":
            msg = `Alas, years ago you were bitten by a werewolf,\nand suffer from Lycanthropy (${lvl}): every full moon night you transform into a beast.`;
            gifts.lycanthropy = lvl;
            break;
    }
    io.showText(msg);
    return gifts;
}

// #endregion

// #region URAWIZARD
/**
 * Create a new wizard character.
 * @param chara The base character information.
 * @returns The first-year wizard character.
 */
export async function urawizard(chara: Baseclass<'Default'>): Promise<MainChara<'Wizard'>>
{
    let pet = await sortPet();
    await io.nextEvent();

    let grades = await sortSkills();
    await io.nextEvent();

    return {
        gameclass: 'Wizard',
        gender: chara.gender,
        name: chara.name,
        blood: chara.blood,
        gifts: chara.gifts,
        pet: pet,
        alignment: "neutral",
        house: 'none',
        housePoints: 0,
        quidditchRole: "none",
        quidditchCaptain: false,
        stress: 0.0,
        fame: 0.0,
        clues: [false, false, false, false, false, false, false],
        characterList: [...characterList],
        quidditchGames: [],
        year: 1,
        grades: grades,
    };
}

/**
 * Sort a pet for the character.
 * @returns The pet sorted.
 */
async function sortPet(): Promise<Pet>
{
    nextBtn.disabled = true;
    let petType: animal = "none";
    let cat = newSegment('cat', 0.15), owl = newSegment('owl', 0.15),
    toad = newSegment('toad', 0.15), none = newSegment('none', 0.55);

    io.showText("Did you bring a pet to Hogwarts?");

    wheels.seeWheel(true);
    myWheel.setSegments([cat, owl, toad, none]);
    const wheelStop = await wheels.spinWheel(myWheel);
    petType = wheelStop.text as animal;

    if (petType === "none")
    {
        io.showText("You decided not to bring any pet with you.");
        await io.nextEvent();
        wheels.seeWheel(false);
        return {type: petType, name: ""};
    }

    let name = "";
    io.showText(`Wonderful, you brought a ${petType}!\nWhat is its name?`);
    do { name = await io.handleInput(); }
    while (!name || name.length < 2);
    await io.nextEvent();
    wheels.seeWheel(false);

    wheels.showWheelResult(`Your ${petType}'s name is: '${name}'.`);

    return {type: petType, name: name};
}

/**
 * Sort the mc skills.
 */
export async function sortSkills(): Promise<Grade[]>
{
    spinBtn.disabled = true;
    wheels.seeWheel(false);
    io.showText("Now, let's see how good are your natural skills...");
    wheels.seeWheel(true);
    await io.nextEvent();

    myWheel.setSegments(wheels.sevenSegments);
    let grades: Grade[] = [];   

    for (let subj of ['Astronomy', 'Charms', 'Defense Against the Dark Arts', 'Flying', 'Herbology', 'History of Magic', 'Potions', 'Transfiguration'] as subject[])
    {
        await sortSubjectSkill(subj, grades);
    }
    wheels.seeWheel(false);

    return grades;
}

/**
 * Spin the wheel for a specific subject.
 * @param subject The subject to spin for.
 * @param grades The array of grades to update.
 */
async function sortSubjectSkill(subject: subject, grades: Grade[]): Promise<void>
{
    io.showText(`Let's spin for ${subject}...`);
    const wheelStop = await wheels.spinWheel(myWheel);
    grades.push({subject, score: Number(wheelStop.text)});
    wheels.showWheelResult(`Your skill in ${subject}: '${wheelStop.text}'.`);
    await io.nextEvent();
}

// #endregion