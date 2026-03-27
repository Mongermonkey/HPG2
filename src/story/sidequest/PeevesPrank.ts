
import { darkForest } from "./dark_forest";
import { spinEqual } from "../../utilities/random";
import { Character } from "../../characters/characters";
import * as wheels from "../../wheel_magic/wheel_helpers";
import * as io from "../../utilities/input_output_helpers";
import * as npc from '../../characters/character-functions';
import { newSegment, WheelSegment } from "../../wheel_magic/wheel_helpers";
import { getAverageSkill, MainChara } from "../../characters/maincharacter";
import { alignment, hogwartsHouse, hogwartsRole } from "../../utilities/basetypes";

/**
 * Handles Peeves' Prank outcomes.
 * @param chara The mc.
 */
export async function PeevesPrank(chara: MainChara<'Wizard'>)
{
    const nextBtn = (window as any).nextBtn as HTMLButtonElement;
    nextBtn.disabled = true;
    
    let peeves = npc.getCharacterByLongname(chara.characterList, 'Peeves')!;
    let filch = npc.getCharacterByLongname(chara.characterList, 'Filch')!;
    let prank = await randomPrank();
    let newFriend = prank === 'Peeves is shutting someone into an armor.' ? npc.getRandomStudent(chara.characterList) : undefined;

    let segments = PeevesOptions(peeves, chara.alignment, chara.house);
    let choice = await wheels.spinWheel("What do you do?", segments);

    segments = await firstChoice(chara, peeves, filch, choice);
    let result = await wheels.spinWheel("Do you succeed?", segments);

    if (result === 'success') await handleSuccess(chara, choice, newFriend);
    else await handleFailure(chara, filch, choice);
}

/**
 * Generates the options for interacting with Peeves based on the character's alignment and house.
 * @param peeves The Peeves character.
 * @param alg The alignment of the character.
 * @param house The house of the character.
 * @returns An array of WheelSegment representing the possible actions.
 */
function PeevesOptions(peeves: Character<hogwartsRole>, alg: alignment, house: hogwartsHouse): WheelSegment[]
{
    let laugh = 35, stop = 35, move = 30;    
    if (npc.isFriend(peeves) || alg === 'chaos') { laugh = 80; move = 15; stop = 5; }
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
 * Handles the first choice the player makes when interacting with Peeves.
 * @param chara The main character.
 * @param peeves The Peeves character.
 * @param filch The Filch character.
 * @param choice The choice made by the player.
 * @returns An array of WheelSegment representing the possible outcomes.
 */
async function firstChoice(chara: MainChara<'Wizard'>, peeves: Character<hogwartsRole>, filch: Character<hogwartsRole>, choice: string)
{
    let success = 50, failure = 50;
    switch (choice)
    {   case 'laugh along':
            io.showText('You laugh along with Peeves. He seems to like that, and you have fun together.');
            await io.nextEvent();
            if (!npc.isFriend(peeves)) await npc.improveConnection(chara, peeves);
            io.showText('A moment later, Filch arrives and demands an explanation. Peeves has already fled the scene.');
            await io.nextEvent();
            io.showText('You try to explain the situation as best as you can.');
            await io.nextEvent();
            if (filch.connectionlvl != 'foe') { success+=20; failure-=20; }
            break;
        case 'stop Peeves':
            io.showText('You decide to try and stop Peeves.');
            await io.nextEvent();
            let avg = getAverageSkill(chara.grades);
            if(avg == 4) { success+=20; failure-=20; }
            if(avg > 4) { success+=40; failure-=40; }
            break;
        case 'move away':
            io.showText('You decide to move away from the scene.');
            await io.nextEvent();
            success = 70;
            failure = 30;
            break;
    }
    return [newSegment('success', success), newSegment('failure', failure)];
}

/**
 * Handles the success outcome of the player's choice.
 * @param chara The main character.
 * @param choice The choice made by the player.
 */
async function handleSuccess(chara: MainChara<'Wizard'>, choice: string, newFriend?: Character<hogwartsRole>)
{
    let txt = "";
    switch (choice)
    {
        case 'move away':
            io.showText('You manage to move away without being noticed by Filch.');
            await io.nextEvent();
            break;
        case 'laugh along':
            io.showText('Filch seems to believe your explanation and you get away with it, under the astonished gaze of a group of students.');
            await io.nextEvent();
            chara.fame++;
            wheels.showWheelResult('fame++');
            break;
        case 'stop Peeves':
            let head = npc.getHeadOfHouse(chara.characterList, chara.house);
            io.showText('You manage to stop Peeves\' prank, just in time for Filch to see your doing.');
            await io.nextEvent();
            if (newFriend)
            {
                io.showText('You helped ' + newFriend.longname + ' out of a tricky situation, and ' + (newFriend.male ? 'he' : 'she') + ' is grateful to you for that.');
                await io.nextEvent();
            }
            io.showText('Filch mutters something and goes referring to your head of House, ' + head.longname + '.');
            await io.nextEvent();
            io.showText('Points are added to ' + chara.house + ' because of your actions.');
            await io.nextEvent();
            chara.housePoints+=5;
            chara.fame++;
            wheels.showWheelResult('+5 house points\nfame++');
            if (newFriend) await npc.improveConnection(chara, newFriend);
            break;
    }
    return;
}

/**
 * Handles the failure outcome of the player's choice.
 * @param chara The main character.
 * @param filch The Filch character.
 * @param choice The choice made by the player.
 */
async function handleFailure(chara: MainChara<'Wizard'>, filch: Character<hogwartsRole>, choice: string)
{
    switch (choice)
    {
        case 'move away':
            io.showText('You try to move away, but it\'s too late: Filch notices and holds you accountable for the prank.\nNow you\'re forced to face the consequences.');
            await io.nextEvent();
            break;
        case 'laugh along':
            io.showText('Filch does not believe you, and decides to punish you for being an accomplice to Peeves\' prank.');
            await io.nextEvent();
            break;
        case 'stop Peeves':
            io.showText('You try to stop Peeves, but unfortunately you fail and end up worsening the situation.');
            await io.nextEvent();
            if (filch.connectionlvl != 'foe')
            {
                io.showText('Filch comes in, furious, but believes that you had good intentions, and decides to let it go.');
                await io.nextEvent();
                chara.stress--;
                wheels.showWheelResult("stress--");
                return;
            }
            io.showText('Filch comes in, furious, and decides to punish you.');
            await io.nextEvent();
            break;
    }
    await darkForest(chara);
}

/**
 * Select a random prank for Peeves to play.
 */
async function randomPrank(): Promise<string>
{
    io.showText('Peeves the Poltergeist plays a prank, and you come at the perfect time.');
    await io.nextEvent();

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
    io.showText(prank);
    await io.nextEvent();
    
    return prank;
}