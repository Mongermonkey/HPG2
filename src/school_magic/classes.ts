/**
 * Funzioni di supporto per le lezioni scolastiche e le ruote delle materie:
 * - Gestione ruota delle lezioni (classWheel, getClassWheelSegments, classWheelOutcome)
 * - Lezioni speciali e volo (firstFlyingLesson, flightWheelOutcome)
 */

import { Wheel } from '../wheel_magic/Wheel';
import { subject } from '../utilities/basetypes';
import { Character } from '../characters/characters';
import * as io from '../utilities/input_output_helpers';
import * as npc from '../characters/character-functions';
import { remembrall } from '../story/sidequest/remembrall';
import * as chitchat from '../dialogues/year-one-dialogues';
import { spinEqual, randomClassEvent, spinbool } from '../utilities/random';
import { alignmentDeath, alignmentPhoenix } from '../utilities/compositetypes';
import { newSegment, sevenSegments, showWheelResult, spinWheel, WheelSegment } from '../wheel_magic/wheel_helpers';
import { getMinGrades, MainChara, stress, housePointsIncrement, subjectIncrement } from '../characters/maincharacter';

// #region CLASSES

/**
 * Handles a lesson the mc attends.
 * @param chara The mc.
 */
export async function classWheel(chara: MainChara<'Wizard'>): Promise<void>
{
    const myWheel = (window as any).myWheel as Wheel;

    const subjects = chara.grades.filter(g => g.score > 0).map(g => g.subject);
    let sub = spinEqual(subjects);
    await io.showText('You have a' + ('AEIOU'.includes(sub[0].toUpperCase()) ? 'n' : '') + ' ' + sub + ' class.');
    const result = await spinWheel('Class Wheel! What do you do?', getClassWheelSegments(chara, sub));

    let prof = npc.getProfessorFromSubject(chara.characterList, sub);
    await classWheelOutcome(chara, sub, prof, result);
}

/**
 * Calcola i segmenti della ruota per la lezione in base al personaggio e alla materia.
 */
export function getClassWheelSegments(chara: MainChara<'Wizard'>, sub: subject): WheelSegment[]
{
    let skipChance = alignmentPhoenix(chara.alignment) ? 0.15 : alignmentDeath(chara.alignment) ? 0.10 : 0.07;
    let attentionChance = chara.stress >= 50 ? 0.07 : chara.stress >= 15 ? 0.14 : 0.21;
    let distractionChance = chara.stress >= 50 ? 0.21 : chara.stress >= 15 ? 0.14 : 0.07;
    let answerGoodChance = chara.stress >= 50 ? 0.07 : chara.stress >= 15 ? 0.11 : 0.15;
    let answerWrongChance = chara.stress >= 50 ? 0.15 : chara.stress >= 15 ? 0.11 : 0.07;
    let forgetHomeworkChance = chara.stress >= 50 ? 0.15 : chara.stress >= 15 ? 0.10 : 0.05;

    if (chara.grades.find(g => g.subject === sub)?.score! >= 7) { skipChance -= 0.05; answerGoodChance += 0.05; answerWrongChance -= 0.05; attentionChance += 0.05; distractionChance -= 0.05; }
    if (sub === 'History of Magic') { attentionChance -= 0.05; distractionChance += 0.05; }

    let regularChance = 1 - (skipChance + attentionChance + answerGoodChance + answerWrongChance + distractionChance + forgetHomeworkChance);
    
    return [
        newSegment('Skip class', skipChance * 100),
        newSegment('Pay attention', attentionChance * 100),
        newSegment('Answer correctly', answerGoodChance * 100),
        newSegment('Answer incorrectly', answerWrongChance * 100),
        newSegment('Distraction', distractionChance * 100),
        newSegment('Forget homework', forgetHomeworkChance * 100),
        newSegment('Regular class', regularChance * 100)
    ];
}

/**
 * Outputs the result of a class event based on the wheel spin result.
 * @param chara The main character.
 * @param sub The subject of the class.
 * @param prof The professor teaching the class.
 * @param wheelOutput The result of the wheel spin.
 */
export async function classWheelOutcome(chara: MainChara<'Wizard'>, sub: subject, prof: Character<'Teacher'>, wheelOutput: string): Promise<void>
{
    switch(wheelOutput)
    {
        case 'Skip class':
            await io.showText('You decided to skip class.');
            break;
        case 'Pay attention':
            await io.showText('You paid full attention during the class and learned a lot!');
            await subjectIncrement(chara, sub);
            await stress(chara, -1);
            break;
        case 'Answer correctly':
            await io.showText('You answered correctly to ' + prof.longname + '\'s question! ' + (prof.male ? 'He' : 'She') + ' awards 5 points to ' + chara.house + '.');
            await housePointsIncrement(chara, 5);
            await subjectIncrement(chara, sub);
            await stress(chara, -1);
            break;
        case 'Answer incorrectly':
            await io.showText('You answered incorrectly to ' + prof.longname + '\'s question. ' + (prof.male ? 'He' : 'She') + ' takes 5 points from ' + chara.house + '.');
            await stress(chara);
            await housePointsIncrement(chara, -5);
            break;
        case 'Distraction':
            await io.showText('During the class, you got distracted chatting.');
            await stress(chara, -1);
            await npc.friendshipWheel(chara, true, false);
            break;
        case 'Forget homework':
            await io.showText('You forgot to do your homework. ' + prof.longname + ' scolds you and takes 10 points from ' + chara.house + '.');
            await housePointsIncrement(chara, -10);
            await stress(chara);
            break;
        case 'Regular class':
            await io.showText('You attend the class as usual.');
            let buddy = npc.getRandomStudent(chara.characterList);
            await io.showText(randomClassEvent(prof, buddy!));
            break;
        default: throw new Error('Unknown class wheel outcome: ' + wheelOutput);
    }
}

// #endregion CLASSES

// #region SPECIAL CLASSES

/**
 * Handles the first flying lesson.
 * @param chara The mc.
 */
export async function firstFlyingLesson(chara: MainChara<'Wizard'>): Promise<void>
{
    await io.showText('It\'s your first flying lesson! Time to get on your broomstick and learn to fly.');
    const neville = chara.house === 'Gryffindor' || chara.house === 'Slytherin';

    if (neville)
    {
        await remembrall(chara);
        return;
    }

    await chitchat.flyingLesson();

    const segments = sevenSegments;
    let result = await spinWheel('How many hoops can you get through?', segments);
    await flightWheelOutcome(chara, result);

    result = await spinWheel('Second try! How many hoops can you get through?', segments);
    await flightWheelOutcome(chara, result);
}

/**
 * Outputs the result of the first flying class event based on the wheel spin result.
 * @param chara The main character.
 * @param wheelOutput The result of the wheel spin.
 */
export async function flightWheelOutcome(chara: MainChara<'Wizard'>, wheelOutput: string): Promise<void>
{
    let grade = chara.grades.find(g => g.subject === 'Flying');
    if (!grade) throw new Error('Subject Flying not found in character grades.');

    switch(wheelOutput)
    {
        case '1':
            await io.showText('You managed to get only through only through the first hoop, barely above the grass.');
            await stress(chara);
            break;
        case '2':
        case '3':
            await io.showText('You flew through the first ' + wheelOutput + ' hoops. Not bad, for a first timer.');
            break;
        case '4':
        case '5':
            await io.showText('Great job! You flew through the first ' + wheelOutput + ' hoops.');
            await subjectIncrement(chara, 'Flying');
            break;
        case '6':
            await io.showText('Amazing! You flew through the first 6 hoops, impressing everyone!');
            await subjectIncrement(chara, 'Flying');
            await stress(chara, -1);
            break;
        case '7':
            await io.showText('Incredible! You flew through all 7 hoops flawlessly, showing some great flying talent!');
            await io.showText('Madame Hooch praises your skills and awards 5 points to your house.');
            await housePointsIncrement(chara, 5);
            await subjectIncrement(chara, 'Flying');
            await stress(chara, -1);
            break;
    }
}

// #endregion SPECIAL CLASSES

// #region STUDIES

/**
 * Handles the library study event.
 * @param chara The mc.
 */
export async function libraryStudy(chara: MainChara<'Wizard'>): Promise<void>
{
    let lowSub = getMinGrades(chara, 1)[0];
    let chance = chara.stress < 10 ? 60 : 50;
    if (npc.isFriendByLongname(chara.characterList, 'Hermione Granger')) chance += 15;

    let success = spinbool(chance, 100 - chance);
    lowSub.score += success ? 2 : 1;
    await chitchat.subjectStudy(lowSub.subject, success);
    showWheelResult(lowSub.subject + '++');
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

    showWheelResult(reducedSubjects.trim());
}
// #endregion STUDIES