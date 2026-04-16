
/**
 * Functions for handling Hagrid's questline.
 */

import * as b from '../../basis/_index';
import * as d from "../../dialogues/_index";
import { meetNorbert } from "../sidequest/year_one/Norbert";
import { MainChara } from "../../basis/main_character/maincharacter";

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
            await d.HagridsHelp();
            break;
        case 'friend':
            let fluffyClue = chara.clues.find(c => c.name === 'fluffy_talk');
            fluffyClue!.discovered = true;
            await d.HagridFluffy(fluffyClue!.discovered, lost);
            break;
        case 'bff':
            await meetNorbert(chara, lost);
            break;
    }
    await b.subjectIncrement(chara, 'Care of Magical Creatures');
    await b.improveConnection(chara, hagrid!);
}