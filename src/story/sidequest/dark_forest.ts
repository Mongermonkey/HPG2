
import { Character } from "../../characters/characters";
import * as wheels from "../../wheel_magic/wheel_helpers";
import * as io from "../../utilities/input_output_helpers";
import { MainChara } from "../../characters/maincharacter";
import * as npc from '../../characters/character-functions';
import { newSegment } from "../../wheel_magic/wheel_helpers";
import * as chitchat from "../../dialogues/year-one-dialogues";

/**
 * Handles the Dark Forest sidequest.
 * @param chara The mc.
 */
export async function darkForest(chara: MainChara<'Wizard'>)
{
    const nextBtn = (window as any).nextBtn as HTMLButtonElement;
    nextBtn.disabled = true;

    io.showText('Filch takes you and another student, as a punishment, to Hagrid\'s hut.');
    await io.nextEvent();
    let segments = npc.getStudentList(chara, false, false);
    let result = await wheels.spinWheel("Who is the other student?", segments);
    let buddy = npc.getCharacterByLongname(chara.characterList, result) as Character<'Student'>;
    io.showText('The student you share the punishment with is ' + buddy.longname + ' (' + buddy.house + ').');
    await io.nextEvent();
    if (npc.isFriend(buddy))
    {
        io.showText('Luckily, you get to share the burden with a friend.');
        await io.nextEvent();
    }
    if (buddy.connectionlvl === 'foe')
    {
        io.showText('Your burden seems even heavier.');
        await io.nextEvent();
        chara.stress++;
        wheels.showWheelResult("stress++");
    }

    await chitchat.DarkForestIntro(buddy.longname === 'Draco Malfoy');
    segments = [newSegment('left', 50), newSegment('right', 50)];
    result = await wheels.spinWheel("After a while, you come to a crossroads. Where do you go?", segments);
    if (result === 'left')
    {
        await chitchat.DarkForest_GoodEnding(buddy.name);
        await npc.improveConnection(chara, buddy);
    }
    else
    {
        await chitchat.DarkForest_BadEnding(buddy.name);
        chara.stress+=5;
        wheels.showWheelResult("stress++");
        await npc.improveConnection(chara, buddy);
    }

}