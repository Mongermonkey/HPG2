
import { MainChara } from "../maincharacter";
import { hogwartsHouse } from "../utilities/basetypes";

/**
 * Sort the list of the six Quidditch games for the current year.
 * @param chara The main character.
 */
export function sortGames(chara: MainChara<'Wizard'>)
{
    const houses: hogwartsHouse[] = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
    let pairs: [hogwartsHouse, hogwartsHouse][] =
    [
        ['Gryffindor', 'Slytherin'], ['Gryffindor', 'Ravenclaw'], ['Gryffindor', 'Hufflepuff'],
        ['Slytherin', 'Ravenclaw'], ['Slytherin', 'Hufflepuff'], ['Ravenclaw', 'Hufflepuff']
    ];

    // mix the games
    for (let i = pairs.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    chara.quidditchGames = pairs.map(([houseA, houseB]) => ({
        houseA,
        houseB,
        scoreA: 0,
        scoreB: 0,
        winner: 'none'
    }));
}