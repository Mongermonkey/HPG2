
import * as wheels from "../../wheel_magic/wheel_helpers";
import * as io from "../../utilities/input_output_helpers";
import * as npc from '../../characters/character-functions';
import { newSegment } from "../../wheel_magic/wheel_helpers";
import * as chitchat from "../../dialogues/year-one-dialogues";
import { getAverageSkill, MainChara } from "../../characters/maincharacter";

/**
 * Norbert is born, Hagrid asks to keep it a secret.
 * @param chara The mc.
 */
export async function meetNorbert(chara: MainChara<'Wizard'>, lost: boolean = false): Promise<void>
{
    let hagrid = chara.characterList.find(c => c.longname === 'Hagrid')!;
    await chitchat.meetingNorbert(lost);
    await io.nextEvent();

    let keep = hagrid?.connectionlvl === 'friend' ? 70 : 80;
    let slip = (100 - keep) /2, report = (100 - keep) /2;
    if (chara.alignment === 'chaos') { keep = 33; slip = 34; report = 33; }
    if (chara.alignment === 'death_eater') { report += 50; keep -= 50; }
    
    let segments = [
        newSegment('keep the secret', keep),
        newSegment('slip the secret', slip),
        newSegment('report to the school', report),
    ];
    let result = await wheels.spinWheel("What do you do?", segments);

    let harry = chara.characterList.find(c => c.longname === 'Harry Potter');
    switch (result)
    {
        case 'keep the secret':
            io.showText("You decide to keep Hagrid's secret about Norbert.\nHagrid is grateful for your discretion, and your friendship grows stronger!");
            await io.nextEvent();
            npc.improveConnection(chara, hagrid);
            await io.nextEvent();
            break;
        case 'slip the secret':
            io.showText("You accidentally let slip Hagrid's secret about Norbert.");
            await io.nextEvent();
            io.showText("Hagrid is disappointed, but understands it was a mistake.");
            await io.nextEvent();
            if (harry && npc.isFriend(harry))
            {
                io.showText("Harry Potter overhears the news and is upset with you for betraying Hagrid's trust.");
                await io.nextEvent();
                npc.worsenConnection(chara, harry);
                await io.nextEvent();
            }
            break;
        case 'report to the school':
            io.showText("You report Hagrid's secret about Norbert to the school authorities.\nHagrid feels betrayed and your connection worsens.");
            await io.nextEvent();
            npc.worsenConnection(chara, hagrid);
            await io.nextEvent();
            if (harry && npc.isFriend(harry))
            {
                io.showText("Harry Potter overhears the news and is upset with you for betraying Hagrid's trust.");
                await io.nextEvent();
                npc.worsenConnection(chara, harry);
                await io.nextEvent();
            }
            io.showText("The school takes action to ensure Norbert is safely relocated, and 5 points are awarded to " + chara.house + " for your sense of responsibility.");
            await io.nextEvent();
            wheels.showWheelResult("+5 house points");
            break;
    }
}

/**
 * Handles the saving of Norbert.
 * @param chara The mc.
 */
export async function saveNorbert(chara: MainChara<'Wizard'>)
{
    let hagrid = chara.characterList.find(c => c.longname === 'Hagrid');
    // If Hagrid is not a friend, return
    if (!hagrid || !npc.isFriend(hagrid)) return;

    await chitchat.savingNorbert();
    
    let harry = chara.characterList.find(c => c.longname === 'Harry Potter');

    let success = 40, failure = 60;
    let avg = getAverageSkill(chara.grades);
    if (avg == 4) { success+=10; failure-=10; }
    if (avg > 4) { success+=30; failure-=30; }
    if (harry && npc.isFriend(harry))
    {
        success+=20;
        failure-=20;
        io.showText("Once he discovers the task entrusted to you, Harry Potter offers to help you by lending you his invisibility cloak.");
        await io.nextEvent();
    }

    let segments = [newSegment('success', success), newSegment('failure', failure)];
    let result = await wheels.spinWheel('Do you succeed in saving Norbert?', segments);

    switch (result)
    {
        case 'success': await NorbertGoodEnding(chara, harry && npc.isFriend(harry));
            break;
        case 'failure': await NorbertBadEnding(chara, harry && npc.isFriend(harry));
            break;
    }
}

/**
 * Handles the bad ending scenario for the Norbert sidequest.
 * @param chara The mc.
 */
async function NorbertBadEnding(chara: MainChara<'Wizard'>, harryFriend: boolean = false)
{
    await chitchat.NorbertFailure(harryFriend);
    let head = npc.getHeadOfHouse(chara.characterList, chara.house);
    await io.showText('Filch brings you to ' + head.longname + ', and 10 points are taken from ' + chara.house + ' due to your wandering in the Castle at night.');
    await io.nextEvent();
    chara.stress += 5;
    chara.housePoints -= 10;
    wheels.showWheelResult("-10 house points");
    await io.nextEvent();
}

/**
 * Handles the good ending scenario for the Norbert sidequest.
 * @param chara The mc.
 */
async function NorbertGoodEnding(chara: MainChara<'Wizard'>, harryFriend: boolean = false)
{
    await chitchat.NorbertSuccess(harryFriend);
    chara.grades.find(g => g.subject === 'Care of Magical Creatures')!.score ++;
    wheels.showWheelResult('Care of Magical Creatures++');
    await io.nextEvent();

    npc.improveConnection(chara, 'Hagrid');
    await io.nextEvent();
    if (harryFriend)
    {
        npc.improveConnection(chara, 'Harry Potter');
        await io.nextEvent();
    }
}