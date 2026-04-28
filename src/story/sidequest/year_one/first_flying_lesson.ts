
/**
 * Functions for handling the first flying lesson sidequest.
 */

import * as b from '../../../basis/_index';
import * as d from '../../../dialogues/_index';
import * as u from '../../../utilities/_index';
import { MainChara, Character } from '../../../basis/_index';
import { getNumberedSegments as gns } from '../../../utilities/wheel_magic/wheel_helpers';

/**
 * Handles the first flying lesson.
 * @param chara The mc.
 */
export async function firstFlyingLesson(chara: MainChara<'Wizard'>): Promise<void>
{
    await u.showText('It\'s your first flying lesson! Time to get on your broomstick and learn to fly.');
    const neville = chara.house === 'Gryffindor' || chara.house === 'Slytherin';

    if (neville)
    {
        await remembrall(chara);
        return;
    }

    await d.flyingLesson();

    const segments = u.sevenSegments;
    let result = await u.spinWheel('How many hoops can you get through?', segments);
    await flightWheelOutcome(chara, result);

    let seg2 = getSecondAttemptSegments(result, u);
    let result2 = await u.spinWheel('Second try! How many hoops can you get through?', seg2);
    await flightWheelOutcome(chara, result2);
}

// Funzione estratta per calcolare i segmenti dinamici del secondo tentativo
export function getSecondAttemptSegments(firstResult: string, u: any)
{
    switch (firstResult)
    {
        case '1': return gns([9, 14, 20, 21, 16, 11, 9]);
        case '2': return gns([9, 14, 19, 21, 17, 11, 9]);
        case '3': return gns([9, 13, 18, 21, 18, 12, 9]);
        case '4': return gns([8, 12, 17, 21, 19, 13, 10]);
        case '5': return gns([7, 11, 16, 21, 20, 14, 11]);
        case '6': return gns([6, 10, 15, 21, 21, 15, 12]);
        case '7': return gns([5, 9, 14, 21, 22, 16, 13]);
        default: return gns([10, 15, 21, 21, 15, 10, 8]);
    }
}


/**
 * Outputs the result of the first flying class event based on the wheel spin result.
 * @param chara The main character.
 * @param wheelOutput The result of the wheel spin.
 */
async function flightWheelOutcome(chara: MainChara<'Wizard'>, wheelOutput: string): Promise<void>
{
    let grade = chara.grades.find(g => g.subject === 'Flying');
    if (!grade) throw new Error('Subject Flying not found in character grades.');

    switch(wheelOutput)
    {
        case '1':
            await u.showText('You managed to get only through only through the first hoop, barely above the grass.');
            await b.stress(chara);
            break;
        case '2':
        case '3':
            await u.showText('You flew through the first ' + wheelOutput + ' hoops. Not bad, for a first timer.');
            break;
        case '4':
        case '5':
            await u.showText('Great job! You flew through the first ' + wheelOutput + ' hoops.');
            await b.subjectIncrement(chara, 'Flying');
            break;
        case '6':
            await u.showText('Amazing! You flew through the first 6 hoops, impressing everyone!');
            await b.subjectIncrement(chara, 'Flying');
            await b.stress(chara, -1);
            break;
        case '7':
            await u.showText('Incredible! You flew through all 7 hoops flawlessly, showing some great flying talent!');
            await u.showText('Madame Hooch praises your skills and awards 5 points to your house.');
            await b.housePointsIncrement(chara, 5);
            await b.subjectIncrement(chara, 'Flying');
            await b.stress(chara, -1);
            break;
    }
}

/**
 * Handles the Remembrall sidequest.
 * @param chara The main character.
 */
async function remembrall(chara: MainChara<'Wizard'>): Promise<void>
{
    let draco = b.getCharacterByLongname(chara.characterList, 'Draco Malfoy'),
        neville = b.getCharacterByLongname(chara.characterList, 'Neville Longbottom');
    await d.remembrallIntro();

    let laughChance = 15, askChance = 15, actChance = 5;
    if (b.isFriend(draco)) { laughChance += 25; }
    if (b.isFriend(neville)) { askChance += 15; actChance += 5; }
    if (chara.house === 'Gryffindor') { askChance += 5; actChance += 5; }
    if (chara.house === 'Slytherin') { laughChance += 5; }

    let nothingChance = 100 - (laughChance + askChance + actChance);

    let segments = [
        u.newSegment('Laugh', laughChance),
        u.newSegment('Ask it back', askChance),
        u.newSegment('Act', actChance),
        u.newSegment('Mind your business', nothingChance)
    ]
    const result = await u.spinWheel('What do you do?', segments);

    switch (result)
    {
        case 'Laugh': await laugh(chara); break;
        case 'Ask it back': await trial(chara); break;
        case 'Act': await act(chara); break;
        case 'Mind your business': await ignore(chara); break;
    }
}


async function laugh(chara: MainChara<'Wizard'>): Promise<void>
{
    let draco = b.getCharacterByLongname(chara.characterList, 'Draco Malfoy') as Character<'Student'>,
        neville = b.getCharacterByLongname(chara.characterList, 'Neville Longbottom') as Character<'Student'>;
    
    await u.showText('You find it very funny, and laugh along with Draco as he mocks Neville for losing his Remembrall.');
    await b.shiftAlignment(chara, 'death_eater');
    if (b.isFriend(neville))
    {
        await u.showText('Neville is now angry at you. He expected more from a friend.');
        neville.connectionlvl = 'foe';
    }
    if (chara.house === 'Slytherin') await b.improveConnection(chara, draco); 
}

async function trial(chara: MainChara<'Wizard'>): Promise<void>
{
    let draco = b.getCharacterByLongname(chara.characterList, 'Draco Malfoy') as Character<'Student'>,
        neville = b.getCharacterByLongname(chara.characterList, 'Neville Longbottom') as Character<'Student'>;
    
    await d.remembrallTrialIntro();
    let chance = 10 + Math.min(85, b.getSkill(chara, 'Flying') * 10);

    const result = await u.spinWheel('Do you catch it?', [u.newSegment('Catch', chance), u.newSegment('Miss', 100 - chance)]);

    await d.remembrallTrial(result === 'Miss');
    if (result === 'Miss')
    {
        await b.stress(chara);
        return;
    }

    await b.worsenConnection(chara, draco);
    await b.improveConnection(chara, neville);
    await b.fame(chara, 5);

    // add chance to quidditch
    let head = b.getHeadOfHouse(chara.characterList, chara.house);
    await u.showText('A bit later in the evening, you receive a note from ' + head?.longname + '.');
    await u.showText('It seems that your actions have not gone unnoticed, and you are being considered for the Quidditch team!');
    chara.quidditchRole = 'candidate';
}

async function act(chara: MainChara<'Wizard'>): Promise<void>
{
    let draco = b.getCharacterByLongname(chara.characterList, 'Draco Malfoy') as Character<'Student'>,
        neville = b.getCharacterByLongname(chara.characterList, 'Neville Longbottom') as Character<'Student'>;
    
    await u.showText('You decide to take matters into your own hands and take the Remembrall from Draco\'s hand.');
    await b.shiftAlignment(chara, 'phoenix_order');

    const result = await u.spinWheel('Do you succeed?', [ u.newSegment('Success', 50), u.newSegment('Fail', 50)]);
    await d.remembrallNinja(result === 'Success');

    draco.connectionlvl = 'foe';

    if (result === 'Success')
    {
        await b.improveConnection(chara, neville);
        await b.fame(chara);
    }
    else await b.stress(chara);
}

async function ignore(chara: MainChara<'Wizard'>): Promise<void>
{
    let neville = b.getCharacterByLongname(chara.characterList, 'Neville Longbottom') as Character<'Student'>;

    await u.showText('You decide to mind your own business and not get involved.');    
    if (b.isFriend(neville))
    {
        await u.showText('Neville is now angry at you. He expected more from a friend.');
        neville.connectionlvl = 'foe';
    }
}