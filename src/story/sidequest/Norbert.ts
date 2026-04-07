
import * as wheels from "../../wheel_magic/wheel_helpers";
import * as io from "../../utilities/input_output_helpers";
import * as npc from '../../characters/character-functions';
import { newSegment } from "../../wheel_magic/wheel_helpers";
import * as chitchat from "../../dialogues/year-one-dialogues";
import { getAverageSkill, housePointsIncrement, MainChara, stress, subjectIncrement } from "../../characters/maincharacter";
import { alignmentChaos, alignmentDeath } from "../../utilities/compositetypes";

/**
 * Norbert is born, Hagrid asks to keep it a secret.
 * @param chara The mc.
 */
export async function meetNorbert(chara: MainChara<'Wizard'>, lost: boolean = false): Promise<void>
{
    let hagrid = chara.characterList.find(c => c.longname === 'Hagrid')!;
    await chitchat.meetingNorbert(lost);

    let keep = hagrid?.connectionlvl === 'friend' ? 70 : 80;
    let slip = (100 - keep) /2, report = (100 - keep) /2;
    if (alignmentChaos(chara.alignment)) { keep = 33; slip = 34; report = 33; }
    if (alignmentDeath(chara.alignment)) { report += 50; keep -= 50; }
    
    let segments = [
        newSegment('keep the secret', keep),
        newSegment('slip the secret', slip),
        newSegment('report to the school', report),
    ];
    let result = await wheels.spinWheel('What do you do?', segments);

    let harry = chara.characterList.find(c => c.longname === 'Harry Potter');
    switch (result)
    {
        case 'keep the secret':
            await io.showText('You decide to keep Hagrid\'s secret about Norbert.\nHagrid is grateful for your discretion, and your friendship grows stronger!');
            await npc.improveConnection(chara, hagrid);
            break;
        case 'slip the secret':
            await io.showText('You accidentally let slip Hagrid\'s secret about Norbert.');
            await io.showText('Hagrid is disappointed, but understands it was a mistake.');
            if (harry && npc.isFriend(harry))
            {
                await io.showText('Harry Potter overhears the news and is upset with you for betraying Hagrid\'s trust.');
                npc.worsenConnection(chara, harry);
            }
            break;
        case 'report to the school':
            await io.showText('You report Hagrid\'s secret about Norbert to the school authorities.\nHagrid feels betrayed and your connection worsens.');
            npc.worsenConnection(chara, hagrid);
            if (harry && npc.isFriend(harry))
            {
                await io.showText('Harry Potter overhears the news and is upset with you for betraying Hagrid\'s trust.');
                npc.worsenConnection(chara, harry);
            }
            await io.showText('The school takes action to ensure Norbert is safely relocated, and 15 points are awarded to ' + chara.house + ' for your sense of responsibility.');
            await housePointsIncrement(chara, 15);
            break;
    }
}

/**
 * Handles the saving of Norbert.
 * @param chara The mc.
 * @return Whether the event was triggered or not.
 */
export async function saveNorbert(chara: MainChara<'Wizard'>): Promise<boolean>
{
    let hagrid = chara.characterList.find(c => c.longname === 'Hagrid');    
    if (!hagrid || !npc.isFriend(hagrid)) return false;     // Impossible if Hagrid is not a friend

    await chitchat.savingNorbert();    
    let harry = chara.characterList.find(c => c.longname === 'Harry Potter');

    let success = 40, failure = 60;
    let avg = getAverageSkill(chara.grades);
    if (avg == 4) { success+=10; failure-=10; }
    if (avg > 4) { success+=30; failure-=30; }
    if (harry && npc.isFriend(harry))
    {
        await io.showText('Once he discovers the task entrusted to you, Harry Potter offers to help you by lending you his invisibility cloak.');
        success+=20;
        failure-=20;
    }

    let segments = [newSegment('success', success), newSegment('failure', failure)];
    let result = await wheels.spinWheel('Do you succeed in saving Norbert?', segments);
    
    if (result != "Success" && chara.gifts.sight > 0)
    {
        await io.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await wheels.spinWheel('Do you succeed?', segments);
    }

    await result === 'success' ? NorbertGoodEnding(chara, harry && npc.isFriend(harry)) : NorbertBadEnding(chara, harry && npc.isFriend(harry));
    return true;
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
    await stress(chara, 5);
    await housePointsIncrement(chara, -10);
}

/**
 * Handles the good ending scenario for the Norbert sidequest.
 * @param chara The mc.
 */
async function NorbertGoodEnding(chara: MainChara<'Wizard'>, harryFriend: boolean = false)
{
    await chitchat.NorbertSuccess(harryFriend);
    await subjectIncrement(chara, 'Care of Magical Creatures');

    await npc.improveConnection(chara, 'Hagrid');
    if (harryFriend) await npc.improveConnection(chara, 'Harry Potter');    
}