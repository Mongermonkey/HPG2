
import { Wheel } from '../wheel_magic/Wheel';
import * as io from "./input_output_helpers";
import { depr, getUniformSegments, seeWheel } from "../wheel_magic/wheel_helpers";

const myWheel = (window as any).myWheel as Wheel;
export async function chooseamovie(genre: string): Promise<void>
{
    await io.showText('What movie to watch?');
    if (genre === 'horror')
    {
        myWheel.setSegments(getUniformSegments([
            // "Mortal (2020)",
            // "The Innocents (2021)",
            // "Honeymoon (2014)",
            // "Mad God (2021)",
            // "Monolith (2022)",
            // "Don't Knock Twice (2016)",
            // "Talk to Me (2022)",
            // "Contracted (2013)",
            // "The Heretics (2017)",
            // "The Woods (2006)",
            // "X (2022)",
            // "Knock Knock (2015)",
            // "Skinamarink (2022)",
            // "May (2002)",
            // "The Devil's Candy (2015)",
            // "The Wretched (2019)",
            // "Pulse (2001)",
            // "Body (2015)",
            // "Hunter Hunter (2020)",
            // "Viral (2016)",
            // "Lake Bodom (2016)",
            // "Sissy (2022)",
            // "Spring (2014)",
            // "Byzantium (2012)",
            // "The Feast (2021)",
            // "La abuela / The grandmother (2021)",
            // "Dark Water (2002)",
            // "Synchronic (2019)",
            // "The Ugly Stepsister (2025)",
            "Son (2021)",

            "Southbound (2015)",
            "Inside - A l'intérieur (2007)",
            "Mad Heidi (2022)",
            "XX (2017)",
            "Chained (2012)",
            "Kiss of the Damned (2012)",
            "Sputnik (2020)",
            "Ju-on: The Grudge (2002)",
            "Lonely Hearts / The Lonely Hearts Killers (2006)",
            "Starry Eyes (2014)",
            "The Green Inferno (2013)",
            "Bliss (2019)",
            "Demonic (2021)",
            "It Stains the Sands Red (2016)",
            "Vermines / Infested (2023)",
            "V/H/S (2012)",
            "Let Her Out (2016)",
            "Sinister (2012)",
            "The Djinn (2021)",
            "Under the Shadow (2016)",
            "I Spit on Your Grave (1978)",
        ]));
    }
    else if (genre.toLowerCase() === 'ash')
    {
        myWheel.setSegments(getUniformSegments([
            "The Monkey (2025)",
            // "The Lord of the Rings: The Fellowship of the Ring (2001)",
            "The Lord of the Rings: The Two Towers (2002)",
            "The Lord of the Rings: The Return of the King (2003)",
            "The Twilight Saga: Eclipse (2010)",
            "The Twilight Saga: Breaking Dawn - Part 1 (2011)",
            "The Twilight Saga: Breaking Dawn - Part 2 (2012)",
            "Brüno (2009)",
            "The Matrix: Reloaded (2003)",
            "The Matrix Revolutions (2003)",
            "Gangubai Kathiawadi (2022)",
            "Basic Instinct (1992)",
            "Exit 8 (2025)",
            // "Dhurandar The Revenge (2026)",
        ]));
    }
    else    
    {
        myWheel.setSegments(getUniformSegments([            
            "Elisa y Marcela (2019)",
            "My First Summer (2020)",
            "The World to Come (2020)",
            "Elena Undone (2010)",
            "Below Her Mouth (2016)",
            "Blue Is the Warmest Color (2013)",
        ]));
    }
    seeWheel(true);

    await depr(myWheel);
    await io.nextEvent();
}