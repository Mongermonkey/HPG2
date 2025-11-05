
import { characterList } from "../characters/characters";
import { MainChara, print } from "../characters/maincharacter";
import { chooseamovie } from "../utilities/horrormovies";

export async function startStory()
{
  const wheels = await import("../wheel_magic/wheel_helpers");
  const init = await import("../characters/character-creation");
  const yearOne = await import("./school-years/year1");

  // await chooseamovie();
  
  wheels.seeWheel(false);

  let wiz: MainChara<'Wizard'> =
  {
    gameclass: 'Wizard',
    gender: 'm',
    name: 'Matt',
    blood: 'half',
    gifts: { metamorphmagus: 0, parselmouth: 0, sight: 0, lycanthropy: 0 },
    pet: { type: "cat", name: "Carus" },
    alignment: "neutral",
    house: "Ravenclaw",
    housePoints: 0,
    quidditchRole: "none",
    quidditchCaptain: false,
    stress: 0.0,
    fame: 0.0,
    clues: [false, false, false, false, false, false, false],
    characterList: [...characterList],
    quidditchGames: [],
    year: 1,
    grades:
    [
      {subject: 'Astronomy', score: 5}, {subject: 'Charms', score: 4},
      {subject: 'Defense Against the Dark Arts', score: 4}, {subject: 'Herbology', score: 2},
      {subject: 'History of Magic', score: 3}, {subject: 'Potions', score: 4},
      {subject: 'Transfiguration', score: 4}, {subject: 'Flying', score: 4}
    ],
  };

  // let chara = await init.createCharacter();
  // wiz = await init.urawizard(chara);

  // print(wiz);

  yearOne.attend(wiz);
  
}
