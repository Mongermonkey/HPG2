
/**
 * Peeves' prank event handler.
 *
 * 1. Generate a random prank scene.
 * 2. Build weighted options based on player's alignment and house.
 * 3. Resolve outcomes (social effects, stats, punishment -> Dark Forest sidequest).
 */
import { spinEqual } from "../utilities/random";
import { Character } from "../characters/characters";
import * as io from "../utilities/input_output_helpers";
import * as npc from '../characters/character-functions';
import { darkForest } from "../story/sidequest/dark_forest";
import { alignmentChaos } from "../utilities/compositetypes";
import { metamorphPrank } from "../dialogues/multi-year-dialogues";
import { hogwartsRole, hogwartsHouseName } from "../utilities/basetypes";
import { newSegment, showWheelResult, spinWheel, WheelSegment } from "../wheel_magic/wheel_helpers";
import { shiftAlignment, fame, getAverageSkill, MainChara, stress, infamy } from "../characters/maincharacter";

/**
 * Handles Peeves' Prank outcomes.
 * @param chara The mc.
 */
export async function PeevesPrank(chara: MainChara<'Wizard'>)
{
    let peeves = npc.getCharacterByLongname(chara.characterList, 'Peeves')!;
    let filch = npc.getCharacterByLongname(chara.characterList, 'Filch')!;
    let prank = await randomPrankFromList();
    let newFriend = prank === 'Peeves is shutting someone into an armor.' ? npc.getRandomStudent(chara.characterList) : undefined;

    let segments = PeevesOptions(peeves, alignmentChaos(chara.alignment), chara.house);
    let result = await spinWheel('What do you do?', segments);

    if (result === 'laugh along') await LaughAlong(chara, peeves, filch);
    else if (result === 'move away') await MoveAway(chara, peeves, filch);
    else if (result === 'stop Peeves') await StopPeeves(chara, newFriend, filch);
}

/**
 * Select a random prank for Peeves to play.
 */
async function randomPrankFromList(): Promise<string>
{
    await io.showText('Peeves the Poltergeist plays a prank, and you come at the perfect time.');
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
    let prank = spinEqual(pranklist);    
    await io.showText(prank);
    return prank;
}

/**
 * Generates the options for interacting with Peeves based on the character's alignment and house.
 * @param peeves The Peeves character.
 * @param alg The alignment of the character.
 * @param house The house of the character.
 * @returns An array of WheelSegment representing the possible actions.
 */
function PeevesOptions(peeves: Character<hogwartsRole>, chaosAlg: boolean, house: hogwartsHouseName): WheelSegment[]
{
    let laugh = 35, stop = 35, move = 30;    
    if (npc.isFriend(peeves) || chaosAlg) { laugh = 80; move = 15; stop = 5; }
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
    return [newSegment('laugh along', laugh), newSegment('move away', move), newSegment('stop Peeves', stop)];
}

/**
 * Handles the scenario where the mc laughs along with Peeves.
 * @param chara The mc.
 * @param peeves The Peeves character.
 * @param filch The Filch character.
 */
async function LaughAlong(chara: MainChara<'Wizard'>, peeves: Character<hogwartsRole>, filch: Character<hogwartsRole>)
{
    await io.showText('You laugh along with Peeves. He seems to like that, and you two have fun together.');
    if (!npc.isFriend(peeves)) await npc.improveConnection(chara, peeves);
    await io.showText('A moment later, Filch arrives and demands an explanation. Peeves has already fled the scene.');
    let success = 50, failure = 50;
    if (filch.connectionlvl != 'foe') { success+=20; failure-=20; }

    let segments = [newSegment('success', success), newSegment('failure', failure)];
    let result = await spinWheel('Do you succeed?', segments);

    if (result === 'success')
    {
        await io.showText('Filch seems to believe your explanation and you get away with it, under the astonished gaze of a group of students.');
        await fame(chara);
    }
    else
    {
        await io.showText('You try to explain the situation, but Filch does not believe you, and decides to punish you for being an accomplice to Peeves\' prank.');
        await darkForest(chara);
    }
}

/**
 * Handles the scenario where the mc decides to move away from Peeves' prank.
 * @param chara The mc.
 * @param peeves The Peeves character.
 * @param filch The Filch character.
 */
async function MoveAway(chara: MainChara<'Wizard'>, peeves: Character<hogwartsRole>, filch: Character<hogwartsRole>)
{
    await io.showText('You decide to move away from the scene before Filch arrives on the spot.');
    let success = 70, failure = 30;

    let segments = [newSegment('success', success), newSegment('failure', failure)];
    let result = await spinWheel('Do you succeed?', segments);

    if (result === 'success')
    {
        await io.showText('You manage to move away without being noticed by Filch.');
        return;
    }
    
    if (chara.gifts.metamorphmagus > 0)
    {
        await io.showText('You see Filch approaching from a distance.');
        let meta = chara.gifts.metamorphmagus * 7;
        await io.showText('Using your gift, you try to metamorph into someone else.');
        segments = [newSegment('metamorph', meta), newSegment('failure', 100 - meta)];
        result = await spinWheel('Do you succeed?', segments);
    }
    
    if (result === 'failure')
    {
        await io.showText('Unfortunately, Filch comes and holds you accountable for the prank. Now you\'re forced to face the consequences.');
        await darkForest(chara);
    }
    else if (result === 'metamorph')
    {
        let student = npc.getRandomStudent(chara.characterList);
        await metamorphPrank(student!.longname, false);
        await npc.worsenConnection(chara, student!);
        await shiftAlignment(chara, 'chaos');
    }
}

/**
 * Handles the scenario where the mc decides to stop Peeves' prank.
 * @param chara The mc.
 * @param newFriend A new friend character, if any.
 * @param filch The Filch character.
 */
async function StopPeeves(chara: MainChara<'Wizard'>, newFriend: Character<"Student"> | undefined, filch: Character<hogwartsRole>)
{
    let success = 50, failure = 50;
    await io.showText('You decide to try and stop Peeves.');
    let avg = getAverageSkill(chara.grades);
    if(avg == 4) { success+=20; failure-=20; }
    if(avg > 4) { success+=40; failure-=40; }
    let segments = [newSegment('success', success), newSegment('failure', failure)];
    let result = await spinWheel('Do you succeed?', segments);

    if (result === 'success')
    {
        let head = npc.getHeadOfHouse(chara.characterList, chara.house);
        await io.showText('You manage to stop Peeves\' prank, just in time for Filch to see your doing.');
        if (newFriend)
        {
            await io.showText('You helped ' + newFriend.longname + ' out of a tricky situation, and ' + (newFriend.male ? 'he' : 'she') + ' is grateful to you for that.');
        }
        await io.showText('Filch mutters something and goes referring to your head of House, ' + head.longname + '.');
        await io.showText('Points are added to ' + chara.house + ' because of your actions.');
        chara.housePoints+=5;
        showWheelResult('+5 house points');
        await fame(chara);
        if (newFriend) await npc.improveConnection(chara, newFriend);
        return;
    }

    await io.showText('You try to stop Peeves, but unfortunately you fail and end up worsening the situation.');

    if (chara.gifts.metamorphmagus > 0)
    {
        let meta = chara.gifts.metamorphmagus * 7;
        await io.showText('Using your gift, you try to metamorph into someone else.');
        segments = [newSegment('metamorph', meta), newSegment('failure', 100 - meta)];
        result = await spinWheel('Do you succeed?', segments);
    }

    if (result === 'failure')
    {
        if (filch.connectionlvl != 'foe')
            {
                await io.showText('Filch comes in, furious, but believes that you had good intentions, and decides to let it go.');
                await stress(chara, -1);
                return;
            }
        await io.showText('Filch comes in, furious, and takes you to punishment.');
        await darkForest(chara);
    }
    else if (result === 'metamorph')
    {
        let student = npc.getRandomStudent(chara.characterList);
        await metamorphPrank(student!.longname, true);
        await npc.worsenConnection(chara, student!);
        await infamy(chara);
        await shiftAlignment(chara, 'chaos');
    }
}