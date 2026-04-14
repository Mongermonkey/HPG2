
import { spinEqual } from '../utilities/random';
import { worsenAllGrades } from "../school_magic/classes";
import { schoolWheel } from '../school_magic/schoolEvents';
import { showText } from "../utilities/input_output_helpers";
import { newSegment, spinWheel } from "../wheel_magic/wheel_helpers";
import { getRandomStudent, improveConnection } from './character-functions';
import { fame, infamy, MainChara, subjectIncrement } from './maincharacter';
import { giantRacism, takeWolfsBane } from '../dialogues/multi-year-dialogues';


export async function classAddOns(chara: MainChara<'Wizard'>)
{
    switch (chara.race)
    {
        case 'werewolf': await WolfsBane(chara); break;
        case 'half-veela': await VeelasCharm(chara); break;
        case 'half-giant': await GiantRacism(chara); break;
        default: await schoolWheel(chara); break;
    } 
}

/**
 * Add on function for werewolves: spin for taking the wolfsbane potion and harming students.
 * @param chara The mc.
 */
async function WolfsBane(chara: MainChara<'Wizard'>)
{
    if (chara.race !== 'werewolf') return;  // If the character is not a werewolf, nothing happens
    
    await takeWolfsBane();
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

    if (result === 'No harm') await takeWolfsBane(result);
    else await takeWolfsBane(getRandomStudent(chara.characterList)!.longname);
    worsenAllGrades(chara);
}


/**
 * Add on function for half-veelas: improves connection with a random friend (to BFF) or BFF (to lover).
 * @param chara The mc.
 */
async function VeelasCharm(chara: MainChara<'Wizard'>)
{
    let friends = chara.characterList.filter(c => c.connectionlvl === 'bff');
    if (friends.length === 0) friends = chara.characterList.filter(c => c.connectionlvl === 'friend');
    const randomFriend = spinEqual(friends);

    await showText('In the last days, you felt ' + randomFriend.name + ' more present than ever.');
    await improveConnection(chara, randomFriend);
}


/**
 * Add on function for half-giants.
 * @param chara The mc.
 */
async function GiantRacism(chara: MainChara<'Wizard'>)
{
    await giantRacism(chara.house === 'Slytherin', chara.year === 1);

    const subjects = chara.grades.filter(g => g.score > 0).map(g => g.subject);
    const subjectHits = chara.house === 'Slytherin' ? 3 : 1;
    for (let i = 0; i < subjectHits; i++)
        await subjectIncrement(chara, spinEqual(subjects), -1);

    await fame(chara, 5);
    await infamy(chara, 5);
}