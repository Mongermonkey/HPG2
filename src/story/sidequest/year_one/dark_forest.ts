
/**
 * Functions for handling the Dark Forest sidequests.
 */

import * as b from "../../../basis/_index";
import * as d from "../../../dialogues/_index";
import * as u from "../../../utilities/_index";
import { MainChara, Character } from "../../../basis/_index";

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
        ? [u.newSegment('left', 50), u.newSegment('right', 50)]
        : [u.newSegment('left', 33), u.newSegment('center', 34),  u.newSegment('right', 33)];
    
    await u.spinWheel('After a while, you come to a crossroads. Where do you go?', segments);

    // The outcome does not depend on the wheel
    switch (u.spinEqual(paths))
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
    await u.showText('Filch takes you and another student, as a punishment, to Hagrid\'s hut.');
    const segments = b.getStudentList(chara, false, false);
    const result = await u.spinWheel('Who is the other student?', segments);

    const buddy = b.getCharacterByLongname(chara.characterList, result) as Character<'Student'>;
    await u.showText('The student you share the punishment with is ' + buddy.longname + ' (' + buddy.house + ').');
    if (b.isFriend(buddy))
    {
        await u.showText('Luckily, you get to share the burden with a friend.');
    }
    if (buddy.connectionlvl === 'foe')
    {
        await u.showText('Your burden seems even heavier.');
        await b.stress(chara);
    }

    await d.DarkForestIntro(chara.secrets.darkForestPunishment, buddy.longname === 'Draco Malfoy');
    chara.secrets.darkForestPunishment = true;

    return buddy;
}

async function goodEnding(chara: MainChara<'Wizard'>, buddy: Character<'Student'>)
{
    await d.DarkForest_GoodEnding(buddy.name);
    await b.improveConnection(chara, buddy);
}

async function aragogEnding(chara: MainChara<'Wizard'>, buddy: Character<'Student'>)
{
    chara.secrets.aragogMet = true;
    await d.DarkForest_Aragog(chara, buddy.name);
    await b.improveConnection(chara, buddy);
    await b.stress(chara, 7);
}

async function voldemortEnding(chara: MainChara<'Wizard'>, buddy: Character<'Student'>)
{
    chara.secrets.darkForestVoldemort = true;
    await d.DarkForest_BadEnding(buddy.name);
    await b.improveConnection(chara, buddy);
    await b.stress(chara, 7);
}