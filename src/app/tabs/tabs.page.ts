import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor() {

  }

  /**
  constructor(private platform: Platform,) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      console.log('Handler was called!');
    });
  }
   */

}
