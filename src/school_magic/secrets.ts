
import * as io from "../utilities/input_output_helpers";
import * as npc from '../characters/character-functions';
import * as chitchat from "../dialogues/year-one-dialogues";
import { MainChara, subjectIncrement } from "../characters/maincharacter";
import { roomOfRequirementDiscovery } from "../dialogues/multi-year-dialogues";
import { getUniformSegments, showWheelResult, spinWheel } from "../wheel_magic/wheel_helpers";

/**
 * Handles the discovery of secret passages in Hogwarts.
 * @param chara The main character.
 * @returns The newly discovered secret passage.
 */
export async function secretPassages(chara: MainChara<'Wizard'>)
{
    await io.showText('While wandering the castle, you find a secret passage.');
    // io.showText('Do you want to enter it? (y/n)');
    // let answer = "";
    // do { answer = (await io.handleInput())?.toLowerCase(); }
    // while (answer !== "y" && answer !== "n");    
    // wheels.showWheelResult(answer === "y" ? "You enter the passage." : "You ignore the passage.");
    // if (answer === "n")
    // {
    //     wheels.showWheelResult('You choose to walk away.');
    //     return;
    // }

    let secrets = chara.secretPassages.filter(p => !p.discovered);
    let segments = getUniformSegments(secrets.map(p => p.name));

    const result = await spinWheel('Which secret passage did you discover?', segments);
    let newPassage = secrets.find(s => s.name === result);
    if (!newPassage) throw new Error('Secret passage not found.');

    await io.showText(newPassage!.description || 'No description available.');

    if (newPassage.name === 'Whomping Will')
    {
        await io.showText('It\'s not very clear how you discovered this, but one thing is for sure: you just demonstrated a talent for Herbology.');
        await subjectIncrement(chara, 'Herbology');
    }

    chara.secretPassages.find(p => p.name === newPassage!.name)!.discovered = true;
    return newPassage;
}

/**
 * Handles the discovery of the Mirror of Erised.
 * @param chara The main character.
 */
export async function mirrorOfErised(chara: MainChara<'Wizard'>)
{
    await chitchat.mirrorOfErised();
    chara.secrets.mirrorOfErised = true;
    showWheelResult('You discovered a secret!');
    let dumbledore = chara.characterList.find(s => s.surname === 'Dumbledore');
    await npc.improveConnection(chara, dumbledore!);
}

/**
 * Handles the discovery of the Room of Requirement.
 * @param chara The main character.
 */
export async function roomOfRequirement(chara: MainChara<'Wizard'>)
{
    await roomOfRequirementDiscovery(chara.name);
    chara.secrets.roomOfRequirement = true;
    showWheelResult('You discovered a secret!');
}