
import * as ct from "../utilities/compositetypes";
import { Grades } from "../utilities/compositetypes";
import { MainChara } from "../characters/maincharacter";
import { characterList } from "../characters/characters";
import { createCharacter, urawizard } from "../characters/character-creation";

/**
 * The main story function.
 */
export async function startStory()
{
  const wheels = await import('../wheel_magic/wheel_helpers');
  const yearOne = await import('./school-years/year1');
  
  wheels.seeWheel(false);

  // Base character example for testing.
  let wiz: MainChara<'Wizard'> =
  {
    gameclass: 'Wizard',
    gender: 'm',
    name: 'Matt',
    blood: 'half',
    race: 'human',
    gifts: { metamorphmagus: 0, parselmouth: 0, sight: 0 },
    pet: { type: "cat", name: "Matt" },
    alignment: ct.NeutralAlignment,
    house: "Ravenclaw",
    housePoints: 0,
    quidditchRole: "none",
    quidditchCaptain: false,
    stress: 0.0,
    fame: 0.0,
    clues: ct.firstYearClues,
    secrets: ct.HogwartsSecrets,
    characterList: [...characterList],
    quidditchGames: [],
    year: 1,
    grades: Grades,
    secretPassages: [...ct.freshPassages],
    mainQuestProgress: 0
  };

  // let chara = await createCharacter();
  // wiz = await urawizard(chara);

  (window as any).currentCharacter = wiz;

  yearOne.attend(wiz);
  
}
