
/**
 * Peeves' prank event handler.
 *
 * 1. Generate a random prank scene.
 * 2. Build weighted options based on player's alignment and house.
 * 3. Resolve outcomes (social effects, stats, punishment -> Dark Forest sidequest).
 */

import * as b from "../../basis/_index";
import * as d from "../../dialogues/_index";
import * as u from "../../utilities/_index";
import { WheelSegment } from "../../utilities/_index";
import { MainChara, Character } from "../../basis/_index";
import { darkForest } from "../sidequest/year_one/dark_forest";

/**
 * Handles Peeves' Prank outcomes.
 * @param chara The mc.
 */
export async function PeevesPrank(chara: MainChara<'Wizard'>)
{
    let peeves = b.getCharacterByLongname(chara.characterList, 'Peeves')!;
    let filch = b.getCharacterByLongname(chara.characterList, 'Filch')!;
    let prank = await randomPrankFromList();
    let newFriend = prank === 'Peeves is shutting someone into an armor.' ? b.getRandomStudent(chara.characterList) : undefined;

    let segments = PeevesOptions(peeves, b.alignmentChaos(chara.alignment), chara.house);
    let result = await u.spinWheel('What do you do?', segments);

    if (result === 'laugh along') await LaughAlong(chara, peeves, filch);
    else if (result === 'move away') await MoveAway(chara, peeves, filch);
    else if (result === 'stop Peeves') await StopPeeves(chara, newFriend, filch);
}

/**
 * Select a random prank for Peeves to play.
 */
async function randomPrankFromList(): Promise<string>
{
    await u.showText('Peeves the Poltergeist plays a prank, and you come at the perfect time.');
    let pranklist = [
        'Peeves is shutting someone into an armor.',
        'Peeves is moving books to the wrong shelves.',
        'Peeves is spilling ink all over someone\'s homework.',
        'Peeves is dropping tarantulas from the ceiling in the Great Hall.',
        'Peeves is writing rude words all over the classroom\'s blackboard.',
        'Peeves is throwing books into a fireplace, creating a lot of smoke.',
        'Peeves is loosening stair carpets so students trip when running to class.',
        'Peeves is smearing ink on the telescope eyepeices in the astronomy class.',
        'Peeves is hiding in the second floor\'s bathroom, waiting to scare someone.',
        'Peeves is switching the labels on potion ingredients in the Potions classroom.',
        'Peeves is lobbing water balloons from the staircases, hitting whoever walks by.',
        'Peeves is trying to flood the third floor by clogging the sinks and opening the taps.',
        'Peeves is wreaking havoc in the kitchen, terrorizing the house-elves and ruining the food.',
        'Peeves is unscrewing the lids of ink bottles so they spill the moment someone picks them up.',
        'Peeves is tying students\' shoelaces together from under the tables while they are distracted.',
        'Peeves is floating upside down over the corridor and dropping chalk dust onto passing students.',
    ]
    let prank = u.spinEqual(pranklist);    
    await u.showText(prank);
    return prank;
}

/**
 * Generates the options for interacting with Peeves based on the character's alignment and house.
 * @param peeves The Peeves character.
 * @param alg The alignment of the character.
 * @param house The house of the character.
 * @returns An array of WheelSegment representing the possible actions.
 */
function PeevesOptions(peeves: Character<b.hogwartsRole>, chaosAlg: boolean, house: b.hogwartsHouseName): WheelSegment[]
{
    let laugh = 35, stop = 35, move = 30;    
    if (b.isFriend(peeves) || chaosAlg) { laugh = 80; move = 15; stop = 5; }
    else
    {
        switch (house)
        {
            case 'Gryffindor': move-=20; stop+=20; break;
            case 'Hufflepuff': laugh-=10; move-=20; stop+=30; break;
            case 'Ravenclaw': laugh-=20; stop-=10; move+=30; break;
            case 'Slytherin': stop-=20; laugh+=20; break;
        }
    }
    return [u.newSegment('laugh along', laugh), u.newSegment('move away', move), u.newSegment('stop Peeves', stop)];
}

/**
 * Handles the scenario where the mc laughs along with Peeves.
 * @param chara The mc.
 * @param peeves The Peeves character.
 * @param filch The Filch character.
 */
async function LaughAlong(chara: MainChara<'Wizard'>, peeves: Character<b.hogwartsRole>, filch: Character<b.hogwartsRole>)
{
    await u.showText('You laugh along with Peeves. He seems to like that, and you two have fun together.');
    if (!b.isFriend(peeves)) await b.improveConnection(chara, peeves);
    await u.showText('A moment later, Filch arrives and demands an explanation. Peeves has already fled the scene.');
    let success = 50, failure = 50;
    if (filch.connectionlvl != 'foe') { success+=20; failure-=20; }

    let segments = [u.newSegment('success', success), u.newSegment('failure', failure)];
    let result = await u.spinWheel('Do you succeed?', segments);

    if (result === 'success')
    {
        await u.showText('Filch seems to believe your explanation and you get away with it, under the astonished gaze of a group of students.');
        await b.fame(chara);
    }
    else
    {
        await u.showText('You try to explain the situation, but Filch does not believe you, and decides to punish you for being an accomplice to Peeves\' prank.');
        await darkForest(chara);
    }
}

/**
 * Handles the scenario where the mc decides to move away from Peeves' prank.
 * @param chara The mc.
 * @param peeves The Peeves character.
 * @param filch The Filch character.
 */
async function MoveAway(chara: MainChara<'Wizard'>, peeves: Character<b.hogwartsRole>, filch: Character<b.hogwartsRole>)
{
    await u.showText('You decide to move away from the scene before Filch arrives on the spot.');
    let success = 70, failure = 30;

    let segments = [u.newSegment('success', success), u.newSegment('failure', failure)];
    let result = await u.spinWheel('Do you succeed?', segments);

    if (result === 'success')
    {
        await u.showText('You manage to move away without being noticed by Filch.');
        return;
    }
    
    if (chara.gifts.metamorphmagus > 0)
    {
        await u.showText('You see Filch approaching from a distance.');
        let meta = chara.gifts.metamorphmagus * 7;
        await u.showText('Using your gift, you try to metamorph into someone else.');
        segments = [u.newSegment('metamorph', meta), u.newSegment('failure', 100 - meta)];
        result = await u.spinWheel('Do you succeed?', segments);
    }
    
    if (result === 'failure')
    {
        await u.showText('Unfortunately, Filch comes and holds you accountable for the prank. Now you\'re forced to face the consequences.');
        await darkForest(chara);
    }
    else if (result === 'metamorph')
    {
        let student = b.getRandomStudent(chara.characterList);
        await d.metamorphPrank(student!.longname, false);
        await b.worsenConnection(chara, student!);
        await b.shiftAlignment(chara, 'chaos');
    }
}

/**
 * Handles the scenario where the mc decides to stop Peeves' prank.
 * @param chara The mc.
 * @param newFriend A new friend character, if any.
 * @param filch The Filch character.
 */
async function StopPeeves(chara: MainChara<'Wizard'>, newFriend: Character<"Student"> | undefined, filch: Character<b.hogwartsRole>)
{
    let success = 50, failure = 50;
    await u.showText('You decide to try and stop Peeves.');
    let avg = b.getAverageSkill(chara.grades);
    if(avg == 4) { success+=20; failure-=20; }
    if(avg > 4) { success+=40; failure-=40; }
    let segments = [u.newSegment('success', success), u.newSegment('failure', failure)];
    let result = await u.spinWheel('Do you succeed?', segments);

    if (result === 'success')
    {
        let head = b.getHeadOfHouse(chara.characterList, chara.house);
        await u.showText('You manage to stop Peeves\' prank, just in time for Filch to see your doing.');
        if (newFriend)
        {
            await u.showText('You helped ' + newFriend.longname + ' out of a tricky situation, and ' + (newFriend.male ? 'he' : 'she') + ' is grateful to you for that.');
        }
        await u.showText('Filch mutters something and goes referring to your head of House, ' + head.longname + '.');
        await u.showText('Points are added to ' + chara.house + ' because of your actions.');
        chara.housePoints+=5;
        u.showWheelResult('+5 house points');
        await b.fame(chara);
        if (newFriend) await b.improveConnection(chara, newFriend);
        return;
    }

    await u.showText('You try to stop Peeves, but unfortunately you fail and end up worsening the situation.');

    if (chara.gifts.metamorphmagus > 0)
    {
        let meta = chara.gifts.metamorphmagus * 7;
        await u.showText('Using your gift, you try to metamorph into someone else.');
        segments = [u.newSegment('metamorph', meta), u.newSegment('failure', 100 - meta)];
        result = await u.spinWheel('Do you succeed?', segments);
    }

    if (result === 'failure')
    {
        if (filch.connectionlvl != 'foe')
            {
                await u.showText('Filch comes in, furious, but believes that you had good intentions, and decides to let it go.');
                await b.stress(chara, -1);
                return;
            }
        await u.showText('Filch comes in, furious, and takes you to punishment.');
        await darkForest(chara);
    }
    else if (result === 'metamorph')
    {
        let student = b.getRandomStudent(chara.characterList);
        await d.metamorphPrank(student!.longname, true);
        await b.worsenConnection(chara, student!);
        await b.infamy(chara);
        await b.shiftAlignment(chara, 'chaos');
    }
}