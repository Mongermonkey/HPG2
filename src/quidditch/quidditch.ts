
import { Wheel } from "../wheel_magic/Wheel";
import * as random from '../utilities/random';
import { Character } from "../characters/characters";
import * as wheels from "../wheel_magic/wheel_helpers";
import * as io from "../utilities/input_output_helpers";
import * as npc from '../characters/character-functions';
import { newSegment } from "../wheel_magic/wheel_helpers";
import { WheelSegment } from "../wheel_magic/wheel_helpers";
import * as chitchat from "../dialogues/year-one-dialogues";
import { QuidditchGame } from "../utilities/compositetypes";
import { getSkill, MainChara } from "../characters/maincharacter";
import { hogwartsHouse, quidditchRole } from "../utilities/basetypes";

const myWheel = (window as any).myWheel as Wheel;
const nextBtn = (window as any).nextBtn as HTMLButtonElement;
const spinBtn = (window as any).spinBtn as HTMLButtonElement;

/**
 * Sort the list of the six Quidditch games for the current year.
 * @param chara The mc.
 */
export function sortGames(chara: MainChara<'Wizard'>): void
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
    let head = npc.getHeadOfHouse(chara.characterList, chara.house);
    let captain = npc.getQuidditchCaptain(chara.characterList, chara.house);
    let wheelStop = null;

    if (chara.quidditchRole === 'candidate')
    {
        io.showText(`As forwarned by ${head.longname}, you are now to attend the tryouts for the Quidditch team.`);
        await io.nextEvent();
    }
    else
    {
        io.showText("Quidditch tryouts are now open! Interested in applying?");
        await io.nextEvent();
        let quid = newSegment("Interested", Math.min(0.95, 0.1 + getSkill(chara, 'Flying') / 10));
        let notquid = newSegment("Not Interested", 1 - quid.fraction);
        myWheel.setSegments([quid, notquid]);
        wheels.seeWheel(true);
        wheelStop = await wheels.spinWheel(myWheel);
        await io.nextEvent();
        wheels.seeWheel(false);

        if (wheelStop.text === "Not Interested")
        {
            io.showText("You decided not to try out for the Quidditch team this year.");
            await io.nextEvent();
            return;
        }
    }

    await chitchat.QuidditchSelection(captain.longname, chara.house);

    let pass = newSegment("Pass", Math.min(0.95, getSkill(chara, 'Flying') / 10));
    let bad = newSegment("Fail", 1 - pass.fraction);
    myWheel.setSegments([pass, bad]);
    wheels.seeWheel(true);
    wheelStop = await wheels.spinWheel(myWheel);
    await io.nextEvent();
    wheels.seeWheel(false);

    if (wheelStop.text === "Fail")
    {
        io.showText("Alas, you failed the Quidditch selection. Maybe you can try again next year.");
        await io.nextEvent();
        return;
    }

    io.showText("You passed the Quidditch selection!");
    await io.nextEvent();
    io.showText("What role will you play?");
    await io.nextEvent();

    await spinQuidditchRole(chara, captain);
}

/**
 * Sets the mc quidditch role.
 * @param chara The mc.
 * @param captain The quidditch captain of the mc's house.
 */
async function spinQuidditchRole(chara: MainChara<'Wizard'>, captain: Character<'Student'>): Promise<void>
{
    let r1 = newSegment("Seeker", 0.15), r2 = newSegment("Chaser", 0.40), r3 = newSegment("Beater", 0.30), r4 = newSegment("Keeper", 0.15);
    let segments: WheelSegment[] = [];

    // Modifiche in base al ruolo del capitano della casa - Ravenclaw, Slytherin: chaser; Gryffindor: keeper; Hufflepuff: seeker
    switch (chara.house)
    {
        case 'Ravenclaw':
        case 'Slytherin': {
            r2.fraction -= 0.15;
            r1.fraction += 0.05;
            r3.fraction += 0.05;
            r4.fraction += 0.05;
            break;
        }
        case 'Gryffindor': {
            // Rimuovi r4 (Keeper) e redistribuisci 0.15 agli altri
            r1.fraction += 0.05;
            r2.fraction += 0.05;
            r3.fraction += 0.05;
            break;
        }
        case 'Hufflepuff': {
            // Rimuovi r1 (Seeker) e redistribuisci 0.15 agli altri
            r2.fraction += 0.05;
            r3.fraction += 0.05;
            r4.fraction += 0.05;
            break;
        }
    }

    // Se candidato, probabilità di Seeker aumentata (no Hufflepuff -> Cedric)
    if (chara.quidditchRole === 'candidate')
    {
        if (chara.house !== 'Hufflepuff') r1.fraction += 0.36;
        r2.fraction -= 0.12;
        r3.fraction -= 0.12;
        if (chara.house !== 'Gryffindor') r4.fraction -= 0.12;
    }

    // Costruisci l'array dei segmenti validi
    if (chara.house !== 'Hufflepuff') segments.push(r1);
    segments.push(r2, r3);
    if (chara.house !== 'Gryffindor') segments.push(r4);

    myWheel.setSegments(segments);

    wheels.seeWheel(true);
    let wheelStop = await wheels.spinWheel(myWheel);
    await io.nextEvent();
    wheels.seeWheel(false);

    chara.quidditchRole = wheelStop.text.toLowerCase() as quidditchRole;
    io.showText(`Congratulations! You have been selected as ${wheelStop.text} for the ${chara.house} Quidditch team!`);
    await io.nextEvent();
    io.showText(`${captain.name} welcomes you to the team.`);
    await io.nextEvent();
    npc.handleFriendshipOutcome(chara, captain);
    await io.nextEvent();
}

/**
 * Handles a Quidditch game event.
 * @param chara The mc.
 * @param gameIndex The index of the game.
 */
export async function quidditchGame(chara: MainChara<'Wizard'>, gameIndex: number): Promise<void>
{
    io.showText(gameIndex == 0 ? "Today is the first Quidditch match of the year!"
        : gameIndex == 5 ? "Today is the last Quidditch match of the year!" : "There is Quidditch today!");
    await io.nextEvent();

    let game = chara.quidditchGames[gameIndex];
    let player = chara.quidditchRole != 'none' && chara.quidditchRole != 'candidate';
    let houseGame = game.houseA == chara.house || game.houseB == chara.house;

    if(player)   // mc is part of the team
    {
        if (houseGame) io.showText(`You are excited to play against ${game.houseA === chara.house ? game.houseB : game.houseA}!`);
        else io.showText(`You go to see how ${game.houseA} and ${game.houseB} teams play.`);
        
        await io.nextEvent();
        await playMatch(chara, game);
    }
    else        // mc is not part of the team
    {
        io.showText(`Today's match is ${game.houseA} vs ${game.houseB}.`);
        await io.nextEvent();
        if (!houseGame)
        {
            io.showText("You have no particular interest in this match: you prefer to mind your business.");
            await io.nextEvent();
            return;
        }
        
        io.showText("You watch eagerly as your house team plays!");
        await io.nextEvent();
        setRandomScores(game);
    }
    
    await postQuidditch(chara, game);
}

/**
 * Plays a Quidditch match with the mc as a player (competing or watching).
 * @param chara The mc.
 * @param game The Quidditch game.
 */
async function playMatch(chara: MainChara<'Wizard'>, game: QuidditchGame): Promise<void>
{
    setRandomScores(game);

    // Mc watching
    if (game.houseA !== chara.house && game.houseB !== chara.house) return await chitchat.quidditchMatch(game.winner, game.loser);

    // Mc competing
    // Se game.loser, skill-powered swap scores
    let skillFactor = Math.min(0.9, getSkill(chara, 'Flying') / 10);
    console.log(`Chara flying skill: ${getSkill(chara, 'Flying')}\nskillFactor: ${skillFactor}`);
    if(chara.house == game.loser && random.spinbool(skillFactor, 1 - skillFactor)) swapScores(game);

    if (chara.house == game.winner)
    {
        io.showText(chara.quidditchRole === 'seeker'
            ? "You caught the Golden Snitch, bringing victory to your team!"
            : "Thanks to your skills and efforts, your team wins the match!"
        );
    }
    else io.showText("Despite your efforts, your team has lost the match.");
    await io.nextEvent();
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
    io.showText(
        houseWin && player ? `You beat ${game.loser} with a score of ${game.winnerScore} to ${game.loserScore}!`        
        : houseWin && !player ? `${game.winner} wins against ${game.loser} with a score of ${game.winnerScore} to ${game.loserScore}!`        
        : watcher ? `${game.loser} loses against ${game.winner} with a score of ${game.loserScore} to ${game.winnerScore}.`
        : `You lose against ${game.winner} with a score of ${game.loserScore} to ${game.winnerScore}.`
    );
    await io.nextEvent();

    // no celebration if not house game or you lost the match
    if (game.winner != chara.house)
    {
        io.showText(
            player ? `You discuss with your team about the match, then return to ${chara.house} common room.`
            : `After the match, you and your housemates return to the castle in a gloomy mood.`
        );
        await io.nextEvent();
        return;
    }

    // celebration
    io.showText(`All ${chara.house}s celebrates the victory together in the common room!`);
    await io.nextEvent();
    io.showText("You strengthen your bonds with your housemates!");
    await io.nextEvent();
    wheels.seeWheel(true);
    let friendshipChance = Math.min(0.55 + chara.fame - chara.stress + (chara.quidditchRole != 'none' ? 0.10 : 0), 1);
    let chance = wheels.newSegment('Make friends', friendshipChance),
        notchance = wheels.newSegment('Mind your business', 1 - friendshipChance);
    
    io.showText("Friendship Wheel! What do you do?");
    myWheel.setSegments([chance, notchance]);
    let wheelStop = await wheels.spinWheel(myWheel);
    await io.nextEvent();
    wheels.seeWheel(false);
    if (wheelStop.text === 'Mind your business')
    {
        io.showText("You decided to mind your own business.");
        await io.nextEvent();
        return;
    }
    io.showText("You made friends!");
    await io.nextEvent();
    io.showText("Who did you befriend?");
    await npc.befriend(chara, true);
    await io.nextEvent();
}