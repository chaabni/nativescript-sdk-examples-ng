// >> app-check-target-code
import { Component } from "@angular/core";

import * as application from "application";

@Component({
    selector: 'app-check-target-component',
    templateUrl: 'application/app-checking-target/app-checking-target.component.html'
})

export class AppCheckingTargetExampleComponent {      
    public isItemVisible: boolean;

    constructor() {
        if(application.android) {
            console.log("We are running on Android device!");
            this.isItemVisible = true;
        } else if (application.ios) {
            console.log("We are running on iOS device");
            this.isItemVisible = false;
        }
    }

}
// << app-check-target-code 