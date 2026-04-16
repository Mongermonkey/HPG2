
/**
 * Functions for handling Hogwarts' secret passages and hidden locations.
 */

import * as b from "../../basis/_index";
import * as d from "../../dialogues/_index";
import * as u from "../../utilities/_index";
import { MainChara } from "../../basis/_index";

/**
 * Handles the discovery of secret passages in Hogwarts.
 * @param chara The main character.
 * @returns The newly discovered secret passage.
 */
export async function secretPassages(chara: MainChara<'Wizard'>)
{
    await u.showText('While wandering the castle, you find a secret passage.');
    
    // u.showText('Do you want to enter it? (y/n)');
    // let answer = "";
    // do { answer = (await u.handleInput())?.toLowerCase(); }
    // while (answer !== "y" && answer !== "n");    
    // u.showWheelResult(answer === "y" ? "You enter the passage." : "You ignore the passage.");
    // if (answer === "n")
    // {
    //     u.showWheelResult('You choose to walk away.');
    //     return;
    // }

    let secrets = chara.secretPassages.filter(p => !p.discovered);
    let segments = u.getUniformSegments(secrets.map(p => p.name));

    const result = await u.spinWheel('Which secret passage did you discover?', segments);
    let newPassage = secrets.find(s => s.name === result);
    if (!newPassage) throw new Error('Secret passage not found.');

    await u.showText(newPassage!.description || 'No description available.');

    if (newPassage.name === 'Whomping Will')
    {
        await u.showText('It\'s not very clear how you discovered this, but one thing is for sure: you just demonstrated a talent for Herbology.');
        await b.subjectIncrement(chara, 'Herbology');
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
    await d.mirrorOfErised();
    chara.secrets.mirrorOfErised = true;
    await u.showWheelResult('You discovered a secret!');
    let dumbledore = chara.characterList.find(s => s.surname === 'Dumbledore');
    await b.improveConnection(chara, dumbledore!);
}

/**
 * Handles the discovery of the Room of Requirement.
 * @param chara The main character.
 */
export async function roomOfRequirement(chara: MainChara<'Wizard'>)
{
    await d.roomOfRequirementDiscovery(chara.name);
    chara.secrets.roomOfRequirement = true;
    await u.showWheelResult('You discovered a secret!');
}