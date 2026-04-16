
/**
 * Functions for handling Norbert's sidequest.
 */

import * as b from "../../../basis/_index";
import * as d from "../../../dialogues/_index";
import * as u from "../../../utilities/_index";
import { MainChara } from "../../../basis/_index";
import { newSegment } from "../../../utilities/_index";

/**
 * Norbert is born, Hagrid asks to keep it a secret.
 * @param chara The mc.
 */
export async function meetNorbert(chara: MainChara<'Wizard'>, lost: boolean = false): Promise<void>
{
    let hagrid = chara.characterList.find(c => c.longname === 'Hagrid')!;
    await d.meetingNorbert(lost);

    let keep = hagrid?.connectionlvl === 'friend' ? 70 : 80;
    let slip = (100 - keep) /2, report = (100 - keep) /2;
    if (b.alignmentChaos(chara.alignment)) { keep = 33; slip = 34; report = 33; }
    if (b.alignmentDeath(chara.alignment)) { report += 50; keep -= 50; }
    
    let segments = [
        newSegment('keep the secret', keep),
        newSegment('slip the secret', slip),
        newSegment('report to the school', report),
    ];
    let result = await u.spinWheel('What do you do?', segments);

    let harry = chara.characterList.find(c => c.longname === 'Harry Potter');
    switch (result)
    {
        case 'keep the secret':
            await u.showText('You decide to keep Hagrid\'s secret about Norbert.\nHagrid is grateful for your discretion, and your friendship grows stronger!');
            await b.improveConnection(chara, hagrid);
            break;
        case 'slip the secret':
            await u.showText('You accidentally let slip Hagrid\'s secret about Norbert.');
            await u.showText('Hagrid is disappointed, but understands it was a mistake.');
            if (harry && b.isFriend(harry))
            {
                await u.showText('Harry Potter overhears the news and is upset with you for betraying Hagrid\'s trust.');
                b.worsenConnection(chara, harry);
            }
            break;
        case 'report to the school':
            await u.showText('You report Hagrid\'s secret about Norbert to the school authorities.\nHagrid feels betrayed and your connection worsens.');
            b.worsenConnection(chara, hagrid);
            if (harry && b.isFriend(harry))
            {
                await u.showText('Harry Potter overhears the news and is upset with you for betraying Hagrid\'s trust.');
                b.worsenConnection(chara, harry);
            }
            await u.showText('The school takes action to ensure Norbert is safely relocated, and 15 points are awarded to ' + chara.house + ' for your sense of responsibility.');
            await b.housePointsIncrement(chara, 15);
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
    if (!hagrid || !b.isFriend(hagrid)) return false;     // Impossible if Hagrid is not a friend

    await d.savingNorbert();    
    let harry = chara.characterList.find(c => c.longname === 'Harry Potter');

    let success = 40, failure = 60;
    let avg = b.getAverageSkill(chara.grades);
    if (avg == 4) { success+=10; failure-=10; }
    if (avg > 4) { success+=30; failure-=30; }
    if (harry && b.isFriend(harry))
    {
        await u.showText('Once he discovers the task entrusted to you, Harry Potter offers to help you by lending you his invisibility cloak.');
        success+=20;
        failure-=20;
    }

    let segments = [newSegment('success', success), newSegment('failure', failure)];
    let result = await u.spinWheel('Do you succeed in saving Norbert?', segments);
    let metamorph_ending = false;

    if (result != "success")
    {
        let help = await giftHelping(chara, segments);
        metamorph_ending = help && chara.gifts.metamorphmagus > 0;
        result = help ? 'success' : 'failure';
    }

    if (metamorph_ending) await metamorphEnding(chara, harry && b.isFriend(harry));
    else result === 'success'
        ? await NorbertGoodEnding(chara, harry && b.isFriend(harry))
        : await NorbertBadEnding(chara, harry && b.isFriend(harry));
    return true;
}

/**
 * Handles the gifts helping during the Norbert sidequest.
 * @param chara The mc.
 * @param segments The wheel segments.
 * @returns The final result: true if the mc succeeds, false otherwise.
 */
async function giftHelping(chara: MainChara<'Wizard'>,  segments: u.WheelSegment[]): Promise<boolean>
{
    let sight = chara.gifts.sight, metamorphmagus = chara.gifts.metamorphmagus;
    if (sight === 0 && metamorphmagus === 0) return false;    // No gifts = no help

    await u.showText(sight > 0
        ? 'Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.'
        : 'Using your metamorphmagus abilities, you try to change the outcome in your favor.'
    );

    let success = (Number)(segments.find(s => s.text === 'success')?.fraction) ?? (() => { throw new Error('Segment not found'); })();
    success = Math.min(success + (sight ? chara.gifts.sight : chara.gifts.metamorphmagus) * 2, 100);
    segments = [newSegment('success', success), newSegment('failure', 100 - success)];
            
    return await u.spinWheel('Do you succeed?', segments) === 'success';
}

/**
 * Handles the bad ending scenario for the Norbert sidequest.
 * @param chara The mc.
 */
async function NorbertBadEnding(chara: MainChara<'Wizard'>, harryFriend: boolean = false)
{
    await d.NorbertFailure(harryFriend);
    let head = b.getHeadOfHouse(chara.characterList, chara.house);
    await u.showText('Filch brings you to ' + head.longname + ', and 10 points are taken from ' + chara.house + ' due to your wandering in the Castle at night.');
    await b.stress(chara, 5);
    await b.housePointsIncrement(chara, -10);
}

/**
 * Handles the good ending scenario for the Norbert sidequest.
 * @param chara The mc.
 */
async function NorbertGoodEnding(chara: MainChara<'Wizard'>, harryFriend: boolean = false)
{
    await d.NorbertSuccess(harryFriend);
    await b.subjectIncrement(chara, 'Care of Magical Creatures');

    await b.improveConnection(chara, 'Hagrid');
    if (harryFriend) await b.improveConnection(chara, 'Harry Potter');    
}

/**
 * Handles the metamorph ending scenario for the Norbert sidequest.
 * @param chara The mc.
 * @param harryFriend Whether Harry Potter is a friend of the mc.
 */
async function metamorphEnding(chara: MainChara<'Wizard'>, harryFriend: boolean = false)
{
    await d.NorbertFailure(harryFriend);
    let student = b.getRandomStudent(chara.characterList);
    await u.showText('Using your metamorph powers, however, you manage to shift the blame onto another student:\n' + student!.longname + ' ('+ (student?.house) + ').');
    await b.infamy(chara);
    await b.shiftAlignment(chara, 'chaos');
}