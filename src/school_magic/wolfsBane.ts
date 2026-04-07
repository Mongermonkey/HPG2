
import { worsenAllGrades } from "./classes";
import * as wheels from "../wheel_magic/wheel_helpers";
import { MainChara } from '../characters/maincharacter';
import * as io from "../utilities/input_output_helpers";
import * as npc from '../characters/character-functions';
import * as diag from '../dialogues/multi-year-dialogues';

export async function takeWolfsBane(chara: MainChara<'Wizard'>)
{
    if (chara.gifts.lycanthropy === 0) return;  // If the character is not a werewolf, nothing happens
    
    await diag.takeWolfsBane();
    let chance = 100 - chara.gifts.lycanthropy - chara.stress;

    let segments = [wheels.newSegment('Take Wolfsbane', chance), wheels.newSegment('Forget', 100 - chance)];
    let result = await wheels.spinWheel('Do you take the WolfsBane Potion?', segments);

    if (result === 'Take Wolfsbane')
    {
        await io.showText('Of course you remember to take the potion, you are a responsible wizard after all.');
        return;
    }

    await io.showText('Alas, you forgot to take the potion, and the transformation begins.');

    segments = [wheels.newSegment('Harm', 50), wheels.newSegment('No harm', 50)];
    result = await wheels.spinWheel('Do you harm anyone during the transformation?', segments);

    if (result === 'No harm') await diag.takeWolfsBane(result);
    else await diag.takeWolfsBane(npc.getRandomStudent(chara.characterList)!.longname);
    worsenAllGrades(chara);
}