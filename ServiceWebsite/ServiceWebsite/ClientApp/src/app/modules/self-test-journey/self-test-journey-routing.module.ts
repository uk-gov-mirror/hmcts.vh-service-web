import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Paths } from './paths';
import { TestYourEquipmentComponent } from './pages/test-your-equipment/test-your-equipment.component';
import { SwitchOnCameraAndMicrophoneComponent } from './pages/switch-on-camera-and-microphone/switch-on-camera-and-microphone.component';
import { CheckYourComputerComponent } from './pages/check-your-computer/check-your-computer.component';
import { SignBackInComponent } from './pages/sign-back-in/sign-back-in.component';
import { CameraWorkingComponent } from './pages/camera-working/camera-working.component';
import { MicrophoneWorkingComponent } from './pages/microphone-working/microphone-working.component';
import { VideoWorkingComponent } from './pages/video-working/video-working.component';

const routes: Routes = [
  { path: Paths.CheckYourComputer, component: CheckYourComputerComponent },
  { path: Paths.SignBackIn, component: SignBackInComponent },
  { path: Paths.SwitchOnCameraAndMicrophone, component: SwitchOnCameraAndMicrophoneComponent },
  { path: Paths.TestYourEquipment, component: TestYourEquipmentComponent },
  { path: Paths.CameraWorking, component: CameraWorkingComponent },
  { path: Paths.MicrophoneWorking, component: MicrophoneWorkingComponent },
  { path: Paths.VideoWorking, component: VideoWorkingComponent }
];

export const Components = [
  CheckYourComputerComponent,
  SignBackInComponent,
  SwitchOnCameraAndMicrophoneComponent,
  TestYourEquipmentComponent,
  CameraWorkingComponent,
  MicrophoneWorkingComponent,
  VideoWorkingComponent
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class SelfTestJourneyRoutingModule {
}
