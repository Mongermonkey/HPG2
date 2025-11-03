
import { Wheel } from "../wheel_magic/Wheel";
import * as wheels from "../wheel_magic/wheel_helpers";
import { MainChara } from "../characters/maincharacter";
import * as io from "../utilities/input_output_helpers";
import * as npc from '../characters/character-functions';
import { newSegment } from "../wheel_magic/wheel_helpers";
import * as chitchat from "../dialogues/year-one-dialogues";
import { hogwartsHouse, quidditchRole } from "../utilities/basetypes";

const myWheel = (window as any).myWheel as Wheel;
const nextBtn = (window as any).nextBtn as HTMLButtonElement;
const spinBtn = (window as any).spinBtn as HTMLButtonElement;

/**
 * Sort the list of the six Quidditch games for the current year.
 * @param chara The mc.
 */
export function sortGames(chara: MainChara<'Wizard'>): void
{
    const houses: hogwartsHouse[] = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
    let pairs: [hogwartsHouse, hogwartsHouse][] =
    [
        ['Gryffindor', 'Slytherin'], ['Gryffindor', 'Ravenclaw'], ['Gryffindor', 'Hufflepuff'],
        ['Slytherin', 'Ravenclaw'], ['Slytherin', 'Hufflepuff'], ['Ravenclaw', 'Hufflepuff']
    ];

    // mix the games
    for (let i = pairs.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    chara.quidditchGames = pairs.map(([houseA, houseB]) => ({
        houseA,
        houseB,
        scoreA: 0,
        scoreB: 0,
        winner: 'none'
    }));
}

/**
 * Handles the selection for the Quidditch team.
 * @param chara The mc.
 */
export async function QuidditchSelection(chara: MainChara<'Wizard'>): Promise<void>
{
    let head = npc.getHeadOfHouse(chara.characterList, chara.house);
    let captain = npc.getQuidditchCaptain(chara.characterList, chara.house);
    let wheelStop = null;

    if (chara.quidditchRole === 'candidate')
    {
        io.showText(`As forwarned by ${head.longname}, you are now to attend the tryouts for the Quidditch team.`);
        await io.nextEvent();
    }
    else
    {
        io.showText("Quidditch tryouts are now open! Interested in applying?");
        await io.nextEvent();
        let quid = newSegment("Interested", Math.min(0.95, 0.1 + chara.grades.find(g => g.subject === 'Flying')!.score / 10));
        let notquid = newSegment("Not Interested", 1 - quid.fraction);
        myWheel.setSegments([quid, notquid]);
        wheels.seeWheel(true);
        wheelStop = await wheels.spinWheel(myWheel);
        await io.nextEvent();
        wheels.seeWheel(false);

        if (wheelStop.text === "Not Interested")
        {
            io.showText("You decided not to try out for the Quidditch team this year.");
            await io.nextEvent();
            return;
        }
    }

    await chitchat.QuidditchSelection(captain.longname, chara.house);

    let pass = newSegment("Pass", Math.min(0.95, 0.1 + chara.grades.find(g => g.subject === 'Flying')!.score/10));
    let bad = newSegment("Fail", 1 - pass.fraction);
    myWheel.setSegments([pass, bad]);
    wheels.seeWheel(true);
    wheelStop = await wheels.spinWheel(myWheel);
    await io.nextEvent();
    wheels.seeWheel(false);

    if (wheelStop.text === "Fail")
    {
        io.showText("Alas, you failed the Quidditch selection. Maybe you can try again next year.");
        await io.nextEvent();
        return;
    }

    io.showText("You passed the Quidditch selection!");
    await io.nextEvent();
    io.showText("What role will you play?");
    await io.nextEvent();
    let r1 = newSegment("Seeker", 0.16), r2 = newSegment("Chaser", 0.40), r3 = newSegment("Beater", 0.28), r4 = newSegment("Keeper", 0.16);
    if (chara.quidditchRole === 'candidate')
    {
        r1.fraction += 0.36;
        r2.fraction -= 0.12;
        r3.fraction -= 0.12;
        r4.fraction -= 0.12;
    }
    myWheel.setSegments([r1, r2, r3, r4]);
    wheels.seeWheel(true);
    wheelStop = await wheels.spinWheel(myWheel);
    await io.nextEvent();
    wheels.seeWheel(false);

    chara.quidditchRole = wheelStop.text.toLowerCase() as quidditchRole;
    io.showText(`Congratulations! You have been selected as ${wheelStop.text} for the ${chara.house} Quidditch team!`);
    await io.nextEvent();
    io.showText(`${captain.name} welcomes you to the team.`);
}