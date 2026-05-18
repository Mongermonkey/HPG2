
import * as b from "../basis/_index";
import { MainChara } from "../basis/_index";
import { attend as attendFirstYear } from './years/year1';
import { attend as attendSecondYear } from './years/year2';
import { attend as attendThirdYear } from './years/year3';
import { attend as attendFourthYear } from './years/year4';
import { attend as attendFifthYear } from './years/year5';
import { attend as attendSixthYear } from './years/year6';
import { attend as attendSeventhYear } from './years/year7';

/**
 * The main story function.
 * @param mainChara An optional main character to start the story with. If not provided, a new character will be created.
 */
export async function startStory(mainChara?: MainChara<'Wizard'>)
{
  console.log('Starting story with character:', mainChara);
  const wheels = await import('../utilities/_index');  
  wheels.seeWheel(false);

  let wiz: MainChara<'Wizard'>;
  let startYear = 1;
  if (mainChara)
  {
    wiz = mainChara;
    startYear = (typeof mainChara.year === 'number' ? mainChara.year : 1) + 1;
  }
  else
  {
    // let chara = await b.createCharacter();
    // wiz = await b.urawizard(chara);
    // startYear = 1;

    wiz =
        {
            gameclass: 'Wizard',
            gender: 'm',
            name: 'Test Character',
            blood: 'half',
            race: 'human',
            gifts: { metamorphmagus: 0, parselmouth: 0, sight: 0 },
            pet: { type: 'cat', name: 'Whiskers' },
    
            alignment: { neutral: 50, phoenix_order: 20, chaos: 20, death_eater: 10 },
            house: 'Ravenclaw',
            housePoints: 10,
            year: 1,
            quidditchRole: 'seeker',
            quidditchCaptain: false,
            quidditchGames: [],
            fame: 0,
            infamy: 0,
            stress: 0,
            clues: [ { name: 'dumbledores_speech', discovered: false }, { name: 'gringotts_theft', discovered: false },
                { name: 'chocolate_frog', discovered: false }, { name: 'library', discovered: false }, { name: 'snape_quirrell_talk', discovered: false }, ],
            grades: [],
            secrets: {mirrorOfErised: false, roomOfRequirement: false, darkForestPunishment: false, aragogMet: false, darkForestVoldemort: false},
            characterList: b.characterList,
            secretPassages: [],
            questProgress: { 'main': 0, 'darkForest': 0, 'norbert': 0 }
        }
  }

  (window as any).currentCharacter = wiz;

  if (startYear < 7) await attendFrom(startYear, wiz);  
}

/**
 * Calls the attend functions in sequence starting from the specified year.
 * @param year The year to start attending from.
 * @param wiz The main character.
 */
async function attendFrom(year: number, wiz: MainChara<'Wizard'>)
{
    const attendFns = [ attendFirstYear, attendSecondYear, attendThirdYear, attendFourthYear, attendFifthYear, attendSixthYear, attendSeventhYear ];
    for (let i = year - 1; i < attendFns.length; i++)
    {
      await attendFns[i](wiz);
    }
  }