// We define the empty imports so the auto-complete feature works as expected.
import { } from '@dcl/sdk/math'
import { Animator, AudioSource, AvatarAttach, GltfContainer, Transform, VisibilityComponent, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { initAssetPacks } from '@dcl/asset-packs/dist/scene-entrypoint'

//import { setupUi } from './ui'
import { buildScene } from './builder'
import {bridge} from './bridge'

// You can remove this if you don't use any asset packs
initAssetPacks(engine, pointerEventsSystem, {
  Animator,
  AudioSource,
  AvatarAttach,
  Transform,
  VisibilityComponent,
  GltfContainer
})



export function main() {
  // Defining behavior. See `src/systems.ts` file.
bridge
  // draw UI. Here is the logic to spawn cubes.
  //setupUi()
  buildScene()
}