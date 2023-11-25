import {
    engine,
    Entity,
    Transform,
    GltfContainer, MeshRenderer,pointerEventsSystem, InputAction,
    AudioSource
  } from '@dcl/sdk/ecs'
  import { MessageBus } from '@dcl/sdk/message-bus'
  import { Vector3,Color4,Quaternion } from '@dcl/sdk/math'
  

  
  // Custom class to hold data
export   class BridgeState {
    open: boolean
    startingPos: Vector3
    startingRotation: Quaternion
    targetPosition: Vector3
    targetRotation: Quaternion
    speed: number
    isMoving: boolean
    progress: number  // 0 = at startingPos, 1 = at endingPos
    initialStateActive: boolean

    constructor(open: boolean, startingPos: Vector3, targetPosition: Vector3, startingRotation: Quaternion, targetRotation: Quaternion, speed: number) {
      this.open = open
      this.startingPos = startingPos
      this.startingRotation = startingRotation
      this.targetPosition = targetPosition
      this.targetRotation = targetRotation
      this.speed = speed
      this.isMoving = false
      this.progress = 0
      this.initialStateActive = true // Start with initial state active

    }
  
  startMoving() {
    this.isMoving = true
    this.progress = 0 // Reset progress when starting
  }


  toggleDirection() {
    if (this.initialStateActive) {
      // Switch to second state
      this.startingPos = secondState.startingPos
      this.startingRotation = secondState.startingRotation
      this.targetPosition = secondState.targetPosition
      this.targetRotation = secondState.targetRotation
    } else {
      // Switch back to initial state
      this.startingPos = initialState.startingPos
      this.startingRotation = initialState.startingRotation
      this.targetPosition = initialState.targetPosition
      this.targetRotation = initialState.targetRotation
    }
    // Toggle state and start moving
    this.initialStateActive = !this.initialStateActive
    this.isMoving = true
    this.progress = 0
  }
}


// Create the bridge entity
export const bridge = engine.addEntity();
GltfContainer.create(bridge, { src: 'models/Log_Bridge_01/Log_Bridge_01.glb' });
MeshRenderer.create(bridge);

Transform.create(bridge, {

  position: Vector3.create(11.2, 2.2, 6.9),
    rotation: Quaternion.create(
      -9.158600493394588e-15,
      -0.41761070489883423,
      4.978307543979099e-8,
      -0.9086260795593262
    ),
   
    scale: Vector3.create(2.23, 1.23, 1)
  });


// Create a mapping from entities to their states
const bridgeStates = new Map<Entity, BridgeState>();


// Define the initial state of the bridge
const initialState = new BridgeState(
  false, // Initially not open
  Vector3.create(11.2, 2.2, 6.9), // Starting position
  Vector3.create(4, 2.2, 6.5), // Target position
  Quaternion.create(
    -9.158600493394588e-15,
      -0.41761070489883423,
      4.978307543979099e-8,
      -0.9086260795593262
  ),
  Quaternion.create(
    -1.5265747641888378e-15,   // Starting rotation
    0.8520362377166748,
    -1.0157062746429801e-7,
    0.5234828591346741
  ), // Target rotation
  1 // Speed
);

// System to animate the bridge
engine.addSystem((dt: number) => {
  for (const [entity, state] of bridgeStates) {
    if (state.isMoving) {
      state.progress += dt * state.speed
      state.progress = Math.min(1, Math.max(0, state.progress))

      const transform = Transform.getMutable(entity)
      transform.position = Vector3.lerp(state.startingPos, state.targetPosition, state.progress)
      transform.rotation = Quaternion.slerp(state.startingRotation, state.targetRotation, state.progress)

      if (state.progress === 1) {
        state.isMoving = false
      }
    }
  }
})



// Lever 

const baseLever =  engine.addEntity();
GltfContainer.create(baseLever, { src: 'models/PaidLever/Base_Lever.glb'});
MeshRenderer.create(baseLever);
Transform.create(baseLever, {
  position: Vector3.create(7, 2.3, 11),
  rotation: Quaternion.create(
    
  ),
  scale: Vector3.create(1, 1, 1)
});


const lever = engine.addEntity();
GltfContainer.create(lever, { src: 'models/PaidLever/Lever_Stick.glb' });
MeshRenderer.create(lever);
Transform.create(lever, {
    position: Vector3.create(7, 2.3, 11),
    rotation: Quaternion.create(
      
    ),
    scale: Vector3.create(1, 1, 1)
  });


  pointerEventsSystem.onPointerDown(
    {
      entity: lever,
      opts: { button: InputAction.IA_PRIMARY, hoverText: 'Activate Lever' },
    },
    () => {
      const state = bridgeStates.get(bridge)
      if (state) state.toggleDirection()
    }
  )
  
// define second state of the bridge 

const secondState = new BridgeState(
  false, // Initially not open
  Vector3.create(4, 2.2, 6.5), // Starting position
  Vector3.create(11.2, 2.2, 6.9), // Target position
  Quaternion.create(
    -1.5265747641888378e-15,   // Starting rotation
    0.8520362377166748,
    -1.0157062746429801e-7,
    0.5234828591346741
  ),
  Quaternion.create(
    -9.158600493394588e-15,
      -0.41761070489883423,
      4.978307543979099e-8,
      -0.9086260795593262
  ), // Target rotation
  0.5 // Speed
);


// Associate the bridge entity with its state
bridgeStates.set(bridge, initialState);

// System to animate the bridge
engine.addSystem((dt: number) => {
  for (const [entity, state] of bridgeStates) {
    if (state.isMoving) {
      // Update progress
      state.progress += dt * state.speed;
      // Clamp progress between 0 and 1
      state.progress = Math.min(1, Math.max(0, state.progress));

      // Update the transform
      const transform = Transform.getMutable(entity);
      transform.position = Vector3.lerp(state.startingPos, state.targetPosition, state.progress);
//      transform.rotation = Quaternion.slerp(state.targetRotation, state.progress);

      // Check if the movement is complete
      if (state.progress === 1) {
        state.isMoving = false;
        [state.startingPos, state.targetPosition] = [state.targetPosition, state.startingPos];
        state.targetRotation = Quaternion.create(0, 0, 0, 1);
      }
    }
  }
});


/*
// System to start moving the bridge
engine.addSystem(() => {
  const state = bridgeStates.get(bridge);
  if (state && !state.isMoving) {
    state.startMoving();
  }
});
*/