
/**
 * Functions for managing lessons and common school events.
 */

import * as b from "../../basis/_index";
import * as d from "../../dialogues/_index";
import * as u from "../../utilities/_index";

import { PeevesPrank } from "./Peeves";
import { befriendHagrid } from "./Hagrid";
import { WheelSegment } from "../../utilities/_index";
import { quidditchPractice } from "../quidditch/quidditch";
import { philosophersStoneQuest } from "../mainquest/year1";
import { MainChara, Character, subject } from "../../basis/_index";
import { secretPassages, mirrorOfErised, roomOfRequirement } from "./secrets";


// #region CLASS WHEEL

/**
 * Handles a lesson the mc attends.
 * @param chara The mc.
 */
export async function classWheel(chara: MainChara<'Wizard'>): Promise<void>
{
    const subjects = chara.grades.filter(g => g.score > 0).map(g => g.subject);
    let sub = u.spinEqual(subjects);
    await u.showText('You have a' + ('AEIOU'.includes(sub[0].toUpperCase()) ? 'n' : '') + ' ' + sub + ' class.');
    const result = await u.spinWheel('Class Wheel! What do you do?', getClassWheelSegments(chara, sub));

    let prof = b.getProfessorFromSubject(chara.characterList, sub);
    await classWheelOutcome(chara, sub, prof, result);
}

/**
 * Calculates the wheel segments for a class based on the character and the subject.
 */
function getClassWheelSegments(chara: MainChara<'Wizard'>, sub: subject): WheelSegment[]
{
    let skipChance = b.alignmentPhoenix(chara.alignment) ? 0.15 : b.alignmentDeath(chara.alignment) ? 0.10 : 0.07;
    let attentionChance = chara.stress >= 50 ? 0.07 : chara.stress >= 15 ? 0.14 : 0.21;
    let distractionChance = chara.stress >= 50 ? 0.21 : chara.stress >= 15 ? 0.14 : 0.07;
    let answerGoodChance = chara.stress >= 50 ? 0.07 : chara.stress >= 15 ? 0.11 : 0.15;
    let answerWrongChance = chara.stress >= 50 ? 0.15 : chara.stress >= 15 ? 0.11 : 0.07;
    let forgetHomeworkChance = chara.stress >= 50 ? 0.15 : chara.stress >= 15 ? 0.10 : 0.05;

    if (chara.grades.find(g => g.subject === sub)?.score! >= 7) { skipChance -= 0.05; answerGoodChance += 0.05; answerWrongChance -= 0.05; attentionChance += 0.05; distractionChance -= 0.05; }
    if (sub === 'History of Magic') { attentionChance -= 0.05; distractionChance += 0.05; }

    let regularChance = 1 - (skipChance + attentionChance + answerGoodChance + answerWrongChance + distractionChance + forgetHomeworkChance);
    
    return [
        u.newSegment('Skip class', skipChance * 100),
        u.newSegment('Pay attention', attentionChance * 100),
        u.newSegment('Answer correctly', answerGoodChance * 100),
        u.newSegment('Answer incorrectly', answerWrongChance * 100),
        u.newSegment('Distraction', distractionChance * 100),
        u.newSegment('Forget homework', forgetHomeworkChance * 100),
        u.newSegment('Regular class', regularChance * 100)
    ];
}

/**
 * Outputs the result of a class event based on the wheel spin result.
 * @param chara The main character.
 * @param sub The subject of the class.
 * @param prof The professor teaching the class.
 * @param wheelOutput The result of the wheel spin.
 */
async function classWheelOutcome(chara: MainChara<'Wizard'>, sub: subject, prof: Character<'Teacher'>, wheelOutput: string): Promise<void>
{
    switch(wheelOutput)
    {
        case 'Skip class':
            await u.showText('You decided to skip class.');
            break;
        case 'Pay attention':
            await u.showText('You paid full attention during the class and learned a lot!');
            await b.subjectIncrement(chara, sub);
            await b.stress(chara, -1);
            break;
        case 'Answer correctly':
            await u.showText('You answered correctly to ' + prof.longname + '\'s question! ' + (prof.male ? 'He' : 'She') + ' awards 5 points to ' + chara.house + '.');
            await b.housePointsIncrement(chara, 5);
            await b.subjectIncrement(chara, sub);
            await b.stress(chara, -1);
            break;
        case 'Answer incorrectly':
            await u.showText('You answered incorrectly to ' + prof.longname + '\'s question. ' + (prof.male ? 'He' : 'She') + ' takes 5 points from ' + chara.house + '.');
            await b.stress(chara);
            await b.housePointsIncrement(chara, -5);
            break;
        case 'Distraction':
            await u.showText('During the class, you got distracted chatting.');
            await b.stress(chara, -1);
            await b.friendshipWheel(chara, true, false);
            break;
        case 'Forget homework':
            await u.showText('You forgot to do your homework. ' + prof.longname + ' scolds you and takes 10 points from ' + chara.house + '.');
            await b.housePointsIncrement(chara, -10);
            await b.stress(chara);
            break;
        case 'Regular class':
            await u.showText('You attend the class as usual.');
            let buddy = b.getRandomStudent(chara.characterList);
            await u.showText(u.randomClassEvent(prof, buddy!));
            break;
        default: throw new Error('Unknown class wheel outcome: ' + wheelOutput);
    }
}

// #endregion

// #region SCHOOL_WHEEL

/**
 * Handles the school wheel, providing random events within the school.
 * @param chara The main character.
 */
export async function schoolWheel(chara: MainChara<'Wizard'>): Promise<void>
{
    let result = await u.spinWheel('School Wheel! What happens?', getSegments(chara));
    switch (result)
    {
        case 'friendship wheel': await b.friendshipWheel(chara, true); break;
        case 'study': await b.libraryStudy(chara); break;
        case 'Peeves\' prank': await PeevesPrank(chara); break;
        case 'ghost': await ghostEncounter(chara); break;
        case 'stairs': await stairsChange(chara); break;
        case 'Quidditch practice': await quidditchPractice(chara); break;
        case 'Hagrid': await befriendHagrid(chara); break;
        case 'Moaning Myrtle': await moaningMyrtle(chara); break;
        case 'secret passage': await secretPassages(chara); break;
        case 'Philosopher\'s Stone': await philosophersStoneQuest(chara); break;
    }        
}

/**
 * Generates the segments for the school wheel based on the main character's state.
 * @param chara The mc.
 * @returns An array of WheelSegment objects representing the possible events.
 */
function getSegments(chara: MainChara<'Wizard'>): WheelSegment[]
{
    let segments: WheelSegment[] = u.getUniformSegments(['friendship wheel', 'study', 'Peeves\' prank', 'ghost', 'stairs']);
    u.addSegment(segments, u.newSegment('Room of Requirement', 1));

    // se si è parte della squadra, aggiungo segmento
    if (chara.quidditchRole != 'none') u.addSegment(segments, u.newSegment('Quidditch practice', 20));
    
    // se si è amici di Hagrid, aggiungo segmento
    if (b.isFriendByLongname(chara.characterList, 'Hagrid')) u.addSegment(segments, u.newSegment('Hagrid', 20));

    // se non è già stata incontrata Mirtilla, aggiungo segmento
    if (!b.isFriendByLongname(chara.characterList, 'Moaning Myrtle')) u.addSegment(segments, u.newSegment('Moaning Myrtle', chara.gender == 'm' ? 1 : 15));

    // se non sono stati scoperti tutti i passaggi segreti, aggiungo segmento
    if (!chara.secretPassages.every(p => p.discovered)) u.addSegment(segments, u.newSegment('secret passage', 10));

    // se sono stati scoperti almeno 3 indizi, aggiungo segmento
    if (chara.clues.filter(c => c.discovered).length >= 3) u.addSegment(segments, u.newSegment('Philosopher\'s Stone', 5));

    return segments;
}

/**
 * Handles the encounter with a ghost.
 * @param chara The mc.
 */
async function ghostEncounter(chara: MainChara<'Wizard'>): Promise<void>
{
    // incontro con un fantasma (history of magic++, improveconnection)
    let ghost = chara.characterList.filter((c): c is Character<'Creature'> => c.role === 'Creature').find(c => c.house === chara.house);
    await d.ghostTalk(ghost!);
    await b.subjectIncrement(chara, 'History of Magic');
    await b.improveConnection(chara, ghost!.longname);
}

/**
 * Handles the encounter with Moaning Myrtle.
 * @param chara The mc.
 */
async function moaningMyrtle(chara: MainChara<'Wizard'>): Promise<void>
{
    let myrtle = chara.characterList.find(c => c.longname === 'Moaning Myrtle');
    await d.myrtleEncounter(b.isFriend(myrtle), chara.gender === 'm');
    await b.improveConnection(chara, myrtle!);
}

/**
 * Handles the event when the stairs change and the mc gets lost in the castle.
 * @param chara The main character.
 */
async function stairsChange(chara: MainChara<'Wizard'>): Promise<void>
{
    await d.stairsChange();

    let segments = [u.newSegment('Hagrid', 89), u.newSegment('Mirror of Erised', 10), u.newSegment('Room of Requirement', 1)];
    let result = await u.spinWheel('Where do you end up?', segments);
    
    switch (result)
    {
        case 'Hagrid': await befriendHagrid(chara, true); break;
        case 'Mirror of Erised': await mirrorOfErised(chara); break;
        case 'Room of Requirement': await roomOfRequirement(chara); break;
    }
}

// #endregion
