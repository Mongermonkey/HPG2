
import { Wheel } from "../wheel_magic/Wheel";
import { MainChara } from "../maincharacter";
import { getProfessorFromSubject, getRandomClassStudent } from "../characters";
import { spinEqual, randomClassEvent } from "../utilities/Random";
import { subject } from "../utilities/basetypes";
import * as wheels from "../wheel_magic/wheel_helpers";
import * as io from "../utilities/input_output_helpers";
import { WheelSegment } from "../wheel_magic/wheel_helpers";


/**
 * Handles a lesson the mc attends.
 * @param chara The mc.
 */
export async function classWheel(chara: MainChara<'Wizard'>, subjects: subject[]): Promise<void>
{
    const myWheel = (window as any).myWheel as Wheel;
    const nextBtn = (window as any).nextBtn as HTMLButtonElement;

    nextBtn.disabled = true;

    let sub = spinEqual(subjects);

    io.showText(`You have a${'AEIOU'.includes(sub[0].toUpperCase()) ? 'n' : ''} ${sub} class.`);
    await io.nextEvent();
    io.showText("Class Wheel! What do you do?");
    await io.nextEvent();

    let skipChance = chara.alignement === 'chaos' ? 0.15 : chara.alignement === 'death_eater' ? 0.10 : 0.07;
    let attentionChance = chara.stress >= 50 ? 0.07 : chara.stress >= 15 ? 0.14 : 0.21;
    let distractionChance = chara.stress >= 50 ? 0.21 : chara.stress >= 15 ? 0.14 : 0.07;
    let answerGoodChance = chara.stress >= 50 ? 0.07 : chara.stress >= 15 ? 0.11 : 0.15;
    let answerWrongChance = chara.stress >= 50 ? 0.15 : chara.stress >= 15 ? 0.11 : 0.07;
    let forgetHomeworkChance = chara.stress >= 50 ? 0.15 : chara.stress >= 15 ? 0.10 : 0.05;
    if (chara.grades.find(g => g.subject === sub)?.score! >= 7) { skipChance -= 0.05; answerGoodChance += 0.05; answerWrongChance -= 0.05; attentionChance += 0.05; distractionChance -= 0.05; }
    if (sub === 'History of Magic') { attentionChance -= 0.05; distractionChance += 0.05; }

    let regularChance = 1 - (skipChance + attentionChance + answerGoodChance + answerWrongChance + distractionChance + forgetHomeworkChance);
    
    let skip = wheels.newSegment('Skip class', skipChance),
        attention = wheels.newSegment('Attention', attentionChance),
        answergood = wheels.newSegment('Answer correctly', answerGoodChance),
        answerwrong = wheels.newSegment('Answer incorrectly', answerWrongChance),
        distraction = wheels.newSegment('Distraction', distractionChance),
        forgethomework = wheels.newSegment('Forget homework', forgetHomeworkChance),
        regular = wheels.newSegment('Regular class', regularChance);

    myWheel.setSegments([skip, attention, answergood, answerwrong, distraction, forgethomework, regular]);
    let wheelStop = await wheels.spinWheel(myWheel);

    if (wheelStop.text === 'Skip class')
    {
        io.showText("You decided to skip class.");
        return;
    }

    io.showText(`How does the ${wheelStop.text} class go?`);
    await io.nextEvent();

    // student for random interaction
    let buddy = getRandomClassStudent(chara.characterList);
    let randomEvent = randomClassEvent(getProfessorFromSubject(chara.characterList, sub), buddy);

    // attention -> +1 skill, -1 stress; answer good -> +1 skill, -1 stress, +5 points; answer wrong -> +1 stress, -5 points;
    // distraction -> friendship wheel, -1 stress; forget homework -> -10 points, +1 stress;
    // randomevent -> nothing
}
