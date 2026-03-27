
import * as wheels from "../wheel_magic/wheel_helpers";
import { MainChara } from "../characters/maincharacter";
import * as io from "../utilities/input_output_helpers";
import * as npc from '../characters/character-functions';
import { meetNorbert } from "../story/sidequest/Norbert";
import * as chitchat from "../dialogues/year-one-dialogues";

/**
 * Handles the various events of befriending Hagrid.
 * @param chara The main character.
 */
export async function befriendHagrid(chara: MainChara<'Wizard'>, lost: boolean = false): Promise<void>
{
    let hagrid = chara.characterList.find(c => c.longname === 'Hagrid');
    switch (hagrid!.connectionlvl)
    {
        case 'foe':
        case 'neutral':
            await chitchat.HagridsHelp();
            break;
        case 'friend':
            let fluffyClue = chara.clues.find(c => c.name === 'fluffy_talk');
            fluffyClue!.discovered = true;
            await chitchat.HagridFluffy(fluffyClue!.discovered, lost);
            break;
        case 'bff':
            await meetNorbert(chara, lost);
            break;
    }
    wheels.showWheelResult('Care of Magical Creatures++');
    await io.nextEvent();
    npc.improveConnection(chara, hagrid!);
}