
/**
 * Functions for handling the first year Troll's sidequest.
 */

import * as b from '../../../basis/_index';
import * as d from "../../../dialogues/_index";
import * as u from '../../../utilities/_index';
import { MainChara } from '../../../basis/_index';


/**
 * Handles the Troll sidequest.
 * @param chara The main character.
 * @return Whether the mc actually confronted the troll.
 */
export async function troll(chara: MainChara<'Wizard'>): Promise<boolean>
{
    await d.trollIntro();

    let hermione = b.getCharacterByLongname(chara.characterList, 'Hermione Granger');
    let hermfriend = b.isFriend(hermione);
    
    if (hermfriend) await d.trollRescue();
    else if (u.spinbool(30, 70)) await d.trollBadLuck();
    else
    {
        await u.showText('You decide to follow the teachers to the dormitories.');  
        return false;
    }

    let flee = 50, fight = 50;
    if (chara.house === 'Gryffindor') { fight += 5; flee -= 5; }
    if (hermfriend && b.alignmentDeath(chara.alignment)) { fight -= 40; flee += 40; }
    if (hermfriend && b.alignmentPhoenix(chara.alignment)) { fight += 40; flee -= 40; }

    let segments = [ u.newSegment('Flee', flee), u.newSegment('Fight', fight)];
    const firstResult = await u.spinWheel('What do you do?', segments);

    firstResult === "Flee"
        ? await trollFlee(chara, hermfriend)
        : await trollFight(chara);

    return true;
}

async function trollFlee(chara: MainChara<'Wizard'>, hermfriend: boolean): Promise<void>
{
    if (hermfriend)
    {
        await d.trollCoward();
        await b.shiftAlignment(chara, 'death_eater');
    }
    else
    {
        await d.trollEscape();
        let newfriends = u.spinEqual([1, 2, 3]);
        for (let i = 0; i < newfriends; i++) await b.befriend(chara, true);
    }
}

async function trollFight(chara: MainChara<'Wizard'>): Promise<void>
{
    let charmSkill = b.getSkill(chara, 'Charms');
    let darkArtSkill = b.getSkill(chara, 'Defense Against the Dark Arts');
    let spellskill = Math.max(charmSkill, darkArtSkill) * 10;
    
    let segments = [
        u.newSegment('spell', spellskill),
        u.newSegment('broom', (100 - spellskill) / 2),
        u.newSegment('freeze', (100 - spellskill) / 2)
    ];
    await u.showText('You decide to fight the troll!');
    const result = await u.spinWheel('What do you do?', segments);
    
    switch (result)
    {
        case "freeze": await badEnding(chara); break;
        case "broom":
        case "spell": await goodEnding(chara, result === 'spell'); break;
    }
}

async function badEnding(chara: MainChara<'Wizard'>): Promise<void>
{
    await d.troll_badEnding();
    let grades = b.getMaxGrades(chara, 3);
    for (let g of grades) await b.subjectIncrement(chara, g.subject, -1);  
}

async function goodEnding(chara: MainChara<'Wizard'>, spell: boolean): Promise<void>
{
    let hermione = b.getCharacterByLongname(chara.characterList, 'Hermione Granger');
    let hermfriend = b.isFriend(hermione);

    await d.troll_goodEnding(hermfriend, chara.house, spell);
    
    chara.clues.find(c => c.name === 'snape_halloween')!.discovered = true;     // second clue (Snape's wound)
    await b.housePointsIncrement(chara, spell ? (hermfriend ? 10 : 5) : -5);
    await b.fame(chara, spell ? (hermfriend ? 10 : 5) : 5);

    await u.showText(hermfriend ? 'After this scary night, you and Hermione become closer.' : 'This scary night brings you closer to Hermione.');
    await b.improveConnection(chara, hermione!);
}