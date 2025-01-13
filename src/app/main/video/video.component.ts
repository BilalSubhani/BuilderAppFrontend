import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.less'],
  imports: [CommonModule, FormsModule]
})
export class VideoComponent {
  selectedFile: File | null = null;
  publicId: string = '';
  uploadStatus: string = '';

  videoChanged: string = '0';
  @Output() videoSent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  onFileDropped(event: any) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
    document.querySelector('.drop-area')?.classList.add('hover');
  }

  onDragLeave(event: any) {
    event.preventDefault();
    document.querySelector('.drop-area')?.classList.remove('hover');
  }

  onUpload() {
    if (!this.selectedFile) {
      this.toastr.warning('Please Select a File', 'Error uploading image', {
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'decreasing'
      });
      return;
    }

    if (!this.publicId) {
      this.toastr.warning('Please enter a public ID', 'Error uploading image', {
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'decreasing'
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('public_id', this.publicId); 
  
    this.http.post('http://localhost:3000/media/upload/video', formData).subscribe(
      (response: any) => {
        this.toastr.success('', 'Video uploaded successfully', {
          positionClass: 'toast-top-right',
          progressBar: true,
          progressAnimation: 'increasing'
        });

        this.changed();
      },
      (error) => {
        this.toastr.error(error, 'Error uploading image', {
          positionClass: 'toast-top-right',
          progressBar: true,
          progressAnimation: 'decreasing'
        });
      }
    );
  }

  changed(){
    this.videoChanged = '1';

    if (this.videoChanged) {
      this.videoSent.emit(this.videoChanged);
      this.publicId='';
      this.videoChanged = '0';
    }
  }
}
