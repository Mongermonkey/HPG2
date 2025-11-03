
import * as io from "../utilities/input_output_helpers";

async function write(msg: string)
{
    io.showText(msg);
    await io.nextEvent();
}

/**
 * Handles the arrival at Hogwarts.
 */
export async function arrivalAtHogwarts(): Promise<void>
{
    await write("On the first of September, you board the Hogwarts Express from platform nine and three-quarters at King's Cross Station.");
    await write("By the same evening, you arrive at the magnificent and mysterious Hogwarts Castle.");
}

/**
 * Handles the sorting ceremony dialogues.
 */
export async function sort(): Promise<void>
{
    await write("In the Great Hall, under a velvety black ceiling dotted with stars, the Sorting Ceremony is about to begin...");
    await write("Everyone seems very excited about it.");
    await write("The Sorting Hat is brought in, looking old and worn.");
    await write("He presents the four houses: Gryffindor, Hufflepuff, Ravenclaw and Slytherin.");
    await write("After a while, the Sorting Hat is placed on your head. It feels a bit heavy and itchy.");
    await write("\"...Hmmmm... Interesting... Very interesting...\", the hat recites.");
}

/**
 * Handles Dumbledore's speech after the sorting ceremony.
 * @param clue Whether the player has the clue about the third-floor corridor.
 */
export async function dumbledoresSpeech(clue: boolean): Promise<void>
{
    await write("After the sorting ceremony, a silver-haired man stands up from his golden chair.");
    await write("It's Albus Dumbledore, Hogwarts' headmaster.");
    await write("He says few words about the new year and the school.");
    await write("\"...And finally, I must tell you that this year, the third-floor corridor\non the right-hand side is "
        + (clue ? "OUT OF BOUNDS" : "out of bounds") + " to everyone who does not wish to die a very painful " + (clue ? "DEATH.\"" : "death.\""));
    await write("You start to laugh... But everyone else seems to take these words seriously.");
    if(clue) await write("You wonder what could be in that corridor to deserve such a warning...");
}

/**
 * Handles the introduction to the Remembrall sidequest.
 */
export async function remembrallIntro(): Promise<void>
{
    await write("During the first exercise, you notice a boy struggling with his broom.");
    await write("It's Neville Longbottom, a clumsy-looking Gryffindor student.");
    await write("Suddenly he takes flight, and starts speeding around dangerously!");
    await write("Madam Hooch, the flying instructor, blows her whistle and tries to stop him, without success.");
    await write("As everyone begins to panic, Neville falls from the broom and crashes to the ground!");
    await write("Madam Hooch rushes to his side and helps him up, taking him to the infirmary.");
    await write("While leaving, she makes VERY CLEAR that no one is to fly until she comes back.");
    await write("As Neville is taken away, you notice Draco Malfoy smirking and holding a small, round object.");
    await write("It's Neville's Remembrall! He must have lost it during the fall.\nDraco is making fun of Neville with his friends.");
}

export async function flyingLesson(): Promise<void>
{
    await write("Madame Hooch makes seven circles of light appear in the air, all at different heights and distances from each other.");
    await write("She explains that you'll take turns trying to get through as many hoops as possible.");
    await write("Each one will have two attempts, and you can practice on the broom while the others are trying.");   
}

export async function remembrallNinja(): Promise<void>
{    
    await write("Alas, as you try to snatch the Remembrall, Draco quickly pulls it away.");
    await write("You fall to the ground, and Draco laughs at you.");
    await write("Draco now despises you. He squeaks something about his father.");
}

export async function remembrallTrial(): Promise<void>
{
    await write("Draco taunts you, flying quickly up and daring you to catch the remembrall.");
    await write("You realize that you need to act fast to get it back.");
    await write("As you reach for it, Draco throws the Remembrall high into the air, very far away. Do you catch it?");
}