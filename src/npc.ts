import { TestDialog } from "src/modules/dialogData";
import { NPC, NPCData } from "@dcl/npc-scene-utils";
export class ButlerNPC extends NPC
{
    public audioClip = new AudioClip('sounds/NPC_boo.mp3')
    public audioSource = new AudioSource(this.audioClip)

    public answered: boolean = false
    constructor(position: TranformConstructorArgs, model: string, data?: NPCData, openDoor?: () => void)
    {
        super(position, model, () =>
        {
        }, data)
        this.addComponent(this.audioSource)
        this.onActivate = () =>
        {
            this.playAnimation(`Lifting_Up`, true, 2)
            this.audioSource.playOnce()
            if (!this.answered)
            {
                this.talk(TestDialog, "welcome");
            }
            else
            {
                this.talk(TestDialog, "goodbye")
            }
        }
        TestDialog.forEach((v) =>
        {
            if (v.name == "openDoor")
                v.triggeredByNext = openDoor
        })
    }
}