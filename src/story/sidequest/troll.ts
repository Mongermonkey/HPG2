
import { Wheel } from '../../wheel_magic/Wheel';
import * as random from '../../utilities/Random';
import { Character } from '../../characters/characters';
import * as wheels from "../../wheel_magic/wheel_helpers";
import * as io from "../../utilities/input_output_helpers";
import * as npc from '../../characters/character-functions';
import * as chitchat from "../../dialogues/year-one-dialogues";
import { getMaxSkill, MainChara } from '../../characters/maincharacter';

const myWheel = (window as any).myWheel as Wheel;
const nextBtn = (window as any).nextBtn as HTMLButtonElement;
const spinBtn = (window as any).spinBtn as HTMLButtonElement;

// Remembrall event
export async function troll(chara: MainChara<'Wizard'>): Promise<void>
{
    await chitchat.trollIntro();

    let wheelStop = null;
    let hermione = npc.getCharacterByLongname(chara.characterList, 'Hermione Granger') as Character<'Student'>;
    let hermfriend = npc.isFriend(hermione);

    if (hermfriend) await chitchat.trollRescue();
    else if (random.spinbool(30, 70)) await chitchat.trollBadLuck();
    else
    {
        io.showText("You decide to follow the teachers to the dormitories.");  
        await io.nextEvent();      
        return;
    }

    let flee = wheels.newSegment("Flee", 0.50), fight = wheels.newSegment("Fight", 0.50);
    if (chara.house === 'Gryffindor') { fight.fraction += 0.10; flee.fraction -= 0.10; }
    if (hermfriend && chara.alignment === 'death_eater') { fight.fraction -= 0.40; flee.fraction += 0.40; }
    if (hermfriend && chara.alignment === 'phoenix_order') { fight.fraction += 0.40; flee.fraction -= 0.40; }

    myWheel.setSegments([flee, fight]);
    wheels.seeWheel(true);
    wheelStop = await wheels.spinWheel(myWheel);
    await io.nextEvent();
    wheels.seeWheel(false);

    if (wheelStop.text === "Flee")
    {
        if (hermfriend)
        {
            await chitchat.trollCoward();
            if (chara.alignment !== "death_eater")
            {
                io.showText("Your alignment has shifted.");
                chara.alignment = "death_eater";
                await io.nextEvent();
                return;
            }
        }
        await chitchat.trollEscape();

        let newfriends = random.spinEqual([1, 2, 3]);
        for (let i = 0; i < newfriends; i++) await npc.befriend(chara, true);
        await io.nextEvent();
    }

    // Fight
    io.showText("You decide to fight the troll!");
    await io.nextEvent();
    io.showText("What do you do?");

    let spellskill = getMaxSkill(chara, ['Charms', 'Defense Against the Dark Arts']) / 10;
    let spell = wheels.newSegment("spell", spellskill);
    let broom = wheels.newSegment("broom", (1 - spellskill) / 2), freeze = wheels.newSegment("freeze", (1 - spellskill) / 2);
    myWheel.setSegments([spell, broom, freeze]);

    wheels.seeWheel(true);
    wheelStop = await wheels.spinWheel(myWheel);
    await io.nextEvent();
    wheels.seeWheel(false);

    switch (wheelStop.text)
    {
        case "freeze":
            await chitchat.troll_freeze();
            let msg = "";
            let badluck = random.spinEqual([1, 2, 3]);
            console.log(`badluck = ${badluck}`);
            for (let i = 0; i < badluck; i++)
            {
                let worsensubject = random.spinEqual(chara.grades);
                if (worsensubject.score <= 1) continue;
                worsensubject.score -= 1;
                msg += (i === 0 ? '' : '\n') + `${worsensubject.subject}--`;
            }
            wheels.showWheelResult(msg);
            await io.nextEvent();
            break;
        case "broom":
            await chitchat.troll_broom(hermfriend, chara.house);
            chara.clues[1] = true;      // second clue (Snape's wound)
            chara.fame += 5;
            wheels.showWheelResult('-5 house points\nfame++');
            await io.nextEvent();
            io.showText(hermfriend ? "After this scary night, you and Hermione become closer." : "This scary night brings you closer to Hermione.");
            await io.nextEvent();
            await npc.handleFriendshipOutcome(chara, hermione);
            break;
        case "spell":
            await chitchat.troll_spell(hermfriend, chara.house);
            chara.clues[1] = true;      // second clue (Snape's wound)
            chara.fame += hermfriend ? 10 : 5;
            wheels.showWheelResult(hermfriend ? '+10 house points\nfame++' : '+5 house points\nfame++');
            await io.nextEvent();
            io.showText(hermfriend ? "After this scary night, you and Hermione become closer." : "This scary night brings you closer to Hermione.");
            await io.nextEvent();
            await npc.handleFriendshipOutcome(chara, hermione);
            break;
    }
}