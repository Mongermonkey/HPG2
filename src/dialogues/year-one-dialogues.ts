
import { hogwartsHouse } from "../utilities/basetypes";
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
    await write("What do you do?");
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

export async function QuidditchSelection(captain: string, house: string): Promise<void>
{
    await write(`The Quidditch tryouts are held by ${captain}, the ${house} captain.`);
    await write("After a brief explanation of the game, you are asked to demonstrate your flying skills.");
    await write("Do you pass the Quidditch selection?");
}

export async function trollIntro(): Promise<void>
{
    await write("On Halloween night, something bizarre happens.");
    await write("Professor Quirrell rushes into the Great Hall, his turban askew and terror on his face.");
    await write("Everyone stared as he reached Professor Dumbledore's chair, slumped against the table, and gasped," +
        "\n\"Troll -- in the dungeons -- thought you ought to know.\"");
    await write("He then sink to the floor in a dead faint.\nThere is an uproar.");
    await write("Professor Dumbledore quickly orders everyone to stay calm,\nand soon the heads of houses and the prefects start bringing everyone to their dormitories.");
}

export async function trollBadLuck(): Promise<void>
{
    await write("Unfortunately, you were at the bathroom until a few moments before that happened.");
    await write("You suddenly hear a loud roar echoing through the corridors.");
    await write("You reach the corner, and see a huge troll rampaging through the hallways!");
    await write("It seems very angry and dangerous, and it's coming directly at you.");
    await write("What do you do?");
}

export async function trollRescue(): Promise<void>
{
    await write("You noticed that you haven't seen Hermione around since before the chaos started.");
    await write("You know that she wasn't feeling right, and that she always goes to the bathroom when she's upset.");
    await write("The girls' bathroom is just ahead, but it is near the dungeon, so you rush there to check on her.");
    await write("As you enter, you see the monstrous tall figure of the troll! He's looming over Hermione, who is frozen in fear.");
    await write("What do you do?");
}

/**
 * Coward ending.
 */
export async function trollCoward(): Promise<void>
{
    await write("At the decisive moment, you find yourself a coward. You run away.");
    await write("You hear Hermione's terrified scream behind you as the troll grabs her.");
    await write("You manage to reach the dormitories safely, but you feel terrible for abandoning Hermione.");
    await write("Later, you find out that Hermione was rescued by Harry Potter and Ron Weasley.");
}

/**
 * Escape ending.
 */
export async function trollEscape(): Promise<void>
{
    await write("You manage to escape the troll's grasp and run back to the safety of the dormitories.");
    await write("Once inside, you talk about what just happened with the other students.");
    await write("After a while, all gather around you to hear your story.\nThey are all very interested in knowing all the details of the troll.");
    await write("You strengthen your bonds with your housemates!");
}

/**
 * Bad ending - freezing.
 */
export async function troll_freeze(): Promise<void>
{
    await write ("You freeze in terror and, before you can try anything, the troll hits you pretty hard.");
    await write ("You wake up the day after, in the Hospital Wing.");
    await write ("You try to explain, but you don't remember much.\nYou also can't remember well the last two weeks.");
    await write ("As Madam Pomfrey says, it may take some time to recover all the memories.");
    await write("This accident made you fall behind in your studies.");
}

/**
 * Good ending - Hermione saves the mc.
 * @param friends True if the mc already knows Hermione.
 * @param house The mc house.
 */
export async function troll_broom(friends: boolean, house: hogwartsHouse): Promise<void>
{
    await write ("You grab an old broom from nearby and use it to attack the troll.");
    await write ("You hit the troll on the knees. It's not very effective.");
    await write ("As the monster is about to strike you, something hits it from behind.");
    await write ("The monster turns around. It's Hermione Granger!");

    if (!friends) await write("Everybody knows her as the best student in your year already.");

    await write ("She quickly uses another spell to make the troll hit itself.");
    await write ("The troll falls to the ground, unconscious.");
    await write ("Professor McGonagall comes bursting into the room, closely followed by Snape, with Quirrell bringing up the rear.");
    await write ("You notice that Snape has a still bleeding wound on his leg. He immediately covers it.");

    await write(`As they find out what you two did, they take 5 points from ${house}, for the danger you put yourself in.`);
    await write("They also award 10 points from Gryffindor, for the courage and the skills Hermione showed.");

    await write("Tonight's events will make you more popular.");
}

/**
 * Good ending - defeating the troll (and rescuing Hermione).
 * @param rescue True if the mc is rescuing Hermione.
 * @param house The mc house.
 */
export async function troll_spell(rescue: boolean, house: hogwartsHouse): Promise<void>
{
    await write ("You cast the first spell that comes to your mind.");
    await write ("The troll's club flies suddenly out of the troll's hand, rises high, high up into the air," +
				"\nturns slowly over and drops, with a sickening crack, onto its owner's head.");
    await write ("The troll sways on the spot and then falls flat on its face, with a thud that made the whole room tremble.");
    await write ("A moment later, Professor McGonagall comes bursting into the room, closely followed by Snape, with Quirrell bringing up the rear.");
    await write ("You notice that Snape has a still bleeding wound on his leg. He immediately covers it.");
    if (rescue)
    {
        await write("Hermione explains them that it was all her fault, and that you are her savior.");
        await write(`As they find out what you did, they award ${house} 10 points for your feat.`);
        await write("They also take 5 points from Gryffindor, for the danger Hermione put herself in.");
    }
    else
    {
        await write(`As they find out what you did, they take 5 points from ${house}, for your recklessness.`);
        await write(`They also award 10 points to ${house}, for the impressive feat you accomplished.`);
    }
    await write("After tonight, you become quite popular among your peers.");
}