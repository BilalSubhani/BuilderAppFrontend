import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient) {}

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
    if (!this.selectedFile || !this.publicId) {
      this.uploadStatus = 'Please select a file and enter a public ID';
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('public_id', this.publicId); 
  
    this.http.post('http://localhost:3000/media/upload/video', formData).subscribe(
      (response: any) => {
        this.uploadStatus = `Video uploaded successfully: ${response.secure_url}`;
      },
      (error) => {
        console.error('Error uploading video:', error);
        this.uploadStatus = 'Failed to upload video';
      }
    );
  }
  
}
