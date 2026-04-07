
import * as random from '../utilities/random';
import { Character } from '../characters/characters';
import * as wheels from '../wheel_magic/wheel_helpers';
import * as npc from '../characters/character-functions';
import { newSegment } from '../wheel_magic/wheel_helpers';
import { WheelSegment } from '../wheel_magic/wheel_helpers';
import * as chitchat from '../dialogues/year-one-dialogues';
import { QuidditchGame } from '../utilities/compositetypes';
import { showText } from '../utilities/input_output_helpers';
import { hogwartsHouseName, quidditchRole } from '../utilities/basetypes';
import { getSkill, MainChara, subjectIncrement } from '../characters/maincharacter';

/**
 * Sort the list of the six Quidditch games for the current year.
 * @param chara The mc.
 */
export function sortGames(chara: MainChara<'Wizard'>): void
{
    let pairs: [hogwartsHouseName, hogwartsHouseName][] =
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
        winner: 'none',
        loser: 'none',
        winnerScore: 0,
        loserScore: 0,
    }));
}

/**
 * Handles the selection for the Quidditch team.
 * @param chara The mc.
 */
export async function quidditchSelection(chara: MainChara<'Wizard'>): Promise<void>
{
    let headname = npc.getHeadOfHouse(chara.characterList, chara.house).longname;
    let captain = npc.getQuidditchCaptain(chara.characterList, chara.house);

    if (chara.quidditchRole === 'candidate')
        await showText('As forwarned by ' + headname + ', you are now to attend the tryouts for the Quidditch team.');
    else
    {
        let chance = Math.min(95, 10 + getSkill(chara, 'Flying') * 10);
        let segments = [ newSegment('Interested', chance), newSegment('Not Interested', 100 - chance) ];

        let result = await wheels.spinWheel('Quidditch tryouts are now open! Interested in applying?', segments);
        if (result === 'Not Interested')
        {
            await showText('You decided not to try out for the Quidditch team this year.');
            return;
        }
    }

    await chitchat.QuidditchSelection(captain.longname, chara.house);
    let pass = Math.min(95, getSkill(chara, 'Flying') * 10);

    let segments = [ newSegment('Pass', pass), newSegment('Fail', 100 - pass) ];
    let test = await wheels.spinWheel('Do you pass the Quidditch selection?', segments);

    if (test === 'Pass')
    {
        await showText('You passed the Quidditch selection!');
        await spinQuidditchRole(chara, captain);        
    }
    else await showText('Alas, you failed the Quidditch selection. Maybe you can try again next year.');
}

/**
 * Sets the mc quidditch role.
 * @param chara The mc.
 * @param captain The quidditch captain of the mc's house.
 */
async function spinQuidditchRole(chara: MainChara<'Wizard'>, captain: Character<'Student'>): Promise<void>
{
    let seeker = 20, chaser = 25, beater = 35, keeper = 20;     // Base roles: Ravenclaw or Slytherin

    // Modifiche in base al ruolo del capitano della casa Gryffindor / Hufflepuff
    if (chara.house === 'Gryffindor') seeker = 20, chaser = 45, beater = 35, keeper = 0;
    else if (chara.house === 'Hufflepuff') seeker = 0, chaser = 45, beater = 35, keeper = 20;       

    // Se candidato, probabilità di Seeker aumentata (no Hufflepuff -> Cedric)
    if (chara.quidditchRole === 'candidate')
    {
        if (chara.house === 'Gryffindor') { seeker += 20; chaser -= 10; beater -= 10; }
        else if (chara.house === 'Ravenclaw' || chara.house === 'Slytherin') { seeker += 30; chaser -= 10; beater -= 10; keeper -= 10; }
    }
    
    // Aggiungo segmenti solo se fraction > 0
    let segments =
    [
        newSegment('Seeker', seeker),
        newSegment('Chaser', chaser),
        newSegment('Beater', beater),
        newSegment('Keeper', keeper)
    ].filter(s => s.fraction > 0);

    let result = await wheels.spinWheel('What role will you play?', segments);
    chara.quidditchRole = result.toLowerCase() as quidditchRole;
    
    await showText('Congratulations! You have been selected as ' + result + ' for the ' + chara.house + ' Quidditch team!');
    await showText(captain.name + ' welcomes you to the team.');
    await npc.improveConnection(chara, captain);
}

/**
 * Handles a Quidditch game event.
 * @param chara The mc.
 * @param gameIndex The index of the game.
 */
export async function quidditchGame(chara: MainChara<'Wizard'>, gameIndex: number): Promise<void>
{
    await showText(gameIndex == 0 ? 'Today is the first Quidditch match of the year!'
        : gameIndex == 5 ? 'Today is the last Quidditch match of the year!' : 'There is Quidditch today!');
    let game = chara.quidditchGames[gameIndex];
    let player = chara.quidditchRole != 'none' && chara.quidditchRole != 'candidate';
    let houseGame = game.houseA == chara.house || game.houseB == chara.house;

    if(player) await playMatch(chara, game, houseGame);     // mc is part of the team
    else        // mc is not part of the team
    {
        await showText('Today\'s match is ' + game.houseA + ' vs ' + game.houseB + '.');
        if (!houseGame)
        {
            await showText('You have no particular interest in this match: you prefer to mind your business.');
            return;
        }        
        await showText('You watch eagerly as your house team plays!');
        setRandomScores(game);
    }
    
    await postQuidditch(chara, game);
}

/**
 * Plays a Quidditch match with the mc as a player (competing or watching).
 * @param chara The mc.
 * @param game The Quidditch game.
 */
async function playMatch(chara: MainChara<'Wizard'>, game: QuidditchGame, houseGame: boolean): Promise<void>
{
    if (houseGame) await showText('You are excited to play against ' + (game.houseA === chara.house ? game.houseB : game.houseA) + '!');
    else await showText('You go to see how ' + game.houseA + ' and ' + game.houseB + ' teams play.');

    setRandomScores(game);
    // Mc watching, not competing
    if (game.houseA !== chara.house && game.houseB !== chara.house) return await chitchat.quidditchMatch(game.winner, game.loser);

    // If game.loser, skill-powered swap scores
    let skillFactor = Math.min(0.9, getSkill(chara, 'Flying') / 10);
    console.log('Chara flying skill: ' + getSkill(chara, 'Flying') + '\nskillFactor: ' + skillFactor);
    if(chara.house == game.loser && random.spinbool(skillFactor, 1 - skillFactor)) swapScores(game);
    
    await showText(chara.house != game.winner
        ? "Despite your efforts, your team has lost the match."
        : chara.quidditchRole === 'seeker'
        ? "You caught the Golden Snitch, bringing victory to your team!"
        : "Thanks to your skills and efforts, your team wins the match!"
    );
}

/**
 * Randomly scores a Quidditch game.
 * @param game The Quidditch game to score.
 */
function setRandomScores(game: QuidditchGame)
{
    // Calcolo punteggi random 50 <= score <= 300 (soli multipli di 5)
    let scoreA = 50 + Math.floor(Math.random() * 51) * 5;
    let scoreB = 50 + Math.floor(Math.random() * 51) * 5;
    // Se i punteggi sono uguali, incremento di 5 uno dei due
    if (scoreA == scoreB) scoreA += 5;
    // Set winnerScore, loserScore
    game.winnerScore = scoreA > scoreB ? scoreA : scoreB;
    game.loserScore = scoreA > scoreB ? scoreB : scoreA;
    // Se winnerScore < 150 (è comunque >= 50), incremento di 150
    if (game.winnerScore < 150) game.winnerScore += 150;
    game.winner = scoreA > scoreB ? game.houseA : game.houseB;
    game.loser = scoreA > scoreB ? game.houseB : game.houseA;
}

/**
 * Swaps winner and loser in a Quidditch game.
 * @param game The Quidditch game to swap.
 */
function swapScores(game: QuidditchGame): void
{
    let tempScore = game.winnerScore, tempWinner = game.winner;
    game.winnerScore = game.loserScore;
    game.loserScore = tempScore;
    game.winner = game.loser;
    game.loser = tempWinner;
}

/**
 * Handles the aftermath of a Quidditch game.
 * @param chara The mc.
 * @param game The Quidditch game that has been played.
 */
async function postQuidditch(chara: MainChara<'Wizard'>, game: QuidditchGame): Promise<void>
{
    let houseWin = game.winner == chara.house;
    let player = chara.quidditchRole != 'none' && chara.quidditchRole != 'candidate';
    let watcher = game.houseA != chara.house && game.houseB != chara.house;
    await showText(
        houseWin && player ? 'You beat ' + game.loser + ' with a score of ' + game.winnerScore + ' to ' + game.loserScore + '!'
        : houseWin && !player ? game.winner + ' wins against ' + game.loser + ' with a score of ' + game.winnerScore + ' to ' + game.loserScore + '!'
        : watcher ? game.loser + ' loses against ' + game.winner + ' with a score of ' + game.loserScore + ' to ' + game.winnerScore + '.'
        : 'You lose against ' + game.winner + ' with a score of ' + game.loserScore + ' to ' + game.winnerScore + '.'
    );
    // no celebration if not house game or you lost the match
    if (game.winner != chara.house)
    {
        await showText(
            player ? 'You discuss with your team about the match, then return to ' + chara.house + ' common room.'
            : 'After the match, you and your housemates return to the castle in a gloomy mood.'
        );
    }
    else
    {
        await showText('All ' + chara.house + 's celebrates the victory together in the common room!');
        await quidditchTeamBond(chara);
    }
}

/**
 * Handles the bonding event with the Quidditch team.
 * @param chara The main character.
 */
async function quidditchTeamBond(chara: MainChara<'Wizard'>): Promise<void>
{
    let friendshipChance = Math.min(0.55 + chara.fame - chara.stress + (chara.quidditchRole != 'none' ? 0.10 : 0), 1);
    let chance = wheels.newSegment('Make friends', friendshipChance * 100),
        notchance = wheels.newSegment('Mind your business', 100 - friendshipChance * 100);

    const result = await wheels.spinWheel('Friendship Wheel! What do you do?', [chance, notchance]);

    if (result === 'Mind your business')
    {
        await showText('You decide to mind your own business.');
        return;
    }

    await showText('You make friends!');
    await showText('Who do you befriend?');
    await npc.befriend(chara, true);
}

/**
 * Handles the Quidditch practice event.
 * @param chara The main character.
 */
export async function quidditchPractice(chara: MainChara<'Wizard'>): Promise<void>
{
    chitchat.quidditchPractice();
    await subjectIncrement(chara, 'Flying');
    await quidditchTeamBond(chara);
}