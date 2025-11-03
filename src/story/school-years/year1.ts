
import { Wheel } from '../../wheel_magic/Wheel';
import * as random from '../../utilities/Random';
import * as wheels from "../../wheel_magic/wheel_helpers";
import { hogwartsHouse } from '../../utilities/basetypes';
import { MainChara } from '../../characters/maincharacter';
import * as io from "../../utilities/input_output_helpers";
import * as npc from '../../characters/character-functions';
import { newSegment } from '../../wheel_magic/wheel_helpers';
import * as chitchat from "../../dialogues/year-one-dialogues";
import { QuidditchSelection, sortGames } from '../../quidditch/quidditch';
import { classWheel, firstFlyingLesson } from '../../school_magic/classes';

import { chooseamovie } from '../../utilities/horrormovies';

const myWheel = (window as any).myWheel as Wheel;
const nextBtn = (window as any).nextBtn as HTMLButtonElement;
const spinBtn = (window as any).spinBtn as HTMLButtonElement;

/**
 * Attend the first year at Hogwarts.
 */
export async function attend(chara: MainChara<'Wizard'>): Promise<MainChara<'Wizard'>>
{
    // first clue
    // await schoolIntro(chara);

    // semester #1 *******************************************

    // prima lezione di volo
    // await firstFlyingLesson(chara);

    await QuidditchSelection(chara);
    // distribuire class wheels durante i semestri
    await classWheel(chara, chara.grades.map(g => g.subject));
    
    // selezioni di quidditch
    // gringott's theft
    // chocolate frog
    // library
    // troll in the dungeon
    // halloween party (?)
    // quidditch match 1
    // staircases (philosopher's stone + secret passages)
    // dark forest (?)

    // semester #2 *******************************************

    // add norbert (?)
    // quidditch game 2
    // tuttecose del secondo semestre
    // quidditch game 3
    // philosopher's stone quest (final attempt)
    // end of year feast + points

    return chara;
}

/**
 *  Attend the Sorting Ceremony: sort the mc house.
 * @param chara The mc.
 */
async function sortingCeremony(chara:MainChara<'Wizard'>): Promise<void>
{
    nextBtn.disabled = true;
    let hog = "";
    let hoghouse: hogwartsHouse = "none";
    let gry = newSegment('Gryffindor', 0.26), huf = newSegment('Hufflepuff', 0.24),
    rav = newSegment('Ravenclaw', 0.24), sly = newSegment('Slytherin', 0.24), choice = newSegment('choice', 0.02);

    // Changing wheel based on the player's gifts
    if (chara.gifts.metamorphmagus != 0) { huf.fraction += 0.15; gry.fraction -= 0.05; sly.fraction -= 0.05; rav.fraction -= 0.05; }
    if (chara.gifts.parselmouth != 0) { sly.fraction += 0.15; gry.fraction -= 0.05; huf.fraction -= 0.05; rav.fraction -= 0.05; }
    if (chara.gifts.sight) { rav.fraction += 0.15; gry.fraction -= 0.05; huf.fraction -= 0.05; sly.fraction -= 0.05; }

    io.showText("Which house is your house?");

    myWheel.setSegments([gry, huf, rav, sly, choice]);
    const wheelStop = await wheels.spinWheel(myWheel);

    if (wheelStop.text === "choice")
    {
        io.showText("The Sorting Hat is baffled by your mind.\nSince he cannot decide, the choice is yours.");
        
        io.showText("Choose wisely which house to join: (g/h/r/s)");
        do
        {
            hog = (await io.handleInput())?.toLowerCase();
            hoghouse = hog === "g" ? "Gryffindor" : hog === "h" ? "Hufflepuff" : hog === "r" ? "Ravenclaw" : "Slytherin";
        }
        while (hog !== "g" && hog !== "h" && hog !== "r" && hog !== "s");
    }
    else hoghouse = wheelStop.text as hogwartsHouse;

    chara.house = hoghouse;
    wheels.showWheelResult(`Your house is: ${hoghouse} !`);
}

/**
 * Handles Dumbledore's speech at the feast.
 * @param chara The mc.
 */
async function schoolIntro(chara:MainChara<'Wizard'>): Promise<void>
{
    await chitchat.arrivalAtHogwarts();
    await chitchat.sort();

    wheels.seeWheel(true);
    await sortingCeremony(chara);
    await io.nextEvent();
    wheels.seeWheel(false);

    // first clue
    const raven = chara.house === 'Ravenclaw';
    chara.clues[0] = random.spinbool(raven ? 60 : 50, raven ? 40 : 50);
    await chitchat.dumbledoresSpeech(chara.clues[0]);

    // friendship wheels
    io.showText("You are brought to your house's common room,\nwhere you can spend some time with your new housemates.");
    wheels.seeWheel(true);
    await npc.friendshipWheel(chara);
    await io.nextEvent();
    await npc.friendshipWheel(chara);
    await io.nextEvent();
    await npc.friendshipWheel(chara);
    await io.nextEvent();
    wheels.seeWheel(false);

    // sort quidditch games
    sortGames(chara);
}