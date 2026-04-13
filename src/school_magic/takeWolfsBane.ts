
import { worsenAllGrades } from "./classes";
import { MainChara } from '../characters/maincharacter';
import { showText } from "../utilities/input_output_helpers";
import { wolfsBane } from '../dialogues/multi-year-dialogues';
import { getRandomStudent } from '../characters/character-functions';
import { newSegment, spinWheel } from "../wheel_magic/wheel_helpers";

export async function takeWolfsBane(chara: MainChara<'Wizard'>)
{
    if (chara.race !== 'werewolf') return;  // If the character is not a werewolf, nothing happens
    
    await wolfsBane();
    let chance = 100 - chara.stress;

    let segments = [newSegment('Take Wolfsbane', chance), newSegment('Forget', 100 - chance)];
    let result = await spinWheel('Do you take the WolfsBane Potion?', segments);

    if (result === 'Take Wolfsbane')
    {
        await showText('Of course you remember to take the potion, you are a responsible wizard after all.');
        return;
    }

    await showText('Alas, you forgot to take the potion, and the transformation begins.');

    segments = [newSegment('Harm', 50), newSegment('No harm', 50)];
    result = await spinWheel('Do you harm anyone during the transformation?', segments);

    if (result === 'No harm') await wolfsBane(result);
    else await wolfsBane(getRandomStudent(chara.characterList)!.longname);
    worsenAllGrades(chara);
}