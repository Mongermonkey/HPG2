
import { Character } from '../../characters/characters';
import * as npc from '../../characters/character-functions';
import * as chitchat from "../../dialogues/year-one-dialogues";
import { showText } from "../../utilities/input_output_helpers";
import { spinWheel, newSegment } from "../../wheel_magic/wheel_helpers";
import { shiftAlignment, fame, getSkill, MainChara, stress } from '../../characters/maincharacter';

/**
 * Handles the Remembrall sidequest.
 * @param chara The main character.
 */
export async function remembrall(chara: MainChara<'Wizard'>): Promise<void>
{
    let draco = npc.getCharacterByLongname(chara.characterList, 'Draco Malfoy'),
        neville = npc.getCharacterByLongname(chara.characterList, 'Neville Longbottom');
    await chitchat.remembrallIntro();

    let laughChance = 15, askChance = 15, actChance = 5;
    if (npc.isFriend(draco)) { laughChance += 25; }
    if (npc.isFriend(neville)) { askChance += 15; actChance += 5; }
    if (chara.house === 'Gryffindor') { askChance += 5; actChance += 5; }
    if (chara.house === 'Slytherin') { laughChance += 5; }

    let nothingChance = 100 - (laughChance + askChance + actChance);

    let segments = [
        newSegment('Laugh', laughChance),
        newSegment('Ask it back', askChance),
        newSegment('Act', actChance),
        newSegment('Mind your business', nothingChance)
    ]
    const result = await spinWheel('What do you do?', segments);

    switch (result)
    {
        case 'Laugh': await laugh(chara); break;
        case 'Ask it back': await trial(chara); break;
        case 'Act': await act(chara); break;
        case 'Mind your business': await ignore(chara); break;
    }
}


async function laugh(chara: MainChara<'Wizard'>): Promise<void>
{
    let draco = npc.getCharacterByLongname(chara.characterList, 'Draco Malfoy') as Character<'Student'>,
        neville = npc.getCharacterByLongname(chara.characterList, 'Neville Longbottom') as Character<'Student'>;
    
    await showText('You find it very funny, and laugh along with Draco as he mocks Neville for losing his Remembrall.');
    await shiftAlignment(chara, 'death_eater');
    if (npc.isFriend(neville))
    {
        await showText('Neville is now angry at you. He expected more from a friend.');
        neville.connectionlvl = 'foe';
    }
    if (chara.house === 'Slytherin') await npc.improveConnection(chara, draco); 
}

async function trial(chara: MainChara<'Wizard'>): Promise<void>
{
    let draco = npc.getCharacterByLongname(chara.characterList, 'Draco Malfoy') as Character<'Student'>,
        neville = npc.getCharacterByLongname(chara.characterList, 'Neville Longbottom') as Character<'Student'>;
    
    await chitchat.remembrallTrialIntro();
    let chance = 10 + Math.min(85, getSkill(chara, 'Flying') * 10);

    const result = await spinWheel('Do you catch it?', [newSegment('Catch', chance), newSegment('Miss', 100 - chance)]);

    await chitchat.remembrallTrial(result === 'Miss');
    if (result === 'Miss')
    {
        await stress(chara);
        return;
    }

    npc.worsenConnection(chara, draco);
    await npc.improveConnection(chara, neville);
    await fame(chara, 5);

    // add chance to quidditch
    let head = npc.getHeadOfHouse(chara.characterList, chara.house);
    await showText('A bit later in the evening, you receive a note from ' + head?.longname + '.');
    await showText('It seems that your actions have not gone unnoticed, and you are being considered for the Quidditch team!');
    chara.quidditchRole = 'candidate';
}

async function act(chara: MainChara<'Wizard'>): Promise<void>
{
    let draco = npc.getCharacterByLongname(chara.characterList, 'Draco Malfoy') as Character<'Student'>,
        neville = npc.getCharacterByLongname(chara.characterList, 'Neville Longbottom') as Character<'Student'>;
    
    await showText('You decide to take matters into your own hands and take the Remembrall from Draco\'s hand.');
    await shiftAlignment(chara, 'phoenix_order');

    const result = await spinWheel('Do you succeed?', [ newSegment('Success', 50), newSegment('Fail', 50)]);
    await chitchat.remembrallNinja(result === 'Success');

    draco.connectionlvl = 'foe';

    if (result === 'Success')
    {
        await npc.improveConnection(chara, neville);
        await fame(chara);
    }
    else await stress(chara);
}

async function ignore(chara: MainChara<'Wizard'>): Promise<void>
{
    let neville = npc.getCharacterByLongname(chara.characterList, 'Neville Longbottom') as Character<'Student'>;

    await showText('You decide to mind your own business and not get involved.');    
    if (npc.isFriend(neville))
    {
        await showText('Neville is now angry at you. He expected more from a friend.');
        neville.connectionlvl = 'foe';
    }
}