import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextComponent } from './text/text.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TextComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent{
  textFromChild: string = '';

  receiveText(event: string) {
    this.textFromChild = event;
    console.log(this.textFromChild);
  }
}