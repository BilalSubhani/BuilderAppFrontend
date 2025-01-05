import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text',
  standalone: true,
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.less'],
  imports: [FormsModule]
})
export class TextComponent {
  textInput: string = '';
  @Output() textSent: EventEmitter<string> = new EventEmitter<string>();

  sendText() {
    if (this.textInput.trim()) {
      this.textSent.emit(this.textInput);
      this.textInput = '';
    }
  }
}
