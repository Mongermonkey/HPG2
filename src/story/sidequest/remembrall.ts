
import * as npc from '../../characters';
import { isFriend, getCharacterByLongname } from '../../characters';
import { Wheel } from '../../wheel_magic/Wheel';
import { MainChara } from '../../maincharacter';
import * as io from "../../utilities/input_output_helpers";
import * as wheels from "../../wheel_magic/wheel_helpers";
import { WheelSegment } from "../../wheel_magic/wheel_helpers";
import * as chitchat from "../../dialogues/year-one-dialogues";

const myWheel = (window as any).myWheel as Wheel;
const nextBtn = (window as any).nextBtn as HTMLButtonElement;
const spinBtn = (window as any).spinBtn as HTMLButtonElement;

// Remembrall event
export async function remembrallEvent(chara: MainChara<'Wizard'>): Promise<void>
{
    await chitchat.remembrallIntro();
    await io.nextEvent();
    io.showText("What do you do?");

    let laughChance = 0.15, askChance = 0.15, actChance = 0.010;

    let draco = getCharacterByLongname(chara.characterList, 'Draco Malfoy'),
        neville = getCharacterByLongname(chara.characterList, 'Neville Longbottom');
    if (isFriend(draco)) { laughChance += 0.25; }
    if (isFriend(neville)) { askChance += 0.10; actChance += 0.05; }
    if (chara.house === 'Gryffindor') { askChance += 0.05; actChance += 0.10; }
    if (chara.house === 'Slytherin') { laughChance += 0.10; }

    let nothingChance = 1 - (laughChance + askChance + actChance);

    myWheel.setSegments([
        wheels.newSegment("Laugh", laughChance),
        wheels.newSegment("Ask it back", askChance),
        wheels.newSegment("Act", actChance),
        wheels.newSegment("Mind your business", nothingChance)
    ]);
    
    const wheelStop = await wheels.spinWheel(myWheel);

    // choices:
    // 1. laugh with Draco -> alignement = deatheater; if slytherin, draco, crabbe and goyle become friends
    // 2. ask for the remembrall back -> if bad, alignement shifts to neutral; draco's trial
    // 3. act and go for the Remembrall -> alignement = phoenix; draco becomes enemy
    // 3.1 success: neville becomes a friend, fame++;
    // 3.2 fail: neville becomes a friend, stress++;
    // 4. mind your business -> if neville friend, neville becomes enemy; nothing
}