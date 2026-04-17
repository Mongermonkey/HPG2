
import * as b from "../basis/_index";
import { MainChara } from "../basis/_index";
import { attend as attendFirstYear } from './years/year1';
import { attend as attendSecondYear } from './years/year2';

/**
 * The main story function.
 */
export async function startStory()
{
  const wheels = await import('../utilities/_index');
  
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
    alignment: b.NeutralAlignment,
    house: "Ravenclaw",
    housePoints: 0,
    quidditchRole: "none",
    quidditchCaptain: false,
    stress: 0,
    fame: 0,
    infamy: 0,
    clues: b.firstYearClues,
    secrets: b.HogwartsSecrets,
    characterList: [...b.characterList],
    quidditchGames: [],
    year: 1,
    grades: b.Grades,
    secretPassages: [...b.freshPassages],
    mainQuestProgress: 0
  };

  // let chara = await b.createCharacter();
  // wiz = await b.urawizard(chara);

  (window as any).currentCharacter = wiz;

  await attendFirstYear(wiz);
  await attendSecondYear(wiz);
  
}
