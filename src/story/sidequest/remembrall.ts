
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
    await io.nextEvent();
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
}

    // choices:
    // 1. laugh with Draco -> alignement = deatheater; if slytherin, draco, crabbe and goyle become friends
    // 2. ask for the remembrall back -> if bad, alignement shifts to neutral; draco's trial
    // 3. act and go for the Remembrall -> alignement = phoenix; draco becomes enemy
    // 3.1 success: neville becomes a friend, fame++;
    // 3.2 fail: neville becomes a friend, stress++;
    // 4. mind your business -> if neville friend, neville becomes enemy; nothing
async function handleRemembrallOutcome(chara: MainChara<'Wizard'>, wheelOutput: string): Promise<void>
{
    let draco = npc.getCharacterByLongname(chara.characterList, 'Draco Malfoy') as Character<'Student'>,
        neville = npc.getCharacterByLongname(chara.characterList, 'Neville Longbottom') as Character<'Student'>;

    switch (wheelOutput)
    {
        case "Laugh":
            chara.alignment = "death_eater";
            if (chara.house === "Slytherin") npc.handleFriendshipOutcome(chara, draco);            
            break;
        case "Ask it back":
            if (chara.alignment === "death_eater") chara.alignment = "neutral";
            await trial(chara, draco, neville);
            break;
        case "Act":
            chara.alignment = "phoenix_order";
            await ninja(chara, draco, neville);
            break;
        case "Mind your business":
            if (npc.isFriend(neville))
            {
                io.showText("Neville is now angry at you. He expected more from a friend.");
                neville.connectionlvl = "foe";
            }
            break;
    }
    wheels.seeWheel(false);
    await io.nextEvent();
}

async function ninja(chara: MainChara<'Wizard'>, draco: Character<'Student'>, neville: Character<'Student'>): Promise<void>
{
    io.showText("You decide to go for the Remembrall in Draco's hand. Do you succeed?");
    myWheel.setSegments([
        wheels.newSegment("Success", 0.5),
        wheels.newSegment("Fail", 0.5)
    ]);
    wheels.seeWheel(true);
    const wheelStop = await wheels.spinWheel(myWheel);
    await io.nextEvent();
    wheels.seeWheel(false);

    if (wheelStop.text === "Success")
    {
        io.showText("You swiftly grab the Remembrall from Draco's hand! This swift move will make you popular.");
        chara.fame++;
        io.showText("Draco now despises you. He squeaks something about his father.");
        draco.connectionlvl = "foe";
        io.showText("You managed to keep it from him until the teacher arrives.");
        io.showText("In the afternoon, you give it back to Neville in the infirmatory. He is very grateful to you.");
        npc.handleFriendshipOutcome(chara, neville);
        return;
    }
    
    io.showText("Alas, as you try to snatch the Remembrall, Draco quickly pulls it away.");
    io.showText("You fall to the ground, and Draco laughs at you.");
    io.showText("Draco now despises you. He squeaks something about his father.");
    draco.connectionlvl = "foe";
    chara.stress++;
}

async function trial(chara: MainChara<'Wizard'>, draco: Character<'Student'>, neville: Character<'Student'>): Promise<void>
{
    io.showText("You decide to make things right, but Draco disagrees with you.");
    io.showText("Draco taunts you, flying quickly up and daring you to catch the remembrall.");
    io.showText("You realize that you need to act fast to get it back.");
    io.showText("As you reach for it, Draco throws the Remembrall high into the air. Do you catch it?");

    let catchChance =  0.1 + Math.min(0.85, 0.1 * (chara.grades.find(g => g.subject === "Flying")?.score ?? 0));

    myWheel.setSegments([
        wheels.newSegment("Catch", catchChance),
        wheels.newSegment("Miss", 1 - catchChance)
    ]);
    wheels.seeWheel(true);
    const wheelStop = await wheels.spinWheel(myWheel);

    if (wheelStop.text === "Miss")
    {
        io.showText("You jump to catch the Remembrall, but miss it as it falls back down.");
        io.showText("Draco laughs at you, and flies away with the Remembrall.");
        chara.stress++;
        return;
    }

    io.showText("You leap into the air and catch the Remembrall! Well done!");
    io.showText("Draco looks furious as you retrieve the Remembrall.");
        io.showText("In the afternoon, you give it back to Neville in the infirmatory. He is very grateful to you.");
    npc.handleFriendshipOutcome(chara, neville);

    // add chance to quidditch

    
    await io.nextEvent();
    wheels.seeWheel(false);
}