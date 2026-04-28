
/** Gestisce eventi legati alla razza e funzioni di sviluppo/progressione del personaggio principale. */

import * as d from '../../dialogues/_index';
import * as u from '../../utilities/_index';
import * as s from '../../story/school/_index';

import { subject } from "../types/base_types";
import { getMinGrades, MainChara } from './maincharacter';
import { getRandomStudent, improveConnection, isFriendByLongname } from '../npcs/character_functions';

// #region RACE DRIVEN EVENTS

/**
 * Handles race-driven events based on the character's race.
 * @param chara The main character.
 */
export async function raceDrivenEvent(chara: MainChara<'Wizard'>)
{
    switch (chara.race)
    {
        case 'werewolf': await WolfsBane(chara); break;
        case 'half-veela': await VeelasCharm(chara); break;
        case 'half-giant': await GiantRacism(chara); break;
        default: await s.schoolWheel(chara); break;
    } 
}

/**
 * Add on function for werewolves: spin for taking the wolfsbane potion and harming students.
 * @param chara The mc.
 */
async function WolfsBane(chara: MainChara<'Wizard'>)
{
    if (chara.race !== 'werewolf') return;  // If the character is not a werewolf, nothing happens
    
    await d.takeWolfsBane();
    let chance = 100 - chara.stress;

    let segments = [u.newSegment('Take Wolfsbane', chance), u.newSegment('Forget', 100 - chance)];
    let result = await u.spinWheel('Do you take the WolfsBane Potion?', segments);

    if (result === 'Take Wolfsbane')
    {
        await u.showText('Of course you remember to take the potion, you are a responsible wizard after all.');
        return;
    }

    await u.showText('Alas, you forgot to take the potion, and the transformation begins.');

    segments = [u.newSegment('Harm', 50), u.newSegment('No harm', 50)];
    result = await u.spinWheel('Do you harm anyone during the transformation?', segments);

    if (result === 'No harm') await d.takeWolfsBane(result);
    else await d.takeWolfsBane(getRandomStudent(chara.characterList)!.longname);
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
    const randomFriend = u.spinEqual(friends);

    await u.showText('In the last days, you felt ' + randomFriend.name + ' more present than ever.');
    await improveConnection(chara, randomFriend);
}


/**
 * Add on function for half-giants.
 * @param chara The mc.
 */
async function GiantRacism(chara: MainChara<'Wizard'>)
{
    await d.giantRacism(chara.house === 'Slytherin', chara.year === 1);

    const subjects = chara.grades.filter(g => g.score > 0).map(g => g.subject);
    const subjectHits = chara.house === 'Slytherin' ? 3 : 1;
    for (let i = 0; i < subjectHits; i++)
        await subjectIncrement(chara, u.spinEqual(subjects), -1);

    await fame(chara, 5);
    await infamy(chara, 5);
}

// #endregion

// #region DEVELOPMENT FUNCTIONS

/**
 * Increases the stress level of the character.
 * @param chara The main character.
 * @param increment The amount of stress to add (default is 1).
 */
export async function stress(chara: MainChara<'Wizard'>, increment?: number)
{
    chara.stress += increment ?? 1;
    chara.stress = Math.max(0, chara.stress); // Ensure stress does not go below 0
    u.showWheelResult(increment && increment > 0 ? 'stress++' : 'stress--');
    await u.nextEvent();
}

/**
 * Increases the fame level of the character.
 * @param chara The main character.
 * @param increment The amount of fame to add (default is 1).
 */
export async function fame(chara: MainChara<'Wizard'>, increment?: number)
{
    chara.fame += increment ?? 1;
    u.showWheelResult('fame++');
    await u.nextEvent();
}

/**
 * Increases the infamy level of the character.
 * @param chara The main character.
 * @param increment The amount of infamy to add (default is 1).
 */
export async function infamy(chara: MainChara<'Wizard'>, increment?: number)
{
    chara.infamy += increment ?? 1;
    u.showWheelResult('infamy++');
    await u.nextEvent();
}

/**
 * Increases an alignment level of the character.
 * @param chara The main character.
 * @param alignment The alignment to increase ('phoenix_order', 'chaos', or 'death_eater').
 * @param increment The amount to increase the alignment by (default is 1).
 */
export async function shiftAlignment(chara: MainChara<'Wizard'>, alignment: 'phoenix_order' | 'chaos' | 'death_eater', increment?: number)
{
    switch (alignment)
    {
        case 'phoenix_order': chara.alignment.phoenix_order += increment ?? 1; break;
        case 'chaos': chara.alignment.chaos += increment ?? 1; break;
        case 'death_eater': chara.alignment.death_eater += increment ?? 1; break;
        default: return;
    }
    await fixAlignment(chara);
    u.showWheelResult('your alignment has shifted.');
    await u.nextEvent();
}

/**
 * Fixes the character's neutral alignment level based on their other alignment levels.
 * @param chara The main character.
 */
async function fixAlignment(chara: MainChara<'Wizard'>)
{
    chara.alignment.neutral = 100 - chara.alignment.phoenix_order - chara.alignment.chaos - chara.alignment.death_eater;
}

/**
 * Increases/decreases the skill value for a specific subject.
 * @param chara The main character.
 * @param subject The subject to increase/decrease.
 * @param increment The amount to change the skill by (default is 1).
 */
export async function subjectIncrement(chara: MainChara<'Wizard'>, subject: subject, increment?: number)
{
    let grade = chara.grades.find(g => g.subject === subject);
    increment = increment ?? 1;
    grade!.score += increment;
    u.showWheelResult(subject + (increment > 0 ? '++' : '--'));
    await u.nextEvent();
}

/**
 * Increases/decreases the house points of the character.
 * @param chara The main character.
 * @param increment The amount to change the house points by (default is 1).
 */
export function housePointsIncrement(chara: MainChara<'Wizard'>, increment?: number)
{
    increment = increment ?? 1;
    chara.housePoints += increment;
    chara.housePoints = Math.max(0, chara.housePoints); // Ensure house points do not go below 0
    u.showWheelResult((increment > 0 ? '+' : '-') + Math.abs(increment) + ' house points');
}

/**
 * Handles the library study event.
 * @param chara The mc.
 */
export async function libraryStudy(chara: MainChara<'Wizard'>): Promise<void>
{
    // modificare: al momento, prende anche le materie a 0 (non studiate)
    let lowSub = getMinGrades(chara, 1)[0];
    let chance = chara.stress < 10 ? 60 : 50;
    if (isFriendByLongname(chara.characterList, 'Hermione Granger')) chance += 15;

    let success = u.spinbool(chance, 100 - chance);
    lowSub.score += success ? 2 : 1;
    await d.subjectStudy(lowSub.subject, success);
    u.showWheelResult(lowSub.subject + '++');
}

/**
 * Reduces all mc grades' scores by 1 point.
 */
export async function worsenAllGrades(chara: MainChara<'Wizard'>): Promise<void>
{
    let reducedSubjects = '';
    chara.grades.forEach(g =>
    {
        const oldScore = g.score;
        g.score = Math.max(0, g.score - 1);
        if (g.score < oldScore) reducedSubjects += g.subject + '--\n';
    });

    u.showWheelResult(reducedSubjects.trim());
}

// #endregion