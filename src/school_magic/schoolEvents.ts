
import { libraryStudy } from "./classes";
import { befriendHagrid } from "./Hagrid";
import { Character } from "../characters/characters";
import * as wheels from "../wheel_magic/wheel_helpers";
import { MainChara } from "../characters/maincharacter";
import * as io from "../utilities/input_output_helpers";
import * as npc from '../characters/character-functions';
import { quidditchPractice } from "../quidditch/quidditch";
import * as chitchat from "../dialogues/year-one-dialogues";
import { PeevesPrank } from '../story/sidequest/PeevesPrank';
import { mirrorOfErised, roomOfRequirement, secretPassages } from "./secrets";
import { philosophersStoneQuest } from "../story/mainquest/philosophers_stone_quest";
import { hogwartsHouseName } from "../utilities/basetypes";
import { hogwartsHouse } from "../utilities/compositetypes";
import { addSegment, getUniformSegments, newSegment, WheelSegment } from "../wheel_magic/wheel_helpers";
import { eoyFeast } from "../dialogues/multi-year-dialogues";

// #region SCHOOL_WHEEL

/**
 * Handles the school wheel, providing random events within the school.
 * @param chara The main character.
 */
export async function schoolWheel(chara: MainChara<'Wizard'>): Promise<void>
{
    let result = await wheels.spinWheel("School Wheel! What happens?", getSegments(chara));
    switch (result)
    {
        case 'friendship wheel': await npc.friendshipWheel(chara, true);
            break;
        case 'study': await libraryStudy(chara);
            break;
        case 'Peeves\' prank': await PeevesPrank(chara);
            break;
        case 'ghost': await ghostEncounter(chara);
            break;
        case 'stairs': await stairsChange(chara);
            break;
        case 'Quidditch practice': await quidditchPractice(chara);
            break;
        case 'Hagrid': await befriendHagrid(chara);
            break;
        case 'Moaning Myrtle': await moaningMyrtle(chara);
            break;
        case 'secret passage': await secretPassages(chara);
            break;
        case 'Philosopher\'s Stone': await philosophersStoneQuest(chara);
            break;
    }        
}

/**
 * Generates the segments for the school wheel based on the main character's state.
 * @param chara The mc.
 * @returns An array of WheelSegment objects representing the possible events.
 */
function getSegments(chara: MainChara<'Wizard'>): WheelSegment[]
{
    let segments: WheelSegment[] = getUniformSegments(['friendship wheel', 'study', 'Peeves\' prank', 'ghost', 'stairs']);
    addSegment(segments, newSegment('Room of Requirement', 1));

    // se si è parte della squadra, aggiungo segmento
    if (chara.quidditchRole != 'none') addSegment(segments, newSegment('Quidditch practice', 20));
    
    // se si è amici di Hagrid, aggiungo segmento
    if (npc.isFriendByLongname(chara.characterList, 'Hagrid')) addSegment(segments, newSegment('Hagrid', 20));

    // se non è già stata incontrata Mirtilla, aggiungo segmento
    if (!npc.isFriendByLongname(chara.characterList, 'Moaning Myrtle')) addSegment(segments, newSegment('Moaning Myrtle', chara.gender == 'm' ? 1 : 15));

    // se non sono stati scoperti tutti i passaggi segreti, aggiungo segmento
    if (!chara.secretPassages.every(p => p.discovered)) addSegment(segments, newSegment('secret passage', 10));

    // se sono stati scoperti almeno 3 indizi, aggiungo segmento
    if (chara.clues.filter(c => c.discovered).length >= 3) addSegment(segments, newSegment('Philosopher\'s Stone', 5));

    return segments;
}

/**
 * Handles the encounter with a ghost.
 * @param chara The mc.
 */
async function ghostEncounter(chara: MainChara<'Wizard'>): Promise<void>
{
    // incontro con un fantasma (history of magic++, improveconnection)
    let ghost = chara.characterList.filter((c): c is Character<'Creature'> => c.role === 'Creature').find(c => c.house === chara.house);
    let sub = chara.grades.find(g => g.subject === 'History of Magic')!;
    sub.score++;
    await chitchat.ghostTalk(ghost!);
    wheels.showWheelResult(sub.subject + "++");
    await io.nextEvent();
    await npc.improveConnection(chara, ghost!.longname);
}

/**
 * Handles the encounter with Moaning Myrtle.
 * @param chara The mc.
 */
async function moaningMyrtle(chara: MainChara<'Wizard'>): Promise<void>
{
    let myrtle = chara.characterList.find(c => c.longname === 'Moaning Myrtle');
    await chitchat.myrtleEncounter(npc.isFriend(myrtle), chara.gender === 'm');
    npc.improveConnection(chara, myrtle!);
}

/**
 * Handles the event when the stairs change and the mc gets lost in the castle.
 * @param chara The main character.
 */
async function stairsChange(chara: MainChara<'Wizard'>): Promise<void>
{
    await chitchat.stairsChange();

    let segments = [newSegment('Hagrid', 89), newSegment('Mirror of Erised', 10), newSegment('Room of Requirement', 1)];
    let result = await wheels.spinWheel("Where do you end up?", segments);
    
    switch (result)
    {
        case 'Hagrid': await befriendHagrid(chara, true); break;
        case 'Mirror of Erised': await mirrorOfErised(chara); break;
        case 'Room of Requirement': await roomOfRequirement(chara); break;
    }
}

// #endregion

/**
 * Handles the end-of-year feast and the house cup ceremony
 * @param chara The mc.
 */
export async function feast(chara: MainChara<'Wizard'>): Promise<void>
{
    let houseScores = getHouseScores(chara);

    const [first, second, third, fourth] = houseScores
        .sort((a, b) => b.points - a.points);

    await eoyFeast(chara, first, second, third, fourth);
}

/**
 * Calculates the scores for each house based on quidditch games and other factors.
 * @param chara The main character.
 */
function getHouseScores(chara: MainChara<'Wizard'>): hogwartsHouse[]
{
    const validHouses = Array.from(new Set(chara.quidditchGames.flatMap(game => [game.houseA.name, game.houseB.name])))
        .filter((house): house is Exclude<hogwartsHouseName, 'none'> => house !== 'none');

    const pointsByHouse = new Map<hogwartsHouseName, number>();
    validHouses.forEach(house => pointsByHouse.set(house, 0));
    chara.quidditchGames.forEach(game =>
    {
        pointsByHouse.set(game.winner.name, (pointsByHouse.get(game.winner.name) ?? 0) + game.winnerScore);
        pointsByHouse.set(game.loser.name, (pointsByHouse.get(game.loser.name) ?? 0) + game.loserScore);
    });

    const getRandomHousePoints = (): number => (Math.floor(Math.random() * 41) + 20) * 5;
    const scores: hogwartsHouse[] = validHouses.map(name => ({
        name,
        points: (pointsByHouse.get(name) ?? 0) + getRandomHousePoints() + (chara.house === name ? chara.housePoints : 0)
    }));

    // Se ci sono pareggi, aggiungo +5 a una casa random tra quelle in parita fino ad avere 4 punteggi unici.
    while (new Set(scores.map(house => house.points)).size < scores.length)
    {
        const ties = new Map<number, hogwartsHouse[]>();
        scores.forEach(house =>
        {
            if (!ties.has(house.points)) ties.set(house.points, []);
            ties.get(house.points)!.push(house);
        });

        const tiedGroups = Array.from(ties.values()).filter(group => group.length > 1);
        const randomGroup = tiedGroups[Math.floor(Math.random() * tiedGroups.length)];
        const randomHouse = randomGroup[Math.floor(Math.random() * randomGroup.length)];
        randomHouse.points += 5;
    };

    return scores;
}