
import { Wheel } from '../../wheel_magic/Wheel';
import { Character } from '../../characters/characters';
import * as wheels from "../../wheel_magic/wheel_helpers";
import { MainChara } from '../../characters/maincharacter';
import * as io from "../../utilities/input_output_helpers";
import * as npc from '../../characters/character-functions';
import * as chitchat from "../../dialogues/year-one-dialogues";

const myWheel = (window as any).myWheel as Wheel;
const nextBtn = (window as any).nextBtn as HTMLButtonElement;
const spinBtn = (window as any).spinBtn as HTMLButtonElement;

// Remembrall event
export async function remembrall(chara: MainChara<'Wizard'>): Promise<void>
{
    await chitchat.remembrallIntro();
    io.showText("What do you do?");

    let laughChance = 0.15, askChance = 0.15, actChance = 0.010;

    let draco = npc.getCharacterByLongname(chara.characterList, 'Draco Malfoy'),
        neville = npc.getCharacterByLongname(chara.characterList, 'Neville Longbottom');
    if (npc.isFriend(draco)) { laughChance += 0.25; }
    if (npc.isFriend(neville)) { askChance += 0.10; actChance += 0.05; }
    if (chara.house === 'Gryffindor') { askChance += 0.05; actChance += 0.10; }
    if (chara.house === 'Slytherin') { laughChance += 0.10; }

    let nothingChance = 1 - (laughChance + askChance + actChance);

    myWheel.setSegments([
        wheels.newSegment("Laugh", laughChance),
        wheels.newSegment("Ask it back", askChance),
        wheels.newSegment("Act", actChance),
        wheels.newSegment("Mind your business", nothingChance)
    ]);
    
    wheels.seeWheel(true);    
    const wheelStop = await wheels.spinWheel(myWheel);
    await remembrallOutcome(chara, wheelStop.text);
}

    // choices:
    // 1. laugh with Draco -> alignement = deatheater; if slytherin, draco, crabbe and goyle become friends
    // 2. ask for the remembrall back -> if bad, alignement shifts to neutral; draco's trial
    // 3. act and go for the Remembrall -> alignement = phoenix; draco becomes enemy
    // 3.1 success: neville becomes a friend, fame++;
    // 3.2 fail: neville becomes a friend, stress++;
    // 4. mind your business -> if neville friend, neville becomes enemy; nothing
async function remembrallOutcome(chara: MainChara<'Wizard'>, wheelOutput: string): Promise<void>
{
    let draco = npc.getCharacterByLongname(chara.characterList, 'Draco Malfoy') as Character<'Student'>,
        neville = npc.getCharacterByLongname(chara.characterList, 'Neville Longbottom') as Character<'Student'>;

    wheelOutput = 'Act'; // DEBUG
    switch (wheelOutput)
    {
        case "Laugh":
            await io.nextEvent();
            io.showText("You find it very funny, and laugh along with Draco as he mocks Neville for losing his Remembrall.");
            if (chara.alignment !== "death_eater")
            {
                chara.alignment = "death_eater";
                await io.nextEvent();
                io.showText("Your alignment has shifted.");
            }
            if (chara.house === "Slytherin") npc.handleFriendshipOutcome(chara, draco);            
            break;
        case "Ask it back":
            await io.nextEvent();
            io.showText("You decide to ask Draco for the Remembrall back.");
            if (chara.alignment === "death_eater")
            {
                chara.alignment = "neutral";
                await io.nextEvent();
                io.showText("Your alignment has shifted.");
            }
            await io.nextEvent();
            await trial(chara, draco, neville);
            break;
        case "Act":
            await io.nextEvent();
            io.showText("You decide to take matters into your own hands and take the Remembrall from Draco's hand.");
            if (chara.alignment !== "phoenix_order")
            {
                await io.nextEvent();
                io.showText("Your alignment has shifted.");
            }
            chara.alignment = "phoenix_order";
            await io.nextEvent();
            await ninja(chara, draco, neville);
            break;
        case "Mind your business":
            await io.nextEvent();
            io.showText("You decide to mind your own business and not get involved.");
            if (npc.isFriend(neville))
            {
                await io.nextEvent();
                io.showText("Neville is now angry at you. He expected more from a friend.");
                neville.connectionlvl = "foe";
            }
            break;
    }
    wheels.seeWheel(false);
    await io.nextEvent();
}

/**
 * Handles the outcome of the Remembrall event 'Act'.
 */
async function ninja(chara: MainChara<'Wizard'>, draco: Character<'Student'>, neville: Character<'Student'>): Promise<void>
{
    io.showText("Do you succeed?");
    myWheel.setSegments([
        wheels.newSegment("Success", 0.5),
        wheels.newSegment("Fail", 0.5)
    ]);
    wheels.seeWheel(true);
    const wheelStop = await wheels.spinWheel(myWheel);
    await io.nextEvent();
    wheels.seeWheel(false);

    wheelStop.text = "Success"; // DEBUG
    if (wheelStop.text === "Success")
    {
        io.showText("You swiftly grab the Remembrall from Draco's hand! This swift move will make you popular.");
        await io.nextEvent();
        chara.fame++;
        wheels.showWheelResult("fame++");
        await io.nextEvent();
        io.showText("You managed to keep it from him until the teacher arrives.");
        await io.nextEvent();
        io.showText("Draco now despises you. He squeaks something about his father.");
        draco.connectionlvl = "foe";
        await io.nextEvent();
        io.showText("In the afternoon, you give it back to Neville in the infirmatory. He is very grateful to you.");
        npc.handleFriendshipOutcome(chara, neville);
        return;
    }
    
    await chitchat.remembrallNinja();
    draco.connectionlvl = "foe";
    chara.stress++;
    await io.nextEvent();
    wheels.showWheelResult("stress++");
}

/**
 * Handles the outcome of the Remembrall event 'Trial'.
 */
async function trial(chara: MainChara<'Wizard'>, draco: Character<'Student'>, neville: Character<'Student'>): Promise<void>
{
    wheels.seeWheel(false);
    await chitchat.remembrallTrial();
    let catchChance = 0.1 + Math.min(0.85, 0.1 * (chara.grades.find(g => g.subject === "Flying")?.score ?? 0));

    myWheel.setSegments([
        wheels.newSegment("Catch", catchChance),
        wheels.newSegment("Miss", 1 - catchChance)
    ]);
    wheels.seeWheel(true);
    const wheelStop = await wheels.spinWheel(myWheel);

    if (wheelStop.text === "Miss")
    {
        io.showText("You jump to catch the Remembrall, but miss it as it falls back down.");
        await io.nextEvent();
        io.showText("Draco laughs at you, and flies away with the Remembrall.");
        chara.stress++;
        await io.nextEvent();
        wheels.showWheelResult("stress++");
        return;
    }

    await io.nextEvent();
    wheels.seeWheel(false);
    io.showText("You leap into the air and, in a move worthy of a Quidditch player, catch the Remembrall!\nWell done! This brave move will make you popular.");
    chara.fame += 5;
        await io.nextEvent();
    wheels.showWheelResult("fame++");
    await io.nextEvent();
    io.showText("Draco looks furious as you retrieve the Remembrall.");
    draco.connectionlvl = "foe";
    await io.nextEvent();
    io.showText("In the afternoon, you give it back to Neville in the infirmatory. He is very grateful to you.");
    await io.nextEvent();
    npc.handleFriendshipOutcome(chara, neville);

    // add chance to quidditch
    let head = npc.getHeadOfHouse(chara.characterList, chara.house);
    await io.nextEvent();
    io.showText(`A bit later in the evening, you receive a note from ${head?.longname}.`);
    await io.nextEvent();
    io.showText(`It seems that your actions have not gone unnoticed, and you are being considered for the Quidditch team!`);
    chara.quidditchRole = "candidate";
}