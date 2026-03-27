
import { write } from "./dialogue-helpers";
import { MainChara } from "../characters/maincharacter";
import { hogwartsHouse } from "../utilities/compositetypes";

/**
 * Handles the discovery of the Room of Requirement.
 */
export async function roomOfRequirementDiscovery(): Promise<void>
{
    await write("While wandering in the castle, you find a door that wasn't there before.");
    await write("You open it, and it leads you to a room that seems to be exactly what you need at that moment.");
    await write("You spend some time in the Room of Requirement, and you find it very useful for your needs.");
}

/**
 * Handles the end-of-year feast and the house cup ceremony
 * @param first The house in first place.
 * @param second The house in second place.
 * @param third The house in third place.
 * @param fourth The house in fourth place.
 */
export async function eoyFeast(chara: MainChara<'Wizard'>, first: hogwartsHouse, second: hogwartsHouse, third: hogwartsHouse, fourth: hogwartsHouse): Promise<void>
{
    await write('The night of the end-of-year feast finally arrives.\nAll the students are waiting for the house cup award.');
    await write(`In fourth and last place, there is ${fourth.name}, with ${fourth.points} points.`);
    await write(`In third place, there is ${third.name}, with ${third.points} points.`);
    await write(`In second place, there is ${second.name}, with ${second.points} points.`);
    await write(`And finally, in first place, there is ${first.name}, with ${first.points} points.`);
    await write(`${first.name} wins the house cup!`);
    if (first.name === chara.house) await write('Your house\'s table erupts in cheers, and you can\'t help but feel proud of your housemates.');
    else await write('The feast starts, and you can\'t help but feel a bit sad that the year is coming to an end.');
}