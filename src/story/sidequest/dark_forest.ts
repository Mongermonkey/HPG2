
import { spinEqual } from "../../utilities/random";
import { Character } from "../../characters/characters";
import * as wheels from "../../wheel_magic/wheel_helpers";
import * as io from "../../utilities/input_output_helpers";
import * as npc from '../../characters/character-functions';
import { newSegment } from "../../wheel_magic/wheel_helpers";
import * as diag from "../../dialogues/multi-year-dialogues";
import * as chitchat from "../../dialogues/year-one-dialogues";
import { MainChara, stress } from "../../characters/maincharacter";

/**
 * Handles the Dark Forest sidequest.
 * @param chara The mc.
 */
export async function darkForest(chara: MainChara<'Wizard'>): Promise<void>
{
    const buddy = await intro(chara);
    let aragogMet = chara.secrets.aragogMet;
    let voldemortMet = chara.secrets.darkForestVoldemort;
    if (voldemortMet && aragogMet)
    {
        await goodEnding(chara, buddy);
        return;
    }

    let paths = ['safe'];
    if (!aragogMet) paths.push('aragog');
    if (!voldemortMet) paths.push('voldemort');

    let segments = paths.length === 2
        ? [newSegment('left', 50), newSegment('right', 50)]
        : [newSegment('left', 33), newSegment('center', 34),  newSegment('right', 33)];
    
    await wheels.spinWheel('After a while, you come to a crossroads. Where do you go?', segments);

    // The outcome does not depend on the wheel
    switch (spinEqual(paths))
    {
        case 'safe': await goodEnding(chara, buddy); break;            
        case 'aragog': await aragogEnding(chara, buddy); break;
        case 'voldemort': await voldemortEnding(chara, buddy); break;
    }
}

/**
 * Handles the introduction to the Dark Forest sidequest.
 * @param chara The main character.
 * @returns The student character who accompanies the main character.
 */
async function intro(chara: MainChara<'Wizard'>): Promise<Character<'Student'>>
{
    await io.showText('Filch takes you and another student, as a punishment, to Hagrid\'s hut.');
    const segments = npc.getStudentList(chara, false, false);
    const result = await wheels.spinWheel('Who is the other student?', segments);

    const buddy = npc.getCharacterByLongname(chara.characterList, result) as Character<'Student'>;
    await io.showText('The student you share the punishment with is ' + buddy.longname + ' (' + buddy.house + ').');
    if (npc.isFriend(buddy))
    {
        await io.showText('Luckily, you get to share the burden with a friend.');
    }
    if (buddy.connectionlvl === 'foe')
    {
        await io.showText('Your burden seems even heavier.');
        await stress(chara);
    }

    await chitchat.DarkForestIntro(chara.secrets.darkForestPunishment, buddy.longname === 'Draco Malfoy');
    chara.secrets.darkForestPunishment = true;

    return buddy;
}

async function goodEnding(chara: MainChara<'Wizard'>, buddy: Character<'Student'>)
{
    await chitchat.DarkForest_GoodEnding(buddy.name);
    await npc.improveConnection(chara, buddy);
}

async function aragogEnding(chara: MainChara<'Wizard'>, buddy: Character<'Student'>)
{
    chara.secrets.aragogMet = true;
    await diag.DarkForest_Aragog(chara, buddy.name);
    await npc.improveConnection(chara, buddy);
    await stress(chara, 7);
}

async function voldemortEnding(chara: MainChara<'Wizard'>, buddy: Character<'Student'>)
{
    chara.secrets.darkForestVoldemort = true;
    await chitchat.DarkForest_BadEnding(buddy.name);
    await npc.improveConnection(chara, buddy);
    await stress(chara, 7);
}