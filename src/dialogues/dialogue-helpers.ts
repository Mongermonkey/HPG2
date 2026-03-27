
import * as io from "../utilities/input_output_helpers";

export async function write(msg: string)
{
    io.showText(msg);
    await io.nextEvent();
}