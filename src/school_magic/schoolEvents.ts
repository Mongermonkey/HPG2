
import { libraryStudy } from "./classes";
import { befriendHagrid } from "./Hagrid";
import { PeevesPrank } from './PeevesPrank';
import * as random from '../utilities/random';
import { Character } from "../characters/characters";
import * as io from "../utilities/input_output_helpers";
import * as npc from '../characters/character-functions';
import { hogwartsHouseName } from "../utilities/basetypes";
import * as chitchat from "../dialogues/year-one-dialogues";
import { hogwartsHouse } from "../utilities/compositetypes";
import { eoyFeast } from "../dialogues/multi-year-dialogues";
import { quidditchPractice, sortGames } from "../quidditch/quidditch";
import { MainChara, subjectIncrement } from "../characters/maincharacter";
import { mirrorOfErised, roomOfRequirement, secretPassages } from "./secrets";
import { philosophersStoneQuest } from "../story/mainquest/philosophers_stone_quest";
import { addSegment, getUniformSegments, newSegment, WheelSegment, spinWheel, showWheelResult } from "../wheel_magic/wheel_helpers";

// #region SCHOOL_WHEEL

/**
 * Handles the school wheel, providing random events within the school.
 * @param chara The main character.
 */
export async function schoolWheel(chara: MainChara<'Wizard'>): Promise<void>
{
    let result = await spinWheel('School Wheel! What happens?', getSegments(chara));
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
    await chitchat.ghostTalk(ghost!);
    await subjectIncrement(chara, 'History of Magic');
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
    await npc.improveConnection(chara, myrtle!);
}

/**
 * Handles the event when the stairs change and the mc gets lost in the castle.
 * @param chara The main character.
 */
async function stairsChange(chara: MainChara<'Wizard'>): Promise<void>
{
    await chitchat.stairsChange();

    let segments = [newSegment('Hagrid', 89), newSegment('Mirror of Erised', 10), newSegment('Room of Requirement', 1)];
    let result = await spinWheel('Where do you end up?', segments);
    
    switch (result)
    {
        case 'Hagrid': await befriendHagrid(chara, true); break;
        case 'Mirror of Erised': await mirrorOfErised(chara); break;
        case 'Room of Requirement': await roomOfRequirement(chara); break;
    }
}

// #endregion

/**
 *  Attend the Sorting Ceremony: sort the mc house.
 * @param chara The mc.
 */
async function sortingCeremony(chara:MainChara<'Wizard'>): Promise<void>
{
    let hog = '';
    let hoghouse: hogwartsHouse = {name: 'none', points: 0};
    // crea un array di 4 opzioni uguali + opzione extra 'choice' e assegna la % rimanente a una opzione a caso
    const options = [24, 24, 24, 24, 2];
    options[random.spin(20, 20, 20, 20, 20) - 1] += 2;
    let [gry, huf, rav, sly, choice] = options;

    // Changing wheel based on the player's gifts
    if (chara.gifts.metamorphmagus != 0) { huf += 15; gry -= 5; sly -= 5; rav -= 5; }
    if (chara.gifts.parselmouth != 0) { sly += 15; gry -= 5; huf -= 5; rav -= 5; }
    if (chara.gifts.sight) { rav += 15; gry -= 5; huf -= 5; sly -= 5; }

    let segments =
    [
        newSegment('Gryffindor', gry),
        newSegment('Hufflepuff', huf),
        newSegment('Ravenclaw', rav),
        newSegment('Slytherin', sly),
        newSegment('choice', choice)
    ]
    let result = await spinWheel('Which house is your house?', segments);

    if (result === 'choice')
    {
        await io.showText('The Sorting Hat is baffled by your mind.\nSince he cannot decide, the choice is yours.');        
        await io.showText('Choose wisely which house to join: (g/h/r/s)', false);
        do
        {
            hog = (await io.handleInput())?.toLowerCase();
            hoghouse.name = hog === 'g' ? 'Gryffindor' : hog === 'h' ? 'Hufflepuff' : hog === 'r' ? 'Ravenclaw' : 'Slytherin';
        }
        while (hog !== 'g' && hog !== 'h' && hog !== 'r' && hog !== 's');
    }
    else hoghouse.name = result as hogwartsHouseName;

    chara.house = hoghouse.name;
    showWheelResult('Your house is: ' + hoghouse.name + ' !');
    await io.nextEvent();
}

/**
 * Handles Dumbledore's speech at the feast.
 * sorting ceremony + first clue + friendshipWheel x3
 * @param chara The mc.
 */
export async function schoolIntro(chara:MainChara<'Wizard'>): Promise<void>
{
    await chitchat.arrivalAtHogwarts();
    await sortingCeremony(chara);

    // quest clue #0 - Dumbledore's speech
    const raven = chara.house === 'Ravenclaw';
    chara.clues.find(c => c.name === 'dumbledores_speech')!.discovered = random.spinbool(raven ? 90 : 80, raven ? 10 : 20);
    await chitchat.dumbledoresSpeech(chara.clues.find(c => c.name === 'dumbledores_speech')!.discovered);

    // friendship wheels
    await io.showText('You are brought to your house\'s common room,\nwhere you can spend some time with your new housemates.');
    await npc.friendshipWheel(chara);
    await npc.friendshipWheel(chara);
    await npc.friendshipWheel(chara);

    // sort quidditch games
    sortGames(chara);
}

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
    const validHouses = Array.from(new Set(chara.quidditchGames.flatMap(game => [game.houseA, game.houseB])))
        .filter((house): house is Exclude<hogwartsHouseName, 'none'> => house !== 'none');

    const pointsByHouse = new Map<hogwartsHouseName, number>();
    validHouses.forEach(house => pointsByHouse.set(house, 0));
    chara.quidditchGames.forEach(game =>
    {
        pointsByHouse.set(game.winner, (pointsByHouse.get(game.winner) ?? 0) + game.winnerScore);
        pointsByHouse.set(game.loser, (pointsByHouse.get(game.loser) ?? 0) + game.loserScore);
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