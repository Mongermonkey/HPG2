
/**
 * Functions for handling special events at Hogwarts.
 */

import * as b from "../../basis/_index";
import * as d from "../../dialogues/_index";
import * as u from "../../utilities/_index";
import { sortGames } from "../quidditch/quidditch";
import { MainChara, hogwartsHouse, hogwartsHouseName } from "../../basis/_index";

/**
 * Handles Dumbledore's speech at the feast.
 * sorting ceremony + first clue + friendshipWheel x3
 * @param chara The mc.
 */
export async function schoolIntro(chara:MainChara<'Wizard'>): Promise<void>
{
    await d.arrivalAtHogwarts(chara.year);
    await sortingCeremony(chara);

    // quest clue #0 - Dumbledore's speech
    const raven = chara.house === 'Ravenclaw';
    chara.clues.find(c => c.name === 'dumbledores_speech')!.discovered = u.spinbool(raven ? 90 : 80, raven ? 10 : 20);
    await d.dumbledoresSpeech(chara.clues.find(c => c.name === 'dumbledores_speech')!.discovered);

    // friendship wheels
    await u.showText('You are brought to your house\'s common room,\nwhere you can spend some time with your new housemates.');
    await b.friendshipWheel(chara);
    await b.friendshipWheel(chara);
    await b.friendshipWheel(chara);

    // sort quidditch games
    sortGames(chara);
}

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
    options[u.spin(20, 20, 20, 20, 20) - 1] += 2;
    let [gry, huf, rav, sly, choice] = options;

    // Changing wheel based on the player's gifts
    if (chara.gifts.metamorphmagus != 0) { huf += 15; gry -= 5; sly -= 5; rav -= 5; }
    if (chara.gifts.parselmouth != 0) { sly += 15; gry -= 5; huf -= 5; rav -= 5; }
    if (chara.gifts.sight) { rav += 15; gry -= 5; huf -= 5; sly -= 5; }

    let segments =
    [
        u.newSegment('Gryffindor', gry),
        u.newSegment('Hufflepuff', huf),
        u.newSegment('Ravenclaw', rav),
        u.newSegment('Slytherin', sly),
        u.newSegment('choice', choice)
    ]
    let result = await u.spinWheel('Which house is your house?', segments);

    if (result === 'choice')
    {
        await u.showText('The Sorting Hat is baffled by your mind.\nSince he cannot decide, the choice is yours.');        
        await u.showText('Choose wisely which house to join: (g/h/r/s)', false);
        do
        {
            hog = (await u.handleInput())?.toLowerCase();
            hoghouse.name = hog === 'g' ? 'Gryffindor' : hog === 'h' ? 'Hufflepuff' : hog === 'r' ? 'Ravenclaw' : 'Slytherin';
        }
        while (hog !== 'g' && hog !== 'h' && hog !== 'r' && hog !== 's');
    }
    else hoghouse.name = result as hogwartsHouseName;

    chara.house = hoghouse.name;
    await u.showWheelResult('Your house is: ' + hoghouse.name + ' !');
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

    await d.eoyFeast(chara, first, second, third, fourth);
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