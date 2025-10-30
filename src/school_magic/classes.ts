
import * as npc from '../characters';
import { Wheel } from "../wheel_magic/Wheel";
import { MainChara } from "../maincharacter";
import { subject } from "../utilities/basetypes";
import * as wheels from "../wheel_magic/wheel_helpers";
import * as io from "../utilities/input_output_helpers";
import { WheelSegment } from "../wheel_magic/wheel_helpers";
import { spinEqual, randomClassEvent } from "../utilities/Random";
import { Character, getProfessorFromSubject, getRandomClassStudent } from "../characters";

// #region class wheel

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

    myWheel.setSegments(getClassWheelSegments(chara, sub));
    wheels.seeWheel(true);

    let wheelStop = await wheels.spinWheel(myWheel);
    let prof = getProfessorFromSubject(chara.characterList, sub);

    await classWheelOutcome(chara, sub, prof, wheelStop.text);
    
    await io.nextEvent();
    wheels.seeWheel(false);
}

/**
 * Calcola i segmenti della ruota per la lezione in base al personaggio e alla materia.
 */
export function getClassWheelSegments(chara: MainChara<'Wizard'>, sub: subject): WheelSegment[]
{
    let skipChance = chara.alignement === 'chaos' ? 0.15 : chara.alignement === 'death_eater' ? 0.10 : 0.07;
    let attentionChance = chara.stress >= 50 ? 0.07 : chara.stress >= 15 ? 0.14 : 0.21;
    let distractionChance = chara.stress >= 50 ? 0.21 : chara.stress >= 15 ? 0.14 : 0.07;
    let answerGoodChance = chara.stress >= 50 ? 0.07 : chara.stress >= 15 ? 0.11 : 0.15;
    let answerWrongChance = chara.stress >= 50 ? 0.15 : chara.stress >= 15 ? 0.11 : 0.07;
    let forgetHomeworkChance = chara.stress >= 50 ? 0.15 : chara.stress >= 15 ? 0.10 : 0.05;

    if (chara.grades.find(g => g.subject === sub)?.score! >= 7) { skipChance -= 0.05; answerGoodChance += 0.05; answerWrongChance -= 0.05; attentionChance += 0.05; distractionChance -= 0.05; }
    if (sub === 'History of Magic') { attentionChance -= 0.05; distractionChance += 0.05; }

    let regularChance = 1 - (skipChance + attentionChance + answerGoodChance + answerWrongChance + distractionChance + forgetHomeworkChance);
    
    return [
        wheels.newSegment('Skip class', skipChance),
        wheels.newSegment('Pay attention', attentionChance),
        wheels.newSegment('Answer correctly', answerGoodChance),
        wheels.newSegment('Answer incorrectly', answerWrongChance),
        wheels.newSegment('Distraction', distractionChance),
        wheels.newSegment('Forget homework', forgetHomeworkChance),
        wheels.newSegment('Regular class', regularChance)
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
    let grade = chara.grades.find(g => g.subject === sub);
    if (!grade) throw new Error(`Subject ${sub} not found in character grades.`);

    let classOutcome = "", heshe = prof.male ? "He" : "She";
    await io.nextEvent();
    switch(wheelOutput)
    {
        case 'Skip class':
            io.showText("You decided to skip class.");
            return;
        case 'Pay attention':
            io.showText("You paid full attention during the class and learned a lot!");
            grade.score++;
            chara.stress = Math.max(0, chara.stress - 1);
            classOutcome = `${sub}++\nstress--`;
            break;
        case 'Answer correctly':
            io.showText(`You answered correctly to ${prof.longname}'s question! ${heshe} awards 5 points to ${chara.house}.`);
            grade.score++;
            chara.stress = Math.max(0, chara.stress - 1);
            chara.housePoints += 5;
            classOutcome = `${sub}++\nstress--\n+5 house points`;
            break;
        case 'Answer incorrectly':
            io.showText(`You answered incorrectly to ${prof.longname}'s question. ${heshe} takes 5 points from ${chara.house}.`);
            chara.stress += 1;
            chara.housePoints = Math.max(0, chara.housePoints - 5);
            classOutcome = `stress++\n-5 house points`;
            break;
        case 'Distraction':
            io.showText("During the class, you got distracted chatting.");
            chara.stress = Math.max(0, chara.stress - 1);
            await io.nextEvent();
            wheels.showWheelResult(`stress--`);
            wheels.seeWheel(true);
            await npc.friendshipWheel(chara, true, false);
            return;
        case 'Forget homework':
            io.showText(`You forgot to do your homework. ${prof.longname} scolds you and takes 10 points from ${chara.house}.`);
            chara.stress += 1;
            chara.housePoints = Math.max(0, chara.housePoints - 10);
            classOutcome = `stress++\n-10 house points`;
            break;
        case 'Regular class':
            io.showText("You attend the class as usual.");
            await io.nextEvent();            
            // student for random interaction
            let buddy = getRandomClassStudent(chara.characterList);
            io.showText(randomClassEvent(prof, buddy));
            return;
    }
    await io.nextEvent();
    wheels.seeWheel(false);
    wheels.showWheelResult(classOutcome);
}

// #endregion

/**
 * Handles the first flying lesson.
 * @param chara The mc.
 */
export async function firstFlyingLesson(chara: MainChara<'Wizard'>): Promise<void>
{
    const myWheel = (window as any).myWheel as Wheel;
    const nextBtn = (window as any).nextBtn as HTMLButtonElement;
    nextBtn.disabled = true;

    io.showText("It's your first flying lesson! Time to get on your broomstick and learn to fly.");
    const neville = chara.house === 'Gryffindor' || chara.house === 'Slytherin';

    if (!neville)
    {
        await io.nextEvent();
        io.showText("Class Wheel! What do you do?");

        myWheel.setSegments(getClassWheelSegments(chara, 'Flying'));
        wheels.seeWheel(true);
        let wheelStop = await wheels.spinWheel(myWheel);
        let prof = getProfessorFromSubject(chara.characterList, 'Flying');
        await classWheelOutcome(chara, 'Flying', prof, wheelStop.text);
        wheels.seeWheel(false);
        await io.nextEvent();
        return;
    }
}