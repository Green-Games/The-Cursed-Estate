import * as utils from "@dcl/ecs-scene-utils";
import { TriggerBoxShape } from "@dcl/npc-scene-utils";

export class ShootingArea extends Entity
{
    private onEnterCallback?;
    private onExitCallback?;
    public trigger: TriggerBoxShape
    constructor(transform: TranformConstructorArgs, triggerDimensions: Vector3, color: Color3)
    {
        super()
        const material = new Material();
        material.albedoColor = color;

        // const this = new Entity();
        this.addComponent(new BoxShape());
        this.addComponent(new Transform(transform));
        this.addComponent(material);
        engine.addEntity(this);

        // Create trigger for shooting area
        this.trigger = new utils.TriggerBoxShape(triggerDimensions, new Vector3(0, 3.5, 0));
        this.addComponent(new utils.TriggerComponent(this.trigger,
            {
                onCameraEnter: () =>
                {
                    this.onEnterCallback()
                    this.getComponent(Material).emissiveColor = Color3.Yellow();
                },
                onCameraExit: () =>
                {
                    this.onExitCallback()
                    this.getComponent(Material).emissiveColor = Color3.Black();
                },
            })
        );
    }
    setEnterCallback(onEnterCallback?: () => void)
    {
        this.onEnterCallback = onEnterCallback;
    }
    setExitCallback(onExitCallback?: () => void)
    {
        this.onExitCallback = onExitCallback;
    }
}
