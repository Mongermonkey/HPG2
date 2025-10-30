
import { characterList } from "./characters";
import { Gifts, Grade, Pet, QuidditchGame } from "./utilities/compositetypes";
import { alignement, bloodStatus, gameclass, gender, hogwartsHouse, quidditchRole, sevenBool, sevenNums, subject } from "./utilities/basetypes";

// #region composite types

export type Baseclass<T extends gameclass> =
{
    gameclass: T;
    gender: gender;
    name: string;
    blood: bloodStatus;
    gifts: Gifts;
}
export type Wizard =
{
    pet: Pet;
    alignement: alignement;
    house: hogwartsHouse;
    housePoints: number;
    quidditchRole: quidditchRole;
    quidditchCaptain: boolean;
    stress: number;          // fraction: da 0 a 1
    fame: number;            // fraction: da 0 a 1
    clues: sevenBool;
    characterList: typeof characterList; // lista interazioni con NPC
    quidditchGames: QuidditchGame[];
    year: sevenNums;
    grades: Grade[];
}

export type CustomClass =
{
    [key in gameclass]: key extends 'Muggle' ? {}
                      : key extends 'Wizard' ? Wizard
                      : never;
}

export type MainChara<T extends gameclass> = Baseclass<T> & CustomClass[T];
// #endregion

// #region functions

export function print<T extends gameclass>(character: Baseclass<T> | MainChara<T>): void
{
    for (const key in character)
    {
        if (!Object.prototype.hasOwnProperty.call(character, key)) continue;
        const value = (character as any)[key];
        if (!(typeof value === 'object' && value !== null))
        {
            console.log(`${key}: ${value}`);
            continue;
        }
        console.log(`${key}:`);
        for (const subKey in value)
        {
            if (!Object.prototype.hasOwnProperty.call(value, subKey)) continue;
            console.log(`  ${subKey}: ${value[subKey]}`);
        }
    }
}


export { Pet, Gifts };
// #endregion