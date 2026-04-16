
import * as b from "../../basis/_index";
import * as d from "../../dialogues/_index";
import * as u from "../../utilities/_index";
import { MainChara } from "../../basis/_index";

import * as school from '../school/_index';
import * as main_q from '../mainquest/year2';
import * as quidditch from '../quidditch/quidditch';
import * as side_q from '../sidequest/year_one/_index';

/**
 * Attend the second year at Hogwarts.
 */
export async function attend(chara: MainChara<'Wizard'>): Promise<MainChara<'Wizard'>>
{
    await d.arrivalAtHogwarts(chara.year);
    
    await school.classWheel(chara);
    await quidditch.quidditchSelection(chara);



    return chara;
}