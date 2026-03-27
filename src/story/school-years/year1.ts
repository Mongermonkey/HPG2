
import { troll } from '../sidequest/troll';
import { Wheel } from '../../wheel_magic/Wheel';
import * as random from '../../utilities/random';
import { PeevesPrank } from '../sidequest/PeevesPrank';
import { chooseamovie } from '../../utilities/movielist';
import * as wheels from "../../wheel_magic/wheel_helpers";
import { hogwartsHouse } from '../../utilities/basetypes';
import * as io from "../../utilities/input_output_helpers";
import * as npc from '../../characters/character-functions';
import { newSegment } from '../../wheel_magic/wheel_helpers';
import * as chitchat from "../../dialogues/year-one-dialogues";
import { meetNorbert, saveNorbert } from '../sidequest/Norbert';
import { MainChara, print } from '../../characters/maincharacter';
import { feast, schoolWheel } from '../../school_magic/schoolEvents';
import { classWheel, firstFlyingLesson } from '../../school_magic/classes';
import { quidditchGame, quidditchSelection, sortGames } from '../../quidditch/quidditch';
import { philosophersStoneQuest, questClue } from '../mainquest/philosophers_stone_quest';

const myWheel = (window as any).myWheel as Wheel;
const nextBtn = (window as any).nextBtn as HTMLButtonElement;
const spinBtn = (window as any).spinBtn as HTMLButtonElement;

/**
 * Attend the first year at Hogwarts.
 * The function works on a MainChara<'Wizard'> object, and returns the same object updated.
 */
export async function attend(chara: MainChara<'Wizard'>): Promise<MainChara<'Wizard'>>
{
    let moviestuff = false;
    if (moviestuff)
    {
        do {
        await chooseamovie("");   // 'horror' for horror or anything else for drama/romance
        await io.nextEvent();
        } while (true);
    }

    // print(chara);
    
    await schoolIntro(chara);

    // semester #1 **************************************************************************************

    await firstFlyingLesson(chara);
    await quidditchSelection(chara);
    await questClue(chara, chara.clues.find(c => c.name === 'gringotts_theft')!);

    await classWheel(chara);
    await quidditchGame(chara, 0);
    await schoolWheel(chara);
 
    await classWheel(chara);
    await quidditchGame(chara, 1);
    await questClue(chara, chara.clues.find(c => c.name === 'chocolate_frog')!);

    await troll(chara);
    
    await classWheel(chara);
    await quidditchGame(chara, 2);
    await schoolWheel(chara);

    // semester #2 **************************************************************************************

    await classWheel(chara);
    await schoolWheel(chara);
    await questClue(chara, chara.clues.find(c => c.name === 'library')!);

    await classWheel(chara);
    await quidditchGame(chara, 3);
    await schoolWheel(chara);

    await classWheel(chara);
    await quidditchGame(chara, 4);
    await questClue(chara, chara.clues.find(c => c.name === 'snape_quirrell_talk')!);
    
    await saveNorbert(chara);

    await classWheel(chara);
    await quidditchGame(chara, 5);
    await schoolWheel(chara);
    
    // aggiungere check sugli indizi prima della main quest (+ tentativi multipli)
    await philosophersStoneQuest(chara, true);

    await feast(chara);

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
    let gry = newSegment('Gryffindor', 26), huf = newSegment('Hufflepuff', 24),
    rav = newSegment('Ravenclaw', 24), sly = newSegment('Slytherin', 24), choice = newSegment('choice', 2);

    // Changing wheel based on the player's gifts
    if (chara.gifts.metamorphmagus != 0) { huf.fraction = wheels.pct(huf.fraction + 15); gry.fraction = wheels.pct(gry.fraction - 5); sly.fraction = wheels.pct(sly.fraction - 5); rav.fraction = wheels.pct(rav.fraction - 5); }
    if (chara.gifts.parselmouth != 0) { sly.fraction = wheels.pct(sly.fraction + 15); gry.fraction = wheels.pct(gry.fraction - 5); huf.fraction = wheels.pct(huf.fraction - 5); rav.fraction = wheels.pct(rav.fraction - 5); }
    if (chara.gifts.sight) { rav.fraction = wheels.pct(rav.fraction + 15); gry.fraction = wheels.pct(gry.fraction - 5); huf.fraction = wheels.pct(huf.fraction - 5); sly.fraction = wheels.pct(sly.fraction - 5); }

    io.showText("Which house is your house?");

    myWheel.setSegments([gry, huf, rav, sly, choice]);
    const wheelStop = await wheels.depr(myWheel);

    if (wheelStop.text === "choice")
    {
        io.showText("The Sorting Hat is baffled by your mind.\nSince he cannot decide, the choice is yours.");
        await io.nextEvent();        
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
    await io.nextEvent();
}

/**
 * Handles Dumbledore's speech at the feast.
 * sorting ceremony + first clue + friendshipWheel x3
 * @param chara The mc.
 */
async function schoolIntro(chara:MainChara<'Wizard'>): Promise<void>
{
    await chitchat.arrivalAtHogwarts();
    await chitchat.sort();

    wheels.seeWheel(true);
    await sortingCeremony(chara);
    wheels.seeWheel(false);

    // quest clue #0 - Dumbledore's speech
    const raven = chara.house === 'Ravenclaw';
    chara.clues.find(c => c.name === 'dumbledores_speech')!.discovered = random.spinbool(raven ? 90 : 80, raven ? 10 : 20);
    await chitchat.dumbledoresSpeech(chara.clues.find(c => c.name === 'dumbledores_speech')!.discovered);

    // friendship wheels
    io.showText("You are brought to your house's common room,\nwhere you can spend some time with your new housemates.");
    await npc.friendshipWheel(chara);
    await npc.friendshipWheel(chara);
    await npc.friendshipWheel(chara);

    // sort quidditch games
    sortGames(chara);
}
