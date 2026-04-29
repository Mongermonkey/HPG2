
import * as b from "../../basis/_index";
import * as u from "../../utilities/_index";
import { MainChara } from "../../basis/_index";

import * as school from '../school/_index';
import * as main_q from '../mainquest/year1';
import * as quidditch from '../quidditch/quidditch';
import * as side_q from '../sidequest/year_one/_index';

/**
 * Attend the first year at Hogwarts.
 * The function works on a MainChara<'Wizard'> object, and returns the same object updated.
 */
export async function attend(chara: MainChara<'Wizard'>): Promise<MainChara<'Wizard'>>
{
    let moviestuff = false;
    if (moviestuff)
    {
        do await u.chooseamovie('');   // 'horror' for horror, 'ash' for Ash or anything else for drama/romance
        while (true);
    }

    await school.schoolIntro(chara);

    // semester #1 **************************************************************************************

    await side_q.firstFlyingLesson(chara);
    await quidditch.quidditchSelection(chara);
    await main_q.questClue(chara, chara.clues.find(c => c.name === 'gringotts_theft')!);

    await school.classWheel(chara);
    await quidditch.quidditchGame(chara, 0);
    await main_q.questClue(chara, chara.clues.find(c => c.name === 'chocolate_frog')!);

    await school.schoolWheel(chara);
    await quidditch.quidditchGame(chara, 1);
    await side_q.troll(chara);

    await school.classWheel(chara);
    await quidditch.quidditchGame(chara, 2);
    await b.raceDrivenEvent(chara);

    // semester #2 **************************************************************************************

    await school.classWheel(chara);
    await quidditch.quidditchGame(chara, 3);
    await main_q.questClue(chara, chara.clues.find(c => c.name === 'library')!);

    await school.schoolWheel(chara);
    await quidditch.quidditchGame(chara, 4);
    await side_q.saveNorbert(chara);

    await school.classWheel(chara);
    await quidditch.quidditchGame(chara, 5);
    await main_q.questClue(chara, chara.clues.find(c => c.name === 'snape_quirrell_talk')!);

    await school.schoolWheel(chara);
    await main_q.philosophersStoneQuest(chara, true);
    
    // feast ********************************************************************************************
    
    await school.feast(chara);

    chara.year = 2;     // TODO: necessario salvare il pg con l'anno aumentato.
    return chara;
}