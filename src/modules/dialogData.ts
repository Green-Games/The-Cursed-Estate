import { Dialog } from "@dcl/npc-scene-utils";
export const TestDialog: Dialog[] = [
    {
        text: "I'm a scary NPC!!", name: "welcome", typeSpeed: 50,
    },
    {
        text: "Don't you think?", isQuestion: true,
        buttons: [
            { label: "So scary!!", goToDialog: 2 },
            { label: "So Cute <3", goToDialog: "angry_goodbye" }
        ]
    },
    {
        text: "<i>Hehehehehehe</i> , I'm not even the scariest thing in this house."
    },
    {
        text: "Be carefull when you look around, you could find something interesting hidden in plain sight.", name: "openDoor"
    },
    {
        text: "Happy Halloween <i>HEHEHEHEHEHEHEH</i>\n or whathever.", name: "goodbye", isEndOfDialog: true
    },
    {
        text: ">:(", name: "angry_goodbye", isEndOfDialog: true
    }
];