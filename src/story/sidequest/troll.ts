
import * as random from '../../utilities/random';
import * as npc from '../../characters/character-functions';
import * as chitchat from "../../dialogues/year-one-dialogues";
import { showText } from "../../utilities/input_output_helpers";
import { newSegment, spinWheel } from "../../wheel_magic/wheel_helpers";
import { alignmentDeath, alignmentPhoenix } from '../../utilities/compositetypes';
import { shiftAlignment, fame, MainChara, subjectIncrement, getMaxGrades, housePointsIncrement, getSkill } from '../../characters/maincharacter';

/**
 * Handles the Troll sidequest.
 * @param chara The main character.
 * @return Whether the mc actually confronted the troll.
 */
export async function troll(chara: MainChara<'Wizard'>): Promise<boolean>
{
    await chitchat.trollIntro();

    let hermione = npc.getCharacterByLongname(chara.characterList, 'Hermione Granger');
    let hermfriend = npc.isFriend(hermione);

    if (hermfriend) await chitchat.trollRescue();
    else if (random.spinbool(30, 70)) await chitchat.trollBadLuck();
    else
    {
        await showText('You decide to follow the teachers to the dormitories.');  
        return false;
    }

    let flee = 50, fight = 50;
    if (chara.house === 'Gryffindor') { fight += 5; flee -= 5; }
    if (hermfriend && alignmentDeath(chara.alignment)) { fight -= 40; flee += 40; }
    if (hermfriend && alignmentPhoenix(chara.alignment)) { fight += 40; flee -= 40; }

    let segments = [ newSegment('Flee', flee), newSegment('Fight', fight)];
    const firstResult = await spinWheel('What do you do?', segments);

    firstResult === "Flee"
        ? await trollFlee(chara, hermfriend)
        : await trollFight(chara);

    return true;
}

async function trollFlee(chara: MainChara<'Wizard'>, hermfriend: boolean): Promise<void>
{
    if (hermfriend)
    {
        await chitchat.trollCoward();
        await shiftAlignment(chara, 'death_eater');
    }
    else
    {
        await chitchat.trollEscape();
        let newfriends = random.spinEqual([1, 2, 3]);
        for (let i = 0; i < newfriends; i++) await npc.befriend(chara, true);
    }
}

async function trollFight(chara: MainChara<'Wizard'>): Promise<void>
{
    let charmSkill = getSkill(chara, 'Charms');
    let darkArtSkill = getSkill(chara, 'Defense Against the Dark Arts');
    let spellskill = Math.max(charmSkill, darkArtSkill) * 10;
    
    let segments = [
        newSegment('spell', spellskill),
        newSegment('broom', (100 - spellskill) / 2),
        newSegment('freeze', (100 - spellskill) / 2)
    ];
    await showText('You decide to fight the troll!');
    const result = await spinWheel('What do you do?', segments);
    
    switch (result)
    {
        case "freeze": await badEnding(chara); break;
        case "broom":
        case "spell": await goodEnding(chara, result === 'spell'); break;
    }
}

async function badEnding(chara: MainChara<'Wizard'>): Promise<void>
{
    await chitchat.troll_badEnding();
    let grades = getMaxGrades(chara, 3);
    for (let g of grades) await subjectIncrement(chara, g.subject, -1);  
}

async function goodEnding(chara: MainChara<'Wizard'>, spell: boolean): Promise<void>
{
    let hermione = npc.getCharacterByLongname(chara.characterList, 'Hermione Granger');
    let hermfriend = npc.isFriend(hermione);

    await chitchat.troll_goodEnding(hermfriend, chara.house, spell);
    
    chara.clues.find(c => c.name === 'snape_halloween')!.discovered = true;     // second clue (Snape's wound)
    await housePointsIncrement(chara, spell ? (hermfriend ? 10 : 5) : -5);
    await fame(chara, spell ? (hermfriend ? 10 : 5) : 5);

    await showText(hermfriend ? 'After this scary night, you and Hermione become closer.' : 'This scary night brings you closer to Hermione.');
    await npc.improveConnection(chara, hermione!);
}