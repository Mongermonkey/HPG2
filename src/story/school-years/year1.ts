
import { troll } from '../sidequest/troll';
import { saveNorbert } from '../sidequest/Norbert';
import { chooseamovie } from '../../utilities/movielist';
import { MainChara } from '../../characters/maincharacter';
import { takeWolfsBane } from '../../school_magic/wolfsBane';
import { classWheel, firstFlyingLesson } from '../../school_magic/classes';
import { quidditchGame, quidditchSelection } from '../../quidditch/quidditch';
import { feast, schoolIntro, schoolWheel } from '../../school_magic/schoolEvents';
import { philosophersStoneQuest, questClue } from '../mainquest/philosophers_stone_quest';

/**
 * Attend the first year at Hogwarts.
 * The function works on a MainChara<'Wizard'> object, and returns the same object updated.
 */
export async function attend(chara: MainChara<'Wizard'>): Promise<MainChara<'Wizard'>>
{
    let moviestuff = false;
    if (moviestuff)
    {
        do 
        await chooseamovie('');   // 'horror' for horror, 'ash' for Ash or anything else for drama/romance
        while (true);
    }

    await schoolIntro(chara);

    // semester #1 **************************************************************************************

    await firstFlyingLesson(chara);
    await questClue(chara, chara.clues.find(c => c.name === 'gringotts_theft')!);
    await quidditchSelection(chara);

    await classWheel(chara);
    await quidditchGame(chara, 0);
    await questClue(chara, chara.clues.find(c => c.name === 'chocolate_frog')!);

    await schoolWheel(chara);
    await quidditchGame(chara, 1);
    await troll(chara);

    await classWheel(chara);
    await quidditchGame(chara, 2);
    await takeWolfsBane(chara);

    // semester #2 **************************************************************************************

    await classWheel(chara);
    await quidditchGame(chara, 3);
    await questClue(chara, chara.clues.find(c => c.name === 'library')!);

    await schoolWheel(chara);
    await quidditchGame(chara, 4);
    await saveNorbert(chara);

    await classWheel(chara);
    await quidditchGame(chara, 5);
    await questClue(chara, chara.clues.find(c => c.name === 'snape_quirrell_talk')!);

    await schoolWheel(chara);
    await philosophersStoneQuest(chara, true);
    await feast(chara);

    return chara;
}