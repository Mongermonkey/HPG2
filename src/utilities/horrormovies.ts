
import { Wheel } from '../wheel_magic/Wheel';
import * as io from "../utilities/input_output_helpers";
import * as wheels from "../wheel_magic/wheel_helpers";
import { WheelSegment } from "../wheel_magic/wheel_helpers";
import * as chitchat from "../dialogues/year-one-dialogues";

const myWheel = (window as any).myWheel as Wheel;
const nextBtn = (window as any).nextBtn as HTMLButtonElement;
const spinBtn = (window as any).spinBtn as HTMLButtonElement;

export async function chooseamovie(): Promise<void>
{
    // await io.nextEvent();
    io.showText("What movie to watch?");

    myWheel.setSegments(wheels.uniformSegments([
        // "I Spit on Your Grave (1978)",
        "La abuela / The grandmother (2021)",
        "Talk to Me (2022)",
        "Byzantium (2012)",
        "The Devil's Candy (2015)",
        "Wolf Hunter / Hunter Hunter (2020)",
        "The Innocents (2021)",
        "Pulse (2001)",
        "Southbound (2015)",
        "Son (2021)",
        "Inside - A l'intérieur (2007)",
        "Mad God (2021)",
        "Mad Heidi (2022)",
        "XX (2017)",
        "The Heretics (2017)",
        "X (2022)",
        "Monolith (2022)",
        "Viral (2016)",
        "Chained (2012)",
        "Kiss of the Damned (2012)",
        "Honeymoon (2014)",
        "Sputnik (2020)",
        "Ju-on: The Grudge (2002)",
        "Lonely Hearts / The Lonely Hearts Killers (2006)",
        "The Wretched (2019)",
        "Lake Bodom (2016)",
        "Starry Eyes (2014)",
        "Mortal (2020)",
        "The Green Inferno (2013)",
        "Bliss (2019)",
        "Sissy (2022)",
        "Don't Knock Twice (2016)",
        "Demonic (2021)",
        "It Stains the Sands Red (2016)",
        "Skinamarink (2022)",
        "Vermines / Infested (2023)",
        "The Woods (2006)",
        "May (2002)",
        "Contracted (2013)",
        "Synchronic (2019)",
        "Dark Water (2002)",
        "Spring (2014)",
        "The Feast (2021)",
        "Knock Knock (2015)",
        "V/H/S (2012)",
        "Body (2015)",
        "Let Her Out (2016)",
        "Sinister (2012)",
        "The Djinn (2021)",
        "Under the Shadow (2016)",
    ]));
    wheels.seeWheel(true);

    const wheelStop = await wheels.spinWheel(myWheel);
    await io.nextEvent();
}