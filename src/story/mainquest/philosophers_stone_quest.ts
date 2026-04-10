
/**
 * Funzioni per la gestione della main quest del primo anno:
 * - region QUEST CLUES: funzioni per ogni indizio della quest (escluso il discorso di Silente a inizio anno e la ferita di Piton ad Halloween);
 * - region QUEST TASKS: Gestione flusso principale della quest + funzioni per ogni prova;
 * - region QUEST ENDINGS: Gestione dei possibili finali della quest.
 */

import { Clue } from "../../utilities/compositetypes";
import * as wheels from "../../wheel_magic/wheel_helpers";
import * as io from "../../utilities/input_output_helpers";
import * as npc from '../../characters/character-functions';
import { secretPassages } from "../../school_magic/secrets";
import * as chitchat from "../../dialogues/year-one-dialogues";
import { newSegment, removeSegment } from "../../wheel_magic/wheel_helpers";
import { shiftAlignment, getMaxGrades, MainChara, subjectIncrement } from "../../characters/maincharacter";

// #region QUEST CLUES

/**
 * Plays the event for the chosen quest clue.
 * @param chara The main character.
 * @param clue The number of the clue to sort (starting from 1).
 */
export async function questClue(chara: MainChara<'Wizard'>, clue: Clue)
{
    if (clue.discovered) return;
    
    // Probabilità di ottenere l'indizio: [(7 - numero di indizi già scoperti) * 10] %
    const discovered = chara.clues.filter(c => c.discovered).length;
    let prob = (7 - discovered) * 0.10 + 0.20;
    // 0 indizi scoperti -> 90% di probabilità di scoprire il primo;
    // 1 -> 80%, 2 -> 70%, 3 -> 60%, 4 -> 50%, 5 -> 40%, 6 -> 30%
    let getClue = Math.random() < prob;
    if (!getClue) return;

    switch (clue.name)
    {
        case 'gringotts_theft': await gringottsTheft(chara);
            break;
        case 'chocolate_frog': await chocolateFrog(chara);
            break;
        case 'library': await library(chara);
            break;
        case 'snape_quirrell_talk': await SnapeQuirrellTalk(chara);
            break;
        default: return;
    }
}

// Gringott's theft
export async function gringottsTheft(chara: MainChara<'Wizard'>)
{
    if (npc.countFriends(chara.characterList) >= 2)
    {
        var friend = npc.getRandomFriend(chara.characterList);
        await io.showText('You hear ' + friend!.name + ' talking about something strange that happened.');
    }
    else await io.showText('You hear a passing conversation.');

    await chitchat.GringottsTheft();
    chara.clues.find(c => c.name === 'gringotts_theft')!.discovered = true;
}

// Dumbledore's chocolate frog
export async function chocolateFrog(chara: MainChara<'Wizard'>)
{
    if (npc.countFriends(chara.characterList) < 1) return;

    var friend = npc.getRandomFriend(chara.characterList);
    await io.showText(friend!.name + ' gifts a chocolate frog to you.');
    await chitchat.chocolateFrog(friend!.name);
    chara.clues.find(c => c.name === 'chocolate_frog')!.discovered = true;
}

// Flamel's book in the library
export async function library(chara: MainChara<'Wizard'>)
{
    await io.showText('While you\'re studying in the library, you find a suspicious large tome.\nSomeone must have left it there.');

    let chance = 30;
    let maxSkill = getMaxGrades(chara, 1)[0].score;
    if (npc.isFriendByLongname(chara.characterList, 'Hermione Granger')) chance += 15;
    if (maxSkill > 7) chance += 25;
    else if (maxSkill > 6) chance += 10;
    if (chara.house === 'Ravenclaw') chance += 5;

    const result = await wheels.spinWheel('Class Wheel! What do you do?', [
        newSegment('Examine the book', chance),
        newSegment('Ignore the book', 100 - chance)
    ]);

    if (result === 'Ignore the book')
    {
        await io.showText('You have already studied enough for today.');
        return;
    }
    
    await chitchat.libraryClue();
    chara.clues.find(c => c.name === 'library')!.discovered = true;
}

// Snape & Quirrell argument
export async function SnapeQuirrellTalk(chara: MainChara<'Wizard'>)
{
    let passage = await secretPassages(chara);
    if (!passage.internal) return;

    await chitchat.SnapeQuirrellTalk();
    chara.clues.find(c => c.name === 'snape_quirrell_talk')!.discovered = true;
}

// #endregion

// #region QUEST TASKS

let sightBonus = 0;

// Quest intro
export async function philosophersStoneQuest(chara: MainChara<'Wizard'>, endofyear: boolean = false)
{
    chara.mainQuestProgress++;
    await chitchat.mainQuest_Intro(chara.clues);

    sightBonus = chara.gifts.sight;
    if (!await doorTask(chara)) return;
    if (!await FluffyTask(chara, endofyear)) return;
    if (!await DevilsSnareTask(chara)) return;
    if (!await wingedKeysTask(chara)) return;
    if (!await WizardsChessTask(chara)) return;
    if (!await mountainTrollTask(chara, endofyear)) return;
    if (!await potionRiddleTask(chara)) return;

    let success = !await mirrorOfErisedTask(chara, endofyear);
    if (success) await goodEnding(chara, endofyear);
    else await badEnding(chara);
}

/**
 * Handles the door task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function doorTask(chara: MainChara<'Wizard'>): Promise<boolean>
{
    if (chara.mainQuestProgress > 0) return true;
    let charmSkill = chara.grades.find(g => g.subject === 'Charms')!.score;
    let chance = Math.min(95, (50 + charmSkill * 5));

    let segments = [ newSegment('Success', chance), newSegment('Failure', 100 - chance) ];
    let result = await wheels.spinWheel('You try to unlock the door. Do you succeed?', segments);

    if (result === 'Failure')
    {
        await io.showText('Alas, it seems that you cannot get past the locked door.\nYou know, there are spells for these things...');
        return false;
    }
    await io.showText('Using a simple \'Alohomora\' spell, you successfully unlock the door and enter the forbidden corridor.');
    return true;
}

/**
 * Handles the Fluffy task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function FluffyTask(chara: MainChara<'Wizard'>, endofyear: boolean): Promise<boolean>
{
    let FluffyClue = chara.clues.find(c => c.name === 'fluffy_talk')!.discovered;
    
    await chitchat.Fluffy_intro(chara.mainQuestProgress != 0, FluffyClue, endofyear);
    if (endofyear) return true;    

    let charmSkill = chara.grades.find(g => g.subject === 'Charms')!.score;
    let magicalCreatureSkill = chara.grades.find(g => g.subject === 'Care of Magical Creatures')!.score;

    let chance = Math.min(95, (20 + charmSkill + (magicalCreatureSkill != 0 ? 20 : 0) + (FluffyClue ? 40 : 0)));
    
    let segments = [ newSegment('Success', chance), newSegment('Failure', 100 - chance) ];
    let result = await wheels.spinWheel('You try to get over ' + (FluffyClue ? 'Fluffy' : 'the beast') + '. Do you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        sightBonus--;
        await io.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await wheels.spinWheel('Do you succeed?', segments);
    }
    
    await chitchat.Fluffy_ending(result === 'Success', FluffyClue);
    if (result === 'Success') return true;
    
    await chitchat.mainQuest_HospitalFailure(chara.house);
    await npc.improveConnection(chara, 'Professor Dumbledore');
    return false;
}

/**
 * Handles the Devil's Snare task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function DevilsSnareTask(chara: MainChara<'Wizard'>): Promise<boolean>
{
    await chitchat.DevilsSnare_intro();

    let herbologySkill = chara.grades.find(g => g.subject === 'Herbology')!.score;
    let nevilleFriend = npc.isFriendByLongname(chara.characterList, 'Neville Longbottom');
    let chance = Math.min(95, (40 + herbologySkill * 5 + (nevilleFriend ? 15 : 0)));
    
    let segments = [ newSegment('Success', chance), newSegment('Failure', 100 - chance) ];
    let result = await wheels.spinWheel('You try to get out of the Devil\'s Snare. Do you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        sightBonus--;
        await io.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await wheels.spinWheel('Do you succeed?', segments);
    }

    await chitchat.DevilsSnare_ending(result === 'Success');
    if (result === 'Success') return true;
    
    await chitchat.mainQuest_HospitalFailure(chara.house);
    await npc.improveConnection(chara, 'Professor Dumbledore');
    return false;
}

/**
 * Handles the Winged Keys task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function wingedKeysTask(chara: MainChara<'Wizard'>): Promise<boolean>
{
    await chitchat.WingedKeys_intro();

    let charmSkill = chara.grades.find(g => g.subject === 'Charms')!.score;
    let flyingSkill = chara.grades.find(g => g.subject === 'Flying')!.score;
    
    let chance = Math.min(95, (30 + charmSkill * 4 + flyingSkill * 4));
    let segments = [ newSegment('Success', chance), newSegment('Failure', 100 - chance) ];
    let result = await wheels.spinWheel('You try to use a broomstick to catch the winged keys and try unlocking the door.\nDo you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        sightBonus--;
        await io.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await wheels.spinWheel('Do you succeed?', segments);
    }

    await chitchat.WingedKeys_ending(result === 'Success');
    if(result === 'Success') return true;
    
    await chitchat.mainQuest_HospitalFailure(chara.house);
    await npc.improveConnection(chara, 'Professor Dumbledore');
    return false;
}

/**
 * Handles the Wizard's Chess task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function WizardsChessTask(chara: MainChara<'Wizard'>): Promise<boolean>
{
    await chitchat.WizardsChess_intro();

    let charmSkill = chara.grades.find(g => g.subject === 'Charms')!.score;
    let trasfigurationSkill = chara.grades.find(g => g.subject === 'Transfiguration')!.score;
    let chance = Math.min(95, (20 + charmSkill * 4 + trasfigurationSkill * 4 + chara.mainQuestProgress > 1 ? 10 : 0));
    
    let segments = [ newSegment('Success', chance), newSegment('Failure', 100 - chance) ];
    let result = await wheels.spinWheel('You try to play the chess game and win. Do you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        sightBonus--;
        await io.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await wheels.spinWheel('Do you succeed?', segments);
    }

    await chitchat.WizardsChess_ending(result === 'Success');
    if (result === 'Success') return true;
    
    await chitchat.mainQuest_HospitalFailure(chara.house);
    await npc.improveConnection(chara, 'Professor Dumbledore');
    return false;
}

/**
 * Handles the mountain Troll task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function mountainTrollTask(chara: MainChara<'Wizard'>, endofyear: boolean): Promise<boolean>
{
    await chitchat.mountainTroll_intro(endofyear);
    if (endofyear) return true;

    let darkArtSkill = chara.grades.find(g => g.subject === 'Defense Against the Dark Arts')!.score;
    let halloweenTroll = chara.clues.find(c => c.name === 'snape_halloween')!.discovered;
    let chance = Math.min(95, (20 + darkArtSkill * 5 + (halloweenTroll ? 30 : 0)));

    let segments = [ newSegment('Success', chance), newSegment('Failure', 100 - chance) ];
    let result = await wheels.spinWheel('You try to fight the mountain troll. Do you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        sightBonus--;
        await io.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await wheels.spinWheel('Do you succeed?', segments);
    }

    await chitchat.mountainTroll_ending(result === 'Success');
    if (result === 'Success') return true;

    await chitchat.mainQuest_HospitalFailure(chara.house);
    await npc.improveConnection(chara, 'Professor Dumbledore');
    return false;
}

/**
 * Handles the Potion Riddle task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function potionRiddleTask(chara: MainChara<'Wizard'>): Promise<boolean>
{
    await chitchat.potionRiddle_intro();

    let potionSkill = chara.grades.find(g => g.subject === 'Potions')!.score;

    let p1 = 20, p2 = 20, p3 = 20, p4 = 20, p5 = 20;
    if (potionSkill >= 5) { p1 = 15; p2 = 40; p3 = 15; p4 = 15; p5 = 15; }
    if (potionSkill >= 7) { p1 = 5; p2 = 50; p3 = 15; p4 = 15; p5 = 15; }

    let segments = [ newSegment('Bottle 1', p1), newSegment('Bottle 2', p2), newSegment('Bottle 3', p3), newSegment('Bottle 4', p4), newSegment('Bottle 5', p5) ];
    let showedText = 'You try to choose the right potion to drink. Do you succeed?';
    while (true)
    {
        let result = await wheels.spinWheel(showedText, segments);
        switch (result)
        {
            case 'Bottle 1': await chitchat.potionRiddle_ending(false); return false;
            case 'Bottle 2': await chitchat.potionRiddle_ending(true); return true;
            case 'Bottle 3':
            case 'Bottle 4':
            case 'Bottle 5':
                await chitchat.potionRiddle_useless(result != 'Bottle 3');
                segments = removeSegment(segments, segments.find(s => s.text === result)!);
                showedText = 'You try another one... Do you succeed?';
                break;
        }
    }
}

/**
 * Handles the Mirror of Erised task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function mirrorOfErisedTask(chara: MainChara<'Wizard'>, endofyear: boolean): Promise<boolean>
{
    if (endofyear) return true;

    await chitchat.mirror_intro(endofyear, chara.secrets.mirrorOfErised);

    let discoveredClues = chara.clues.filter(c => c.discovered).length;
    let charmSkill = chara.grades.find(g => g.subject === 'Charms')!.score;
    let potionSkill = chara.grades.find(g => g.subject === 'Potions')!.score;
    let herbologySkill = chara.grades.find(g => g.subject === 'Herbology')!.score;
    let transfigurationSkill = chara.grades.find(g => g.subject === 'Transfiguration')!.score;
    let darkArtSkill = chara.grades.find(g => g.subject === 'Defense Against the Dark Arts')!.score;
    let chance = Math.min(55, (charmSkill + potionSkill + herbologySkill + transfigurationSkill + darkArtSkill) + (discoveredClues));

    let segments = [ newSegment('Success', chance), newSegment('Failure', 100 - chance) ];
    let result = await wheels.spinWheel('You try to fight professor Quirrell. Do you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        await io.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await wheels.spinWheel('Do you succeed?', segments);
    }
    
    return result === 'Success';
}

// #endregion

// #region QUEST ENDINGS

/**
 * Handles the good ending for the Philosopher's Stone quest.
 * @param chara The mc.
 */
async function goodEnding(chara: MainChara<'Wizard'>, endofyear: boolean)
{
    if (endofyear) await chitchat.mainQuest_MidYearEnding(chara.house);
    else await chitchat.mainQuest_GoodEnding(chara.house);
    
    chara.housePoints += 50;
    wheels.showWheelResult('house points++');
    await npc.improveConnection(chara, 'Professor Dumbledore');
    await shiftAlignment(chara, 'phoenix_order', 7);
}

/**
 * Handles the bad ending for the Philosopher's Stone quest.
 * @param chara The mc.
 */
async function badEnding(chara: MainChara<'Wizard'>)
{
    await chitchat.mainQuest_BadEnding();

    let maxGrades = getMaxGrades(chara, 3);
    for (let g of maxGrades)
    {
        await subjectIncrement(chara, g.subject, -1);
    }
}

// #endregion