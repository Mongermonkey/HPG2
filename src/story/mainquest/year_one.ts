
/**
 * Funzioni per la gestione della main quest del primo anno:
 * - region QUEST CLUES: funzioni per ogni indizio della quest (escluso il discorso di Silente a inizio anno e la ferita di Piton ad Halloween);
 * - region QUEST TASKS: Gestione flusso principale della quest + funzioni per ogni prova;
 * - region QUEST ENDINGS: Gestione dei possibili finali della quest.
 */

import * as b from '../../basis/_index';
import * as d from "../../dialogues/_index";
import * as u from "../../utilities/_index";
import { secretPassages } from "../school/secrets";
import { MainChara, Clue } from "../../basis/_index";

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
    if (b.countFriends(chara.characterList) >= 2)
    {
        var friend = b.getRandomFriend(chara.characterList);
        await u.showText('You hear ' + friend!.name + ' talking about something strange that happened.');
    }
    else await u.showText('You hear a passing conversation.');

    await d.GringottsTheft();
    chara.clues.find(c => c.name === 'gringotts_theft')!.discovered = true;
}

// Dumbledore's chocolate frog
export async function chocolateFrog(chara: MainChara<'Wizard'>)
{
    if (b.countFriends(chara.characterList) < 1) return;

    var friend = b.getRandomFriend(chara.characterList);
    await u.showText(friend!.name + ' gifts a chocolate frog to you.');
    await d.chocolateFrog(friend!.name);
    chara.clues.find(c => c.name === 'chocolate_frog')!.discovered = true;
}

// Flamel's book in the library
export async function library(chara: MainChara<'Wizard'>)
{
    await u.showText('While you\'re studying in the library, you find a suspicious large tome.\nSomeone must have left it there.');

    let chance = 30;
    let maxSkill = b.getMaxGrades(chara, 1)[0].score;
    if (b.isFriendByLongname(chara.characterList, 'Hermione Granger')) chance += 15;
    if (maxSkill > 7) chance += 25;
    else if (maxSkill > 6) chance += 10;
    if (chara.house === 'Ravenclaw') chance += 5;

    const result = await u.spinWheel('Class Wheel! What do you do?', [
        u.newSegment('Examine the book', chance),
        u.newSegment('Ignore the book', 100 - chance)
    ]);

    if (result === 'Ignore the book')
    {
        await u.showText('You have already studied enough for today.');
        return;
    }
    
    await d.libraryClue();
    chara.clues.find(c => c.name === 'library')!.discovered = true;
}

// Snape & Quirrell argument
export async function SnapeQuirrellTalk(chara: MainChara<'Wizard'>)
{
    let passage = await secretPassages(chara);
    if (!passage.internal) return;

    await d.SnapeQuirrellTalk();
    chara.clues.find(c => c.name === 'snape_quirrell_talk')!.discovered = true;
}

// #endregion

// #region QUEST TASKS

let sightBonus = 0;

// Quest intro
export async function philosophersStoneQuest(chara: MainChara<'Wizard'>, endofyear: boolean = false)
{
    chara.mainQuestProgress++;
    await d.mainQuest_Intro(chara.clues);

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

    let segments = [ u.newSegment('Success', chance), u.newSegment('Failure', 100 - chance) ];
    let result = await u.spinWheel('You try to unlock the door. Do you succeed?', segments);

    if (result === 'Failure')
    {
        await u.showText('Alas, it seems that you cannot get past the locked door.\nYou know, there are spells for these things...');
        return false;
    }
    await u.showText('Using a simple \'Alohomora\' spell, you successfully unlock the door and enter the forbidden corridor.');
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
    
    await d.Fluffy_intro(chara.mainQuestProgress != 0, FluffyClue, endofyear);
    if (endofyear) return true;    

    let charmSkill = chara.grades.find(g => g.subject === 'Charms')!.score;
    let magicalCreatureSkill = chara.grades.find(g => g.subject === 'Care of Magical Creatures')!.score;

    let chance = Math.min(95, (20 + charmSkill + (magicalCreatureSkill != 0 ? 20 : 0) + (FluffyClue ? 40 : 0)));
    
    let segments = [ u.newSegment('Success', chance), u.newSegment('Failure', 100 - chance) ];
    let result = await u.spinWheel('You try to get over ' + (FluffyClue ? 'Fluffy' : 'the beast') + '. Do you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        sightBonus--;
        await u.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await u.spinWheel('Do you succeed?', segments);
    }
    
    await d.Fluffy_ending(result === 'Success', FluffyClue);
    if (result === 'Success') return true;
    
    await d.mainQuest_HospitalFailure(chara.house);
    await b.improveConnection(chara, 'Professor Dumbledore');
    return false;
}

/**
 * Handles the Devil's Snare task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function DevilsSnareTask(chara: MainChara<'Wizard'>): Promise<boolean>
{
    await d.DevilsSnare_intro();

    let herbologySkill = chara.grades.find(g => g.subject === 'Herbology')!.score;
    let nevilleFriend = b.isFriendByLongname(chara.characterList, 'Neville Longbottom');
    let chance = Math.min(95, (40 + herbologySkill * 5 + (nevilleFriend ? 15 : 0)));
    
    let segments = [ u.newSegment('Success', chance), u.newSegment('Failure', 100 - chance) ];
    let result = await u.spinWheel('You try to get out of the Devil\'s Snare. Do you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        sightBonus--;
        await u.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await u.spinWheel('Do you succeed?', segments);
    }

    await d.DevilsSnare_ending(result === 'Success');
    if (result === 'Success') return true;
    
    await d.mainQuest_HospitalFailure(chara.house);
    await b.improveConnection(chara, 'Professor Dumbledore');
    return false;
}

/**
 * Handles the Winged Keys task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function wingedKeysTask(chara: MainChara<'Wizard'>): Promise<boolean>
{
    await d.WingedKeys_intro();

    let charmSkill = chara.grades.find(g => g.subject === 'Charms')!.score;
    let flyingSkill = chara.grades.find(g => g.subject === 'Flying')!.score;
    
    let chance = Math.min(95, (30 + charmSkill * 4 + flyingSkill * 4));
    let segments = [ u.newSegment('Success', chance), u.newSegment('Failure', 100 - chance) ];
    let result = await u.spinWheel('You try to use a broomstick to catch the winged keys and try unlocking the door.\nDo you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        sightBonus--;
        await u.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await u.spinWheel('Do you succeed?', segments);
    }

    await d.WingedKeys_ending(result === 'Success');
    if(result === 'Success') return true;
    
    await d.mainQuest_HospitalFailure(chara.house);
    await b.improveConnection(chara, 'Professor Dumbledore');
    return false;
}

/**
 * Handles the Wizard's Chess task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function WizardsChessTask(chara: MainChara<'Wizard'>): Promise<boolean>
{
    await d.WizardsChess_intro();

    let charmSkill = chara.grades.find(g => g.subject === 'Charms')!.score;
    let trasfigurationSkill = chara.grades.find(g => g.subject === 'Transfiguration')!.score;
    let chance = Math.min(95, (20 + charmSkill * 4 + trasfigurationSkill * 4 + chara.mainQuestProgress > 1 ? 10 : 0));
    
    let segments = [ u.newSegment('Success', chance), u.newSegment('Failure', 100 - chance) ];
    let result = await u.spinWheel('You try to play the chess game and win. Do you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        sightBonus--;
        await u.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await u.spinWheel('Do you succeed?', segments);
    }

    await d.WizardsChess_ending(result === 'Success');
    if (result === 'Success') return true;
    
    await d.mainQuest_HospitalFailure(chara.house);
    await b.improveConnection(chara, 'Professor Dumbledore');
    return false;
}

/**
 * Handles the mountain Troll task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function mountainTrollTask(chara: MainChara<'Wizard'>, endofyear: boolean): Promise<boolean>
{
    await d.mountainTroll_intro(endofyear);
    if (endofyear) return true;

    let darkArtSkill = chara.grades.find(g => g.subject === 'Defense Against the Dark Arts')!.score;
    let halloweenTroll = chara.clues.find(c => c.name === 'snape_halloween')!.discovered;
    let chance = Math.min(95, (20 + darkArtSkill * 5 + (halloweenTroll ? 30 : 0)));

    let segments = [ u.newSegment('Success', chance), u.newSegment('Failure', 100 - chance) ];
    let result = await u.spinWheel('You try to fight the mountain troll. Do you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        sightBonus--;
        await u.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await u.spinWheel('Do you succeed?', segments);
    }

    await d.mountainTroll_ending(result === 'Success');
    if (result === 'Success') return true;

    await d.mainQuest_HospitalFailure(chara.house);
    await b.improveConnection(chara, 'Professor Dumbledore');
    return false;
}

/**
 * Handles the Potion Riddle task in the Philosopher's Stone quest.
 * @param chara The mc.
 * @returns A boolean indicating whether the task was successful.
 */
async function potionRiddleTask(chara: MainChara<'Wizard'>): Promise<boolean>
{
    await d.potionRiddle_intro();

    let potionSkill = chara.grades.find(g => g.subject === 'Potions')!.score;

    let p1 = 20, p2 = 20, p3 = 20, p4 = 20, p5 = 20;
    if (potionSkill >= 5) { p1 = 15; p2 = 40; p3 = 15; p4 = 15; p5 = 15; }
    if (potionSkill >= 7) { p1 = 5; p2 = 50; p3 = 15; p4 = 15; p5 = 15; }

    let segments = [ u.newSegment('Bottle 1', p1), u.newSegment('Bottle 2', p2), u.newSegment('Bottle 3', p3), u.newSegment('Bottle 4', p4), u.newSegment('Bottle 5', p5) ];
    let showedText = 'You try to choose the right potion to drink. Do you succeed?';
    while (true)
    {
        let result = await u.spinWheel(showedText, segments);
        switch (result)
        {
            case 'Bottle 1': await d.potionRiddle_ending(false); return false;
            case 'Bottle 2': await d.potionRiddle_ending(true); return true;
            case 'Bottle 3':
            case 'Bottle 4':
            case 'Bottle 5':
                await d.potionRiddle_useless(result != 'Bottle 3');
                segments = u.removeSegment(segments, segments.find(s => s.text === result)!);
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

    await d.mirror_intro(endofyear, chara.secrets.mirrorOfErised);

    let discoveredClues = chara.clues.filter(c => c.discovered).length;
    let charmSkill = chara.grades.find(g => g.subject === 'Charms')!.score;
    let potionSkill = chara.grades.find(g => g.subject === 'Potions')!.score;
    let herbologySkill = chara.grades.find(g => g.subject === 'Herbology')!.score;
    let transfigurationSkill = chara.grades.find(g => g.subject === 'Transfiguration')!.score;
    let darkArtSkill = chara.grades.find(g => g.subject === 'Defense Against the Dark Arts')!.score;
    let chance = Math.min(55, (charmSkill + potionSkill + herbologySkill + transfigurationSkill + darkArtSkill) + (discoveredClues));

    let segments = [ u.newSegment('Success', chance), u.newSegment('Failure', 100 - chance) ];
    let result = await u.spinWheel('You try to fight professor Quirrell. Do you succeed?', segments);

    if (result != 'Success' && sightBonus > 0)
    {
        await u.showText('Using the Sight, you foresee this event. With this knowledge, you try to reverse the odds in your favor.');
        result = await u.spinWheel('Do you succeed?', segments);
    }
    
    return result === 'Success';
}

// #endregion

// #region QUEST ENDINGS

/**
 * Handles the good ending for the Philosopher's Stone quest.
 * @param chara The mc.
 * @param endofyear A boolean indicating whether it's the end of the year.
 */
async function goodEnding(chara: MainChara<'Wizard'>, endofyear: boolean)
{
    if (endofyear)
    {
        await d.mainQuest_GoodEnding(chara.house);
        await b.fame(chara, 15);
    }
    else await d.mainQuest_MidYearEnding(chara.house);
    
    chara.housePoints += 50;
    u.showWheelResult('house points++');
    await b.improveConnection(chara, 'Professor Dumbledore');
    await b.shiftAlignment(chara, 'phoenix_order', 7);
}

/**
 * Handles the bad ending for the Philosopher's Stone quest.
 * @param chara The mc.
 */
async function badEnding(chara: MainChara<'Wizard'>)
{
    await d.mainQuest_BadEnding();

    let maxGrades = b.getMaxGrades(chara, 3);
    for (let g of maxGrades)
    {
        await b.subjectIncrement(chara, g.subject, -1);
    }
}

// #endregion